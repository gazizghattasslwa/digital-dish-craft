import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!geminiApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Environment variables not configured correctly');
    }

    const { restaurant_id, file_url, file_type } = await req.json();

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: extraction, error: insertError } = await supabase
      .from('menu_extractions')
      .insert({ restaurant_id, file_url, status: 'processing' })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    try {
      const extractedData = await extractFromFile(file_url, geminiApiKey, file_type);

      await supabase
        .from('menu_extractions')
        .update({
          status: 'completed',
          extracted_data: extractedData
        })
        .eq('id', extraction.id);

      return new Response(JSON.stringify({
        success: true,
        extraction_id: extraction.id,
        data: extractedData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (extractionError) {
      await supabase
        .from('menu_extractions')
        .update({
          status: 'failed',
          error_message: getErrorMessage(extractionError)
        })
        .eq('id', extraction.id);

      throw extractionError;
    }

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: getErrorMessage(error),
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function extractFromFile(fileUrl: string, apiKey: string, fileType: string) {
  const fileResponse = await fetch(fileUrl);
  if (!fileResponse.ok) {
    throw new Error(`Failed to fetch file: ${fileResponse.status}`);
  }
  
  const fileBuffer = await fileResponse.arrayBuffer();
  const base64Data = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
  
  const mimeType = fileType === 'application/pdf' ? 'application/pdf' : 
                   fileUrl.toLowerCase().includes('.png') ? 'image/png' : 
                   fileUrl.toLowerCase().includes('.jpg') || fileUrl.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
                   'image/png';
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are a menu extraction expert. Analyze this menu document and extract all menu items with their details. 

Return a JSON object with this exact structure:
{
  "categories": [
    {
      "name": "Category Name",
      "description": "Optional category description",
      "items": [
        {
          "name": "Item Name",
          "description": "Item description if available",
          "price": 12.99,
          "is_special": false,
          "is_available": true
        }
      ]
    }
  ]
}

Guidelines:
- Extract ALL visible menu items
- Preserve original pricing (don't convert currencies)
- Group items into logical categories
- Include item descriptions when available
- Mark items as special if they appear highlighted or marked as "chef's special", "signature", etc.
- Set is_available to false only if explicitly marked as "sold out" or "unavailable"
- Be accurate with prices - include decimals when shown
- If no clear categories exist, create logical ones like "Main Dishes", "Appetizers", etc.

Please extract all menu items from this document and return them in the specified JSON format.`
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }
  
  const content = data.candidates[0].content.parts[0].text;
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    throw new Error(`Failed to parse menu data: ${getErrorMessage(parseError)}`);
  }
}
