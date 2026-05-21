import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_LZduUlJ96GYtgyo0l-iTzw_P-8Glk_v';

const categoryMap = {
  'imat-prep': 'IMAT 2026',
  'cent-s-prep': 'CEnT-S 2026',
  'guide': 'Official Guide',
  'paper': 'Past Paper',
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderResourceCard(res) {
  const category = categoryMap[res.exam_type] || res.exam_type || 'RESOURCE';
  const description = escapeHtml(res.description || 'Access official documents, study guides, and preparation materials for this exam.');
  const title = escapeHtml(res.title || 'Resource');
  const date = new Date(res.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  return `
    <div class="group flex flex-col bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 h-full">
      <div class="flex items-center justify-between mb-8">
        <div class="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border-2 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14.5 2 14.5 8 20 8"></polyline></svg>
        </div>
        <span class="bg-slate-50 text-slate-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">${escapeHtml(category)}</span>
      </div>
      <div class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
        ${date}
      </div>
      <div>
        <h2 class="text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-2">${title}</h2>
        <p class="text-[13px] text-slate-500 font-medium leading-relaxed mb-10 line-clamp-3">${description}</p>
      </div>
      <div class="mt-auto">
        <a href="/resources/${escapeHtml(res.slug)}" class="w-full bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl h-14 font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3">
          Open Resource
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </a>
      </div>
    </div>`;
}

function buildItemListSchema(resources) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Study Resources & Materials | ItaloStudy",
    "description": "Free IMAT and CEnT-S past papers, syllabus guides, and preparation materials.",
    "url": "https://italostudy.com/resources",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": resources.length,
      "itemListElement": resources.slice(0, 20).map((res, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": res.title,
        "url": `https://italostudy.com/resources/${res.slug}`,
        "description": res.description || ''
      }))
    }
  };
}

export default async function handler(req, res) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    const { data: resources, error } = await supabase
      .from('exam_resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const templatePath = path.join(process.cwd(), 'public', 'resources.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // 1. Inject SSR-rendered resource cards into the grid
    const cardsHtml = (resources || []).map(renderResourceCard).join('\n');
    const ssrGrid = `
      <!-- SSR_START: injected at request time for SEO -->
      ${cardsHtml}
      <!-- SSR_END -->
      <!-- Client will hydrate filters/search on top of this -->
    `;
    html = html.replace(
      '<div id="resources-grid"\n        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32 transition-opacity duration-500">\n        <!-- Dynamically populated -->\n      </div>',
      `<div id="resources-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32 transition-opacity duration-500">${ssrGrid}</div>`
    );

    // Fallback replacement if whitespace differs
    if (!html.includes('SSR_START')) {
      html = html.replace(
        /(<div id="resources-grid"[^>]*>)\s*<!-- Dynamically populated -->\s*(<\/div>)/,
        `$1${ssrGrid}$2`
      );
    }

    // 2. Inject canonical tag if missing
    if (!html.includes('<link rel="canonical"')) {
      html = html.replace('</head>', `  <link rel="canonical" href="https://italostudy.com/resources">\n</head>`);
    }

    // 3. Inject Open Graph tags if missing
    if (!html.includes('og:title')) {
      const ogTags = `
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://italostudy.com/resources">
  <meta property="og:title" content="Free Study Resources for IMAT &amp; CEnT-S 2026 | ItaloStudy">
  <meta property="og:description" content="Access free IMAT and CEnT-S past papers, syllabus guides, and preparation materials.">
  <meta property="og:image" content="https://italostudy.com/logo.webp">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Free Study Resources | ItaloStudy">
  <meta name="twitter:description" content="Free IMAT and CEnT-S study materials, past papers and mock tests.">`;
      html = html.replace('</head>', `${ogTags}\n</head>`);
    }

    // 4. Inject ItemList schema
    if (resources && resources.length > 0) {
      const schema = JSON.stringify(buildItemListSchema(resources), null, 2);
      html = html.replace('</head>', `  <script type="application/ld+json">\n${schema}\n  </script>\n</head>`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(html);

  } catch (err) {
    console.error('[resources-ssr] Error:', err);
    // Fallback: serve the plain HTML without SSR injection
    try {
      const templatePath = path.join(process.cwd(), 'public', 'resources.html');
      const html = fs.readFileSync(templatePath, 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    } catch (fallbackErr) {
      return res.status(500).send('Internal Server Error');
    }
  }
}
