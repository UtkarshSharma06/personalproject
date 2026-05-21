export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const isBot = /bot|whatsapp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|googlebot/i.test(userAgent);

  if (!isBot) {
    return new Response(null, {
      headers: { 'x-middleware-next': '1' },
    });
  }

  const supabaseUrl = 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5amhwcXRxYnd0eHhnaWp4ZXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTgyNjUsImV4cCI6MjA4MzE5NDI2NX0.5HaHhfgPQbIRKmHZE61ggrtj-lKi5JlBU9tsOfQ_d3c';

  const segments = url.pathname.split('/').filter(Boolean);
  const type = segments[0]; // 'blog' or 'resources'
  const slug = segments[1];

  if (!slug) {
    return new Response(null, {
      headers: { 'x-middleware-next': '1' },
    });
  }

  try {
    let title = 'Italostudy';
    let description = 'Study in Italy with Italostudy - Your ultimate guide to IMAT, TOLC, and more.';
    let image = 'https://italostudy.com/logo.webp';
    let ogType = 'website';

    if (type === 'blog') {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/blog_posts?slug=eq.${slug}&select=title,meta_description,excerpt,featured_image`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );
      const posts = await response.json();
      const post = posts?.[0];
      if (post) {
        title = post.title;
        description = post.meta_description || post.excerpt || '';
        image = post.featured_image || image;
        ogType = 'article';
      }
    } else if (type === 'resources') {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/exam_resources?slug=eq.${slug}&select=title,description`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );
      const resources = await response.json();
      const resource = resources?.[0];
      if (resource) {
        title = resource.title;
        description = resource.description || `Download ${resource.title} and other free study materials on ItaloStudy.`;
        ogType = 'article';
      }
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${url.href}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${url.href}">
  <meta property="twitter:title" content="${title}">
  <meta property="twitter:description" content="${description}">
  <meta property="twitter:image" content="${image}">

  <meta http-equiv="refresh" content="0;url=${url.href}">
</head>
<body>
  <p>Redirecting...</p>
  <script>window.location.href = "${url.href}";</script>
</body>
</html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Middleware SEO Error:', error);
    return new Response(null, {
      headers: { 'x-middleware-next': '1' },
    });
  }
}
