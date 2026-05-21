import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).send('Slug is required');
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_LZduUlJ96GYtgyo0l-iTzw_P-8Glk_v';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: resource, error } = await supabase
      .from('exam_resources')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !resource) {
      console.error('Resource not found:', slug, error);
      return res.status(404).send('Resource not found');
    }

    const templatePath = path.join(process.cwd(), 'dist', 'index.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    const title = resource.title || 'ItaloStudy Resource';
    const excerpt = resource.description || `Download ${title} at ItaloStudy.`;
    
    // Determine the preview image
    let previewImage = 'https://italostudy.com/square%20png.png';
    if (resource.file_url) {
      if (resource.file_url.includes('/image/upload/') && resource.file_url.endsWith('.pdf')) {
        previewImage = resource.file_url.replace('.pdf', '.jpg');
      } else if (resource.file_url.match(/\.(png|jpg|jpeg|webp)$/i)) {
        previewImage = resource.file_url;
      }
    }

    const postUrl = 'https://italostudy.com/resources/' + slug;
    
    const safeTitle = title.replace(/"/g, '&quot;');
    const safeDesc = excerpt.replace(/"/g, '&quot;');
    const safeImage = previewImage.replace(/"/g, '&quot;');
    const safeUrl = postUrl.replace(/"/g, '&quot;');

    html = html.replace(/<title>.*?<\/title>/, '<title>' + safeTitle + '</title>');
    html = html.replace(/<meta name="description" content=".*?"\s*\/>/, '<meta name="description" content="' + safeDesc + '" />');
    html = html.replace(/<link rel="canonical" href=".*?"\s*\/>/, '<link rel="canonical" href="' + safeUrl + '" />');
    html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/, '<meta property="og:title" content="' + safeTitle + '" />');
    html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/, '<meta property="og:description" content="' + safeDesc + '" />');
    html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/, '<meta property="og:image" content="' + safeImage + '" />');
    html = html.replace(/<meta property="og:url" content=".*?"\s*\/>/, '<meta property="og:url" content="' + safeUrl + '" />');
    html = html.replace(/<meta property="twitter:title" content=".*?"\s*\/>/, '<meta property="twitter:title" content="' + safeTitle + '" />');
    html = html.replace(/<meta property="twitter:description" content=".*?"\s*\/>/, '<meta property="twitter:description" content="' + safeDesc + '" />');
    html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/>/, '<meta name="twitter:image" content="' + safeImage + '" />');
    
    // Replace preloaded logo
    html = html.replace(/<link rel="preload" href="\/logo\.webp"/g, '<link rel="preload" href="' + safeImage + '"');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).send(html);

  } catch (err) {
    console.error('Resource SSR error:', err);
    try {
      const fallback = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(fallback);
    } catch {
      return res.status(500).send('Internal Server Error');
    }
  }
}
