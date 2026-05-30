import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  const { type } = req.query;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_LZduUlJ96GYtgyo0l-iTzw_P-8Glk_v';
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (type === 'blog') {
      // Always include the root blog index so the sitemap is never empty
      xml += `\n  <url>\n    <loc>https://italostudy.com/blog</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`;

      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, created_at')
        .eq('status', 'published');

      if (!error && posts && posts.length > 0) {
        posts.forEach((post) => {
          const lastMod = post.updated_at || post.created_at || new Date().toISOString();
          xml += `\n  <url>\n    <loc>https://italostudy.com/blog/${post.slug}</loc>\n    <lastmod>${new Date(lastMod).toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
        });
      }
    } else if (type === 'resources') {
      // Always include the root resources index so the sitemap is never empty
      xml += `\n  <url>\n    <loc>https://italostudy.com/resources</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`;

      const { data: resources, error } = await supabase
        .from('exam_resources')
        .select('slug, updated_at, created_at')
        .eq('is_active', true);

      if (!error && resources && resources.length > 0) {
        resources.forEach((resource) => {
          const lastMod = resource.updated_at || resource.created_at || new Date().toISOString();
          xml += `\n  <url>\n    <loc>https://italostudy.com/resources/${resource.slug}</loc>\n    <lastmod>${new Date(lastMod).toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
        });
      }
    }
  } catch (err) {
    console.error(`Error fetching ${type} for sitemap:`, err);
  }

  xml += `\n</urlset>`;

  return res.status(200).send(xml);
}
