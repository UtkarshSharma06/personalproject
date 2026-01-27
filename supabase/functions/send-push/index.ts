
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";

const SERVICE_ACCOUNT = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");

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

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
    }

    try {
        if (!SERVICE_ACCOUNT) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT secret");
        const serviceAccount = JSON.parse(SERVICE_ACCOUNT);
        const { title, body, topic, token, tokens, data: extraData } = await req.json();

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

        const sendPush = async (target: { topic?: string, token?: string }) => {
            const messagePayload = {
                message: {
                    ...target,
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

        let results = [];
        if (topic) {
            results.push(await (await sendPush({ topic })).json());
        } else if (token) {
            results.push(await (await sendPush({ token })).json());
        } else if (tokens && Array.isArray(tokens)) {
            // Send to multiple (Multicast equivalent for v1)
            for (const t of tokens) {
                results.push(await (await sendPush({ token: t })).json());
            }
        }

        return new Response(JSON.stringify({ success: true, results }), { headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } });
    }
});
