// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const ONESIGNAL_APP_ID = Deno.env.get("ONESIGNAL_APP_ID");
const ONESIGNAL_REST_API_KEY = Deno.env.get("ONESIGNAL_REST_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req: Request) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        })
    }

    try {
        if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
            throw new Error("Missing OneSignal configuration secrets");
        }

        const { title, body, topic, community_id, sender_id, data: extraData } = await req.json();
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        let payload = {
            app_id: ONESIGNAL_APP_ID,
            headings: { en: title || "New Update" },
            contents: { en: body || "Check the app for details" },
            data: {
                url: "/dashboard",
                ...extraData
            }
        };

        // 1. Handle Community Chat (Targeted by external_user_ids)
        if (community_id) {
            const { data: members, error: memberError } = await supabase
                .from('community_members')
                .select('user_id')
                .eq('community_id', community_id)
                .eq('status', 'approved');

            if (memberError) throw memberError;

            let targetUserIds = members.map(m => m.user_id);
            if (sender_id) {
                targetUserIds = targetUserIds.filter(id => id !== sender_id);
            }

            if (targetUserIds.length === 0) {
                return new Response(JSON.stringify({ success: true, message: "No target users" }), { headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } });
            }

            payload.include_external_user_ids = targetUserIds;
        }
        // 2. Handle Promotional / Topic based (Targeted by Segments or Tags)
        else if (topic) {
            if (topic === 'all_users') {
                payload.included_segments = ["Subscribed Users", "Active Users"];
            } else {
                // Target users using tags set in App.tsx
                payload.filters = [
                    { field: "tag", key: "selected_exam", relation: "=", value: topic }
                ];
            }
        }

        // Call OneSignal API
        const response = await fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        return new Response(JSON.stringify({ success: true, result }), {
            headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' }
        });

    } catch (error: any) {
        console.error("send-push error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' }
        });
    }
});
