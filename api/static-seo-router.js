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
  // ─── Homepage & Localization ──────────────────────────────────────
  '': {
    title: 'ItaloStudy | Free CEnT-S, IMAT, TOLC & Italian University Prep Platform',
    description: 'Free preparation for CEnT-S, IMAT, TOLC, TIL-I, SAT & IELTS. Unlimited simulated mock tests, past papers with solutions, cutoff score analyzers & direct admission support for Italian universities.',
    canonical: 'https://italostudy.com/',
    h1: 'ItaloStudy — Europe\'s Trusted Platform for Italian University Admissions & Exam Prep',
    intro: 'ItaloStudy is the official, comprehensive study platform trusted by over 5,000+ international and Italian students preparing for Italian university entrance exams, including CEnT-S, IMAT, TOLC, and TIL-I. Practice with 100+ full-length simulated mocks, over 50,000+ solved questions, past papers, syllabus breakdowns, and cutoff calculators.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test Simulator' },
      { href: '/cent-s-syllabus-2026', label: 'CEnT-S Syllabus Breakdown' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Exam Simulator' },
      { href: '/imat-previous-year-papers-pdf', label: 'IMAT Past Papers with Answers' },
      { href: '/imat-cutoff-trends-2026', label: 'IMAT Cutoff Trends & Analysis' },
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide' },
      { href: '/til-i-exam-guide-2026', label: 'Politecnico di Torino TIL-I Guide' },
      { href: '/courses', label: 'ItaloStudy Live & Video Prep Courses' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy Complete Guide' },
      { href: '/study-in-italy/universities-2026', label: 'Top Italian Universities for International Students' },
      { href: '/study-in-italy/tuition-fees-2026', label: 'Tuition Fees & DSU Scholarships in Italy' },
      { href: '/resources', label: 'Free Study Materials & Exam Resources' },
      { href: '/pricing', label: 'ItaloStudy Platform Pricing & Free Tier' },
      { href: '/blog', label: 'ItaloStudy Admissions & Preparation Blog' },
    ],
    keyPoints: [
      'Comprehensive exam coverage: CEnT-S, IMAT, TOLC (TOLC-E, TOLC-I, TOLC-F, TOLC-MED), TIL-I, SAT, and IELTS',
      'Realistic computer-based testing (CBT) simulator with authentic CISIA and MUR timing and negative marking',
      '100+ simulated mock tests and question bank with 50,000+ verified questions and step-by-step solutions',
      'Historical cutoff score database covering Bologna, Milan, Sapienza, Pavia, Padua, and Tor Vergata',
      'Over 5,000+ enrolled students worldwide with a 98% satisfaction rating',
      'Step-by-step guidance for Universitaly pre-enrollment, CIMEA comparability, and Italian student visas',
    ],
  },
  'it': {
    title: 'ItaloStudy | Preparazione Gratuita per CEnT-S, IMAT, SAT e IELTS',
    description: 'Inizia il tuo percorso accademico in Italia con ItaloStudy. Preparazione gratuita con simulazioni illimitate, test ufficiali e supporto all\'ammissione universitaria.',
    canonical: 'https://italostudy.com/it',
    h1: 'ItaloStudy — La Piattaforma Leader per l\'Ammissione Universitaria in Italia',
    intro: 'ItaloStudy aiuta migliaia di studenti a superare con successo i test di ammissione universitari come CEnT-S, IMAT e TOLC. Accedi a simulazioni realistiche, graduatorie storiche e corsi dedicati.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'Guida Completa Esame CEnT-S' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'Guida Completa Esame IMAT' },
      { href: '/courses', label: 'Corsi di Preparazione' },
      { href: '/pricing', label: 'Piani e Tariffe' },
    ],
    keyPoints: [
      'Simulatore d\'esame fedele al software ufficiale CISIA e MUR',
      'Oltre 50.000 domande risolte con spiegazioni dettagliate passo-passo',
      'Analisi punteggi minimi e soglie di ammissione per tutte le università italiane',
    ],
  },
  'tr': {
    title: 'ItaloStudy | CEnT-S, IMAT, SAT ve IELTS İçin Ücretsiz Hazırlık',
    description: 'ItaloStudy ile İtalya\'daki üniversite giriş sınavlarına ücretsiz hazırlanın ve deneme sınavlarını çözün. CEnT-S, IMAT ve TOLC hazırlık rehberi.',
    canonical: 'https://italostudy.com/tr',
    h1: 'ItaloStudy — İtalya Üniversite Giriş Sınavları Hazırlık Platformu',
    intro: 'ItaloStudy, İtalya\'da tıp, mühendislik ve fen bilimleri okumak isteyen öğrenciler için CEnT-S, IMAT ve TOLC sınavlarına eksiksiz hazırlık sunar.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Sınavı Kapsamlı Rehberi' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Sınavı Kapsamlı Rehberi' },
      { href: '/study-in-italy-guide-2026', label: 'İtalya\'da Üniversite Eğitimi Rehberi' },
    ],
    keyPoints: [
      'CISIA ve MUR formatında gerçek zamanlı online deneme sınavları',
      'İtalya üniversite taban puanları ve kontenjan analizleri',
      'Universitaly ön kayıt ve burs başvuru rehberliği',
    ],
  },
  // ─── CEnT-S Cluster ───────────────────────────────────────────────
  'cent-s': {
    title: 'CEnT-S Exam 2026–2027: Syllabus, Exam Dates, Fees (€35) & Free Mocks | ItaloStudy',
    description: 'Master the Italian CEnT-S 2026–2027 entrance exam. Download official CISIA syllabus, check registration dates, exam fee (€35), and take free full-length simulated mocks.',
    canonical: 'https://italostudy.com/cent-s',
    h1: 'CEnT-S Exam 2026–2027 — Syllabus, Exam Dates, Fees (€35) & Free Mocks',
    intro: 'The CEnT-S (CISIA English Test for Science) is the official English-language entrance examination for STEM, Engineering, and Science Bachelor\'s degrees at top Italian universities. Prepare with authentic CISIA-style full-length simulated mocks, subject breakdowns, official registration guidelines, and historical cutoff benchmarks.',
    relatedLinks: [
      { href: '/cent-s-syllabus-2026', label: 'CEnT-S Syllabus Breakdown & PDF' },
      { href: '/cent-s-registration-process-2026', label: 'CEnT-S Registration & €35 Fee Guide' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test Simulator' },
      { href: '/cent-s-cutoff-2026', label: 'CEnT-S Cutoff Scores & Rankings' },
      { href: '/cent-s-important-dates-2026', label: 'CEnT-S Exam Dates & Deadlines' },
      { href: '/cent-s-exam-pattern-2026', label: 'CEnT-S Exam Pattern & Marking' },
      { href: '/imat-vs-cents-2026', label: 'IMAT vs CEnT-S Comparison' },
    
      { href: '/cent-s-exam-fees', label: 'CEnT-S Exam Fees (€35 Guide)' },
      { href: '/cent-s-free-practice-test', label: 'Free CEnT-S Practice Test' },
      { href: '/cent-s-for-turkish-students', label: 'CEnT-S Guide for Turkish Students' },
    ],
    keyPoints: [
      'Exam Language: 100% in English for English-taught Italian Bachelor programs',
      'Format: 50–55 multiple-choice questions across Mathematics, Logic & Text Reasoning, and Sciences',
      'Standardized Exam Fee: €35 per attempt paid securely via CISIA portal (PagoPA or Credit Card)',
      'Multiple Exam Sessions: Held across Macro-Periods throughout spring, summer, and autumn',
      'Negative Marking: +1 for correct answers, -0.25 for incorrect answers, 0 for unattempted questions',
      '100% Free full-length simulated practice tests with instant scoring and detailed step-by-step solutions',
    ],
    table: {
          "caption": "Official CEnT-S Exam Pattern & Section Breakdown (2026–2027)",
          "headers": [
                "Subject Section",
                "Questions",
                "Time Allotted",
                "Scoring & Marking"
          ],
          "rows": [
                [
                      "Mathematics",
                      "15 Questions",
                      "30 Minutes",
                      "+1.0 Correct, -0.25 Wrong, 0 Blank"
                ],
                [
                      "Text & Data Reasoning",
                      "15 Questions",
                      "30 Minutes",
                      "+1.0 Correct, -0.25 Wrong, 0 Blank"
                ],
                [
                      "Chemistry",
                      "10 Questions",
                      "20 Minutes",
                      "+1.0 Correct, -0.25 Wrong, 0 Blank"
                ],
                [
                      "Physics",
                      "10 Questions",
                      "20 Minutes",
                      "+1.0 Correct, -0.25 Wrong, 0 Blank"
                ],
                [
                      "Biology",
                      "5 Questions",
                      "10 Minutes",
                      "+1.0 Correct, -0.25 Wrong, 0 Blank"
                ],
                [
                      "Total Examination",
                      "55 Questions",
                      "110 Minutes",
                      "Max 55 Points (€35 Registration Fee)"
                ]
          ]
    },
    sections: [
          {
                "heading": "What is the CEnT-S Exam in Italy?",
                "paragraphs": [
                      "The CEnT-S (CISIA English Test — Sciences) is the official English-language standardized entrance examination administered by CISIA for admission to undergraduate degrees in Science, Engineering, Biotechnology, Computer Science, and Data Science across Italian universities.",
                      "Conducted entirely in English, the CEnT-S tests conceptual depth, mathematical fluency, scientific reasoning, and analytical speed. It can be taken either at university testing centers in Italy (@UNI) or remotely from home (@HOME) under secure online proctoring."
                ]
          },
          {
                "heading": "CEnT-S Registration & €35 Exam Fee",
                "paragraphs": [
                      "Registration for the CEnT-S is completed through the official CISIA portal (cisiaonline.it). The exam fee is fixed at €35.00 per sitting for all applicants (EU and non-EU), payable via credit card or PagoPA.",
                      "Candidates may retake the CEnT-S in subsequent macro-periods to improve their score. Participating universities will evaluate your best valid score in their admission ranking lists."
                ]
          }
    ],
    faqs: [
          {
                "question": "How much does the CEnT-S exam cost?",
                "answer": "The official CEnT-S registration fee is €35 per attempt, payable on the CISIA portal via international credit card or PagoPA."
          },
          {
                "question": "Is CEnT-S conducted entirely in English?",
                "answer": "Yes. All 55 questions across Mathematics, Logic, Chemistry, Physics, and Biology are written and administered in English."
          },
          {
                "question": "Which Italian universities accept the CEnT-S exam?",
                "answer": "Prominent universities accepting CEnT-S include the University of Bologna, University of Milan (Statale), Sapienza University of Rome, University of Padua, and University of Pavia for their English-taught bachelor programs."
          },
          {
                "question": "Are calculators permitted in the CEnT-S exam?",
                "answer": "No calculators are allowed during the CEnT-S exam. Calculations must be worked out manually or approximated mentally."
          },
          {
                "question": "Where can I take free full-length CEnT-S mock tests?",
                "answer": "ItaloStudy offers authentic full-length CEnT-S mock exams simulating CISIA test conditions with realistic timers, negative marking, and detailed answer explanations."
          }
    ],
  },
  'cent-s-exam-ultimate-guide': {
    title: 'CEnT-S Exam 2026–2027: Complete Preparation Guide & Free Resources | ItaloStudy',
    description: 'Definitive CEnT-S 2026–2027 preparation guide: official CISIA syllabus, question structure (55 MCQs), €35 fee, university cutoffs, and free full-length mocks.',
    canonical: 'https://italostudy.com/cent-s-exam-ultimate-guide',
    h1: 'CEnT-S Exam 2026–2027 — The Ultimate Preparation Guide',
    intro: 'The CEnT-S (CISIA English Test — Sciences) is the official Italian university entrance exam for English-taught science and engineering programs. This guide covers everything you need: syllabus breakdown, important dates, registration steps, cutoff scores, and free mock tests on ItaloStudy.',
    relatedLinks: [
      { href: '/cent-s-syllabus-2026', label: 'CEnT-S Syllabus 2026 — Full Breakdown' },
      { href: '/cent-s-exam-pattern-2026', label: 'CEnT-S Exam Pattern & Marking Scheme' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
      { href: '/cent-s-cutoff-2026', label: 'CEnT-S Cutoff Scores 2026' },
      { href: '/cent-s-registration-process-2026', label: 'CEnT-S Registration & Fee Guide (€35)' },
      { href: '/cent-s-important-dates-2026', label: 'CEnT-S Important Dates 2026' },
      { href: '/imat-vs-cents-2026', label: 'IMAT vs CEnT-S — Which to Choose?' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Ultimate Guide' },
    
      { href: '/cent-s-exam-fees', label: 'CEnT-S Exam Fees (€35 Guide)' },
      { href: '/cent-s-free-practice-test', label: 'Free CEnT-S Practice Test' },
      { href: '/cent-s-for-turkish-students', label: 'CEnT-S Guide for Turkish Students' },
    ],
    keyPoints: [
      'Official standardized exam fee is €35 per attempt on the CISIA portal',
      'Subjects: Mathematics (15 Qs), Text & Data Reasoning (15 Qs), Biology, Chemistry, and Physics',
      'Negative marking: -0.25 per wrong answer; +1 per correct answer',
      'Free full-length mock tests available on ItaloStudy with instant scoring',
      'Accepted for English-taught STEM programs at Milan, Bologna, Sapienza, Padua, and more',
    ],
    table: {
          "caption": "Official CEnT-S Exam Structure & CISIA Subject Distribution",
          "headers": [
                "Subject Module",
                "Questions",
                "Time Allotted",
                "Scoring Model"
          ],
          "rows": [
                [
                      "Mathematics",
                      "15 Questions",
                      "30 Minutes",
                      "+1.0 Correct, -0.25 Wrong, 0 Blank"
                ],
                [
                      "Text & Data Reasoning",
                      "15 Questions",
                      "30 Minutes",
                      "+1.0 Correct, -0.25 Wrong, 0 Blank"
                ],
                [
                      "Chemistry",
                      "10 Questions",
                      "20 Minutes",
                      "+1.0 Correct, -0.25 Wrong, 0 Blank"
                ],
                [
                      "Physics",
                      "10 Questions",
                      "20 Minutes",
                      "+1.0 Correct, -0.25 Wrong, 0 Blank"
                ],
                [
                      "Biology",
                      "5 Questions",
                      "10 Minutes",
                      "+1.0 Correct, -0.25 Wrong, 0 Blank"
                ],
                [
                      "Total Exam",
                      "55 Questions",
                      "110 Minutes",
                      "55 Max Score (€35 CISIA Fee)"
                ]
          ]
    },
    sections: [
          {
                "heading": "Complete Preparation Blueprint for CEnT-S",
                "paragraphs": [
                      "Preparing for the CEnT-S requires mastering both scientific problem solving and high-speed data interpretation. Since each wrong answer deducts 0.25 points, strategic guessing must be strictly controlled.",
                      "High scoring candidates prioritize Mathematics and Text & Data Reasoning, which account for over 54% of the total available points."
                ]
          }
    ],
    faqs: [
          {
                "question": "What is the passing score for CEnT-S?",
                "answer": "There is no fixed passing cutoff; admission is ranked based on merit relative to university seat quotas. Competitive target scores generally start at 35–42+ out of 55."
          },
          {
                "question": "How do I register for CEnT-S?",
                "answer": "Create an account on the CISIA website, select an available test session, and pay the €35 fee before the booking deadline."
          }
    ],
  },
  'cent-s-syllabus-2026': {
    title: 'CEnT-S Syllabus 2026–2027: Official CISIA Subject Breakdown & PDF Download',
    description: 'Official CEnT-S exam syllabus 2026–2027 by CISIA. Subject-wise topic breakdown for Math (15 Qs), Text & Data Reasoning (15 Qs), Biology, Chemistry & Physics + Free PDF.',
    canonical: 'https://italostudy.com/cent-s-syllabus-2026',
    h1: 'CEnT-S Syllabus 2026–2027 — Complete Subject Breakdown & PDF',
    intro: 'The official CEnT-S syllabus covers five core modules designed by CISIA for English-taught STEM and Science degrees. Master the exact topic weightages, sample questions, and essential formulas.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/cent-s-exam-pattern-2026', label: 'CEnT-S Exam Pattern & Format' },
      { href: '/best-books-for-cent-s-2026', label: 'Best Books for CEnT-S 2026' },
      { href: '/cent-s-preparation-strategy-2026', label: 'CEnT-S Preparation Strategy 2026' },
      { href: '/cent-s-difficulty-level-analysis', label: 'CEnT-S Difficulty Level Analysis' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
    ],
    keyPoints: [
      'Mathematics (15 questions): Algebra, functions, coordinate geometry, trigonometry, logarithms, probability and calculus fundamentals',
      'Reasoning on Texts & Data (15 questions): Scientific literacy, graph and chart interpretation, logical deduction, and argument analysis',
      'Biology: Cytology, genetics, cellular respiration, Mendelian inheritance, human physiology basics',
      'Chemistry: Periodic trends, stoichiometry, chemical bonds, acid-base equilibrium, introductory organic nomenclature',
      'Physics: Mechanics, kinematics, thermodynamics, electromagnetism, and wave optics',
      'No calculator permitted — mental math and approximation shortcuts are essential',
    ],
    table: {
          "caption": "Official CEnT-S Syllabus & Subject Weightage Breakdown",
          "headers": [
                "Subject Section",
                "Question Count",
                "Key Topic Areas Covered",
                "Difficulty Level"
          ],
          "rows": [
                [
                      "Mathematics",
                      "15 Questions",
                      "Algebra, Functions, Coordinate Geometry, Trigonometry, Exponentials & Logarithms, Probability, Intro Calculus",
                      "High / Core"
                ],
                [
                      "Text & Data Reasoning",
                      "15 Questions",
                      "Scientific Graph Interpretation, Tabular Data Deduction, Logical Fallacies, Critical Reading",
                      "High / Analytical"
                ],
                [
                      "Chemistry",
                      "10 Questions",
                      "Atomic Structure, Periodic Trends, Stoichiometry, Chemical Equilibrium, Redox, Acid-Base, Organic Functional Groups",
                      "Medium-High"
                ],
                [
                      "Physics",
                      "10 Questions",
                      "Kinematics, Dynamics, Work & Energy, Thermodynamics, Hydrostatics, Electromagnetism, Wave Phenomena",
                      "Medium-High"
                ],
                [
                      "Biology",
                      "5 Questions",
                      "Cell Structure, Molecular Genetics, Photosynthesis, Cellular Respiration, Human Body System Basics",
                      "Medium"
                ]
          ]
    },
    faqs: [
          {
                "question": "What subjects are included in the CEnT-S syllabus?",
                "answer": "The CEnT-S syllabus covers Mathematics (15 Qs), Text & Data Reasoning (15 Qs), Chemistry (10 Qs), Physics (10 Qs), and Biology (5 Qs), totaling 55 questions in 110 minutes."
          },
          {
                "question": "Are calculators allowed in the CEnT-S exam?",
                "answer": "No calculators are permitted. All arithmetic, fractions, approximations, and unit conversions must be calculated by hand."
          },
          {
                "question": "Where can I download the official CEnT-S syllabus PDF?",
                "answer": "You can download the full syllabus topic breakdown and formula sheets directly on ItaloStudy for free."
          }
    ],
  },
  'cent-s-syllabus': {
    title: 'CEnT-S Syllabus 2026–2027: Official CISIA Subject Breakdown & PDF Download',
    description: 'Official CEnT-S exam syllabus 2026–2027 by CISIA. Subject-wise topic breakdown for Math (15 Qs), Text & Data Reasoning (15 Qs), Biology, Chemistry & Physics + Free PDF.',
    canonical: 'https://italostudy.com/cent-s-syllabus-2026',
    h1: 'CEnT-S Syllabus 2026–2027 — Complete Subject Breakdown & PDF',
    intro: 'The official CEnT-S syllabus covers five core modules designed by CISIA for English-taught STEM and Science degrees. Master the exact topic weightages, sample questions, and essential formulas.',
    relatedLinks: [
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test Simulator' },
      { href: '/cent-s-registration-process-2026', label: 'CEnT-S Registration & Fee Guide' },
    ],
    keyPoints: [
      'Full coverage of CISIA official module topics for Italian English STEM programs',
      'Detailed weightage breakdown for Mathematics, Logic, and Natural Sciences',
      'Step-by-step preparation plan and free mock tests',
    ],
    table: {
          "caption": "Official CEnT-S Syllabus & Subject Weightage Breakdown",
          "headers": [
                "Subject Section",
                "Question Count",
                "Key Topic Areas Covered",
                "Difficulty Level"
          ],
          "rows": [
                [
                      "Mathematics",
                      "15 Questions",
                      "Algebra, Functions, Coordinate Geometry, Trigonometry, Exponentials & Logarithms, Probability, Intro Calculus",
                      "High / Core"
                ],
                [
                      "Text & Data Reasoning",
                      "15 Questions",
                      "Scientific Graph Interpretation, Tabular Data Deduction, Logical Fallacies, Critical Reading",
                      "High / Analytical"
                ],
                [
                      "Chemistry",
                      "10 Questions",
                      "Atomic Structure, Periodic Trends, Stoichiometry, Chemical Equilibrium, Redox, Acid-Base, Organic Functional Groups",
                      "Medium-High"
                ],
                [
                      "Physics",
                      "10 Questions",
                      "Kinematics, Dynamics, Work & Energy, Thermodynamics, Hydrostatics, Electromagnetism, Wave Phenomena",
                      "Medium-High"
                ],
                [
                      "Biology",
                      "5 Questions",
                      "Cell Structure, Molecular Genetics, Photosynthesis, Cellular Respiration, Human Body System Basics",
                      "Medium"
                ]
          ]
    },
    faqs: [
          {
                "question": "What subjects are covered in the CEnT-S syllabus?",
                "answer": "The CEnT-S syllabus covers Mathematics, Text & Data Reasoning, Chemistry, Physics, and Biology."
          },
          {
                "question": "Is the CEnT-S syllabus identical to TOLC-I?",
                "answer": "While sharing mathematics and physics foundations, CEnT-S includes dedicated English text and data reasoning and biology modules."
          }
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
    title: 'CEnT-S Registration & Exam Fee 2026–2027: €35 Fee, CISIA Portal & Dates',
    description: 'Official CEnT-S exam fee is €35 per test. Complete step-by-step registration guide on the CISIA portal, payment methods (Credit Card / PagoPA), and deadlines.',
    canonical: 'https://italostudy.com/cent-s-registration-process-2026',
    h1: 'CEnT-S Registration Process & Exam Fee (€35) — Official 2026–2027 Guide',
    intro: 'Registering for the CEnT-S requires booking your test session through the official CISIA portal (cisia.eu). The standardized registration fee is exactly €35.00 per attempt. Follow this step-by-step walkthrough to register properly and avoid common account errors.',
    relatedLinks: [
      { href: '/cent-s-important-dates-2026', label: 'CEnT-S Important Dates & Deadlines' },
      { href: '/cent-s-eligibility-criteria', label: 'CEnT-S Eligibility Criteria' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/study-in-italy/how-to-apply', label: 'Universitaly Pre-Enrollment Guide' },
      { href: '/cent-s-cutoff-2026', label: 'CEnT-S Cutoff Scores 2026' },
    ],
    keyPoints: [
      'Standardized Exam Fee: Exactly €35.00 per test attempt, payable on the CISIA portal',
      'Accepted Payment Modes: Visa/Mastercard credit cards, international debit cards, or Italian PagoPA',
      'Step 1: Create your student profile on cisia.eu with your passport or EU ID card',
      'Step 2: Select the CEnT-S exam and choose between @UNI (university center) or @HOME (remote proctoring)',
      'Step 3: Pay the €35 fee and immediately download your "Ricevuta di Pagamento" (Payment Receipt)',
      'Step 4: Non-EU international students must complete Universitaly pre-enrollment alongside CISIA registration',
    ],
    table: {
          "caption": "Italian Entrance Exam Fees Comparison (2026–2027)",
          "headers": [
                "Exam Name",
                "Official Registration Fee",
                "Administering Body",
                "Accepted Payment Methods"
          ],
          "rows": [
                [
                      "CEnT-S (Sciences & STEM)",
                      "€35.00 per attempt",
                      "CISIA",
                      "Credit/Debit Card (Visa/Mastercard), PagoPA"
                ],
                [
                      "TOLC (TOLC-E, TOLC-I, TOLC-F)",
                      "€30.00 per attempt",
                      "CISIA",
                      "Credit/Debit Card, PagoPA, MAV"
                ],
                [
                      "IMAT (Medicine & Surgery)",
                      "€156.00 per attempt",
                      "MUR / Cineca",
                      "Universitaly Portal (PagoPA / Credit Card)"
                ],
                [
                      "TIL-I (Engineering)",
                      "€50.00 per attempt",
                      "Politecnico di Torino",
                      "Apply@PoliTo Platform"
                ]
          ]
    },
    faqs: [
          {
                "question": "How much is the CEnT-S registration fee in 2026/2027?",
                "answer": "The CEnT-S exam fee is exactly €35.00 per attempt. It is paid directly on the CISIA portal."
          },
          {
                "question": "How do I pay the CEnT-S fee?",
                "answer": "Payment is completed online through the CISIA student area using credit card or PagoPA."
          }
    ],
  },
  'cent-s-exam-fee': {
    title: 'CEnT-S Exam Fee 2026–2027: Official €35 Cost, Payment Methods & CISIA Guide',
    description: 'How much does the CEnT-S exam cost? Official CISIA fee is €35 per attempt. Learn accepted payment methods (Credit Card, PagoPA), refund policy & fee waivers.',
    canonical: 'https://italostudy.com/cent-s-registration-process-2026',
    h1: 'CEnT-S Exam Fee 2026–2027 — Official €35 Cost & Payment Guide',
    intro: 'The official registration fee for the CEnT-S (CISIA English Test for Science) is set by the CISIA consortium at €35.00 for all candidates (EU and non-EU). Learn how to pay, what payment modes are accepted, and how retakes are billed.',
    relatedLinks: [
      { href: '/cent-s-registration-process-2026', label: 'CEnT-S Full Registration Process' },
      { href: '/cent-s-important-dates-2026', label: 'CEnT-S Exam Dates & Deadlines' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test Simulator' },
    ],
    keyPoints: [
      'Cost: Fixed at €35.00 per attempt for both @HOME and @UNI modalities',
      'Payment methods: International credit/debit cards (Visa, Mastercard) and Italian PagoPA system',
      'Retake policy: You can retake the exam in different macro-periods for €35 per session; universities take your best score',
      'Receipt: Download your Ricevuta immediately upon payment to prove test registration',
    ],
    table: {
          "caption": "Italian University Entrance Exam Fees (2026–2027)",
          "headers": [
                "Exam Name",
                "Standard Registration Fee",
                "Administering Body",
                "Payment Options"
          ],
          "rows": [
                [
                      "CEnT-S (Sciences & STEM)",
                      "€35.00 per attempt",
                      "CISIA",
                      "Credit/Debit Card, PagoPA"
                ],
                [
                      "TOLC (Italian & English)",
                      "€30.00 per attempt",
                      "CISIA",
                      "Credit/Debit Card, PagoPA"
                ],
                [
                      "IMAT (Medicine)",
                      "€156.00 per attempt",
                      "MUR / Cineca",
                      "Universitaly Portal"
                ]
          ]
    },
    faqs: [
          {
                "question": "What is the official CEnT-S exam fee?",
                "answer": "The official fee is €35 per attempt set by CISIA consortium."
          }
    ],
  },
  'cents-exam-fee': {
    title: 'CEnT-S Exam Fee 2026–2027: Official €35 Cost, Payment Methods & CISIA Guide',
    description: 'How much does the CEnT-S exam cost? Official CISIA fee is €35 per attempt. Learn accepted payment methods (Credit Card, PagoPA), refund policy & fee waivers.',
    canonical: 'https://italostudy.com/cent-s-registration-process-2026',
    h1: 'CEnT-S Exam Fee 2026–2027 — Official €35 Cost & Payment Guide',
    intro: 'The official registration fee for the CEnT-S (CISIA English Test for Science) is set by the CISIA consortium at €35.00 for all candidates (EU and non-EU). Learn how to pay, what payment modes are accepted, and how retakes are billed.',
    relatedLinks: [
      { href: '/cent-s-registration-process-2026', label: 'CEnT-S Full Registration Process' },
      { href: '/cent-s-important-dates-2026', label: 'CEnT-S Exam Dates & Deadlines' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test Simulator' },
    ],
    keyPoints: [
      'Cost: Fixed at €35.00 per attempt for both @HOME and @UNI modalities',
      'Payment methods: International credit/debit cards (Visa, Mastercard) and Italian PagoPA system',
      'Retake policy: You can retake the exam in different macro-periods for €35 per session; universities take your best score',
      'Receipt: Download your Ricevuta immediately upon payment to prove test registration',
    ],
    table: {
          "caption": "Italian University Entrance Exam Fees (2026–2027)",
          "headers": [
                "Exam Name",
                "Standard Registration Fee",
                "Administering Body",
                "Payment Options"
          ],
          "rows": [
                [
                      "CEnT-S (Sciences & STEM)",
                      "€35.00 per attempt",
                      "CISIA",
                      "Credit/Debit Card, PagoPA"
                ],
                [
                      "TOLC (Italian & English)",
                      "€30.00 per attempt",
                      "CISIA",
                      "Credit/Debit Card, PagoPA"
                ],
                [
                      "IMAT (Medicine)",
                      "€156.00 per attempt",
                      "MUR / Cineca",
                      "Universitaly Portal"
                ]
          ]
    },
    faqs: [
          {
                "question": "What is the official CEnT-S exam fee?",
                "answer": "The official fee is €35 per attempt set by CISIA consortium."
          }
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
  'imat': {
    title: 'IMAT Exam 2026–2027: Complete Medical Entrance Guide, Dates & Free Mocks | ItaloStudy',
    description: 'Ace the Italian IMAT exam 2026–2027. Official MUR syllabus, past papers with solutions (2011–2025), university cutoffs, and free full-length simulated mocks.',
    canonical: 'https://italostudy.com/imat',
    h1: 'IMAT Exam 2026–2027 — Medical Entrance Guide, Dates & Free Mocks',
    intro: 'The International Medical Admissions Test (IMAT) is the mandatory entrance exam for studying Medicine and Surgery (MBBS) in English at top Italian public universities. Prepare with verified past papers, realistic full-length computer simulations, ministerial scoring analytics, and university cutoff benchmarks.',
    relatedLinks: [
      { href: '/imat-previous-year-papers-pdf', label: 'IMAT Past Papers with Worked Solutions (2011–2025)' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Exam Simulator' },
      { href: '/imat-exam-dates-2026', label: 'IMAT Exam Dates & Universitaly Deadlines' },
      { href: '/imat-syllabus-2026', label: 'Official IMAT Syllabus Breakdown' },
      { href: '/imat-cutoff-trends-2026', label: 'IMAT Cutoffs & Historical Rankings' },
      { href: '/imat-vs-neet-2026', label: 'IMAT vs NEET Comparison Guide' },
      { href: '/study-in-italy/how-to-apply', label: 'Universitaly Pre-Enrollment Guide' },
    
      { href: '/imat-past-papers', label: 'IMAT Past Papers (2016–2026)' },
      { href: '/imat-free-practice-test', label: 'Free IMAT Practice Test (15 Questions)' },
      { href: '/imat-score-calculator', label: 'IMAT Score Calculator' },
      { href: '/imat-cutoff-estimator', label: 'IMAT Cutoff Estimator' },
      { href: '/imat-question-bank', label: 'IMAT Question Bank (2000+ Qs)' },
      { href: '/imat-preparation-books', label: 'IMAT Preparation Books' },
      { href: '/imat-scoring-system', label: 'IMAT Scoring System (+1.5 / -0.4)' },
      { href: '/tolc-med-vs-imat', label: 'TOLC-MED vs IMAT Guide' },
      { href: '/imat-from-india', label: 'IMAT Guide for Indian Students' },
      { href: '/study-medicine-italy-from-pakistan', label: 'Study Medicine in Italy from Pakistan' },
      { href: '/study-medicine-italy-from-bangladesh', label: 'Study Medicine in Italy from Bangladesh' },
    ],
    keyPoints: [
      'Exam Format: 60 multiple-choice questions in 100 minutes (MUR format)',
      'Subject Breakdown: Biology (23 Qs), Chemistry (15 Qs), Physics & Mathematics (13 Qs), Reading Skills & General Knowledge (9 Qs)',
      'Scoring: +1.5 points for correct, -0.4 points for incorrect, 0 points for unattempted',
      'Tuition Fees: Public Italian medical schools cost only €156 to €3,500/year based on family ISEE income',
      'DSU Scholarships: Up to €8,000/year living stipend + free university canteen + 100% tuition waiver',
      'Global Degree Recognition: Recognized across the European Union, UK (GMC), US (ECFMG/USMLE), and India (NMC/WHO)',
    ],
    table: {
          "caption": "Official IMAT Exam Structure & Marking Scheme (2026–2027)",
          "headers": [
                "Subject Section",
                "Questions",
                "Maximum Score",
                "Suggested Time Allocation"
          ],
          "rows": [
                [
                      "Reading Skills & General Knowledge",
                      "4 Questions",
                      "6.0 Points (+1.5 per correct)",
                      "6 Minutes"
                ],
                [
                      "Logical Reasoning",
                      "5 Questions",
                      "7.5 Points (+1.5 per correct)",
                      "10 Minutes"
                ],
                [
                      "Biology",
                      "23 Questions",
                      "34.5 Points (+1.5 per correct)",
                      "35 Minutes"
                ],
                [
                      "Chemistry",
                      "15 Questions",
                      "22.5 Points (+1.5 per correct)",
                      "25 Minutes"
                ],
                [
                      "Physics & Mathematics",
                      "13 Questions",
                      "19.5 Points (+1.5 per correct)",
                      "24 Minutes"
                ],
                [
                      "Total IMAT Examination",
                      "60 Questions",
                      "90.0 Points (-0.4 per incorrect)",
                      "100 Minutes"
                ]
          ]
    },
    sections: [
          {
                "heading": "What is the IMAT Exam?",
                "paragraphs": [
                      "The International Medical Admissions Test (IMAT) is the mandatory national admissions examination required for entry into English-taught Medicine and Surgery (MD / Laurea Magistrale a Ciclo Unico) programs at Italian public universities.",
                      "Administered under the authority of the Italian Ministry of University and Research (MUR) and Cineca, IMAT is held simultaneously on a single designated date in September across certified test centers in Italy and over 20 countries worldwide."
                ]
          },
          {
                "heading": "Affordable Medical Education & DSU Scholarships in Italy",
                "paragraphs": [
                      "Italian public universities offer world-class European medical training with exceptionally low tuition fees ranging from €156 to €3,500 annually based on household income (ISEE Parificato).",
                      "Eligible international students can receive regional DSU scholarships providing 100% tuition waivers, free student cafeteria meals, university accommodation, and annual cash stipends of up to €7,000–€8,000."
                ]
          }
    ],
    faqs: [
          {
                "question": "When is the IMAT 2026/2027 exam held?",
                "answer": "The IMAT is scheduled annually in mid-September. The official decree by MUR confirms the exact global test date in late spring."
          },
          {
                "question": "What is a competitive IMAT score for admission?",
                "answer": "Competitive cutoff scores vary by university. High-demand schools like Milan Statale, Bologna, and Pavia typically require 45–55+ out of 90. Universities in southern Italy or newer programs may accept scores between 35 and 45."
          },
          {
                "question": "Are Italian medical degrees recognized internationally?",
                "answer": "Yes. An Italian medical degree is directly recognized throughout the European Union (Directive 2005/36/EC), in the UK by the GMC, in the US via ECFMG/USMLE, and in India by the National Medical Commission (NMC)."
          },
          {
                "question": "Is IMAT an online or paper-based test?",
                "answer": "IMAT is an in-person, pen-and-paper examination administered simultaneously at official test centers worldwide."
          },
          {
                "question": "Where can I access free IMAT past papers and mock tests?",
                "answer": "ItaloStudy provides all official IMAT past papers from 2011 to 2025 with worked solutions, plus realistic full-length timed mock exams."
          }
    ],
  },
  'imat-exam-ultimate-guide-2026': {
    title: 'IMAT Exam 2026–2027: Complete Medical Entrance Guide, Dates & Free Mocks | ItaloStudy',
    description: 'Ace the Italian IMAT exam 2026–2027. Official MUR syllabus, past papers with solutions (2011–2025), university cutoffs, and free full-length simulated mocks.',
    canonical: 'https://italostudy.com/imat-exam-ultimate-guide-2026',
    h1: 'IMAT Exam 2026–2027 — The Definitive Preparation Guide',
    intro: 'The IMAT (International Medical Admissions Test) is the official gateway to studying Medicine in English at Italian public universities. This comprehensive guide covers every aspect of IMAT 2026–2027 preparation.',
    relatedLinks: [
      { href: '/imat-syllabus-2026', label: 'IMAT Syllabus — Full Breakdown' },
      { href: '/imat-exam-dates-2026', label: 'IMAT Exam Dates & Timeline' },
      { href: '/imat-registration-2026', label: 'IMAT Registration Guide' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test Simulator' },
      { href: '/imat-previous-year-papers-pdf', label: 'IMAT Past Papers PDF with Solutions' },
      { href: '/imat-cutoff-trends-2026', label: 'IMAT Cutoff Scores by University' },
      { href: '/imat-vs-neet-2026', label: 'IMAT vs NEET Comparison' },
    
      { href: '/imat-past-papers', label: 'IMAT Past Papers (2016–2026)' },
      { href: '/imat-free-practice-test', label: 'Free IMAT Practice Test (15 Questions)' },
      { href: '/imat-score-calculator', label: 'IMAT Score Calculator' },
      { href: '/imat-cutoff-estimator', label: 'IMAT Cutoff Estimator' },
      { href: '/imat-question-bank', label: 'IMAT Question Bank (2000+ Qs)' },
      { href: '/imat-preparation-books', label: 'IMAT Preparation Books' },
      { href: '/imat-scoring-system', label: 'IMAT Scoring System (+1.5 / -0.4)' },
      { href: '/tolc-med-vs-imat', label: 'TOLC-MED vs IMAT Guide' },
      { href: '/imat-from-india', label: 'IMAT Guide for Indian Students' },
      { href: '/study-medicine-italy-from-pakistan', label: 'Study Medicine in Italy from Pakistan' },
      { href: '/study-medicine-italy-from-bangladesh', label: 'Study Medicine in Italy from Bangladesh' },
    ],
    keyPoints: [
      'IMAT exam date: mid-September annually across international and Italian test centers',
      'Official MUR format: 60 questions in 100 minutes (+1.5 correct, -0.4 incorrect)',
      'Public university tuition: €156–€3,500/year with regional DSU scholarship support',
      'Free full-length mock tests and 2011–2025 past papers with worked solutions on ItaloStudy',
      'Degrees recognized worldwide: WHO, NMC India, GMC UK, USMLE/ECFMG USA',
    ],
    table: {
          "caption": "Official IMAT Exam Structure & Marking Scheme (2026–2027)",
          "headers": [
                "Subject Section",
                "Questions",
                "Maximum Score",
                "Suggested Time Allocation"
          ],
          "rows": [
                [
                      "Reading Skills & General Knowledge",
                      "4 Questions",
                      "6.0 Points (+1.5 per correct)",
                      "6 Minutes"
                ],
                [
                      "Logical Reasoning",
                      "5 Questions",
                      "7.5 Points (+1.5 per correct)",
                      "10 Minutes"
                ],
                [
                      "Biology",
                      "23 Questions",
                      "34.5 Points (+1.5 per correct)",
                      "35 Minutes"
                ],
                [
                      "Chemistry",
                      "15 Questions",
                      "22.5 Points (+1.5 per correct)",
                      "25 Minutes"
                ],
                [
                      "Physics & Mathematics",
                      "13 Questions",
                      "19.5 Points (+1.5 per correct)",
                      "24 Minutes"
                ],
                [
                      "Total IMAT Examination",
                      "60 Questions",
                      "90.0 Points (-0.4 per incorrect)",
                      "100 Minutes"
                ]
          ]
    },
    sections: [
          {
                "heading": "Complete Preparation Blueprint for IMAT",
                "paragraphs": [
                      "High scorers allocate over 65% of study hours to Biology and Chemistry, which combine for 38 out of 60 total questions (57 points out of 90).",
                      "With negative marking penalizing wrong answers by -0.4 points, strategic omission is essential to protect your total score."
                ]
          }
    ],
    faqs: [
          {
                "question": "What is the minimum passing score in IMAT?",
                "answer": "For EU students, the statutory minimum threshold is 20 points, but competitive admission cutoffs are typically between 35 and 55+ points."
          },
          {
                "question": "How do I register for the IMAT?",
                "answer": "Registration takes place on the Universitaly portal in July, where you select your exam test center and list university choices."
          }
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
    title: 'IMAT Exam Dates 2026–2027: Official Schedule, Deadlines & Test Centres | ItaloStudy',
    description: 'Official IMAT 2026–2027 exam dates released by MUR. Registration schedule on Universitaly, global test center locations, results announcement & enrollment timeline.',
    canonical: 'https://italostudy.com/imat-exam-dates-2026',
    h1: 'IMAT Exam Dates 2026–2027 — Official MUR Schedule & Deadlines',
    intro: 'The official IMAT examination is scheduled annually by the Italian Ministry of University and Research (MUR) in mid-September. Check the complete timeline from Universitaly pre-enrollment to exam day, results release, and university rankings.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026–2027' },
      { href: '/imat-registration-2026', label: 'IMAT Registration Step-by-Step' },
      { href: '/study-in-italy/how-to-apply', label: 'Universitaly Pre-Enrollment Guide' },
      { href: '/imat-cutoff-trends-2026', label: 'IMAT Cutoff Scores by University' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Exam Simulator' },
    ],
    keyPoints: [
      'IMAT Exam Date: Scheduled for mid-September across all global test locations simultaneously',
      'Universitaly Pre-Enrollment: Opens spring (February–April) for non-EU students needing visas',
      'Test Registration Window: Typically open for 2–3 weeks in July on the Universitaly portal',
      'Global Test Centers: Held in Italy, UK, USA, Canada, India, UAE, Saudi Arabia, Turkey, Germany, and more',
      'Results Timeline: Anonymized scores published within 14 days; final national ranking published in October',
    ],
  },
  'imat-dates': {
    title: 'IMAT Exam Dates 2026–2027: Official Schedule, Deadlines & Test Centres | ItaloStudy',
    description: 'Official IMAT 2026–2027 exam dates released by MUR. Registration schedule on Universitaly, global test center locations, results announcement & enrollment timeline.',
    canonical: 'https://italostudy.com/imat-exam-dates-2026',
    h1: 'IMAT Exam Dates 2026–2027 — Official MUR Schedule & Deadlines',
    intro: 'The official IMAT examination is scheduled annually by the Italian Ministry of University and Research (MUR) in mid-September.',
    relatedLinks: [
      { href: '/imat-exam-dates-2026', label: 'IMAT Exam Dates Calendar' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide' },
    ],
    keyPoints: [
      'Exam held mid-September annually',
      'July Universitaly registration window',
      'Global testing centers across 20+ countries',
    ],
  },
  'imat-dates-2026': {
    title: 'IMAT Exam Dates 2026–2027: Official Schedule, Deadlines & Test Centres | ItaloStudy',
    description: 'Official IMAT 2026–2027 exam dates released by MUR. Registration schedule on Universitaly, global test center locations, results announcement & enrollment timeline.',
    canonical: 'https://italostudy.com/imat-exam-dates-2026',
    h1: 'IMAT Exam Dates 2026–2027 — Official MUR Schedule & Deadlines',
    intro: 'The official IMAT examination is scheduled annually by the Italian Ministry of University and Research (MUR) in mid-September.',
    relatedLinks: [
      { href: '/imat-exam-dates-2026', label: 'IMAT Exam Dates Calendar' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide' },
      { href: '/study-in-italy/how-to-apply', label: 'How to Apply to Italian Universities' },
      { href: '/imat-preparation-strategy-2026', label: 'IMAT Preparation Strategy 2026' },
    ],
    keyPoints: [
      'IMAT 2026–2027 exam: expected mid-September annually across 20+ countries',
      'Registration on Universitaly: opens approximately July',
      'Registration deadline: typically 3 weeks after opening',
      'IMAT results: usually released within 2–3 weeks after the exam',
      'University enrollment: October–November after national ranking list',
      'Non-EU visa application: submit Universitaly pre-enrollment starting spring',
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
    title: 'IMAT Past Papers PDF (2011–2025) with Worked Solutions & Answer Keys | Free Download',
    description: 'Download official IMAT past papers (2011–2025) in PDF with verified answer keys and step-by-step worked solutions. 100% free master download & online mock simulator.',
    canonical: 'https://italostudy.com/imat-previous-year-papers-pdf',
    h1: 'IMAT Past Papers PDF (2011–2025) — Free Download with Worked Solutions',
    intro: 'Master the IMAT with official question booklets and answer keys from 2011 to 2025. Access free PDF downloads for printing and practice with our interactive online exam simulator that replicates real MUR timing and scoring.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026–2027' },
      { href: '/imat-mock-test-free-2026', label: 'Free Online IMAT Mock Simulator' },
      { href: '/imat-syllabus-2026', label: 'Official IMAT Syllabus Breakdown' },
      { href: '/imat-cutoff-trends-2026', label: 'IMAT University Cutoff Trends' },
      { href: '/resources', label: 'Free Study Materials & Question Bank' },
    ],
    keyPoints: [
      'Complete archive: All 15 official IMAT exam papers from 2011 through 2024/2025',
      'Official answer keys: Verified against the Italian Ministry (MUR) answer releases',
      'Step-by-step worked solutions for challenging Math, Physics, and Logical Reasoning questions',
      'Instant Master ZIP download available for easy offline printing and practice',
      'Interactive CBT simulator mode: Practice on screen under genuine 100-minute time limits',
    ],
    table: {
          "caption": "Official IMAT Past Papers (2011–2025) Archive & Answer Keys",
          "headers": [
                "Exam Year",
                "Paper Format & Administering Body",
                "Answer Key Status",
                "Download Status"
          ],
          "rows": [
                [
                      "IMAT 2025",
                      "60 MCQs Cineca Ministerial Format",
                      "Official MUR Key + Worked Solutions",
                      "Free PDF Available"
                ],
                [
                      "IMAT 2024",
                      "60 MCQs Cineca Format (High Science Weight)",
                      "Official MUR Key + Worked Solutions",
                      "Free PDF Available"
                ],
                [
                      "IMAT 2023",
                      "60 MCQs Italian Ministerial Format",
                      "Official MUR Key + Worked Solutions",
                      "Free PDF Available"
                ],
                [
                      "IMAT 2022",
                      "60 MCQs Cambridge Assessment Admissions Testing",
                      "Official Key + Complete Explanations",
                      "Free PDF Available"
                ],
                [
                      "IMAT 2021",
                      "60 MCQs Cambridge Assessment Admissions Testing",
                      "Official Key + Complete Explanations",
                      "Free PDF Available"
                ],
                [
                      "IMAT 2011–2020 Archive",
                      "Full 10-Year Historical Cambridge Papers Bundle",
                      "Verified Solutions for All 600 Questions",
                      "Free PDF Available"
                ]
          ]
    },
    faqs: [
          {
                "question": "Where can I download authentic IMAT past papers?",
                "answer": "All official IMAT past papers from 2011 to 2025 with official keys and solutions are available for free download on ItaloStudy."
          },
          {
                "question": "Are Cambridge IMAT papers still relevant for the current exam?",
                "answer": "Yes! The core scientific syllabus for biology, chemistry, mathematics, and physics remains identical across years."
          }
    ],
  },
  'imat-past-papers': {
    title: 'IMAT Past Papers PDF (2011–2025) with Worked Solutions & Answer Keys | Free Download',
    description: 'Download official IMAT past papers (2011–2025) in PDF with verified answer keys and step-by-step worked solutions. 100% free master download & online mock simulator.',
    canonical: 'https://italostudy.com/imat-previous-year-papers-pdf',
    h1: 'IMAT Past Papers PDF (2011–2025) — Free Download with Worked Solutions',
    intro: 'Master the IMAT with official question booklets and answer keys from 2011 to 2025. Access free PDF downloads for printing and practice with our interactive online exam simulator that replicates real MUR timing and scoring.',
    relatedLinks: [
      { href: '/imat-previous-year-papers-pdf', label: 'IMAT Previous Year Papers Master Archive' },
      { href: '/imat-mock-test-free-2026', label: 'Free Online IMAT Mock Simulator' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026–2027' },
    ],
    keyPoints: [
      'Official papers from 2011 to 2025 with official answer keys',
      'Worked solutions for numerical and logic problems',
      '100% free instant access — no credit card or paywall',
    ],
    table: {
          "caption": "Official IMAT Past Papers (2011–2025) Archive & Answer Keys",
          "headers": [
                "Exam Year",
                "Paper Format & Administering Body",
                "Answer Key Status",
                "Download Status"
          ],
          "rows": [
                [
                      "IMAT 2025",
                      "60 MCQs Cineca Ministerial Format",
                      "Official MUR Key + Worked Solutions",
                      "Free PDF Available"
                ],
                [
                      "IMAT 2024",
                      "60 MCQs Cineca Format (High Science Weight)",
                      "Official MUR Key + Worked Solutions",
                      "Free PDF Available"
                ],
                [
                      "IMAT 2023",
                      "60 MCQs Italian Ministerial Format",
                      "Official MUR Key + Worked Solutions",
                      "Free PDF Available"
                ],
                [
                      "IMAT 2022",
                      "60 MCQs Cambridge Assessment Admissions Testing",
                      "Official Key + Complete Explanations",
                      "Free PDF Available"
                ],
                [
                      "IMAT 2021",
                      "60 MCQs Cambridge Assessment Admissions Testing",
                      "Official Key + Complete Explanations",
                      "Free PDF Available"
                ],
                [
                      "IMAT 2011–2020 Archive",
                      "Full 10-Year Historical Cambridge Papers Bundle",
                      "Verified Solutions for All 600 Questions",
                      "Free PDF Available"
                ]
          ]
    },
    faqs: [
          {
                "question": "Where can I download authentic IMAT past papers?",
                "answer": "All official IMAT past papers from 2011 to 2025 with official keys and solutions are available for free download on ItaloStudy."
          },
          {
                "question": "Are Cambridge IMAT papers still relevant for the current exam?",
                "answer": "Yes! The core scientific syllabus for biology, chemistry, mathematics, and physics remains identical across years."
          }
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
    title: 'IMAT vs CEnT-S 2026–2027 | Which Exam Should You Choose? | ItaloStudy',
    description: 'IMAT vs CEnT-S: full comparison of difficulty, programs, universities, preparation time, and career outcomes for international students.',
    canonical: 'https://italostudy.com/imat-vs-cents-2026',
    h1: 'IMAT vs CEnT-S 2026–2027 — Which Italian University Entrance Exam Is Right for You?',
    intro: 'IMAT and CEnT-S are both Italian university entrance exams conducted in English, but for different disciplines. Choosing between Medicine (IMAT) and STEM/Sciences (CEnT-S) determines your preparation pathway.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide 2026' },
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy 2026 Guide' },
      { href: '/study-in-italy/universities-2026', label: 'Top Universities in Italy 2026' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Test 2026' },
      { href: '/cent-s-mock-test-free-2026', label: 'Free CEnT-S Mock Test 2026' },
    ],
    keyPoints: [
      'IMAT: Entrance exam for Medicine & Surgery (MBBS) taught in English at Italian public universities',
      'CEnT-S: CISIA English Test for Science, used for English-taught STEM, Engineering, and Science Bachelor degrees',
      'Both exams are 100% in English — no Italian language requirement for sitting either exam',
      'Structure: IMAT has 60 questions in 100 minutes; CEnT-S has 50–55 questions in 100–110 minutes',
      'Test delivery: IMAT is paper-based once per year (September); CEnT-S is computer-based with multiple sessions across the year',
      'Students can prepare for and attempt both exams in the same academic cycle',
    ],
  },
  'imat-vs-neet-2026': {
    title: 'IMAT vs NEET 2026–2027: Difficulty, Fees, Syllabus & MBBS in Italy Compared',
    description: 'Is IMAT easier than NEET? Comprehensive comparison of difficulty, syllabus, negative marking, tuition fees (€150–€3,000/yr), and European medical degree validity.',
    canonical: 'https://italostudy.com/imat-vs-neet-2026',
    h1: 'IMAT vs NEET 2026–2027: The Definitive Comparison for Indian Students',
    intro: 'With over 2.4 million candidates competing for limited government medical seats in India, the Italian IMAT has emerged as a premier, affordable gateway to a world-class European medical degree (MD/MBBS). Here is a data-driven breakdown of difficulty, syllabus differences, tuition costs, and international degree recognition.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide 2026–2027' },
      { href: '/imat-previous-year-papers-pdf', label: 'IMAT Past Papers with Worked Solutions' },
      { href: '/study-in-italy/tuition-fees-2026', label: 'Italy Medical Tuition Fees & DSU Scholarships' },
      { href: '/study-in-italy/how-to-apply', label: 'Universitaly Pre-Enrollment Guide' },
      { href: '/imat-mock-test-free-2026', label: 'Free IMAT Mock Exam Simulator' },
    ],
    keyPoints: [
      'Competition Ratio: NEET has 2,400,000+ applicants for ~55,000 government seats; IMAT offers direct English-taught public seats at Milan, Bologna, Rome, and Pavia',
      'Tuition Comparison: Private Indian medical colleges cost ₹50L–₹1.2 Crore; Italian public universities cost just €156–€3,500/year (₹15,000–₹3 Lakh/yr)',
      'Scholarships: Italian DSU regional scholarships offer up to €8,000/year stipend + free meals + 100% tuition waiver for qualified international students',
      'Syllabus & Difficulty: NEET requires massive factual memorization of NCERT; IMAT is 60 conceptual MCQs focusing on scientific application, logic, and critical reasoning',
      'Global Degree Recognition: Degrees are valid across the European Union, UK (GMC), US (ECFMG / USMLE), and India (NMC / NEXT / WHO)',
    ],
    table: {
          "caption": "IMAT (Italy) vs NEET (India) Comprehensive Comparison",
          "headers": [
                "Evaluation Parameter",
                "IMAT (Italy MBBS)",
                "NEET-UG (India MBBS)"
          ],
          "rows": [
                [
                      "Applicant Competition",
                      "~12,000–15,000 applicants total",
                      "~2.4 million candidates"
                ],
                [
                      "Selection Ratio (Govt)",
                      "~1 in 6 candidates admitted",
                      "~1 in 45 candidates for government seats"
                ],
                [
                      "Exam Structure",
                      "60 Questions in 100 Minutes",
                      "180 Questions in 200 Minutes"
                ],
                [
                      "Tuition Fees (Public)",
                      "€156 to €3,500/year (~₹15k to ₹3.2L/year)",
                      "₹50,000–₹1,00,000 (Govt) vs ₹60L–₹1.5Cr (Private)"
                ],
                [
                      "Scholarship Opportunities",
                      "DSU Regional: Up to €8,000/yr + free meals/housing",
                      "Limited merit-cum-means assistance"
                ],
                [
                      "Degree Recognition",
                      "Valid across EU, UK (GMC), USA (USMLE), India (NMC)",
                      "NMC (India), requires licensing exams abroad"
                ],
                [
                      "Language of Instruction",
                      "100% English at 16+ public Italian universities",
                      "English / Hindi / Regional Indian languages"
                ]
          ]
    },
    sections: [
          {
                "heading": "Why Medical Aspirants Target IMAT Along With NEET",
                "paragraphs": [
                      "The European medical qualification (Laurea Magistrale a Ciclo Unico) adheres to EU Directive 2005/36/EC, allowing graduates to practice medicine across 27 EU member states without needing requalification."
                ]
          }
    ],
    faqs: [
          {
                "question": "Is IMAT easier than NEET?",
                "answer": "The selection ratio is vastly better (1 in 6 vs 1 in 45+), but the exam demands high analytical speed and strong English scientific comprehension."
          }
    ],
  },
  'imat-vs-neet': {
    title: 'IMAT vs NEET 2026–2027: Difficulty, Fees, Syllabus & MBBS in Italy Compared',
    description: 'Is IMAT easier than NEET? Comprehensive comparison of difficulty, syllabus, negative marking, tuition fees (€150–€3,000/yr), and European medical degree validity.',
    canonical: 'https://italostudy.com/imat-vs-neet-2026',
    h1: 'IMAT vs NEET 2026–2027: The Definitive Comparison for Indian Students',
    intro: 'With over 2.4 million candidates competing for limited government medical seats in India, the Italian IMAT has emerged as a premier, affordable gateway to a world-class European medical degree (MD/MBBS).',
    relatedLinks: [
      { href: '/imat-vs-neet-2026', label: 'IMAT vs NEET Complete In-Depth Guide' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide' },
      { href: '/study-in-italy/how-to-apply', label: 'Universitaly Pre-Enrollment Guide' },
    ],
    keyPoints: [
      'European medical degree at 1/10th the cost of Indian private colleges',
      'Entirely taught in English at historic public Italian medical faculties',
      'Full scholarship coverage available through Italian regional DSU programs',
    ],
    table: {
          "caption": "IMAT (Italy) vs NEET (India) Comprehensive Comparison",
          "headers": [
                "Evaluation Parameter",
                "IMAT (Italy MBBS)",
                "NEET-UG (India MBBS)"
          ],
          "rows": [
                [
                      "Applicant Competition",
                      "~12,000–15,000 applicants total",
                      "~2.4 million candidates"
                ],
                [
                      "Selection Ratio (Govt)",
                      "~1 in 6 candidates admitted",
                      "~1 in 45 candidates for government seats"
                ],
                [
                      "Exam Structure",
                      "60 Questions in 100 Minutes",
                      "180 Questions in 200 Minutes"
                ],
                [
                      "Tuition Fees (Public)",
                      "€156 to €3,500/year (~₹15k to ₹3.2L/year)",
                      "₹50,000–₹1,00,000 (Govt) vs ₹60L–₹1.5Cr (Private)"
                ],
                [
                      "Scholarship Opportunities",
                      "DSU Regional: Up to €8,000/yr + free meals/housing",
                      "Limited merit-cum-means assistance"
                ],
                [
                      "Degree Recognition",
                      "Valid across EU, UK (GMC), USA (USMLE), India (NMC)",
                      "NMC (India), requires licensing exams abroad"
                ],
                [
                      "Language of Instruction",
                      "100% English at 16+ public Italian universities",
                      "English / Hindi / Regional Indian languages"
                ]
          ]
    },
    sections: [
          {
                "heading": "Why Thousands of Medical Aspirants Choose IMAT Over NEET",
                "paragraphs": [
                      "Every year, hundreds of qualified medical candidates miss high NEET cutoffs due to intense competition for limited government seats in India. Italy offers an internationally recognized alternative: public medical schools teaching in 100% English with European clinical standards.",
                      "With affordable tuition scaled to parental income and DSU scholarships that cover living expenses, students can graduate debt-free with an MD degree recognized across Europe and North America."
                ]
          }
    ],
    faqs: [
          {
                "question": "Is IMAT easier to clear than NEET-UG?",
                "answer": "While IMAT requires deep critical thinking and scientific literacy in English, the competition ratio (~1:6 in Italy vs 1:45+ in Indian government colleges) is substantially more favorable for prepared students."
          },
          {
                "question": "Can Indian students practice in India after graduating in Italy?",
                "answer": "Yes. Italian medical degrees are recognized by the National Medical Commission (NMC), allowing graduates to sit the mandatory licensing examination (NExT) to practice in India."
          },
          {
                "question": "Do I need NEET qualification to study Medicine in Italy?",
                "answer": "Yes, Indian regulations require Indian citizens to qualify in NEET to be eligible for foreign medical recognition upon return, in addition to passing the IMAT for admission in Italy."
          }
    ],
  },

  // ─── TOLC & TIL-I Cluster ──────────────────────────────────────────
  'tolc': {
    title: 'TOLC Exam 2026–2027: Ultimate Guide, Syllabus, Dates & Free Mocks | ItaloStudy',
    description: 'Complete guide to CISIA TOLC exams (TOLC-I, TOLC-E, TOLC-F, English TOLC). Syllabus, dates, €35 registration fee, cutoffs & free simulated mock tests.',
    canonical: 'https://italostudy.com/tolc-exam-ultimate-guide-2026',
    h1: 'TOLC Exam 2026–2027 — Complete Guide for All CISIA TOLC Types',
    intro: 'The TOLC (Test OnLine CISIA) is Italy\'s standardized computer-based entrance examination required for Engineering (TOLC-I), Economics (TOLC-E), Pharmacy (TOLC-F), and other undergraduate degrees across Italy. Prepare with authentic online mocks and complete topic breakdowns.',
    relatedLinks: [
      { href: '/tolc-syllabus-2026', label: 'TOLC Syllabus Breakdown & PDF' },
      { href: '/tolc-mock-test-free-2026', label: 'Free Online TOLC Mock Simulator' },
      { href: '/tolc-exam-dates-2026', label: 'TOLC Exam Dates & Booking Calendar' },
      { href: '/tolc-registration-2026', label: 'CISIA TOLC Registration Guide' },
      { href: '/tolc-cutoff-trends-2026', label: 'TOLC University Cutoff Scores' },
    ],
    keyPoints: [
      'TOLC-I: For Engineering, Computer Science, and Mathematics programs',
      'TOLC-E: For Economics, Management, and Finance programs',
      'TOLC-F: For Pharmacy, Chemistry, and Pharmaceutical Technology (CTF)',
      'Delivered both @UNI (university computer labs) and @HOME (remote online proctoring)',
      'Standardized exam fee of €35 per attempt on the official CISIA portal',
      'Scores valid across multiple Italian universities for 12–18 months',
    ],
    table: {
          "caption": "Overview of CISIA TOLC Examinations for Italian Universities",
          "headers": [
                "TOLC Type",
                "Eligible Programs",
                "Structure & Duration",
                "Key Subjects Tested"
          ],
          "rows": [
                [
                      "English TOLC-E",
                      "Economics, Business & Finance",
                      "36 Questions in 90 Minutes",
                      "Logic (13 Qs), Reading (10 Qs), Mathematics (13 Qs)"
                ],
                [
                      "English TOLC-I",
                      "Engineering & Applied Sciences",
                      "50 Questions in 110 Minutes",
                      "Mathematics (20 Qs), Logic (10 Qs), Science (10 Qs), Reading (10 Qs)"
                ],
                [
                      "English TOLC-F",
                      "Pharmacy, Biotech & Life Sciences",
                      "50 Questions in 72 Minutes",
                      "Biology (15 Qs), Chemistry (15 Qs), Math (7 Qs), Physics (7 Qs), Logic (6 Qs)"
                ],
                [
                      "TOLC-MED / VET",
                      "Italian Medicine & Veterinary",
                      "Administered per national decrees",
                      "Refer to current ministerial call"
                ]
          ]
    },
    sections: [
          {
                "heading": "Understanding CISIA TOLC Tests for International Students",
                "paragraphs": [
                      "TOLC (Test OnLine CISIA) examinations are widely used aptitude tests across Italian public universities. For English-taught degrees, CISIA offers dedicated English TOLC variants (English TOLC-E, English TOLC-I, and English TOLC-F).",
                      "TOLC tests can be taken multiple times per year, and students can choose between test center sessions (@UNI) or remote online sessions (@CASA) depending on university announcements."
                ]
          }
    ],
    faqs: [
          {
                "question": "How much does the CISIA TOLC exam cost?",
                "answer": "The official CISIA fee for any TOLC or English TOLC exam sitting is €30.00."
          },
          {
                "question": "Can I take the English TOLC from outside Italy?",
                "answer": "Yes. Students can take TOLC@CASA from their home country during authorized remote testing sessions."
          },
          {
                "question": "How long is a TOLC test score valid?",
                "answer": "Most Italian universities accept TOLC scores taken within the previous calendar year or active academic cycle (typically 12 to 18 months)."
          }
    ],
  },
  'tolc-exam-ultimate-guide-2026': {
    title: 'TOLC Exam 2026–2027 Ultimate Guide | TOLC-E, TOLC-I & Free Mocks | ItaloStudy',
    description: 'Complete TOLC 2026–2027 guide: TOLC-I, TOLC-E, TOLC-F explained with registration steps, syllabus, €35 fee, cutoffs, and free full-length simulated mock tests.',
    canonical: 'https://italostudy.com/tolc-exam-ultimate-guide-2026',
    h1: 'TOLC Exam 2026–2027 — Ultimate Guide for All TOLC Types',
    intro: 'TOLC (Test OnLine CISIA) is Italy\'s computer-based university entrance exam, available in multiple versions for different academic disciplines. This guide covers TOLC-I (Engineering), TOLC-E (Economics), TOLC-F (Pharmacy), and more.',
    relatedLinks: [
      { href: '/tolc-syllabus-2026', label: 'TOLC Syllabus 2026–2027' },
      { href: '/tolc-mock-test-free-2026', label: 'Free TOLC Mock Test' },
      { href: '/tolc-exam-dates-2026', label: 'TOLC Exam Dates & Schedule' },
      { href: '/tolc-registration-2026', label: 'TOLC Registration Guide' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide' },
    ],
    keyPoints: [
      'TOLC-I: Engineering, Computer Science & STEM degrees',
      'TOLC-E: Economics, Business Administration & Finance',
      'TOLC-F: Pharmacy, Biotechnology & Chemistry programs',
      'Standardized €35 fee per session on the CISIA portal',
      'One score accepted by multiple universities across Italy',
      'Free practice tests and question banks on ItaloStudy',
    ],
    table: {
          "caption": "Overview of CISIA TOLC Examinations for Italian Universities",
          "headers": [
                "TOLC Type",
                "Eligible Programs",
                "Structure & Duration",
                "Key Subjects Tested"
          ],
          "rows": [
                [
                      "English TOLC-E",
                      "Economics, Business & Finance",
                      "36 Questions in 90 Minutes",
                      "Logic (13 Qs), Reading (10 Qs), Mathematics (13 Qs)"
                ],
                [
                      "English TOLC-I",
                      "Engineering & Applied Sciences",
                      "50 Questions in 110 Minutes",
                      "Mathematics (20 Qs), Logic (10 Qs), Science (10 Qs), Reading (10 Qs)"
                ],
                [
                      "English TOLC-F",
                      "Pharmacy, Biotech & Life Sciences",
                      "50 Questions in 72 Minutes",
                      "Biology (15 Qs), Chemistry (15 Qs), Math (7 Qs), Physics (7 Qs), Logic (6 Qs)"
                ]
          ]
    },
    faqs: [
          {
                "question": "What is the fee for taking a TOLC test?",
                "answer": "The official CISIA fee for any TOLC or English TOLC exam is €30 per attempt."
          },
          {
                "question": "Can international students take English TOLC from outside Italy?",
                "answer": "Yes! When universities schedule TOLC@CASA (at home) sessions, students worldwide can sit the exam from their home computer."
          }
    ],
  },
  'tolc-syllabus-2026': {
    title: 'TOLC Syllabus 2026–2027: Complete Subject-Wise Breakdown & Topics | ItaloStudy',
    description: 'Detailed TOLC syllabus 2026–2027 for TOLC-I, TOLC-E, and TOLC-F. Mathematics, Logic, Science, and Reading Comprehension question distribution.',
    canonical: 'https://italostudy.com/tolc-syllabus-2026',
    h1: 'TOLC Syllabus 2026–2027 — Official CISIA Topic Breakdown',
    intro: 'Master the subject requirements for every TOLC variant. Understand section weightages, timing, and question types for Engineering (TOLC-I), Economics (TOLC-E), and Sciences (TOLC-F).',
    relatedLinks: [
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide' },
      { href: '/tolc-mock-test-free-2026', label: 'Free TOLC Mock Test' },
      { href: '/tolc-pattern-guide', label: 'TOLC Exam Pattern & Marking' },
    ],
    keyPoints: [
      'TOLC-I: Math (20 Qs), Logic (10 Qs), Science (10 Qs), Reading (10 Qs) + English section (30 Qs)',
      'TOLC-E: Logic (13 Qs), Reading Comprehension (13 Qs), Mathematics (13 Qs) + English (30 Qs)',
      'TOLC-F: Biology (15 Qs), Chemistry (15 Qs), Math (7 Qs), Physics (7 Qs), Logic (6 Qs) + English (30 Qs)',
      'Negative marking: +1 for correct, -0.25 for incorrect, 0 for unanswered',
      'Detailed study plans and practice questions available on ItaloStudy',
    ],
  },
  'tolc-mock-test-free-2026': {
    title: 'Free TOLC Mock Test 2026–2027: Online Exam Simulator | ItaloStudy',
    description: 'Take free TOLC mock tests online for TOLC-I and TOLC-E. Full-length timed practice exams with instant CISIA-style scoring and worked solutions.',
    canonical: 'https://italostudy.com/tolc-mock-test-free-2026',
    h1: 'Free TOLC Mock Test 2026–2027 — Online Exam Simulator',
    intro: 'Simulate the exact CISIA computer-based testing environment with ItaloStudy\'s free TOLC mock exams. Timed sections, negative marking, and in-depth performance analytics.',
    relatedLinks: [
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide' },
      { href: '/tolc-syllabus-2026', label: 'TOLC Syllabus Breakdown' },
      { href: '/tolc-cutoff-trends-2026', label: 'TOLC University Cutoff Scores' },
    ],
    keyPoints: [
      'Full-length simulations with authentic CISIA section timers',
      'Instant raw and normalized scoring breakdown',
      'Step-by-step worked explanations for every question',
      'Unlimited practice attempts — 100% free',
    ],
  },
  'tolc-previous-year-papers-pdf': {
    title: 'TOLC Previous Year Papers & Sample Questions PDF | Free Download | ItaloStudy',
    description: 'Download free TOLC sample papers and official CISIA practice questions in PDF. Includes worked solutions and answer keys for TOLC-I, TOLC-E, and TOLC-F.',
    canonical: 'https://italostudy.com/tolc-previous-year-papers-pdf',
    h1: 'TOLC Previous Year Papers & Practice Questions — Free PDF Download',
    intro: 'Practice with official CISIA sample booklets and verified practice sets for TOLC-I, TOLC-E, and TOLC-F. Review worked mathematical derivations and logic explanations.',
    relatedLinks: [
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide' },
      { href: '/tolc-mock-test-free-2026', label: 'Free Online TOLC Mock Simulator' },
      { href: '/tolc-syllabus-2026', label: 'TOLC Syllabus Breakdown' },
    ],
    keyPoints: [
      'Authentic CISIA practice question booklets and sample papers',
      'Step-by-step worked solutions for quantitative and reasoning sections',
      'Free instant download with offline printable formatting',
    ],
  },
  'tolc-exam-dates-2026': {
    title: 'TOLC Exam Dates 2026–2027: Calendar, Booking Deadlines & Sessions | ItaloStudy',
    description: 'Check official TOLC 2026–2027 exam dates: CISIA calendar, booking deadlines, @HOME and @UNI sessions across Italian universities.',
    canonical: 'https://italostudy.com/tolc-exam-dates-2026',
    h1: 'TOLC Exam Dates 2026–2027 — Official CISIA Calendar & Deadlines',
    intro: 'TOLC sessions are offered monthly from February through November by participating Italian universities. View the complete session schedule and booking deadlines.',
    relatedLinks: [
      { href: '/tolc-registration-2026', label: 'TOLC Registration Guide' },
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide' },
    ],
    keyPoints: [
      'Sessions held from February to November across all Italian universities',
      'Booking closes approximately 7–10 days before each exam date',
      'You can sit one TOLC per calendar month',
    ],
  },
  'tolc-registration-2026': {
    title: 'TOLC Registration 2026–2027: CISIA Portal Guide & €35 Fee | ItaloStudy',
    description: 'How to register for the TOLC in 2026–2027: step-by-step CISIA portal guide, €35 exam fee payment methods, and university deadline tracking.',
    canonical: 'https://italostudy.com/tolc-registration-2026',
    h1: 'TOLC Registration 2026–2027 — Official CISIA Portal Guide',
    intro: 'Registering for any TOLC test requires creating an account on the CISIA portal (cisia.eu), selecting your test date, and completing the €35 fee payment.',
    relatedLinks: [
      { href: '/tolc-exam-dates-2026', label: 'TOLC Exam Dates Calendar' },
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide' },
    ],
    keyPoints: [
      'Standardized exam fee of €35 per test session',
      'Select between @UNI (in-person) or @HOME (remote online proctored)',
      'Immediate payment receipt confirmation generated upon payment',
    ],
  },
  'tolc-cutoff-trends-2026': {
    title: 'TOLC Cutoff Scores 2026–2027: University Score Benchmarks | ItaloStudy',
    description: 'TOLC cutoff scores for top Italian universities: Milan, Bologna, Sapienza, Padua, and Turin. Historical admission benchmarks and score calculator.',
    canonical: 'https://italostudy.com/tolc-cutoff-trends-2026',
    h1: 'TOLC Cutoff Scores 2026–2027 — University-Wise Analysis',
    intro: 'Understand what TOLC score you need for admission into competitive Engineering, Economics, and Science degrees across Italy.',
    relatedLinks: [
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide' },
      { href: '/tolc-passing-score-explained-2026', label: 'TOLC Passing Score Explained' },
    ],
    keyPoints: [
      'Bologna and Milan typically require 28–35+ for competitive engineering programs',
      'Economics cutoffs range from 24 to 32 depending on applicant quotas',
      'Universities publish minimum qualifying thresholds in their annual "Bando"',
    ],
  },
  'tolc-passing-score-explained-2026': {
    title: 'TOLC Passing Score Explained 2026–2027: OFA & Admission Scores | ItaloStudy',
    description: 'What is a good TOLC score? Understanding qualifying scores, OFA (additional educational obligations), and rankings for Italian universities.',
    canonical: 'https://italostudy.com/tolc-passing-score-explained-2026',
    h1: 'TOLC Passing Score Explained 2026–2027',
    intro: 'There is no single pass/fail mark for the TOLC. Admission is ranked on merit, and universities often set OFA (Obblighi Formativi Aggiuntivi) thresholds for basic math competency.',
    relatedLinks: [
      { href: '/tolc-cutoff-trends-2026', label: 'TOLC Cutoff Scores by University' },
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide' },
    ],
    keyPoints: [
      'OFA threshold: Usually 8–10 out of 20 in the Math section to avoid remedial courses',
      'Competitive score: Aim for 70%+ of total points for top-tier university seats',
    ],
  },
  'tolc-difficulty-analysis-2026': {
    title: 'TOLC Difficulty Analysis 2026–2027: How Hard Is It? | ItaloStudy',
    description: 'In-depth analysis of TOLC difficulty compared to IMAT, SAT, and standard high school curricula. Subject-by-subject challenge breakdown.',
    canonical: 'https://italostudy.com/tolc-difficulty-analysis-2026',
    h1: 'TOLC Difficulty Analysis 2026–2027 — How Hard Is the Exam?',
    intro: 'Assess the true difficulty of the CISIA TOLC. Learn which sections challenge students most and how to prepare effectively.',
    relatedLinks: [
      { href: '/tolc-syllabus-2026', label: 'TOLC Syllabus Breakdown' },
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide' },
    ],
    keyPoints: [
      'Overall difficulty: 6/10 — very manageable with 2–3 months of targeted preparation',
      'Time pressure in the Mathematics module is the primary challenge',
      'No calculator permitted during the test',
    ],
  },
  'tolc-best-books-2026': {
    title: 'Best Books for TOLC 2026–2027: Top Study Guides & Materials | ItaloStudy',
    description: 'Recommended books and study resources for TOLC-I, TOLC-E, and TOLC-F. Review AlphaTest, CISIA guides, and free online question banks.',
    canonical: 'https://italostudy.com/tolc-best-books-2026',
    h1: 'Best Books for TOLC 2026–2027 — Subject-Wise Recommendations',
    intro: 'Discover the most effective preparation materials for your TOLC exam, from Italian prep manuals to English study resources.',
    relatedLinks: [
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide' },
      { href: '/tolc-mock-test-free-2026', label: 'Free Online TOLC Mocks' },
    ],
    keyPoints: [
      'AlphaTest and EdiTEST manuals for core Italian question patterns',
      'Schaum\'s Outlines for Mathematics and Physics fundamentals',
      'ItaloStudy online question bank for English-language practice',
    ],
  },
  'tolc-preparation-strategy-2026': {
    title: 'TOLC Preparation Strategy 2026–2027: Study Plan & Tips | ItaloStudy',
    description: 'Step-by-step TOLC preparation strategy: 8-week study schedule, math problem shortcuts, and CISIA mock test practice tips.',
    canonical: 'https://italostudy.com/tolc-preparation-strategy-2026',
    h1: 'TOLC Preparation Strategy 2026–2027 — Expert Study Plan',
    intro: 'A structured study plan is key to scoring in the top percentile on your TOLC. Follow this proven 8-week preparation roadmap.',
    relatedLinks: [
      { href: '/tolc-mock-test-free-2026', label: 'Free Online TOLC Mocks' },
      { href: '/tolc-syllabus-2026', label: 'TOLC Syllabus Breakdown' },
    ],
    keyPoints: [
      'Weeks 1–4: Core content revision and formula mastery',
      'Weeks 5–8: Timed section practice and full-length mock exams',
    ],
  },
  'tolc-vs-imat-2026': {
    title: 'TOLC vs IMAT 2026–2027: Differences, Difficulty & Which to Take | ItaloStudy',
    description: 'TOLC vs IMAT comparison: Medicine vs STEM/Economics, difficulty rating, exam format, fees, and university admissions criteria.',
    canonical: 'https://italostudy.com/tolc-vs-imat-2026',
    h1: 'TOLC vs IMAT 2026–2027 — Key Differences & Comparison',
    intro: 'Understand the differences between Italy\'s two major entrance exams: IMAT for Medicine and TOLC for Engineering, Economics, and Sciences.',
    relatedLinks: [
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide' },
      { href: '/tolc-exam-ultimate-guide-2026', label: 'TOLC Exam Ultimate Guide' },
    ],
    keyPoints: [
      'IMAT is specifically for Medicine and Surgery (MD/MBBS)',
      'TOLC is for Bachelor degrees in Engineering, Economics, Pharmacy, and Sciences',
      'IMAT is annual in September; TOLC offers multiple sessions throughout the year',
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
    title: 'Universitaly Pre-Enrollment 2026–2027: Step-by-Step Guide, Documents & Deadlines',
    description: 'Complete official Universitaly pre-enrollment guide for 2026–2027. Step-by-step tutorial: portal registration, CIMEA comparability, summary A/B form, visa & deadlines.',
    canonical: 'https://italostudy.com/study-in-italy/how-to-apply',
    h1: 'Universitaly Pre-Enrollment 2026–2027 — Official Step-by-Step Guide',
    intro: 'Pre-enrollment on the official Universitaly portal (universitaly.it) is a mandatory requirement by the Italian Ministry of Foreign Affairs (MAECI) and MUR for all international students applying to Italian universities and securing an Italian Type D study visa. Follow this definitive guide to navigate the portal smoothly.',
    relatedLinks: [
      { href: '/study-in-italy-guide-2026', label: 'Study in Italy Complete Guide' },
      { href: '/study-in-italy/universities-2026', label: 'Top Italian Universities for International Students' },
      { href: '/study-in-italy/tuition-fees-2026', label: 'Tuition Fees & Regional DSU Scholarships' },
      { href: '/study-in-italy/without-ielts', label: 'Study in Italy Without IELTS (MOI Guide)' },
      { href: '/imat-registration-2026', label: 'IMAT Registration & Pre-Enrollment Guide' },
      { href: '/cent-s-registration-process-2026', label: 'CEnT-S Registration & Fee Guide' },
    
      { href: '/universitaly-pre-enrollment-guide', label: 'Official Universitaly Pre-Enrollment Guide' },
      { href: '/study-medicine-italy-from-pakistan', label: 'Study Medicine from Pakistan' },
      { href: '/study-medicine-italy-from-bangladesh', label: 'Study Medicine from Bangladesh' },
      { href: '/imat-from-india', label: 'Study Medicine from India' },
    ],
    keyPoints: [
      'Step 1: Create and verify your account on universitaly.it using your official passport details',
      'Step 2: Initiate Pre-Enrollment application (Domanda di Preiscrizione) and select your target university and degree course',
      'Step 3: Upload academic credentials, high school diploma / transcripts, and CIMEA Statement of Comparability or DOV (Declaration of Value)',
      'Step 4: University validates your pre-enrollment dossier directly on the portal and issues Summary Form A/B (Riepilogo)',
      'Step 5: The Italian Embassy / Consulate in your home country receives your verified application through the system',
      'Step 6: Book your Visa appointment (Type D National Study Visa) with your stamped Summary Form and financial proof (€6,000/year minimum)',
    ],
  },
  'universitaly-pre-enrollment-2026': {
    title: 'Universitaly Pre-Enrollment 2026–2027: Step-by-Step Guide, Documents & Deadlines',
    description: 'Complete official Universitaly pre-enrollment guide for 2026–2027. Step-by-step tutorial: portal registration, CIMEA comparability, summary A/B form, visa & deadlines.',
    canonical: 'https://italostudy.com/universitaly-pre-enrollment-2026',
    h1: 'Universitaly Pre-Enrollment 2026–2027 — Official Step-by-Step Guide',
    intro: 'Pre-enrollment on the official Universitaly portal (universitaly.it) is a mandatory requirement by the Italian Ministry of Foreign Affairs (MAECI) and MUR for all international students applying to Italian universities and securing an Italian Type D study visa. Follow this definitive guide to navigate the portal smoothly.',
    relatedLinks: [
      { href: '/study-in-italy/how-to-apply', label: 'Complete University Application & Visa Guide' },
      { href: '/study-in-italy/tuition-fees-2026', label: 'Tuition Fees & DSU Scholarship Guide' },
      { href: '/imat-exam-ultimate-guide-2026', label: 'IMAT Exam Ultimate Guide' },
      { href: '/cent-s-exam-ultimate-guide', label: 'CEnT-S Exam Ultimate Guide' },
    
      { href: '/universitaly-pre-enrollment-guide', label: 'Official Universitaly Pre-Enrollment Guide' },
      { href: '/study-medicine-italy-from-pakistan', label: 'Study Medicine from Pakistan' },
      { href: '/study-medicine-italy-from-bangladesh', label: 'Study Medicine from Bangladesh' },
      { href: '/imat-from-india', label: 'Study Medicine from India' },
    ],
    keyPoints: [
      'Official portal walkthrough for 2026/2027 academic year intake',
      'CIMEA Statement of Comparability vs Embassy Declaration of Value (DOV)',
      'Downloading Summary Form A/B (Riepilogo) for Italian consulate visa appointments',
      'Timeline milestones: February opening through autumn embassy deadlines',
    ],
    table: {
          "caption": "Universitaly Pre-Enrollment & Visa Roadmap (2026–2027 Academic Year)",
          "headers": [
                "Stage & Milestone",
                "Key Timeline",
                "Action Required",
                "Required Documents"
          ],
          "rows": [
                [
                      "1. Account Registration",
                      "February – April",
                      "Register profile on universitaly.it",
                      "Valid Passport, Personal Info"
                ],
                [
                      "2. Course Selection & Application",
                      "April – June",
                      "Choose University & Degree Program; submit pre-enrollment",
                      "Transcripts, High School Diploma, CIMEA / DoV"
                ],
                [
                      "3. University Verification",
                      "May – July",
                      "University reviews dossier and issues Summary Sheet (Riepilogo)",
                      "Confirmed academic documents"
                ],
                [
                      "4. Student Visa (Type D) Filing",
                      "June – August",
                      "Submit visa dossier at Italian Embassy or VFS Global consulate",
                      "Summary Sheet, Proof of Funds (€6k+/yr), Housing, Insurance"
                ],
                [
                      "5. Matriculation & Arrival",
                      "September – October",
                      "Arrive in Italy, take entrance exam (if required), finalize enrollment",
                      "Original authenticated documents, Codice Fiscale"
                ]
          ]
    },
    sections: [
          {
                "heading": "What is Universitaly Pre-Enrollment?",
                "paragraphs": [
                      "Universitaly is the official portal of the Italian Ministry of Universities and Research (MUR). It is the mandatory digital bridge connecting international students, Italian higher education institutions, and Italian embassies worldwide.",
                      "All non-EU students residing abroad must complete pre-enrollment on Universitaly to obtain the official summary sheet (Riepilogo) required to apply for an Italian National Study Visa (Type D)."
                ]
          }
    ],
    faqs: [
          {
                "question": "What is the deadline for Universitaly pre-enrollment for 2026/2027?",
                "answer": "Universitaly pre-enrollment generally opens in the spring (March/April) and remains open through July–August depending on individual university deadlines and degree quotas."
          },
          {
                "question": "Can I apply to multiple universities on Universitaly?",
                "answer": "Non-EU students requiring a study visa can only submit one pre-enrollment application for one degree course at one university per academic year."
          },
          {
                "question": "What is CIMEA and is it required for Universitaly?",
                "answer": "CIMEA provides the Statement of Comparability and Verification for foreign academic diplomas. Most Italian universities accept CIMEA certificates as an online alternative to the traditional Embassy Declaration of Value (DoV)."
          },
          {
                "question": "What proof of financial means is required for an Italian student visa?",
                "answer": "Italian visa regulations require demonstration of at least €467.65 per month for the duration of the academic year (~€6,000 per year) via personal or parental bank statements, or proof of an official scholarship."
          }
    ],
  },
  'universitaly-pre-enrollment-guide': {
    title: 'Universitaly Pre-Enrollment 2026–2027: Step-by-Step Guide, Documents & Deadlines',
    description: 'Complete official Universitaly pre-enrollment guide for 2026–2027. Step-by-step tutorial: portal registration, CIMEA comparability, summary A/B form, visa & deadlines.',
    canonical: 'https://italostudy.com/study-in-italy/how-to-apply',
    h1: 'Universitaly Pre-Enrollment 2026–2027 — Official Step-by-Step Guide',
    intro: 'Pre-enrollment on the official Universitaly portal (universitaly.it) is a mandatory requirement by the Italian Ministry of Foreign Affairs (MAECI) and MUR for all international students applying to Italian universities and securing an Italian Type D study visa.',
    relatedLinks: [
      { href: '/study-in-italy/how-to-apply', label: 'Universitaly Pre-Enrollment Walkthrough' },
      { href: '/study-in-italy/tuition-fees-2026', label: 'Italian Tuition & DSU Scholarships' },
    ],
    keyPoints: [
      'Mandatory registration for non-EU students applying to Italian universities',
      'Required documentation checklist and official deadlines',
      'Embassy visa validation and Summary Form download',
    ],
    table: {
          "caption": "Universitaly Pre-Enrollment & Visa Roadmap (2026–2027 Academic Year)",
          "headers": [
                "Stage & Milestone",
                "Key Timeline",
                "Action Required",
                "Required Documents"
          ],
          "rows": [
                [
                      "1. Account Registration",
                      "February – April",
                      "Register profile on universitaly.it",
                      "Valid Passport, Personal Info"
                ],
                [
                      "2. Course Selection & Application",
                      "April – June",
                      "Choose University & Degree Program; submit pre-enrollment",
                      "Transcripts, High School Diploma, CIMEA / DoV"
                ],
                [
                      "3. University Verification",
                      "May – July",
                      "University reviews dossier and issues Summary Sheet (Riepilogo)",
                      "Confirmed academic documents"
                ],
                [
                      "4. Student Visa (Type D) Filing",
                      "June – August",
                      "Submit visa dossier at Italian Embassy or VFS Global consulate",
                      "Summary Sheet, Proof of Funds (€6k+/yr), Housing, Insurance"
                ],
                [
                      "5. Matriculation & Arrival",
                      "September – October",
                      "Arrive in Italy, take entrance exam (if required), finalize enrollment",
                      "Original authenticated documents, Codice Fiscale"
                ]
          ]
    },
    faqs: [
          {
                "question": "What is Universitaly pre-enrollment?",
                "answer": "It is the official governmental procedure for non-EU students to gain university approval and study visa clearance for Italy."
          },
          {
                "question": "When should I start my Universitaly application?",
                "answer": "Begin preparing documents as early as February/March so you can submit your application as soon as the university portal opens."
          }
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

      // Inject BreadcrumbList and FAQPage structured data (JSON-LD) for rich snippets
      const breadcrumbsLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://italostudy.com/',
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': pageMeta.h1 || pageMeta.title.split('|')[0].trim(),
            'item': pageMeta.canonical,
          },
        ],
      };
      let jsonLdScripts = `\n  <script type="application/ld+json">${JSON.stringify(breadcrumbsLd)}</script>`;

      if (pageMeta.faqs && pageMeta.faqs.length > 0) {
        const faqLd = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': pageMeta.faqs.map(f => ({
            '@type': 'Question',
            'name': f.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.answer,
            },
          })),
        };
        jsonLdScripts += `\n  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>`;
      }
      html = html.replace('</head>', `${jsonLdScripts}\n</head>`);

      // Inject SSR content block — visible to bots, hidden to users via CSS
      // This is the critical fix: Google needs real HTML content to index pages properly
      const tableHtml = pageMeta.table
        ? `\n    <section class="ssr-table-section">\n      ${pageMeta.table.caption ? `<h2>${escapeHtml(pageMeta.table.caption)}</h2>` : ''}\n      <table>\n        <thead>\n          <tr>${pageMeta.table.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>\n        </thead>\n        <tbody>\n${pageMeta.table.rows.map(r => `          <tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('\n')}\n        </tbody>\n      </table>\n    </section>`
        : '';

      const sectionsHtml = pageMeta.sections && pageMeta.sections.length > 0
        ? `\n${pageMeta.sections.map(s => `    <section>\n      <h2>${escapeHtml(s.heading)}</h2>\n${s.paragraphs.map(p => `      <p>${escapeHtml(p)}</p>`).join('\n')}\n    </section>`).join('\n')}`
        : '';

      const keyPointsHtml = pageMeta.keyPoints && pageMeta.keyPoints.length > 0
        ? `\n    <section class="ssr-keypoints">\n      <h2>Key Information & Takeaways</h2>\n      <ul>\n${pageMeta.keyPoints.map(p => `        <li>${escapeHtml(p)}</li>`).join('\n')}\n      </ul>\n    </section>`
        : '';

      const faqsHtml = pageMeta.faqs && pageMeta.faqs.length > 0
        ? `\n    <section class="ssr-faqs">\n      <h2>Frequently Asked Questions</h2>\n      <dl>\n${pageMeta.faqs.map(f => `        <dt><strong>${escapeHtml(f.question)}</strong></dt>\n        <dd>${escapeHtml(f.answer)}</dd>`).join('\n')}\n      </dl>\n    </section>`
        : '';

      const relatedLinksHtml = pageMeta.relatedLinks && pageMeta.relatedLinks.length > 0
        ? `\n    <nav aria-label="related-pages">\n      <h2>Related Exam Guides & Study Resources</h2>\n      <ul>\n${pageMeta.relatedLinks.map(l =>
            `        <li><a href="https://italostudy.com${l.href}">${escapeHtml(l.label)}</a></li>`
          ).join('\n')}\n      </ul>\n    </nav>`
        : '';

      const ssrContent = `<div id="root">
  <article id="ssr-page-content" class="ssr-page-shell">
    <h1>${safeH1}</h1>
    <p class="ssr-intro">${safeIntro}</p>${tableHtml}${sectionsHtml}${keyPointsHtml}${faqsHtml}${relatedLinksHtml}
    <p class="ssr-explore"><a href="${safeCanonical}">Explore ${safeTitle} on ItaloStudy</a></p>
  </article>
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
