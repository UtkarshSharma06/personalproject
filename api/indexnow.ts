import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * IndexNow Auto-Submission API
 * 
 * Notifies Bing, Yandex, Seznam, and all IndexNow-compatible search engines
 * about all URLs on italostudy.com instantly — no waiting for crawl.
 * 
 * HOW TO USE:
 *   POST https://italostudy.com/api/indexnow
 *   (or GET with ?secret=your_admin_secret)
 * 
 * The IndexNow key file must be live at:
 *   https://italostudy.com/f7a3b2c9d1e4f6a8b0c3d5e7f9a1b2c4.txt
 */

const INDEXNOW_KEY = 'f7a3b2c9d1e4f6a8b0c3d5e7f9a1b2c4';
const INDEXNOW_HOST = 'italostudy.com';
const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

// All indexable URLs on italostudy.com
// Keep this in sync with sitemap-core.xml + sitemap-authority.xml + sitemap-blog.xml
const ALL_URLS: string[] = [
  // ── Core Pages ──────────────────────────────────────────────────────
  'https://italostudy.com/',
  'https://italostudy.com/resources',
  'https://italostudy.com/blog',
  'https://italostudy.com/exams',
  'https://italostudy.com/pricing',
  'https://italostudy.com/method',
  'https://italostudy.com/about',
  'https://italostudy.com/contact',
  'https://italostudy.com/privacy',
  'https://italostudy.com/terms',
  'https://italostudy.com/refund',

  // ── CEnT-S Cluster ──────────────────────────────────────────────────
  'https://italostudy.com/cent-s-exam-ultimate-guide',
  'https://italostudy.com/cent-s-mock',
  'https://italostudy.com/cent-s-syllabus-2026',
  'https://italostudy.com/cent-s-exam-pattern-2026',
  'https://italostudy.com/cent-s-cutoff-2026',
  'https://italostudy.com/cent-s-mock-test-free-2026',
  'https://italostudy.com/cent-s-previous-year-papers-pdf',
  'https://italostudy.com/cent-s-preparation-strategy-2026',
  'https://italostudy.com/best-books-for-cent-s-2026',
  'https://italostudy.com/cent-s-eligibility-criteria',
  'https://italostudy.com/cent-s-registration-process-2026',
  'https://italostudy.com/cent-s-important-dates-2026',
  'https://italostudy.com/cent-s-difficulty-level-analysis',
  'https://italostudy.com/cent-s-passing-score-explained',
  'https://italostudy.com/cent-s-exam-preparation-book-pdf-free-download',

  // ── IMAT Cluster ─────────────────────────────────────────────────────
  'https://italostudy.com/imat-exam-ultimate-guide-2026',
  'https://italostudy.com/imat-mock',
  'https://italostudy.com/imat-syllabus-2026',
  'https://italostudy.com/imat-exam-dates-2026',
  'https://italostudy.com/imat-registration-2026',
  'https://italostudy.com/imat-exam-pattern-2026',
  'https://italostudy.com/imat-cutoff-trends-2026',
  'https://italostudy.com/imat-mock-test-free-2026',
  'https://italostudy.com/imat-previous-year-papers-pdf',
  'https://italostudy.com/imat-preparation-strategy-2026',
  'https://italostudy.com/imat-best-books-2026',
  'https://italostudy.com/imat-eligibility-criteria-2026',
  'https://italostudy.com/imat-passing-score-explained-2026',
  'https://italostudy.com/imat-difficulty-analysis-2026',
  'https://italostudy.com/imat-vs-cents-2026',

  // ── TOLC / TIL-I ─────────────────────────────────────────────────────
  'https://italostudy.com/tolc-exam-ultimate-guide-2026',
  'https://italostudy.com/til-i-exam-guide-2026',

  // ── Study in Italy Cluster ───────────────────────────────────────────
  'https://italostudy.com/study-in-italy-guide-2026',
  'https://italostudy.com/study-in-italy/universities-2026',
  'https://italostudy.com/study-in-italy/without-ielts',
  'https://italostudy.com/study-in-italy/tuition-fees-2026',
  'https://italostudy.com/study-in-italy/how-to-apply',

  // ── Blog Posts ───────────────────────────────────────────────────────
  'https://italostudy.com/blog/estimated-cost-studying-in-italy',
  'https://italostudy.com/blog/imat-2026-latest-syllabus-changes-and-how-to-prepare',
  'https://italostudy.com/blog/free-cent-s-course-preparation',
  'https://italostudy.com/blog/imat-vs-neet-which-is-better-for-studying-medicine-abroad',
  'https://italostudy.com/blog/imat-preparation-guide-2026',
  'https://italostudy.com/blog/fake-cent-s-websites-warning-2026',
  'https://italostudy.com/blog/best-universities-ms-data-science-computer-science-italy-2026',
  'https://italostudy.com/blog/how-to-study-in-italy-as-an-international-student',
  'https://italostudy.com/blog/imat-vs-cent-s',
  'https://italostudy.com/blog/why-italostudy-best-exam-prep-platform',
  'https://italostudy.com/blog/the-ultimate-guide-to-imat-2026-your-ticket-to-studying-medicine-in-italy',
  'https://italostudy.com/blog/life-as-an-international-student-in-europe',
  'https://italostudy.com/blog/top-10-free-courses-to-study-for-cent-s',
  'https://italostudy.com/blog/cent-s-mock-test-schedule-2026',
  'https://italostudy.com/blog/study-in-italy-without-ielts',
  'https://italostudy.com/blog/why-europe-better-than-us-canada-indian-students-2026',
  'https://italostudy.com/blog/cent-s-whatsapp-group-2026',
  'https://italostudy.com/blog/top-italian-universities-for-international-students',
  'https://italostudy.com/blog/cent-s-exam-2026-complete-guide',
  'https://italostudy.com/blog/cent-s-mock-test-series-2026-schedule-syllabus',
  'https://italostudy.com/blog/how-to-register-for-imat-exam-2026-complete-guide-italy',
];

// IndexNow accepts max 10,000 URLs per call; we chunk at 500 for safety
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple admin guard — pass ?secret=INDEXNOW_ADMIN in query
  // or call this from Vercel cron with the internal network (no secret needed in header)
  const secret = req.query.secret || req.headers['x-indexnow-secret'];
  const adminSecret = process.env.INDEXNOW_ADMIN_SECRET || 'italostudy_indexnow_2026';
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (secret !== adminSecret && req.method !== 'POST') {
    return res.status(401).json({
      error: 'Unauthorized',
      hint: 'Pass ?secret=YOUR_SECRET or POST to this endpoint',
    });
  }

  const results: { engine: string; status: number; ok: boolean }[] = [];
  const errors: string[] = [];

  // IndexNow works with one call that Bing distributes to all partners
  // We use api.indexnow.org as the universal relay endpoint
  const batches = chunk(ALL_URLS, 500);

  for (const batch of batches) {
    const payload = {
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: batch,
    };

    // Submit to IndexNow relay (distributes to Bing, Yandex, Seznam, etc.)
    try {
      const resp = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      results.push({ engine: 'IndexNow (api.indexnow.org)', status: resp.status, ok: resp.ok });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push('IndexNow relay error: ' + msg);
    }

    // Also submit directly to Bing IndexNow endpoint
    try {
      const resp = await fetch('https://www.bing.com/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      results.push({ engine: 'Bing (direct)', status: resp.status, ok: resp.ok });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push('Bing direct error: ' + msg);
    }
  }

  const allOk = results.every(r => r.ok || r.status === 202 || r.status === 200);

  return res.status(200).json({
    success: allOk,
    submitted_urls: ALL_URLS.length,
    batches: batches.length,
    results,
    errors: errors.length > 0 ? errors : undefined,
    note: allOk
      ? 'All URLs submitted. Bing, Yandex, and IndexNow partners will crawl within minutes.'
      : 'Some submissions failed. Check results array for details.',
  });
}
