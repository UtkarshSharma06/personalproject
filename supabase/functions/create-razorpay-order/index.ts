import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Razorpay from "npm:razorpay@2.9.2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Check for Environment Variables
        const key_id = Deno.env.get('RAZORPAY_KEY_ID')
        const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET')

        if (!key_id || !key_secret) {
            throw new Error("Razorpay keys not set in Supabase secrets.")
        }

        const { planId } = await req.json()

        // Map plan to amount (in paisa). 
        // Example: 'elite' -> 49 INR (4900 paisa)
        // Example: 'global' -> 99 INR (9900 paisa)
        // Default fallback: 1 INR for testing
        let amount = 100;

        if (planId === 'Elite' || planId === 'elite') amount = 4900; // 49 INR for testing
        if (planId === 'Global' || planId === 'global') amount = 9900; // 99 INR for testing

        const instance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        })

        const options = {
            amount: amount,
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        };

        const order = await instance.orders.create(options);

        return new Response(JSON.stringify(order), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error: any) {
        console.error("Error creating Razorpay order:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
