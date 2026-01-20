import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { AccessToken } from "npm:livekit-server-sdk"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        const { roomName, participantName } = body

        // 1. Sanitize Inputs
        // LiveKit identities and room names must be alphanumeric/dashes/underscores
        const safeRoom = (roomName || 'default-room').toString().replace(/[^a-zA-Z0-9_\-]/g, '_')
        const safeIdentity = (participantName || 'Guest').toString().replace(/[^a-zA-Z0-9_\- ]/g, '_').trim()

        if (!roomName || !participantName) {
            return new Response(
                JSON.stringify({ error: 'Missing roomName or participantName' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // 2. Load and Sanitize Secrets
        // We remove ALL whitespace characters (\s) and any potential control characters
        const apiKey = Deno.env.get('LIVEKIT_API_KEY')?.replace(/\s/g, '')
        const apiSecret = Deno.env.get('LIVEKIT_API_SECRET')?.replace(/\s/g, '')

        console.log(`[Diagnostic] Room: ${safeRoom}, Identity: ${safeIdentity}`)
        console.log(`[Diagnostic] API Key length: ${apiKey?.length || 0}`)
        console.log(`[Diagnostic] API Secret length: ${apiSecret?.length || 0}`)

        if (!apiKey || !apiSecret) {
            console.error('[Error] LIVEKIT_API_KEY or LIVEKIT_API_SECRET is missing')
            return new Response(
                JSON.stringify({ error: 'LiveKit server configuration missing on server' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // 3. Create Token with Explicit Grants
        const at = new AccessToken(apiKey, apiSecret, {
            identity: safeIdentity,
        })

        at.addGrant({
            roomJoin: true,
            room: safeRoom,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        })

        const token = await at.toJwt()

        // Last sanity check on the token
        if (typeof token !== 'string' || token.length < 50) {
            throw new Error('Token generation produced an invalid result')
        }

        console.log('[Success] Token generated successfully')

        return new Response(
            JSON.stringify({ token }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error: any) {
        console.error('[Fatal Error] LiveKit function failed:', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Internal Server Error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
