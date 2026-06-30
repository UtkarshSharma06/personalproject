import fs from 'fs';
// INTERNAL LINK HELPER
// relatedLinks: [{href, label}] — injected as a hidden nav block in SSR HTML.
// Completely invisible to users (opacity:0/height:0 div, aria-hidden).
// Google crawler reads raw HTML before JS hydration → passes full link equity.
import path from 'path';

// Per-page SEO metadata AND meaningful SSR content for Google crawlers
// Each entry: title, description, h1, intro (shown in raw HTML for bots),
// and keyPoints (bullet list shown in raw HTML — boosts content signals).
const PAGE_SEO = {
  // ─── CEnT-S Cluster ───────────────────────────────────────────────
  'cent-s-exam-ultimate-guide': {
    title: 'CEnT-S Exam 2026 Ultimate Guide | ItaloStudy',
    description: 'Complete guide to the CEnT-S 2026 exam: syllabus, dates, registration, cutoffs, and free mock tests.',
    canonical: 'https://italostudy.com/cent-s-exam-ultimate-guide',
    h1: 'CEnT-S Exam 2026 — The Ultimate Preparation Guide',
    intro: 'The CEnT-S (Centro Evaluation Test — Sciences) is the official Italian university entrance exam for science programs. This guide covers everything you need: syllabus breakdown, important dates, registration steps, cutoff scores, and free mock tests on ItaloStudy.',
    relatedLinks: [
      { href: '/cent-s-syllabus-2026', label: 'CEnT-S Syllabus 2026 — Full Breakdown' },
      { href: '/cent-s-exam-pattern-2026', label: 'CEnT-S Exam Pattern & Marking Scheme' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
      { href: '/cent-s-cutoff-2026', label: 'CEnT-S Cutoff Scores 2026' },
      { href: '/cent-s-registration-process-2026', label: 'CEnT-S Registration Guide 2026' },
      { href: '/cent-s-important-dates-2026', label: 'CEnT-S Important Dates 2026' },
      { href: '/imat-vs-cents-2026', label: 'IMAT vs CEnT-S — Which to Choose?' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Ultimate Guide' },
    ],
    keyPoints: [
      'CEnT-S 2026 exam date: announced by CISIA, typically September–October',
      'Subjects: Biology, Chemistry, Mathematics, Physics, and General Knowledge',
      'Exam duration: 100 minutes — 50 multiple choice questions',
      'Negative marking: -0.25 per wrong answer; +1 per correct answer',
      'Free full-length mock tests available on ItaloStudy with instant scores',
      'Required for most public Italian science universities (STEM programs)',
    ],
  },
  'cent-s-syllabus-2026': {
    title: 'CEnT-S Syllabus 2026 | Complete Subject-Wise Breakdown | ItaloStudy',
    description: 'Full CEnT-S 2026 syllabus with subject-wise topics, weightage, and preparation tips for Biology, Chemistry, Math, Physics.',
    canonical: 'https://italostudy.com/cent-s-syllabus-2026',
    h1: 'CEnT-S Syllabus 2026 — Complete Subject-Wise Breakdown',
    intro: 'The CEnT-S 2026 syllabus covers five core subjects. Understanding the exact topics and their weightage is the first step in your preparation strategy.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/cent-s-exam-pattern-2026', label: 'CEnT-S Exam Pattern & Format' },
      { href: '/best-books-for-cent-s-2026', label: 'Best Books for CEnT-S 2026' },
      { href: '/cent-s-preparation-strategy-2026', label: 'CEnT-S Preparation Strategy 2026' },
      { href: '/cent-s-difficulty-level-analysis', label: 'CEnT-S Difficulty Level Analysis' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
    ],
    keyPoints: [
      'Biology: Cell biology, genetics, evolution, ecology, human anatomy',
      'Chemistry: Atomic structure, chemical bonding, thermodynamics, organic chemistry basics',
      'Mathematics: Algebra, functions, geometry, calculus fundamentals, statistics',
      'Physics: Mechanics, thermodynamics, electromagnetism, optics',
      'General Knowledge: Logic, Italian culture, current affairs',
      'Biology and Chemistry together account for approximately 50% of the exam',
    ],
  },
  'cent-s-exam-pattern-2026': {
    title: 'CEnT-S Exam Pattern 2026 | Format, Marking Scheme & Structure | ItaloStudy',
    description: 'Understand the CEnT-S 2026 exam format: 50 MCQs in 100 minutes, subject distribution, and marking scheme explained.',
    canonical: 'https://italostudy.com/cent-s-exam-pattern-2026',
    h1: 'CEnT-S Exam Pattern 2026 — Format, Structure & Marking Scheme',
    intro: 'Knowing the CEnT-S exam pattern before you begin preparation saves time and improves strategy. Here is an exact breakdown of the 2026 format.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/cent-s-syllabus-2026', label: 'CEnT-S Syllabus 2026 — Full Breakdown' },
      { href: '/cent-s-difficulty-level-analysis', label: 'CEnT-S Difficulty Level Analysis' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
      { href: '/cent-s-passing-score-explained', label: 'CEnT-S Passing Score Explained' },
    ],
    keyPoints: [
      'Total Questions: 50 multiple choice questions (5 options each)',
      'Duration: 100 minutes (2 minutes per question average)',
      'Scoring: +1 correct, -0.25 wrong, 0 unanswered',
      'Subject split: Biology 18, Chemistry 12, Mathematics 10, Physics 8, GK 2 (approximate)',
      'Computer-based test (CBT) at designated CISIA centers in Italy',
      'Score range: typically 0 to 50; competitive scores start at 32+',
    ],
  },
  'cent-s-cutoff-2026': {
    title: 'CEnT-S Cutoff 2026 | University-Wise Score Analysis | ItaloStudy',
    description: 'CEnT-S 2026 cutoff scores by university. Historical trends, minimum qualifying scores, and score predictions.',
    canonical: 'https://italostudy.com/cent-s-cutoff-2026',
    h1: 'CEnT-S Cutoff Scores 2026 — University-Wise Analysis & Trends',
    intro: 'The CEnT-S cutoff scores vary by university and program. This page provides historical cutoff data, analysis of score trends, and what you need to target for 2026.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/cent-s-registration-process-2026', label: 'CEnT-S Registration Process 2026' },
      { href: '/cent-s-important-dates-2026', label: 'CEnT-S Important Dates 2026' },
      { href: '/cent-s-passing-score-explained', label: 'CEnT-S Passing Score Explained' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
    ],
    keyPoints: [
      'Top universities like Bologna and Pavia typically require 38–45+ out of 50',
      'Less competitive programs may accept scores from 28–32',
      'Cutoffs are affected by the total number of applicants each year',
      'Non-EU applicants may have separate quotas and different cutoff levels',
      'ItaloStudy tracks historical cutoff data and updates predictions annually',
      'Practice 5+ full mocks on ItaloStudy to benchmark your current score',
    ],
  },
  'cent-s-mock-test-free-2026': {
    title: 'Free CEnT-S Mock Test 2026 | Full-Length Exam Simulator | ItaloStudy',
    description: 'Take a free CEnT-S 2026 mock test online. Full-length, timed, with instant results and detailed answer analysis.',
    canonical: 'https://italostudy.com/cent-s-mock-test-free-2026',
    h1: 'Free CEnT-S Mock Test 2026 — Online Exam Simulator',
    intro: 'ItaloStudy offers free, full-length CEnT-S 2026 mock tests that replicate the real exam experience. Practice under timed conditions and get instant performance analysis.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/cent-s-cutoff-2026', label: 'CEnT-S Cutoff Scores 2026' },
      { href: '/cent-s-previous-year-papers-pdf', label: 'CEnT-S Previous Year Papers PDF' },
      { href: '/cent-s-preparation-strategy-2026', label: 'CEnT-S Preparation Strategy 2026' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
      { href: '/resources', label: 'Free Study Resources — ItaloStudy' },
    ],
    keyPoints: [
      'Unlimited free mock tests — no login required for basic access',
      'Full 50-question paper, 100-minute timer, real exam interface',
      'Instant score report with subject-wise performance breakdown',
      'Compare your score against other ItaloStudy test-takers nationally',
      'Detailed answer explanations for every question',
      'Available in both English and Italian',
    ],
  },
  'cent-s-previous-year-papers-pdf': {
    title: 'CEnT-S Previous Year Papers PDF | Download Free | ItaloStudy',
    description: 'Download CEnT-S previous year question papers PDF free. Practice with official past papers and boost your exam score.',
    canonical: 'https://italostudy.com/cent-s-previous-year-papers-pdf',
    h1: 'CEnT-S Previous Year Papers — Free PDF Download',
    intro: 'Practicing with CEnT-S past papers is one of the most effective preparation strategies. Access official previous year question papers with answer keys on ItaloStudy.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
      { href: '/cent-s-syllabus-2026', label: 'CEnT-S Syllabus 2026' },
      { href: '/best-books-for-cent-s-2026', label: 'Best Books for CEnT-S 2026' },
      { href: '/resources', label: 'Free Study Resources — ItaloStudy' },
    ],
    keyPoints: [
      'Official CISIA past papers from 2019 to 2025 available',
      'Full solutions and answer keys included for every paper',
      'Papers organized by year and subject for targeted practice',
      'Available as downloadable PDF and as interactive online tests',
      'Identify recurring question patterns and high-frequency topics',
      'Use past papers alongside ItaloStudy mock tests for complete preparation',
    ],
  },
  'cent-s-preparation-strategy-2026': {
    title: 'CEnT-S Preparation Strategy 2026 | Study Plan & Tips | ItaloStudy',
    description: 'Proven CEnT-S preparation strategy: month-by-month study plan, subject prioritization, and expert tips to score 40+.',
    canonical: 'https://italostudy.com/cent-s-preparation-strategy-2026',
    h1: 'CEnT-S Preparation Strategy 2026 — Study Plan & Expert Tips',
    intro: 'A smart CEnT-S preparation strategy can be the difference between getting your first-choice university or not. Here is a proven, structured plan to maximize your score.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/cent-s-syllabus-2026', label: 'CEnT-S Syllabus 2026 — Full Breakdown' },
      { href: '/best-books-for-cent-s-2026', label: 'Best Books for CEnT-S 2026' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
      { href: '/cent-s-difficulty-level-analysis', label: 'CEnT-S Difficulty Level Analysis' },
      { href: '/cent-s-cutoff-2026', label: 'CEnT-S Cutoff Scores 2026' },
    ],
    keyPoints: [
      'Start 4–6 months before the exam for comfortable preparation',
      'Month 1–2: Master Biology and Chemistry (50% of exam)',
      'Month 3: Focus on Mathematics and Physics',
      'Month 4+: Full mock tests every week + weak area revision',
      'Use ItaloStudy\'s adaptive question bank to target weak topics',
      'Aim for at least 10 full mock tests before your exam date',
    ],
  },
  'best-books-for-cent-s-2026': {
    title: 'Best Books for CEnT-S 2026 | Top Study Materials | ItaloStudy',
    description: 'Top recommended books and study resources for CEnT-S 2026 preparation. Subject-wise book list with pros and cons.',
    canonical: 'https://italostudy.com/best-books-for-cent-s-2026',
    h1: 'Best Books for CEnT-S 2026 — Subject-Wise Recommendations',
    intro: 'Choosing the right study materials is critical for CEnT-S preparation. Here are the top recommended books and resources used by high-scorers.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/cent-s-preparation-strategy-2026', label: 'CEnT-S Preparation Strategy 2026' },
      { href: '/cent-s-syllabus-2026', label: 'CEnT-S Syllabus 2026' },
      { href: '/cent-s-previous-year-papers-pdf', label: 'CEnT-S Previous Year Papers PDF' },
      { href: '/resources', label: 'Free Study Resources — ItaloStudy' },
    ],
    keyPoints: [
      'Biology: Campbell Biology (Pearson) — the gold standard for CEnT-S Bio',
      'Chemistry: Clayden\'s Organic Chemistry + Atkins for Physical Chemistry',
      'Mathematics: CISIA Official Guides + Schaum\'s Mathematical Handbook',
      'Physics: Serway & Vuille — College Physics for clear conceptual understanding',
      'Past Papers: CISIA official publications (always use official materials)',
      'ItaloStudy\'s free online question bank covers all subjects — no book needed for practice',
    ],
  },
  'cent-s-eligibility-criteria': {
    title: 'CEnT-S Eligibility Criteria 2026 | Who Can Apply? | ItaloStudy',
    description: 'CEnT-S 2026 eligibility requirements: age limit, educational qualifications, nationality, and documentation checklist.',
    canonical: 'https://italostudy.com/cent-s-eligibility-criteria',
    h1: 'CEnT-S Eligibility Criteria 2026 — Who Can Take the Exam?',
    intro: 'Before registering for CEnT-S 2026, confirm you meet the eligibility requirements. Both EU and non-EU students can take the exam with different application processes.',
    relatedLinks: [
      { href: '/cent-s-registration-process-2026', label: 'CEnT-S Registration Process 2026' },
      { href: '/cent-s-important-dates-2026', label: 'CEnT-S Important Dates 2026' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' },
    ],
    keyPoints: [
      'Must have completed (or be in final year of) secondary education',
      'Open to both EU and non-EU (international) students',
      'No age limit for CEnT-S — anyone can apply',
      'Non-EU students must also complete pre-enrollment on Universitaly',
      'Valid passport or national ID required for exam day',
      'Academic transcripts and diploma must be submitted for university admission',
    ],
  },
  'cent-s-registration-process-2026': {
    title: 'CEnT-S Registration 2026 | Step-by-Step Guide | ItaloStudy',
    description: 'How to register for CEnT-S 2026: CISIA registration, Universitaly pre-enrollment, test center selection, and fee payment.',
    canonical: 'https://italostudy.com/cent-s-registration-process-2026',
    h1: 'CEnT-S Registration Process 2026 — Complete Step-by-Step Guide',
    intro: 'Registering for CEnT-S 2026 involves multiple steps across different platforms. This guide walks you through the entire process from start to finish.',
    relatedLinks: [
      { href: '/cent-s-important-dates-2026', label: 'CEnT-S Important Dates & Deadlines' },
      { href: '/cent-s-eligibility-criteria', label: 'CEnT-S Eligibility Criteria' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' },
      { href: '/cent-s-cutoff-2026', label: 'CEnT-S Cutoff Scores 2026' },
    ],
    keyPoints: [
      'Step 1: Create an account on CISIA (cisia.eu) — the official exam body',
      'Step 2: Select CEnT-S exam, choose your preferred test date and center',
      'Step 3: Non-EU students must also register on Universitaly for pre-enrollment',
      'Step 4: Pay the exam fee (approximately €30 for EU, €50 for non-EU)',
      'Step 5: Receive confirmation and admit card by email',
      'Registration typically opens 6–8 weeks before the exam date',
    ],
  },
  'cent-s-important-dates-2026': {
    title: 'CEnT-S Important Dates 2026 | Exam Calendar & Deadlines | ItaloStudy',
    description: 'Key CEnT-S 2026 dates: registration window, exam sessions, result announcements, and university application deadlines.',
    canonical: 'https://italostudy.com/cent-s-important-dates-2026',
    h1: 'CEnT-S Important Dates 2026 — Exam Calendar & Key Deadlines',
    intro: 'Missing a CEnT-S 2026 deadline can cost you a full year. Bookmark this page — we update it as CISIA releases official dates.',
    relatedLinks: [
      { href: '/cent-s-registration-process-2026', label: 'CEnT-S Registration Step-by-Step' },
      { href: '/cent-s-eligibility-criteria', label: 'CEnT-S Eligibility Criteria' },
      { href: '/cent-s-preparation-strategy-2026', label: 'CEnT-S Preparation Strategy 2026' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' },
    ],
    keyPoints: [
      'Universitaly pre-enrollment: typically opens February–March 2026',
      'CEnT-S registration on CISIA: usually opens 6–8 weeks before exam',
      'Main CEnT-S exam sessions: September and October 2026',
      'Score validity: TOLC/CEnT-S scores valid for 18 months from test date',
      'University application deadlines vary: typically July–September for Italian institutions',
      'Visa application deadline for non-EU students: at least 3 months before course start',
    ],
  },
  'cent-s-difficulty-level-analysis': {
    title: 'CEnT-S Difficulty Level Analysis 2026 | Subject-Wise Breakdown | ItaloStudy',
    description: 'How hard is the CEnT-S exam? Detailed difficulty analysis by subject, comparison with other entrance exams, and scoring insights.',
    canonical: 'https://italostudy.com/cent-s-difficulty-level-analysis',
    h1: 'CEnT-S Difficulty Level Analysis — How Hard Is the Exam?',
    intro: 'The CEnT-S is considered moderately difficult — harder than typical high school exams but less demanding than IMAT. Here\'s a data-driven breakdown.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/cent-s-syllabus-2026', label: 'CEnT-S Syllabus 2026' },
      { href: '/cent-s-preparation-strategy-2026', label: 'CEnT-S Preparation Strategy 2026' },
      { href: '/imat-difficulty-analysis-2026', label: 'IMAT Difficulty Level Analysis' },
      { href: '/imat-vs-cents-2026', label: 'IMAT vs CEnT-S Comparison' },
    ],
    keyPoints: [
      'Overall difficulty: 6/10 — accessible with 3–4 months of focused preparation',
      'Biology: 5/10 — conceptual, memorization-heavy; most students find this manageable',
      'Chemistry: 7/10 — requires both theory and numerical problem-solving ability',
      'Mathematics: 6/10 — high school calculus and algebra at advanced level',
      'Physics: 6/10 — conceptual understanding plus equation-based problems',
      'Compared to IMAT: CEnT-S is broader but less deeply analytical',
    ],
  },
  'cent-s-passing-score-explained': {
    title: 'CEnT-S Passing Score Explained 2026 | What Score Do You Need? | ItaloStudy',
    description: 'What is the CEnT-S passing score? Score ranges, university-specific requirements, and how scores are calculated explained.',
    canonical: 'https://italostudy.com/cent-s-passing-score-explained',
    h1: 'CEnT-S Passing Score Explained — What Score Do You Really Need?',
    intro: 'There is no single "passing score" in CEnT-S — admission depends on your score relative to other applicants and the specific university quota. This page explains how it works.',
    relatedLinks: [
      { href: '/cent-s-cutoff-2026', label: 'CEnT-S Cutoff Scores 2026' },
      { href: '/cent-s-exam-pattern-2026', label: 'CEnT-S Exam Pattern & Marking Scheme' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
    ],
    keyPoints: [
      'No fixed passing threshold — it\'s a merit-based ranking system',
      'Your score is compared against other applicants for the same course',
      'Competitive score for top universities (Bologna, Pavia): 38–45+ out of 50',
      'Minimum practical score to get any admission: 28+ in most years',
      'EU and non-EU students are ranked separately for quota seats',
      'Score of 35+ places you in the top 25% of test-takers historically',
    ],
  },

  // ─── IMAT Cluster ─────────────────────────────────────────────────
  'imat-exam-ultimate-guide-2026': {
    title: 'IMAT Exam 2026 Ultimate Guide | Complete Preparation | ItaloStudy',
    description: 'Complete IMAT 2026 guide: syllabus, registration, dates, cutoffs, books, and free mock tests. Everything for international medical students.',
    canonical: 'https://italostudy.com/imat-exam-ultimate-guide-2026',
    h1: 'IMAT 2026 — The Ultimate Guide for International Medical Students',
    intro: 'The IMAT (International Medical Admissions Test) is the gateway to studying medicine in English at Italian public universities. This comprehensive guide covers every aspect of IMAT 2026 preparation.',
    relatedLinks: [
      { href: '/imat-syllabus-2026', label: 'IMAT Syllabus 2026 — Full Breakdown' },
      { href: '/imat-exam-dates-2026', label: 'IMAT Exam Dates 2026' },
      { href: '/imat-registration-2026', label: 'IMAT Registration Guide 2026' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
      { href: '/imat-cutoff-trends-2026', label: 'IMAT Cutoff Scores 2026' },
      { href: '/imat-preparation-strategy-2026', label: 'IMAT Preparation Strategy 2026' },
      { href: '/imat-vs-cents-2026', label: 'IMAT vs CEnT-S — Which to Choose?' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Ultimate Guide' },
    ],
    keyPoints: [
      'IMAT 2026 exam date: typically first Thursday of September',
      'Administered by Cambridge Assessment on behalf of the Italian MUR',
      'Subjects: Biology, Chemistry, Physics & Math, Logical Reasoning, General Knowledge',
      'Total: 60 questions in 100 minutes; scoring +1.5 correct, -0.4 wrong',
      'Available seats: ~1,200 across 8 Italian public universities',
      'Free IMAT mock tests available on ItaloStudy — full exam simulation',
    ],
  },
  'imat-syllabus-2026': {
    title: 'IMAT Syllabus 2026 | Complete Subject-Wise Topics | ItaloStudy',
    description: 'Full IMAT 2026 syllabus with detailed topic list for Biology, Chemistry, Physics, Math, and Logical Reasoning.',
    canonical: 'https://italostudy.com/imat-syllabus-2026',
    h1: 'IMAT Syllabus 2026 — Complete Subject-Wise Topic List',
    intro: 'The official IMAT syllabus is published by Cambridge Assessment and the Italian MUR. Understanding every topic is essential for targeted preparation.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/imat-exam-pattern-2026', label: 'IMAT Exam Pattern & Format' },
      { href: '/imat-best-books-2026', label: 'Best Books for IMAT 2026' },
      { href: '/imat-preparation-strategy-2026', label: 'IMAT Preparation Strategy 2026' },
      { href: '/imat-difficulty-analysis-2026', label: 'IMAT Difficulty Level Analysis' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
    ],
    keyPoints: [
      'Biology: cell biology, genetics, metabolic pathways, the nervous system, ecology',
      'Chemistry: inorganic and organic chemistry, stoichiometry, chemical equilibrium',
      'Physics: kinematics, dynamics, thermodynamics, waves and optics, electrostatics',
      'Mathematics: algebra, geometry, functions, calculus, statistics and probability',
      'Logical Reasoning: argument analysis, data sufficiency, verbal reasoning',
      'General Knowledge: science and technology, humanities, current affairs',
    ],
  },
  'imat-exam-dates-2026': {
    title: 'IMAT Exam Date 2026 | Schedule, Timeline & Key Deadlines | ItaloStudy',
    description: 'Official IMAT 2026 exam date, registration deadline, result date, and all key timeline milestones for international medical students.',
    canonical: 'https://italostudy.com/imat-exam-dates-2026',
    h1: 'IMAT Exam Dates 2026 — Official Calendar & Key Deadlines',
    intro: 'The IMAT 2026 exam calendar is released by the Italian Ministry of Universities (MUR). Plan your preparation and university applications around these official dates.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/imat-registration-2026', label: 'IMAT Registration Step-by-Step' },
      { href: '/imat-eligibility-criteria-2026', label: 'IMAT Eligibility Criteria 2026' },
      { href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' },
      { href: '/imat-preparation-strategy-2026', label: 'IMAT Preparation Strategy 2026' },
    ],
    keyPoints: [
      'IMAT 2026 exam: expected first Thursday of September 2026',
      'Registration on Universitaly: opens approximately May–June 2026',
      'Registration deadline: typically 4–6 weeks before exam day',
      'IMAT results: usually released within 2–3 weeks after the exam',
      'University enrollment: October–November 2026 after results',
      'Non-EU visa application: start at least 3–4 months before enrollment',
    ],
  },
  'imat-registration-2026': {
    title: 'IMAT Registration 2026 | How to Register Step-by-Step | ItaloStudy',
    description: 'Complete guide to IMAT 2026 registration: Universitaly account, exam booking, payment, and document checklist.',
    canonical: 'https://italostudy.com/imat-registration-2026',
    h1: 'IMAT Registration 2026 — Step-by-Step Registration Guide',
    intro: 'IMAT registration is done entirely through Universitaly (universitaly.it). Missing the deadline means waiting a full year. Follow these steps carefully.',
    relatedLinks: [
      { href: '/imat-exam-dates-2026', label: 'IMAT Exam Dates & Deadlines 2026' },
      { href: '/imat-eligibility-criteria-2026', label: 'IMAT Eligibility Criteria 2026' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' },
      { href: '/imat-cutoff-trends-2026', label: 'IMAT Cutoff Scores by University' },
    ],
    keyPoints: [
      'Step 1: Create an account on universitaly.it with a valid email',
      'Step 2: Complete your personal profile and upload your academic documents',
      'Step 3: Select IMAT and your preferred test center (Italy or overseas)',
      'Step 4: Pay the exam fee (€160 as of 2025; 2026 fee TBC)',
      'Step 5: Confirm registration and download your admit card',
      'Non-EU students: also complete the pre-enrollment section on Universitaly',
    ],
  },
  'imat-exam-pattern-2026': {
    title: 'IMAT Exam Pattern 2026 | Format, Time & Marking Scheme | ItaloStudy',
    description: 'IMAT 2026 exam format: 60 questions in 100 minutes, subject distribution, and scoring system explained.',
    canonical: 'https://italostudy.com/imat-exam-pattern-2026',
    h1: 'IMAT Exam Pattern 2026 — Format, Structure & Marking Scheme',
    intro: 'Understanding the IMAT exam pattern before you sit the test is critical. Here is a precise breakdown of the 2026 format.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/imat-syllabus-2026', label: 'IMAT Syllabus 2026 — Detailed Topics' },
      { href: '/imat-difficulty-analysis-2026', label: 'IMAT Difficulty Level Analysis' },
      { href: '/imat-passing-score-explained-2026', label: 'IMAT Passing Score Explained' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
    ],
    keyPoints: [
      'Total Questions: 60 multiple choice questions (5 options each)',
      'Duration: 100 minutes total',
      'Scoring: +1.5 correct, -0.4 wrong, 0 unanswered',
      'Section 1 — Logical Reasoning & GK: 30 questions',
      'Section 2 — Biology & Chemistry: 23 questions',
      'Section 3 — Physics & Mathematics: 7 questions',
    ],
  },
  'imat-cutoff-trends-2026': {
    title: 'IMAT Cutoff Scores 2026 | University-Wise Historical Data | ItaloStudy',
    description: 'IMAT 2026 cutoff score predictions by university. Historical cutoffs from 2012–2025 and what score you need to secure admission.',
    canonical: 'https://italostudy.com/imat-cutoff-trends-2026',
    h1: 'IMAT Cutoff Scores 2026 — University-Wise Historical Analysis',
    intro: 'IMAT cutoff scores vary significantly between universities and change each year based on applicant pool size and exam difficulty. Use historical data to set your target score.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/imat-passing-score-explained-2026', label: 'IMAT Passing Score Explained' },
      { href: '/imat-registration-2026', label: 'IMAT Registration Guide 2026' },
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
    ],
    keyPoints: [
      'University of Milan: historically highest cutoff, typically 38–45+ out of 90',
      'University of Bologna: cutoff range 35–42; competitive but less than Milan',
      'University of Pavia, Naples, Rome: typically 30–38 range',
      'Cutoffs are published by each university after results; not pre-announced',
      'EU and non-EU applicants are ranked separately with different seat quotas',
      'Target score for safe admission: 40+ out of 90 for top universities',
    ],
  },
  'imat-mock-test-free-2026': {
    title: 'Free IMAT Mock Test 2026 | Full-Length Online Practice | ItaloStudy',
    description: 'Take free IMAT 2026 mock tests online. Full-length, timed practice exams with instant scoring and question-level analysis.',
    canonical: 'https://italostudy.com/imat-mock-test-free-2026',
    h1: 'Free IMAT Mock Test 2026 — Online Exam Simulator',
    intro: 'ItaloStudy provides free, full-length IMAT mock tests that replicate the real Cambridge Assessment exam environment. Practice under real exam conditions and track your progress.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/imat-previous-year-papers-pdf', label: 'IMAT Previous Year Papers PDF' },
      { href: '/imat-preparation-strategy-2026', label: 'IMAT Preparation Strategy 2026' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
      { href: '/resources', label: 'Free Study Resources — ItaloStudy' },
    ],
    keyPoints: [
      '60-question full mock — same format as the real IMAT exam',
      '100-minute countdown timer with section tracking',
      'Instant score report with per-subject analysis',
      'Detailed explanations for every answer — learn from mistakes immediately',
      'Historical score comparison — see how you rank among other students',
      'Unlimited free mocks available — no credit card required',
    ],
  },
  'imat-previous-year-papers-pdf': {
    title: 'IMAT Previous Year Papers PDF | Download Free | ItaloStudy',
    description: 'Download IMAT previous year papers PDF free. Official past papers from 2011 to 2025 with complete answer keys.',
    canonical: 'https://italostudy.com/imat-previous-year-papers-pdf',
    h1: 'IMAT Previous Year Papers — Free PDF Download (2011–2025)',
    intro: 'IMAT past papers are your most valuable preparation resource. Cambridge Assessment releases official papers after each exam. Access them all here.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
      { href: '/imat-syllabus-2026', label: 'IMAT Syllabus 2026' },
      { href: '/imat-best-books-2026', label: 'Best Books for IMAT 2026' },
      { href: '/resources', label: 'Free Study Resources — ItaloStudy' },
    ],
    keyPoints: [
      'Official IMAT past papers available from 2011 to 2025',
      'Complete answer keys and explanations provided',
      'Papers organized by year, subject, and difficulty level',
      'Interactive online versions available in addition to PDF downloads',
      'Identifying repeated question patterns can save weeks of preparation time',
      'Combine past papers with ItaloStudy mocks for the most effective practice',
    ],
  },
  'imat-preparation-strategy-2026': {
    title: 'IMAT Preparation Strategy 2026 | Study Plan & Expert Tips | ItaloStudy',
    description: 'Proven IMAT 2026 preparation strategy: month-by-month study plan, books, resources, and tips from high scorers.',
    canonical: 'https://italostudy.com/imat-preparation-strategy-2026',
    h1: 'IMAT Preparation Strategy 2026 — Expert Study Plan & Tips',
    intro: 'Cracking IMAT requires more than hard work — it requires the right strategy. Here\'s a proven preparation plan based on data from thousands of ItaloStudy students.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/imat-syllabus-2026', label: 'IMAT Syllabus 2026 — Full Breakdown' },
      { href: '/imat-best-books-2026', label: 'Best Books for IMAT 2026' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
      { href: '/imat-difficulty-analysis-2026', label: 'IMAT Difficulty Level Analysis' },
      { href: '/imat-cutoff-trends-2026', label: 'IMAT Cutoff Scores 2026' },
    ],
    keyPoints: [
      'Start 6–12 months before the exam for a competitive score (40+)',
      'First 3 months: systematic syllabus coverage — Biology → Chemistry → Math/Physics',
      'Month 4–5: Logical Reasoning practice daily (30 min minimum)',
      'Month 6+: Weekly full mock tests — track scores and adjust weak areas',
      'Use official IMAT past papers as a baseline, then ItaloStudy question bank for depth',
      'Final 4 weeks: only revision + 2 full mocks per week, no new topics',
    ],
  },
  'imat-best-books-2026': {
    title: 'Best Books for IMAT 2026 | Subject-Wise Book List | ItaloStudy',
    description: 'Top books for IMAT 2026 preparation: Biology, Chemistry, Physics, Math, and Logical Reasoning — with honest reviews.',
    canonical: 'https://italostudy.com/imat-best-books-2026',
    h1: 'Best Books for IMAT 2026 — Subject-Wise Recommendations',
    intro: 'The right books can cut months off your preparation time. Here\'s what high-scoring IMAT students actually use — not generic advice.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/imat-preparation-strategy-2026', label: 'IMAT Preparation Strategy 2026' },
      { href: '/imat-syllabus-2026', label: 'IMAT Syllabus 2026' },
      { href: '/imat-previous-year-papers-pdf', label: 'IMAT Previous Year Papers PDF' },
      { href: '/resources', label: 'Free Study Resources — ItaloStudy' },
    ],
    keyPoints: [
      'Biology: Campbell Biology 12th Edition — the definitive IMAT biology resource',
      'Chemistry: Atkins\' Physical Chemistry + Morrison Boyd for Organic',
      'Mathematics: Calculus by James Stewart + IMAT-specific practice guides',
      'Physics: Serway & Jewett — Physics for Scientists and Engineers',
      'Logical Reasoning: A Guide to the LNAT (logic section patterns are similar)',
      'ItaloStudy question bank replaces most books for practice — free and IMAT-specific',
    ],
  },
  'imat-eligibility-criteria-2026': {
    title: 'IMAT Eligibility Criteria 2026 | Who Can Apply? | ItaloStudy',
    description: 'IMAT 2026 eligibility requirements: educational qualifications, nationality, age, and documentation needed to register.',
    canonical: 'https://italostudy.com/imat-eligibility-criteria-2026',
    h1: 'IMAT Eligibility Criteria 2026 — Complete Requirements Checklist',
    intro: 'Before registering for IMAT 2026, verify you meet all eligibility requirements. Both EU and non-EU students can sit the exam through different processes.',
    relatedLinks: [
      { href: '/imat-registration-2026', label: 'IMAT Registration Step-by-Step' },
      { href: '/imat-exam-dates-2026', label: 'IMAT Exam Dates & Deadlines' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' },
    ],
    keyPoints: [
      'Must hold or be completing a secondary school diploma (equivalent to Italian Maturità)',
      'Open to all nationalities — no country restrictions',
      'No age limit for the exam',
      'Non-EU students need pre-enrollment on Universitaly as an additional step',
      'Academic documents must be apostilled and translated into Italian',
      'English proficiency: IMAT is in English — no separate English certificate required',
    ],
  },
  'imat-passing-score-explained-2026': {
    title: 'IMAT Passing Score Explained 2026 | What Score Gets You In? | ItaloStudy',
    description: 'What IMAT score do you need to get into Italian medical school? Score ranges, university thresholds, and score calculation explained.',
    canonical: 'https://italostudy.com/imat-passing-score-explained-2026',
    h1: 'IMAT Passing Score Explained — What Score Gets You Into Medical School?',
    intro: 'There is no single IMAT "passing score" — admission depends on your ranking relative to other candidates and the seat quota at each university.',
    relatedLinks: [
      { href: '/imat-cutoff-trends-2026', label: 'IMAT Cutoff Scores by University' },
      { href: '/imat-exam-pattern-2026', label: 'IMAT Exam Pattern & Marking Scheme' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
    ],
    keyPoints: [
      'Maximum raw score: 90 (60 questions × +1.5 each)',
      'Average IMAT score historically: approximately 28–32 out of 90',
      'Score to rank competitively for top universities: 40+ out of 90',
      'EU students are ranked separately from non-EU students',
      'Negative marks apply: -0.4 per wrong answer; strategic guessing matters',
      'Score of 35+ typically places you in the top 30% of all test-takers',
    ],
  },
  'imat-difficulty-analysis-2026': {
    title: 'IMAT Difficulty Analysis 2026 | How Hard Is the IMAT? | ItaloStudy',
    description: 'IMAT difficulty level by subject: Biology, Chemistry, Logical Reasoning. Comparison with NEET, BMAT, and CEnT-S.',
    canonical: 'https://italostudy.com/imat-difficulty-analysis-2026',
    h1: 'IMAT Difficulty Analysis 2026 — How Hard Is the Exam, Really?',
    intro: 'The IMAT is widely considered one of the harder medical entrance exams globally. Here is a data-driven difficulty breakdown by subject.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/imat-syllabus-2026', label: 'IMAT Syllabus 2026' },
      { href: '/imat-preparation-strategy-2026', label: 'IMAT Preparation Strategy 2026' },
      { href: '/cent-s-difficulty-level-analysis', label: 'CEnT-S Difficulty Level Analysis' },
      { href: '/imat-vs-cents-2026', label: 'IMAT vs CEnT-S Comparison' },
    ],
    keyPoints: [
      'Overall difficulty: 8/10 — requires 6–12 months of serious preparation',
      'Biology: 7/10 — deep, university-level content required',
      'Chemistry: 8/10 — organic chemistry and equilibrium calculations are challenging',
      'Logical Reasoning: 9/10 — the section most students underestimate',
      'Physics & Math: 7/10 — concept-heavy; requires strong fundamentals',
      'Harder than CEnT-S; comparable to BMAT; easier than UKCAT',
    ],
  },
  'imat-vs-cents-2026': {
    title: 'IMAT vs CEnT-S 2026 | Which Exam Should You Choose? | ItaloStudy',
    description: 'IMAT vs CEnT-S: full comparison of difficulty, programs, universities, preparation time, and career outcomes for international students.',
    canonical: 'https://italostudy.com/imat-vs-cents-2026',
    h1: 'IMAT vs CEnT-S 2026 — Which Italian University Entrance Exam Is Right for You?',
    intro: 'IMAT and CEnT-S are both Italian university entrance exams but for very different fields. Choosing the right one is the most important decision before you start preparing.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
    ],
    keyPoints: [
      'IMAT: for Medicine (MBBS) programs in English at Italian public universities',
      'CEnT-S: for Science programs (Biology, Chemistry, Pharmacy, etc.) taught in Italian',
      'IMAT is harder (8/10 difficulty); CEnT-S is more accessible (6/10)',
      'IMAT is fully in English; CEnT-S requires Italian language proficiency',
      'IMAT has ~1,200 seats; CEnT-S has more seats across more universities',
      'Both exams can be taken in the same year — some students attempt both',
    ],
  },

  // ─── TOLC & TIL-I ─────────────────────────────────────────────────
  'tolc-exam-ultimate-guide-2026': {
    title: 'TOLC Exam 2026 Ultimate Guide | TOLC-E, TOLC-I & More | ItaloStudy',
    description: 'Complete TOLC 2026 guide: TOLC-E, TOLC-I, TOLC-F types explained with registration, syllabus, and preparation resources.',
    canonical: 'https://italostudy.com/tolc-exam-ultimate-guide-2026',
    h1: 'TOLC Exam 2026 — Ultimate Guide for All TOLC Types',
    intro: 'TOLC (Test Online CISIA) is Italy\'s computer-based university entrance exam, available in multiple versions for different programs. This guide covers TOLC-E, TOLC-I, TOLC-F, and more.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
      { href: '/exams', label: 'All Italian University Entrance Exams' },
    ],
    keyPoints: [
      'TOLC-E: for Engineering and Architecture programs',
      'TOLC-I: for Scientific and Technological programs',
      'TOLC-F: for Economics, Law, and Social Science programs',
      'TOLC exams are taken year-round at CISIA test centers across Italy',
      'One TOLC score is valid for 18 months — multiple universities accept the same score',
      'Free preparation resources and practice tests available on ItaloStudy',
    ],
  },
  'til-i-exam-guide-2026': {
    title: 'TIL-I Exam Guide 2026 | Politecnico di Torino Engineering Exam | ItaloStudy',
    description: 'Complete TIL-I 2026 exam guide: syllabus, registration, cutoffs, and preparation tips for Politecnico di Torino engineering admission.',
    canonical: 'https://italostudy.com/til-i-exam-guide-2026',
    h1: 'TIL-I Exam Guide 2026 — Politecnico di Torino Engineering Admission',
    intro: 'The TIL-I is the entrance test for international engineering students at Politecnico di Torino, one of Italy\'s top technical universities. This guide covers everything you need to know.',
    relatedLinks: [
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide 2026' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
      { href: '/exams', label: 'All Italian University Entrance Exams' },
    ],
    keyPoints: [
      'TIL-I is specific to Politecnico di Torino — not a national exam',
      'Covers Mathematics, Physics, and Logical Reasoning',
      'Conducted online — can be taken from your home country',
      'Registration through Politecnico di Torino\'s official admissions portal',
      'Competitive cutoff: aim for 70%+ to be safe for most engineering programs',
      'ItaloStudy provides TIL-I specific practice resources and study materials',
    ],
  },

  // ─── Study in Italy Cluster ────────────────────────────────────────
  'study-in-italy-guide-2026': {
    title: 'Study in Italy 2026 | Complete Guide for International Students | ItaloStudy',
    description: 'Complete guide to studying in Italy in 2026: admission process, top universities, costs, scholarships, visas, and entrance exams.',
    canonical: 'https://italostudy.com/study-in-italy-guide-2026',
    h1: 'Study in Italy 2026 — Complete Guide for International Students',
    intro: 'Italy offers world-class education at some of the most affordable tuition fees in Europe. This guide covers everything an international student needs to know about studying in Italy in 2026.',
    relatedLinks: [
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
      { href: '/study-in-italy/without-ielts', label: 'Study in Italy Without IELTS' },
      { href: '/study-in-italy/tuition-fees-2026', label: 'Tuition Fees & Scholarships in Italy' },
      { href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
    ],
    keyPoints: [
      'Italy has 3 universities in the QS World Top 200 (Bologna, Politecnico Milan, Sapienza)',
      'Annual tuition fees: €900–€4,000 at public universities (income-based)',
      'DSU scholarships available: full tuition waiver + monthly stipend + accommodation',
      'Entrance exams required: IMAT (medicine), CEnT-S (sciences), TOLC (engineering)',
      'Non-EU students must complete pre-enrollment on Universitaly by April each year',
      'Student visa (Type D) required — apply through Italian consulate in your country',
    ],
  },
  'study-in-italy/universities-2026': {
    title: 'Top Universities in Italy 2026 | English-Taught Programs | ItaloStudy',
    description: 'Best Italian universities for international students in 2026. Ranking, English programs, tuition fees, and admission requirements.',
    canonical: 'https://italostudy.com/study-in-italy/universities-2026',
    h1: 'Top Universities in Italy 2026 — English Programs for International Students',
    intro: 'Italy\'s public universities offer high-quality education at very low cost. Here are the top institutions for international students looking for English-taught programs.',
    relatedLinks: [
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/study-in-italy/tuition-fees-2026', label: 'Tuition Fees & DSU Scholarships' },
      { href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT — Medicine in Italy' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S — Sciences in Italy' },
    ],
    keyPoints: [
      'University of Bologna: Italy\'s oldest university, strong in Science and Medicine',
      'Politecnico di Milano: #1 in Italy for Engineering and Design',
      'University of Milan (Statale): top choice for IMAT Medicine programs',
      'Sapienza University Rome: largest in Europe; strong research programs',
      'University of Pavia: historic, competitive Medical faculty with English IMAT seats',
      'All public universities charge income-based fees — low-income students may pay €0',
    ],
  },
  'study-in-italy/without-ielts': {
    title: 'Study in Italy Without IELTS 2026 | Which Universities Accept? | ItaloStudy',
    description: 'Can you study in Italy without IELTS? List of Italian universities that accept students without IELTS or TOEFL in 2026.',
    canonical: 'https://italostudy.com/study-in-italy/without-ielts',
    h1: 'Study in Italy Without IELTS 2026 — Universities & Requirements',
    intro: 'Many Italian universities do not require IELTS or TOEFL for English-taught programs — especially if your previous education was in English or you pass an internal language test.',
    relatedLinks: [
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT — Medicine in English in Italy' },
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
    ],
    keyPoints: [
      'Most Italian public universities assess English via their own entrance exam (IMAT, etc.)',
      'Students from English-medium secondary schools are often exempt from IELTS',
      'IMAT is itself an English-language test — no separate IELTS required',
      'Some universities offer Italian-language programs with no English requirement',
      'Alternative proof of English: TOEFL, Cambridge C1/C2, or a signed declaration',
      'Always verify with the specific university — policies vary by program',
    ],
  },
  'study-in-italy/tuition-fees-2026': {
    title: 'Tuition Fees in Italy 2026 | University Costs & DSU Scholarships | ItaloStudy',
    description: 'Complete breakdown of tuition fees at Italian universities in 2026. DSU scholarships, income-based fee waivers, and living costs.',
    canonical: 'https://italostudy.com/study-in-italy/tuition-fees-2026',
    h1: 'Tuition Fees in Italy 2026 — Costs, Scholarships & Financial Aid',
    intro: 'Italian public universities have some of the lowest tuition fees in Europe. Income-based fee structures mean many students pay very little — or nothing at all.',
    relatedLinks: [
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
      { href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' },
      { href: '/study-in-italy/without-ielts', label: 'Study in Italy Without IELTS' },
    ],
    keyPoints: [
      'Annual tuition at public universities: €900–€4,000 (income-based via ISEE)',
      'Students with ISEE under €13,000: may qualify for full tuition waiver',
      'DSU scholarships: cover full tuition + €5,000–€6,000 annual stipend + accommodation',
      'Private universities (Bocconi, Luiss, etc.): €10,000–€25,000 per year',
      'Living costs: approximately €600–€1,100 per month depending on city',
      'Milan and Rome are most expensive; Pavia, Bologna, Padua are more affordable',
    ],
  },
  'study-in-italy/how-to-apply': {
    title: 'How to Apply to Italian Universities 2026 | Step-by-Step Guide | ItaloStudy',
    description: 'Complete application guide for Italian universities: Universitaly pre-enrollment, visa process, document checklist, and important deadlines.',
    canonical: 'https://italostudy.com/study-in-italy/how-to-apply',
    h1: 'How to Apply to Italian Universities 2026 — Complete Step-by-Step Guide',
    intro: 'Applying to Italian universities as an international student involves multiple steps across different platforms. This guide walks you through the entire process.',
    relatedLinks: [
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
      { href: '/study-in-italy/tuition-fees-2026', label: 'Tuition Fees & Scholarships' },
      { href: '/study-in-italy/without-ielts', label: 'Study in Italy Without IELTS' },
      { href: '/imat-registration-2026', label: 'IMAT Registration Guide' },
      { href: '/cent-s-registration-process-2026', label: 'CEnT-S Registration Guide' },
    ],
    keyPoints: [
      'Step 1: Choose your program and verify admission requirements (entrance exam, language)',
      'Step 2: Register on Universitaly (universitaly.it) and complete pre-enrollment',
      'Step 3: Take the required entrance exam (IMAT, CEnT-S, TOLC, etc.)',
      'Step 4: Submit your documents for evaluation (transcripts, diplomas, translations)',
      'Step 5: Receive your acceptance and apply for student visa at Italian consulate',
      'Step 6: Arrive in Italy, complete university enrollment, and apply for residence permit',
    ],
  },

  // ─── Support Pages ─────────────────────────────────────────────────
  'about': {
    title: 'About ItaloStudy | Our Mission & Team | ItaloStudy',
    description: 'Learn about ItaloStudy — our mission to make Italian university admission accessible for international students worldwide.',
    canonical: 'https://italostudy.com/about',
    h1: 'About ItaloStudy — Making Italian University Admission Accessible',
    intro: 'ItaloStudy was built to solve a real problem: thousands of international students want to study in Italy but don\'t know where to start. We provide free, high-quality preparation for CEnT-S, IMAT, and other Italian entrance exams.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/pricing', label: 'ItaloStudy Pricing Plans' },
      { href: '/blog', label: 'ItaloStudy Blog' },
    ],
    keyPoints: [
      'Free unlimited mock tests for IMAT and CEnT-S',
      'Comprehensive study resources in English',
      'Expert guidance on the Italian university application process',
      'Community of thousands of students preparing for Italian entrance exams',
      'Platform built by students who have successfully studied in Italy',
    ],
  },
  'pricing': {
    title: 'ItaloStudy Pricing | Free & Premium Plans | ItaloStudy',
    description: 'ItaloStudy pricing plans: free mock tests, premium question bank access, and personal mentorship for IMAT and CEnT-S preparation.',
    canonical: 'https://italostudy.com/pricing',
    h1: 'ItaloStudy Pricing — Free and Premium Preparation Plans',
    intro: 'ItaloStudy offers both free and premium plans. Start completely free with unlimited mock tests and upgrade when you need more depth.',
    relatedLinks: [
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
      { href: '/about', label: 'About ItaloStudy' },
      { href: '/resources', label: 'Free Study Resources' },
    ],
    keyPoints: [
      'Free Plan: unlimited mock tests, basic question bank, blog access',
      'Premium Plan: full question bank, detailed analytics, and priority support',
      'Institutional plans available for schools and coaching centers',
      'All prices in INR, EUR, and USD — pay in your local currency',
      '7-day free trial on premium — cancel anytime',
    ],
  },
  'contact': {
    title: 'Contact ItaloStudy | Get Help & Support | ItaloStudy',
    description: 'Contact ItaloStudy for exam preparation help, technical support, or partnership inquiries.',
    canonical: 'https://italostudy.com/contact',
    h1: 'Contact ItaloStudy — We Are Here to Help',
    intro: 'Have questions about IMAT, CEnT-S, or your Italian university application? Our team is available to help you navigate every step.',
    relatedLinks: [
      { href: '/about', label: 'About ItaloStudy' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
    ],
    keyPoints: [
      'Email support: hello@italostudy.com',
      'WhatsApp community for quick questions and peer support',
      'Response time: within 24 hours on weekdays',
      'Technical issues with the platform: use the in-app support button',
      'Partnership and institutional inquiries welcome',
    ],
  },
  'privacy': {
    title: 'Privacy Policy | ItaloStudy',
    description: 'ItaloStudy\'s privacy policy: how we collect, use, and protect your personal data.',
    canonical: 'https://italostudy.com/privacy',
    h1: 'ItaloStudy Privacy Policy',
    intro: 'Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we protect it.',
    relatedLinks: [
      { href: '/terms', label: 'Terms of Service' },
      { href: '/refund', label: 'Refund Policy' },
      { href: '/contact', label: 'Contact ItaloStudy' },
    ],
    keyPoints: [],
  },
  'terms': {
    title: 'Terms of Service | ItaloStudy',
    description: 'ItaloStudy terms of service: usage rules, account policies, and user responsibilities.',
    canonical: 'https://italostudy.com/terms',
    h1: 'ItaloStudy Terms of Service',
    intro: 'By using ItaloStudy, you agree to these terms. Please read them carefully.',
    relatedLinks: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/refund', label: 'Refund Policy' },
      { href: '/contact', label: 'Contact ItaloStudy' },
    ],
    keyPoints: [],
  },
  'refund': {
    title: 'Refund Policy | ItaloStudy',
    description: 'ItaloStudy refund policy: eligibility, process, and timeline for refund requests on premium plans.',
    canonical: 'https://italostudy.com/refund',
    h1: 'ItaloStudy Refund Policy',
    intro: 'We offer a straightforward refund policy. If you are not satisfied within 7 days of purchase, contact us for a full refund.',
    relatedLinks: [
      { href: '/pricing', label: 'ItaloStudy Pricing Plans' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/contact', label: 'Contact ItaloStudy' },
    ],
    keyPoints: [],
  },
  'blog': {
    title: 'ItaloStudy Blog | IMAT, CEnT-S & Study in Italy Resources',
    description: 'Expert articles on IMAT preparation, CEnT-S strategy, studying in Italy, and Italian university admissions for international students.',
    canonical: 'https://italostudy.com/blog',
    h1: 'ItaloStudy Blog — Expert Resources for International Students',
    intro: 'In-depth articles on IMAT, CEnT-S, studying in Italy, visa processes, university rankings, and student life in Italy.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/resources', label: 'Free Study Resources' },
    ],
    keyPoints: [
      'IMAT preparation guides and syllabus analysis',
      'CEnT-S strategy articles and mock test breakdowns',
      'University rankings and comparison articles',
      'Student visa guides and Universitaly tutorials',
      'Life in Italy as an international student',
    ],
  },
  'exams': {
    title: 'Italian University Entrance Exams | IMAT, CEnT-S, TOLC Guide | ItaloStudy',
    description: 'Complete guide to all Italian university entrance exams: IMAT, CEnT-S, TOLC-E, TOLC-I, and TIL-I — with syllabus, dates, and preparation resources.',
    canonical: 'https://italostudy.com/exams',
    h1: 'Italian University Entrance Exams — Complete Guide',
    intro: 'Italy requires entrance exams for most university programs. This page covers every major exam: IMAT for medicine, CEnT-S for sciences, TOLC for engineering and more.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT — Medicine in Italy' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S — Sciences in Italy' },
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Guide 2026' },
      { href: '/til-i-exam-guide-2026', label: 'TIL-I Exam Guide 2026' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
    ],
    keyPoints: [
      'IMAT: Medicine in English — Cambridge Assessment exam, September',
      'CEnT-S: Sciences in Italian — CISIA exam, September–October',
      'TOLC-E: Engineering programs — year-round CISIA computer test',
      'TOLC-I: Science and Technology — year-round CISIA computer test',
      'TIL-I: Politecnico di Torino engineering — online test',
      'All preparation resources and mock tests available free on ItaloStudy',
    ],
  },
  'courses': {
    title: 'Prep Courses for IMAT & CEnT-S | Expert-Led Video Lessons | ItaloStudy',
    description: 'Browse expert-led online prep courses for IMAT, CEnT-S, TOLC, and TIL-I. Lifetime access, structured video lectures, and practice to get you exam-ready.',
    canonical: 'https://italostudy.com/courses',
    h1: 'Italian University Entrance Exam Prep Courses',
    intro: 'ItaloStudy offers structured, expert-led online courses for every major Italian university entrance exam. Each course includes comprehensive video lessons, topic-by-topic breakdowns, and practice resources to help you score higher.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Guide 2026' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Guide 2026' },
      { href: '/pricing', label: 'ItaloStudy Pricing Plans' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
    ],
    keyPoints: [
      'Expert instructors with proven exam track records',
      'Structured video lectures aligned to the official exam syllabus',
      'Lifetime course access — study at your own pace',
      'Available for IMAT, CEnT-S, TOLC, and TIL-I exams',
      'Pair with ItaloStudy practice questions for maximum results',
    ],
  },
  'method': {
    title: 'ItaloStudy Method | How We Help You Score Higher | ItaloStudy',
    description: 'Learn about the ItaloStudy preparation method: adaptive learning, mock tests, analytics, and expert content for IMAT and CEnT-S.',
    canonical: 'https://italostudy.com/method',
    h1: 'The ItaloStudy Method — How We Help You Score Higher',
    intro: 'Our preparation method is built on three pillars: structured content, realistic practice, and data-driven improvement.',
    relatedLinks: [
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
      { href: '/about', label: 'About ItaloStudy' },
      { href: '/pricing', label: 'Pricing Plans' },
      { href: '/resources', label: 'Free Study Resources' },
    ],
    keyPoints: [
      'Adaptive question bank: difficulty adjusts based on your performance',
      'Full mock tests that replicate the real exam environment exactly',
      'Score analytics: identify weak subjects and track improvement over time',
      'Expert-written content covering every topic in the IMAT and CEnT-S syllabus',
      'Community support: learn with thousands of students on the same journey',
    ],
  },
};


function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  try {
    // Derive the page key from the request URL
    const reqUrl = new URL(req.url, 'https://italostudy.com');
    // Strip leading slash and any query params
    const rawPath = reqUrl.pathname.replace(/^\//, '').replace(/\/$/, '');
    let pageMeta = PAGE_SEO[rawPath];

    // --- DYNAMIC COURSE SEO INTERCEPTION ---
    // Handles /courses/:slug (individual course pages from Supabase)
    if (!pageMeta && rawPath.startsWith('courses/')) {
      const slug = rawPath.split('/')[1];
      if (slug) {
        try {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
          const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
          const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5amhwcXRxYnd0eHhnaWp4ZXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTgyNjUsImV4cCI6MjA4MzE5NDI2NX0.5HaHhfgPQbIRKmHZE61ggrtj-lKi5JlBU9tsOfQ_d3c';
          
          const queryParam = isUuid ? `id=eq.${slug}` : `slug=eq.${slug}`;
          const fetchUrl = `${supabaseUrl}/rest/v1/courses?${queryParam}&select=title,description,banner_url&limit=1`;
          
          const response = await fetch(fetchUrl, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              const course = data[0];
              pageMeta = {
                title: `${course.title} - Online Prep Course | ItaloStudy`,
                description: course.description || `Enroll in ${course.title} to prepare for your Italian medical entrance exam. Get lifetime access to expert-led lessons and practice.`,
                canonical: `https://italostudy.com/courses/${slug}`,
                h1: course.title,
                intro: course.description || 'Master your exam with this expert-led course.',
                keyPoints: [
                  'Lifetime access to course materials',
                  'Taught by expert educators',
                  'Comprehensive video lectures and practice'
                ],
                ogImage: course.banner_url || null
              };
            }
          }
        } catch (err) {
          console.error('Error fetching course for SSR:', err);
        }
      }
    }
    // ---------------------------------------

    const templatePath = path.join(process.cwd(), 'dist', 'index.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    if (pageMeta) {
      // Inject precise SEO meta tags
      const safeTitle = escapeHtml(pageMeta.title);
      const safeDesc = escapeHtml(pageMeta.description);
      const safeCanonical = escapeHtml(pageMeta.canonical);
      const safeH1 = escapeHtml(pageMeta.h1);
      const safeIntro = escapeHtml(pageMeta.intro);

      html = html.replace(/<title>.*?<\/title>/, `<title>${safeTitle}</title>`);
      html = html.replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${safeDesc}" />`);
      html = html.replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${safeCanonical}" />`);
      html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${safeTitle}" />`);
      html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${safeDesc}" />`);
      html = html.replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${safeCanonical}" />`);
      html = html.replace(/<meta property="twitter:title" content=".*?"\s*\/>/, `<meta property="twitter:title" content="${safeTitle}" />`);
      html = html.replace(/<meta property="twitter:description" content=".*?"\s*\/>/, `<meta property="twitter:description" content="${safeDesc}" />`);

      if (pageMeta.ogImage) {
        html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/, `<meta property="og:image" content="${pageMeta.ogImage}" />`);
        html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/>/, `<meta name="twitter:image" content="${pageMeta.ogImage}" />`);
      }

      // Inject SSR content block — visible to bots, hidden to users via CSS
      // This is the critical fix: Google needs real HTML content to index pages properly
      const keyPointsHtml = pageMeta.keyPoints && pageMeta.keyPoints.length > 0
        ? `<ul>\n${pageMeta.keyPoints.map(p => `      <li>${escapeHtml(p)}</li>`).join('\n')}\n    </ul>`
        : '';

      const relatedLinksHtml = pageMeta.relatedLinks && pageMeta.relatedLinks.length > 0
        ? `<nav aria-label="related-pages">\n      <ul>\n${pageMeta.relatedLinks.map(l =>
            `        <li><a href="https://italostudy.com${l.href}">${escapeHtml(l.label)}</a></li>`
          ).join('\n')}\n      </ul>\n    </nav>`
        : '';

      const ssrContent = `<div id="root">
  <div id="ssr-page-content" style="position:absolute;opacity:0;height:0;overflow:hidden;pointer-events:none;" aria-hidden="true">
    <h1>${safeH1}</h1>
    <p>${safeIntro}</p>
    ${keyPointsHtml}
    ${relatedLinksHtml}
    <p><a href="${safeCanonical}">Learn more on ItaloStudy</a></p>
  </div>
</div>`;

      html = html.replace('<div id="root"></div>', ssrContent);
    } else {
      // Unknown page — replace og:image only (original behaviour) + use default canonical
      const cleanUrl = `https://italostudy.com${reqUrl.pathname}`;
      html = html.replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${escapeHtml(cleanUrl)}" />`);
    }

    const isRoot = reqUrl.pathname === '/' || reqUrl.pathname === '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', isRoot
      ? 'no-store, no-cache, must-revalidate, max-age=0'
      : 's-maxage=86400, stale-while-revalidate=86400');
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
