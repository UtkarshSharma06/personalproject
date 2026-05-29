import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_LZduUlJ96GYtgyo0l-iTzw_P-8Glk_v';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: resources, error } = await supabase
      .from('exam_resources')
      .select('slug, updated_at, created_at')
      .eq('is_active', true);

    if (error) throw error;

    if (resources && resources.length > 0) {
      resources.forEach((resource) => {
        const lastMod = resource.updated_at || resource.created_at || new Date().toISOString();
        xml += `
  <url>
    <loc>https://italostudy.com/resources/${resource.slug}</loc>
    <lastmod>${new Date(lastMod).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
    } else {
        // Fallback static resource if DB is empty
        xml += `
  <url>
    <loc>https://italostudy.com/resources/cent-s-exam-preparation-book-pdf</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
  } catch (err) {
    console.error('Error fetching resources for sitemap:', err);
    // Silent fail in XML
  }

  xml += `\n</urlset>`;

  return res.status(200).send(xml);
}
