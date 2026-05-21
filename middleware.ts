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
  const type = segments[0]; 
  const slug = segments[1];
  const pathKey = segments.join('/');

  // Static SEO Dictionary for Cluster Pages
  const staticSeoMap: Record<string, { title: string, description: string }> = {
    'cent-s-exam-ultimate-guide': { title: 'CEnT-S Exam 2026 Ultimate Guide', description: 'Everything you need to know about the CEnT-S exam for studying in Italy.' },
    'cent-s-syllabus-2026': { title: 'CEnT-S Syllabus 2026 | Full Breakdown', description: 'Detailed breakdown of the CEnT-S 2026 exam syllabus.' },
    'cent-s-exam-pattern-2026': { title: 'CEnT-S Exam Pattern 2026', description: 'Understand the CEnT-S exam structure, scoring, and format.' },
    'cent-s-cutoff-2026': { title: 'CEnT-S Cutoff Trends 2026', description: 'Analyze past cutoff scores and predict 2026 CEnT-S cutoffs.' },
    'cent-s-mock-test-free-2026': { title: 'Free CEnT-S Mock Test 2026', description: 'Take a free, full-length CEnT-S mock exam to test your preparation.' },
    'cent-s-previous-year-papers-pdf': { title: 'CEnT-S Previous Year Papers PDF', description: 'Download official CEnT-S past papers and practice questions.' },
    'cent-s-preparation-strategy-2026': { title: 'CEnT-S Preparation Strategy 2026', description: 'Proven tips and study plans to ace the CEnT-S exam.' },
    'best-books-for-cent-s-2026': { title: 'Best Books for CEnT-S 2026', description: 'Recommended study materials and books for CEnT-S preparation.' },
    'cent-s-eligibility-criteria': { title: 'CEnT-S Eligibility Criteria', description: 'Check if you are eligible to take the CEnT-S exam.' },
    'cent-s-registration-process-2026': { title: 'CEnT-S Registration Process 2026', description: 'Step-by-step guide to registering for the CEnT-S exam.' },
    'cent-s-important-dates-2026': { title: 'CEnT-S Important Dates 2026', description: 'Key deadlines, exam dates, and registration windows for CEnT-S.' },
    'cent-s-difficulty-level-analysis': { title: 'CEnT-S Difficulty Level Analysis', description: 'In-depth analysis of the CEnT-S exam difficulty compared to other exams.' },
    'cent-s-passing-score-explained': { title: 'CEnT-S Passing Score Explained', description: 'What is a good score in CEnT-S? Understanding the scoring system.' },
    'cent-s-mock-landing': { title: 'CEnT-S Mock Exams Simulator', description: 'Practice with our realistic CEnT-S exam simulator.' },

    'imat-exam-ultimate-guide-2026': { title: 'IMAT Exam 2026 Ultimate Guide', description: 'Your complete guide to passing the IMAT and studying medicine in Italy.' },
    'imat-syllabus-2026': { title: 'IMAT Syllabus 2026 | Detailed Breakdown', description: 'Comprehensive subject-by-subject breakdown of the IMAT 2026 syllabus.' },
    'imat-exam-dates-2026': { title: 'IMAT Exam Dates 2026', description: 'Important dates, deadlines, and timeline for the IMAT 2026 exam.' },
    'imat-registration-2026': { title: 'IMAT Registration 2026 Guide', description: 'How to register for the IMAT exam: Universitaly and payment process.' },
    'imat-exam-pattern-2026': { title: 'IMAT Exam Pattern 2026', description: 'Understand the question format, time limits, and negative marking in IMAT.' },
    'imat-cutoff-trends-2026': { title: 'IMAT Cutoff Trends 2026', description: 'Historical data and cutoff score predictions for Italian medical universities.' },
    'imat-mock-test-free-2026': { title: 'Free IMAT Mock Test 2026', description: 'Practice with a full-length, timed IMAT mock exam for free.' },
    'imat-previous-year-papers-pdf': { title: 'IMAT Previous Year Papers PDF', description: 'Download official IMAT past papers to boost your preparation.' },
    'imat-preparation-strategy-2026': { title: 'IMAT Preparation Strategy 2026', description: 'Expert advice, study plans, and tips to score high on the IMAT.' },
    'imat-best-books-2026': { title: 'Best Books for IMAT 2026', description: 'Top recommended books and resources for IMAT preparation.' },
    'imat-eligibility-criteria-2026': { title: 'IMAT Eligibility Criteria 2026', description: 'Educational requirements and documentation needed for the IMAT exam.' },
    'imat-passing-score-explained-2026': { title: 'IMAT Passing Score Explained', description: 'Understanding how IMAT is scored and what constitutes a competitive score.' },
    'imat-difficulty-analysis-2026': { title: 'IMAT Difficulty Level Analysis', description: 'How hard is the IMAT? A detailed subject-wise difficulty breakdown.' },
    'imat-vs-cents-2026': { title: 'IMAT vs CEnT-S: Which one to choose?', description: 'A detailed comparison between the IMAT and CEnT-S exams.' },

    'tolc-exam-ultimate-guide-2026': { title: 'TOLC Exam 2026 Ultimate Guide', description: 'Everything you need to know about TOLC-E, TOLC-I, and other TOLC exams.' },
    'til-i-exam-guide-2026': { title: 'TIL-I Exam Guide 2026', description: 'Complete preparation guide for the Politecnico di Torino TIL-I engineering exam.' },
    'study-in-italy-guide-2026': { title: 'Study in Italy 2026 Ultimate Guide', description: 'Your roadmap to studying at top Italian universities.' },
    
    'study-in-italy/universities-2026': { title: 'Top English-Taught Universities in Italy 2026', description: 'Discover the best public and private universities in Italy for international students.' },
    'study-in-italy/without-ielts': { title: 'Study in Italy Without IELTS', description: 'How to get admission in Italy without taking the IELTS or TOEFL exams.' },
    'study-in-italy/tuition-fees-2026': { title: 'Tuition Fees & Scholarships in Italy 2026', description: 'A complete breakdown of university fees and DSU scholarships in Italy.' },
    'study-in-italy/how-to-apply': { title: 'How to Apply to Italian Universities', description: 'Step-by-step application guide, pre-enrollment, and visa process for Italy.' }
  };

  try {
    let title = 'ItaloStudy | Free Prep for CEnT-S, IMAT, SAT & IELTS, Simplified';
    let description = 'Accelerate your medical and academic journey with ItaloStudy. Free CEnT-S, IMAT, SAT, and IELTS preparation with unlimited free mocks and direct university admission support.';
    let image = 'https://italostudy.com/logo.webp';
    let ogType = 'website';
    let shouldRenderSeo = false;

    if (staticSeoMap[pathKey]) {
      title = staticSeoMap[pathKey].title;
      description = staticSeoMap[pathKey].description;
      image = 'https://italostudy.com/square1.webp';
      shouldRenderSeo = true;
    } else if (type === 'blog' && slug) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/blog_posts?slug=eq.${slug}&select=title,meta_description,excerpt,featured_image`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const posts = await response.json();
      const post = posts?.[0];
      if (post) {
        title = post.title;
        description = post.meta_description || post.excerpt || '';
        image = post.featured_image || image;
        ogType = 'article';
        shouldRenderSeo = true;
      }
    } else if (type === 'resources' && slug) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/exam_resources?slug=eq.${slug}&select=title,description`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const resources = await response.json();
      const resource = resources?.[0];
      if (resource) {
        title = resource.title;
        description = resource.description || `Download ${resource.title} and other free study materials on ItaloStudy.`;
        ogType = 'article';
        shouldRenderSeo = true;
      }
    }

    if (!shouldRenderSeo) {
      return new Response(null, { headers: { 'x-middleware-next': '1' } });
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
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }
}
