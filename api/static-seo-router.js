import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const templatePath = path.join(process.cwd(), 'dist', 'index.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace the default logo with the square png for social media previews
    const newImage = 'https://italostudy.com/square%20png.png';
    
    html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/g, '<meta property="og:image" content="' + newImage + '" />');
    html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/>/g, '<meta name="twitter:image" content="' + newImage + '" />');
    
    // Replace preloaded logo if it exists
    html = html.replace(/<link rel="preload" href="\/logo\.webp"/g, '<link rel="preload" href="/square%20png.png"');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
    return res.status(200).send(html);
  } catch (err) {
    console.error('Static SEO SSR error:', err);
    try {
      const fallback = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(fallback);
    } catch {
      return res.status(500).send('Internal Server Error');
    }
  }
}
