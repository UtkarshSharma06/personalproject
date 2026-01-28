// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SERVICE_ACCOUNT = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

function getAccessToken({ client_email, private_key }: any) {
    return create(
        { alg: "RS256", typ: "JWT" },
        {
            iss: client_email,
            scope: "https://www.googleapis.com/auth/firebase.messaging",
            aud: "https://oauth2.googleapis.com/token",
            exp: Math.floor(Date.now() / 1000) + 3600,
            iat: Math.floor(Date.now() / 1000),
        },
        private_key
    );
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
    }

    try {
        if (!SERVICE_ACCOUNT) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT secret");
        const serviceAccount = JSON.parse(SERVICE_ACCOUNT);
        const { title, body, topic, community_id, sender_id, data: extraData } = await req.json();

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        let targetTokens = [];

        if (community_id) {
            // Fetch tokens of all members in the community except the sender
            const { data: members, error: memberError } = await supabase
                .from('community_members')
                .select('user_id, profiles(fcm_token)')
                .eq('community_id', community_id)
                .eq('status', 'approved');

            if (memberError) throw memberError;

            targetTokens = members
                .map(m => m.profiles?.fcm_token)
                .filter(token => token && token.trim() !== "");

            if (sender_id) {
                // If we have a sender_id, we should filter out their token if we can
                // But since profiles are joined, we might need to be careful if one user has multiple devices (not supported yet)
                const { data: senderProfile } = await supabase.from('profiles').select('fcm_token').eq('id', sender_id).single();
                if (senderProfile?.fcm_token) {
                    targetTokens = targetTokens.filter(t => t !== senderProfile.fcm_token);
                }
            }
        } else if (topic) {
            let query = supabase.from('profiles').select('fcm_token').not('fcm_token', 'is', null);

            if (topic !== 'all_users') {
                query = query.eq('selected_exam', topic);
            }

            const { data: profiles, error: profileError } = await query;
            if (profileError) throw profileError;

            targetTokens = profiles.map(p => p.fcm_token).filter(t => t && t.trim() !== "");
        }

        if (targetTokens.length === 0) {
            return new Response(JSON.stringify({ success: true, message: "No target tokens found" }), { headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } });
        }

        const jwt = await getAccessToken(serviceAccount);
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt
            })
        });
        const { access_token: accessToken } = await tokenRes.json();

        const fcmUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

        const sendPush = async (token: string) => {
            const messagePayload = {
                message: {
                    token,
                    notification: { title, body },
                    data: {
                        url: "/community",
                        ...extraData
                    }
                }
            };
            return fetch(fcmUrl, {
                method: "POST",
                headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
                body: JSON.stringify(messagePayload),
            });
        };

        const results = [];
        // Remove duplicates
        const uniqueTokens = [...new Set(targetTokens)];

        for (const token of uniqueTokens) {
            try {
                const res = await sendPush(token);
                results.push(await res.json());
            } catch (e) {
                results.push({ error: e.message, token });
            }
        }

        return new Response(JSON.stringify({ success: true, results }), { headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } });

    } catch (error: any) {
        console.error("send-push error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } });
    }
});
