import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check:', {
      hasGemini: !!geminiApiKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    });

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const { restaurant_id, file_url, file_type } = await req.json();
    
    console.log('Starting menu extraction for restaurant:', restaurant_id);
    console.log('File URL:', file_url);
    console.log('File type:', file_type);

    // Create a menu extraction record
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: extraction, error: insertError } = await supabase
      .from('menu_extractions')
      .insert({
        restaurant_id,
        file_url,
        status: 'processing'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating extraction record:', insertError);
      throw insertError;
    }

    console.log('Created extraction record:', extraction.id);

    // Process the image/PDF with Gemini Vision
    let extractedData;
    try {
      if (file_type === 'application/pdf') {
        // Gemini can handle PDFs directly
        extractedData = await extractFromFile(file_url, geminiApiKey, 'application/pdf');
      } else {
        // Handle image files
        extractedData = await extractFromFile(file_url, geminiApiKey, 'image');
      }

      // Update extraction record with success
      await supabase
        .from('menu_extractions')
        .update({
          status: 'completed',
          extracted_data: extractedData
        })
        .eq('id', extraction.id);

      console.log('Extraction completed successfully');

      return new Response(JSON.stringify({
        success: true,
        extraction_id: extraction.id,
        data: extractedData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (extractionError) {
      console.error('Extraction error:', extractionError);
      
      // Update extraction record with error
      await supabase
        .from('menu_extractions')
        .update({
          status: 'failed',
          error_message: extractionError.message
        })
        .eq('id', extraction.id);

      throw extractionError;
    }

  } catch (error) {
    console.error('Error in extract-menu function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function extractFromFile(fileUrl: string, apiKey: string, fileType: string) {
  console.log('Extracting menu data from file:', fileUrl, 'Type:', fileType);
  
  // First, fetch the file to convert it to base64
  const fileResponse = await fetch(fileUrl);
  if (!fileResponse.ok) {
    throw new Error(`Failed to fetch file: ${fileResponse.status}`);
  }
  
  const fileBuffer = await fileResponse.arrayBuffer();
  const base64Data = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
  
  // Determine mime type
  const mimeType = fileType === 'application/pdf' ? 'application/pdf' : 
                   fileUrl.toLowerCase().includes('.png') ? 'image/png' : 
                   fileUrl.toLowerCase().includes('.jpg') || fileUrl.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
                   'image/png'; // default
  
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
    console.error('Gemini API error:', errorData);
    throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    console.error('Unexpected Gemini response structure:', data);
    throw new Error('Invalid response from Gemini API');
  }
  
  const content = data.candidates[0].content.parts[0].text;
  console.log('Raw Gemini response:', content);
  
  try {
    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const extractedData = JSON.parse(jsonMatch[0]);
    console.log('Parsed extraction data:', extractedData);
    
    return extractedData;
  } catch (parseError) {
    console.error('Error parsing extraction response:', parseError);
    throw new Error(`Failed to parse menu data: ${parseError.message}`);
  }
}