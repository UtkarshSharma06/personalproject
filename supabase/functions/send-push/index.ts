
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
        if (!SERVICE_ACCOUNT) {
            throw new Error("Missing FIREBASE_SERVICE_ACCOUNT secret");
        }

        const serviceAccount = JSON.parse(SERVICE_ACCOUNT);
        const { title, body, topic } = await req.json();

        const jwt = await getAccessToken(serviceAccount);

        // Exchange JWT for Access Token
        const tokenParams = new URLSearchParams();
        tokenParams.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
        tokenParams.append('assertion', jwt);

        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: tokenParams,
        });
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        // Send to FCM
        const fcmProject = serviceAccount.project_id;
        const fcmUrl = `https://fcm.googleapis.com/v1/projects/${fcmProject}/messages:send`;

        const messagePayload = {
            message: {
                topic: topic || "all_users",
                notification: {
                    title: title,
                    body: body,
                },
                data: {
                    url: "/mobile/notifications"
                }
            }
        };

        const response = await fetch(fcmUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messagePayload),
        });

        const result = await response.json();
        return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } });
    }
});
