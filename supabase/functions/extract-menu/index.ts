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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check:', {
      hasOpenAI: !!openAIApiKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
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

    // Process the image/PDF with OpenAI Vision
    let extractedData;
    try {
      if (file_type === 'application/pdf') {
        // For PDFs, we'll need to convert to image first or use a different approach
        throw new Error('PDF extraction not yet implemented - please use image files for now');
      } else {
        // Handle image files
        extractedData = await extractFromImage(file_url, openAIApiKey);
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

async function extractFromImage(imageUrl: string, apiKey: string) {
  console.log('Extracting menu data from image:', imageUrl);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: `You are a menu extraction expert. Analyze the menu image and extract all menu items with their details. 

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
- If no clear categories exist, create logical ones like "Main Dishes", "Appetizers", etc.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please extract all menu items from this image and return them in the specified JSON format.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('OpenAI API error:', errorData);
    throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  console.log('Raw OpenAI response:', content);
  
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