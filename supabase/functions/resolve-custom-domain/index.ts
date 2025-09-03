import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url);
    const domain = url.searchParams.get('domain');

    if (!domain) {
      throw new Error('Domain parameter is required');
    }

    console.log(`Resolving custom domain: ${domain}`);

    // Find restaurant associated with this custom domain
    const { data: customDomain, error } = await supabaseClient
      .from('custom_domains')
      .select(`
        *,
        restaurants (
          id,
          name,
          slug,
          logo_url,
          primary_color,
          secondary_color,
          menu_template
        )
      `)
      .eq('domain', domain.toLowerCase())
      .eq('status', 'active')
      .single();

    if (error || !customDomain) {
      console.log(`Domain ${domain} not found or not active`);
      return new Response(
        JSON.stringify({ error: 'Domain not found or not configured' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Domain ${domain} resolved to restaurant:`, customDomain.restaurants.name);

    return new Response(
      JSON.stringify({
        success: true,
        restaurant: customDomain.restaurants,
        domain: customDomain
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Domain resolution error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});