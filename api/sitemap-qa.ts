import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * sitemap-qa.ts
 * 
 * The /answers Q&A pages are currently not active for public indexing.
 * This endpoint returns a valid but empty sitemap to avoid 404 errors
 * if the URL is ever directly requested.
 * 
 * To re-enable: restore Supabase query and URL generation from git history.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400');
    return res.status(200).send(xml);
}
