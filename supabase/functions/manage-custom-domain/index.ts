import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://ohutaeezxljgdrtjyxcq.supabase.co',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DomainRequest {
  action: 'add' | 'verify' | 'delete' | 'fetch';
  domain?: string;
  restaurantId: string;
}

interface DomainVerificationResponse {
  verified: boolean;
  ssl_ready: boolean;
  dns_configured: boolean;
  error?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('Authorization header is required')
    }

    // Create authenticated client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { authorization: authHeader }
        }
      }
    )

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    const { action, domain, restaurantId }: DomainRequest = await req.json();

    // Verify user owns the restaurant for all actions
    const { data: restaurant, error: restaurantError } = await supabaseClient
      .from('restaurants')
      .select('id, user_id')
      .eq('id', restaurantId)
      .eq('user_id', user.id)
      .single()

    if (restaurantError || !restaurant) {
      throw new Error('Restaurant not found or access denied')
    }
    
    console.log(`Domain management request: ${action} for domain ${domain || 'N/A'}`);

    switch (action) {
      case 'add':
        if (!domain) throw new Error('Domain is required for add action');
        return await addCustomDomain(supabaseClient, domain, restaurantId, user.id);
      case 'verify':
        if (!domain) throw new Error('Domain is required for verify action');
        return await verifyDomain(supabaseClient, domain, user.id);
      case 'delete':
        if (!domain) throw new Error('Domain is required for delete action');
        return await deleteCustomDomain(supabaseClient, domain, restaurantId, user.id);
      case 'fetch':
        return await fetchCustomDomains(supabaseClient, restaurantId, user.id);
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Domain management error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function fetchCustomDomains(supabaseClient: any, restaurantId: string, userId: string) {
  // Double check ownership
  const { data: restaurant } = await supabaseClient
    .from('restaurants')
    .select('id')
    .eq('id', restaurantId)
    .eq('user_id', userId)
    .single();

  if (!restaurant) {
    throw new Error('Restaurant not found or access denied');
  }

  const { data, error } = await supabaseClient
    .from('custom_domains')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch domains from database');
  }

  console.log(`Fetched ${data?.length || 0} domains for restaurant ${restaurantId}`);

  return new Response(
    JSON.stringify({ 
      success: true, 
      domains: data || []
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

async function addCustomDomain(supabaseClient: any, domain: string, restaurantId: string, userId: string) {
  // Validate domain format
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    throw new Error('Invalid domain format');
  }

  // Check if domain is already taken
  const { data: existingDomain } = await supabaseClient
    .from('custom_domains')
    .select('id')
    .eq('domain', domain.toLowerCase())
    .single();

  if (existingDomain) {
    throw new Error('Domain is already registered');
  }

  // Add domain to database
  const { data, error } = await supabaseClient
    .from('custom_domains')
    .insert({
      restaurant_id: restaurantId,
      domain: domain.toLowerCase(),
      status: 'pending',
      ssl_status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add domain to database');
  }

  console.log(`Domain ${domain} added successfully`);

  return new Response(
    JSON.stringify({ 
      success: true, 
      domain: data,
      message: 'Domain added successfully. Please configure DNS settings.' 
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

async function verifyDomain(supabaseClient: any, domain: string, userId: string): Promise<Response> {
  console.log(`Verifying domain: ${domain}`);
  
  try {
    // Check DNS configuration
    const dnsConfigured = await checkDNSConfiguration(domain);
    
    // For SSL verification, we'll simulate the process since we can't actually provision SSL in this context
    const sslReady = dnsConfigured; // In a real implementation, this would check SSL status
    
    const verification: DomainVerificationResponse = {
      verified: dnsConfigured,
      ssl_ready: sslReady,
      dns_configured: dnsConfigured
    };

    // Update domain status in database
    const newStatus = verification.verified ? 'active' : 'pending';
    const newSslStatus = verification.ssl_ready ? 'active' : 'pending';

    const { error } = await supabaseClient
      .from('custom_domains')
      .update({
        status: newStatus,
        ssl_status: newSslStatus,
        updated_at: new Date().toISOString()
      })
      .eq('domain', domain.toLowerCase());

    if (error) {
      console.error('Failed to update domain status:', error);
    }

    console.log(`Domain verification complete: ${JSON.stringify(verification)}`);

    return new Response(
      JSON.stringify(verification),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Domain verification error:', error);
    return new Response(
      JSON.stringify({ 
        verified: false, 
        ssl_ready: false, 
        dns_configured: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function checkDNSConfiguration(domain: string): Promise<boolean> {
  try {
    // In a real implementation, you would check if the domain's A record points to your server
    // For this demo, we'll simulate DNS checking with a simple domain lookup
    
    // This is a simplified check - in production you'd verify the A record points to your infrastructure
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const dnsData = await response.json();
    
    console.log(`DNS lookup for ${domain}:`, dnsData);
    
    // Check if domain resolves (has A records)
    return dnsData.Answer && dnsData.Answer.length > 0;
    
  } catch (error) {
    console.error(`DNS check failed for ${domain}:`, error);
    return false;
  }
}

async function deleteCustomDomain(supabaseClient: any, domain: string, restaurantId: string, userId: string) {
  const { error } = await supabaseClient
    .from('custom_domains')
    .delete()
    .eq('domain', domain.toLowerCase())
    .eq('restaurant_id', restaurantId);

  if (error) {
    console.error('Failed to delete domain:', error);
    throw new Error('Failed to delete domain');
  }

  console.log(`Domain ${domain} deleted successfully`);

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Domain deleted successfully' 
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}