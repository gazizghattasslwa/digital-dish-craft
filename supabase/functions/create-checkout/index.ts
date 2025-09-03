import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://ohutaeezxljgdrtjyxcq.supabase.co",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_ORIGINS = [
  "https://ohutaeezxljgdrtjyxcq.supabase.co",
  "http://localhost:3000",
  "http://localhost:5173"
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const { plan } = await req.json();
    if (!plan || !["premium", "agency"].includes(plan)) {
      throw new Error("Invalid plan selected");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2023-10-16" 
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Set pricing based on plan
    const planPricing = {
      premium: { amount: 1999, name: "Premium Plan" }, // €19.99
      agency: { amount: 7999, name: "Agency Plan" }    // €79.99
    };

    const selectedPlan = planPricing[plan as keyof typeof planPricing];

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { 
              name: selectedPlan.name,
              description: plan === "premium" 
                ? "Up to 2 restaurants, unlimited menus & items"
                : "Up to 100 restaurants, unlimited menus & items + branding"
            },
            unit_amount: selectedPlan.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: validateAndGetReturnUrl(req.headers.get("origin"), "/dashboard?success=true"),
      cancel_url: validateAndGetReturnUrl(req.headers.get("origin"), "/dashboard?canceled=true"),
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function validateAndGetReturnUrl(origin: string | null, path: string): string {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return `${ALLOWED_ORIGINS[0]}${path}`;
  }
  return `${origin}${path}`;
}