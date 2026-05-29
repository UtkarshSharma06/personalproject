import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

/**
 * Returns a list of related authority page links based on blog slug keywords.
 * These are injected as a hidden nav block in SSR HTML for Google to crawl.
 * Completely invisible to users — aria-hidden + opacity:0 + height:0.
 */
function getRelatedLinks(slug) {
  const s = (slug || '').toLowerCase();
  const links = [];

  // CEnT-S cluster
  if (s.includes('cent-s') || s.includes('cents') || s.includes('cent_s')) {
    links.push({ href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' });
    links.push({ href: '/cent-s-syllabus-2026', label: 'CEnT-S Syllabus 2026' });
    links.push({ href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' });
    links.push({ href: '/cent-s-cutoff-2026', label: 'CEnT-S Cutoff Scores 2026' });
    if (s.includes('syllabus') || s.includes('subject')) {
      links.push({ href: '/cent-s-exam-pattern-2026', label: 'CEnT-S Exam Pattern 2026' });
    }
    if (s.includes('mock') || s.includes('practice') || s.includes('test')) {
      links.push({ href: '/cent-s-previous-year-papers-pdf', label: 'CEnT-S Previous Year Papers PDF' });
    }
    if (s.includes('registr') || s.includes('date') || s.includes('deadline')) {
      links.push({ href: '/cent-s-registration-process-2026', label: 'CEnT-S Registration Process 2026' });
      links.push({ href: '/cent-s-important-dates-2026', label: 'CEnT-S Important Dates 2026' });
    }
    if (s.includes('book') || s.includes('resource') || s.includes('material')) {
      links.push({ href: '/best-books-for-cent-s-2026', label: 'Best Books for CEnT-S 2026' });
    }
    if (s.includes('strategy') || s.includes('prep') || s.includes('guide') || s.includes('how')) {
      links.push({ href: '/cent-s-preparation-strategy-2026', label: 'CEnT-S Preparation Strategy 2026' });
    }
  }

  // IMAT cluster
  if (s.includes('imat')) {
    links.push({ href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' });
    links.push({ href: '/imat-syllabus-2026', label: 'IMAT Syllabus 2026' });
    links.push({ href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' });
    links.push({ href: '/imat-cutoff-trends-2026', label: 'IMAT Cutoff Scores 2026' });
    if (s.includes('registr') || s.includes('date') || s.includes('deadline')) {
      links.push({ href: '/imat-registration-2026', label: 'IMAT Registration Guide 2026' });
      links.push({ href: '/imat-exam-dates-2026', label: 'IMAT Exam Dates 2026' });
    }
    if (s.includes('strategy') || s.includes('prep') || s.includes('guide') || s.includes('how')) {
      links.push({ href: '/imat-preparation-strategy-2026', label: 'IMAT Preparation Strategy 2026' });
    }
    if (s.includes('book') || s.includes('resource') || s.includes('material')) {
      links.push({ href: '/imat-best-books-2026', label: 'Best Books for IMAT 2026' });
    }
    if (s.includes('neet') || s.includes('vs') || s.includes('compar')) {
      links.push({ href: '/imat-vs-cents-2026', label: 'IMAT vs CEnT-S Comparison' });
    }
  }

  // Study in Italy cluster
  if (s.includes('italy') || s.includes('italian') || s.includes('universit') || s.includes('abroad') || s.includes('europe')) {
    links.push({ href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' });
    links.push({ href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' });
    if (s.includes('ielts') || s.includes('toefl') || s.includes('language') || s.includes('english')) {
      links.push({ href: '/study-in-italy/without-ielts', label: 'Study in Italy Without IELTS' });
    }
    if (s.includes('fee') || s.includes('cost') || s.includes('scholarship') || s.includes('dsu') || s.includes('budget')) {
      links.push({ href: '/study-in-italy/tuition-fees-2026', label: 'Tuition Fees & Scholarships in Italy 2026' });
    }
    if (s.includes('apply') || s.includes('admission') || s.includes('visa') || s.includes('enroll')) {
      links.push({ href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' });
    }
  }

  // Always add these as baseline links
  if (!s.includes('imat') && !s.includes('cent-s')) {
    links.push({ href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' });
    links.push({ href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' });
  }
  links.push({ href: '/resources', label: 'Free Study Resources - ItaloStudy' });
  links.push({ href: '/blog', label: 'ItaloStudy Blog' });

  // Deduplicate by href and cap at 8 links
  const seen = new Set();
  return links.filter(l => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  }).slice(0, 8);
}


export default async function handler(req, res) {
  // 1. Get slug from URL
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).send('Slug is required');
  }

  // 2. Initialize Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_LZduUlJ96GYtgyo0l-iTzw_P-8Glk_v';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 3. Fetch Post Data from Supabase
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(name)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) {
      console.error('Post not found:', slug, error);
      return res.status(404).send('Post not found');
    }

    // 4. Read the PRODUCTION index.html from the Vite build output.
    // IMPORTANT: Must use 'dist/index.html', NOT 'index.html'.
    // The source index.html has <script src="/src/main.tsx"> which doesn't exist in production.
    // Vite build outputs dist/index.html with correct hashed asset paths e.g. /assets/main-AbC.js
    const templatePath = path.join(process.cwd(), 'dist', 'index.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // 5. Prepare Data
    const title = post.title || 'Untitled Post';
    const excerpt = post.excerpt || '';
    const featuredImage = post.featured_image || 'https://italostudy.com/logo.png';
    const postUrl = 'https://italostudy.com/blog/' + slug;
    const categoryName = post.blog_categories?.name || 'Education';
    const publishDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Process content (mirrors BlogPost.tsx logic)
    const recursiveUnwrap = (val) => {
      if (!val) return '';
      if (typeof val === 'object') {
        return val.body ? recursiveUnwrap(val.body) : JSON.stringify(val);
      }
      if (typeof val === 'string') {
        try {
          const trimmed = val.trim();
          if (trimmed.startsWith('{') && trimmed.includes('"body"')) {
            const parsed = JSON.parse(val);
            return recursiveUnwrap(parsed);
          }
        } catch { }
        return val;
      }
      return String(val);
    };
    const body = recursiveUnwrap(post.content);
    const processedContent = body.includes('<') ? body : body.replace(/\n/g, '<br />');
    const readTime = Math.max(1, Math.ceil(processedContent.split(/\s+/).length / 225));

    // Build FAQ schema for server-side injection (needed for Google to detect it
    // without executing JavaScript). BlogPost.tsx also injects it client-side via
    // react-helmet, but Google's crawler needs it in the raw HTML response.
    // react-helmet will overwrite/dedup it on hydration so no user-visible duplicate.
    let faqSchemaTag = '';
    if (post.faq_schema && post.faq_schema.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq_schema
          .filter(f => f.question && f.answer)
          .map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer }
          }))
      };
      faqSchemaTag = '<script type="application/ld+json">' + JSON.stringify(faqSchema) + '</script>';
    }

    // 6. Inject SEO meta tags — replace the generic index.html values with post-specific ones
    // NOTE: Do NOT inject FAQ schema here. The React client (BlogPost.tsx) already handles
    // FAQ schema correctly via react-helmet. Injecting it here would cause duplicates.
    const seoTitle = post.seo_title || title + ' | ItaloStudy Blog';
    const seoDesc = (post.meta_description || excerpt).replace(/"/g, '&quot;');
    const safeTitle = seoTitle.replace(/"/g, '&quot;');
    const safeImage = featuredImage.replace(/"/g, '&quot;');
    const safeUrl = postUrl.replace(/"/g, '&quot;');

    html = html.replace(/<title>.*?<\/title>/, '<title>' + seoTitle + '</title>');
    html = html.replace(/<meta name="description" content=".*?"\s*\/>/, '<meta name="description" content="' + seoDesc + '" />');
    html = html.replace(/<link rel="canonical" href=".*?"\s*\/>/, '<link rel="canonical" href="' + safeUrl + '" />');
    html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/, '<meta property="og:title" content="' + safeTitle + '" />');
    html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/, '<meta property="og:description" content="' + seoDesc + '" />');
    html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/, '<meta property="og:image" content="' + safeImage + '" />');
    html = html.replace(/<meta property="og:url" content=".*?"\s*\/>/, '<meta property="og:url" content="' + safeUrl + '" />');
    html = html.replace(/<meta property="twitter:title" content=".*?"\s*\/>/, '<meta property="twitter:title" content="' + safeTitle + '" />');
    html = html.replace(/<meta property="twitter:description" content=".*?"\s*\/>/, '<meta property="twitter:description" content="' + seoDesc + '" />');
    html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/>/, '<meta name="twitter:image" content="' + safeImage + '" />');

    // Inject FAQ schema into <head> for server-side crawlers
    if (faqSchemaTag) {
      html = html.replace('</head>', faqSchemaTag + '\n</head>');
    }

    // 7. Inject hidden SSR content for Google to read before React mounts.
    // This is invisible to users (opacity:0, height:0) but fully readable by crawlers.
    const featuredImgTag = featuredImage
      ? '<img src="' + featuredImage + '" alt="' + title.replace(/"/g, '&quot;') + '" />'
      : '';

    // Build related internal links for this blog post
    const relatedLinks = getRelatedLinks(slug);
    const relatedLinksHtml = relatedLinks.length > 0
      ? '<nav aria-label="related-pages">\n      <ul>\n' +
        relatedLinks.map(l => '        <li><a href="https://italostudy.com' + l.href + '">' + l.label + '</a></li>').join('\n') +
        '\n      </ul>\n    </nav>'
      : '';

    const ssrContent =
      '<div id="root">\n' +
      '  <div id="ssr-blog-content" style="opacity:0;height:0;overflow:hidden;position:absolute;pointer-events:none;" aria-hidden="true">\n' +
      '    <h1>' + title + '</h1>\n' +
      '    <p>By ItaloStudy Team &bull; ' + publishDate + ' &bull; ' + readTime + ' min read &bull; ' + categoryName + '</p>\n' +
      '    ' + featuredImgTag + '\n' +
      '    <article>' + processedContent + '</article>\n' +
      '    ' + relatedLinksHtml + '\n' +
      '  </div>\n' +
      '</div>';


    html = html.replace('<div id="root"></div>', ssrContent);

    // 8. Send Response
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).send(html);

  } catch (err) {
    console.error('Blog SSR error:', err);
    // Fallback: serve plain index.html so React still loads for users
    try {
      const fallback = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(fallback);
    } catch {
      return res.status(500).send('Internal Server Error');
    }
  }
}
