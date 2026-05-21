import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_LZduUlJ96GYtgyo0l-iTzw_P-8Glk_v';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders a single mock session as a server-side HTML card.
 * Mirrors the client-side render() logic in static-interactivity.js
 */
function renderMockCard(session) {
  const now = new Date();
  const start = new Date(session.start_time);
  const end = new Date(session.end_time);
  const isPast = end < now;
  const isLive = start <= now && end >= now;
  const isUpcoming = start > now;

  const dateStr = start.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  const statusLabel = isLive ? 'Live Now' : isPast ? 'Archive' : 'Registration Open';
  const statusClass = isLive
    ? 'text-red-600 bg-red-50'
    : isPast
    ? 'text-slate-500 bg-slate-100'
    : 'text-emerald-600 bg-emerald-50';

  return `
    <div class="bg-white rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between border border-slate-100 shadow-sm">
      <div class="flex items-center gap-8">
        <div class="flex flex-col items-center justify-center bg-slate-50 rounded-2xl w-20 h-20">
          <span class="text-2xl font-black">${start.getDate()}</span>
          <span class="text-[8px] font-bold uppercase text-slate-400">${start.toLocaleString('default', { month: 'short' })}</span>
        </div>
        <div>
          <h2 class="text-xl font-black text-slate-900 mb-1">${escapeHtml(session.title)}</h2>
          <span class="text-[9px] font-black uppercase ${statusClass} px-3 py-1 rounded-full">${statusLabel}</span>
        </div>
      </div>
      <a href="${isPast ? `/mock-guidelines?session_id=${session.id}&exam_type=cent-s-prep` : `/waiting-room/${session.id}`}" 
         class="mt-6 md:mt-0 px-8 py-3 bg-[#001533] text-white rounded-xl font-bold uppercase text-[10px] tracking-widest">
        ${isPast ? 'Review Paper' : 'Register Now'}
      </a>
    </div>`;
}

function buildMockListSchema(sessions, examName) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${examName} Mock Tests 2026 | ItaloStudy`,
    "url": `https://italostudy.com/cent-s-mock`,
    "numberOfItems": sessions.length,
    "itemListElement": sessions.slice(0, 10).map((s, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": s.title,
      "description": `Official ${examName} mock test scheduled for ${new Date(s.start_time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`,
      "url": `https://italostudy.com/waiting-room/${s.id}`
    }))
  };
}

export default async function handler(req, res) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    const [sessionsResult, seriesResult] = await Promise.all([
      supabase
        .from('mock_sessions')
        .select('*')
        .eq('is_active', true)
        .eq('exam_type', 'cent-s-prep')
        .order('start_time', { ascending: false }),
      supabase
        .from('mock_series')
        .select('id, title, description')
        .eq('is_active', true)
        .eq('exam_type', 'cent-s-prep')
        .order('created_at', { ascending: false })
    ]);

    const sessions = sessionsResult.data || [];
    const series = seriesResult.data || [];

    const now = new Date();
    const upcoming = sessions.filter(s => new Date(s.end_time) >= now);
    const archive = sessions.filter(s => new Date(s.end_time) < now);

    // Build SSR HTML for the mock list
    let ssrHtml = '';

    if (sessions.length === 0) {
      ssrHtml = `
        <div class="py-24 text-center">
          <h3 class="text-2xl font-black text-slate-400 uppercase tracking-tighter">No Simulations Scheduled Yet</h3>
          <p class="text-slate-400 mt-2 font-medium">Check back soon for upcoming CEnT-S mock tests.</p>
        </div>`;
    } else {
      if (upcoming.length > 0) {
        ssrHtml += `
          <div class="mb-24">
            <h3 class="text-2xl font-black text-[#001533] uppercase tracking-tight mb-10">Mocks Available</h3>
            <div class="grid gap-6">
              ${upcoming.map(renderMockCard).join('\n')}
            </div>
          </div>`;
      }
      if (archive.length > 0) {
        ssrHtml += `
          <div>
            <h3 class="text-2xl font-black text-[#001533] uppercase tracking-tight mb-10">Historical Archive</h3>
            <div class="grid gap-4 bg-white border border-slate-100 rounded-[2rem] p-4 shadow-sm">
              ${archive.map(renderMockCard).join('\n')}
            </div>
          </div>`;
      }
    }

    // Load and patch the HTML template
    const templatePath = path.join(process.cwd(), 'public', 'cent-s-mock.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Inject the SSR-rendered mock list (replacing the loading skeleton)
    html = html.replace(
      /<div id="mock-list-container"[^>]*>[\s\S]*?<\/div>\s*(?=<\/div>\s*<\/section>)/,
      `<div id="mock-list-container" class="space-y-16">\n<!-- SSR_START -->\n${ssrHtml}\n<!-- SSR_END -->\n</div>`
    );

    // Inject ItemList schema for SEO
    if (sessions.length > 0) {
      const schema = JSON.stringify(buildMockListSchema(sessions, 'CEnT-S'), null, 2);
      html = html.replace('</head>', `  <script type="application/ld+json">\n${schema}\n  </script>\n</head>`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(html);

  } catch (err) {
    console.error('[cent-s-mock-ssr] Error:', err);
    try {
      const templatePath = path.join(process.cwd(), 'public', 'cent-s-mock.html');
      const html = fs.readFileSync(templatePath, 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    } catch {
      return res.status(500).send('Internal Server Error');
    }
  }
}
