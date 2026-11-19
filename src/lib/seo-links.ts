/**
 * SEO Link Registry for Italostudy 2027
 * These clusters help search engines understand the relationship between 
 * authority guides and deep-dive technical pages.
 */

export interface SEOLink {
  title: string;
  href: string;
  description?: string;
}

export const IMAT_CLUSTER: SEOLink[] = [
  { title: "IMAT Past Papers (2016-2026)", href: "/imat-past-papers", description: "Download official PDFs with worked solutions." },
  { title: "Free IMAT Practice Test", href: "/imat-free-practice-test", description: "15-question simulation with instant scoring." },
  { title: "IMAT Score Calculator", href: "/imat-score-calculator", description: "Calculate your raw score instantly." },
  { title: "IMAT Cutoff Estimator", href: "/imat-cutoff-estimator", description: "Predict your admissions chances across Italian universities." },
  { title: "IMAT Question Bank", href: "/imat-question-bank", description: "2000+ categorized questions with explanations." },
  { title: "IMAT Preparation Books", href: "/imat-preparation-books", description: "Best books and resources for scoring 50+." },
  { title: "IMAT Scoring System (+1.5/-0.4)", href: "/imat-scoring-system", description: "Complete breakdown of negative marking and formula." },
  { title: "IMAT vs NEET Guide", href: "/imat-vs-neet", description: "Direct comparison of syllabus, competition, and fees." },
  { title: "TOLC-MED vs IMAT", href: "/tolc-med-vs-imat", description: "Differences between Italian and English medicine tests." },
  { title: "IMAT from India Guide", href: "/imat-from-india", description: "Complete admission, testing centers, and visa roadmap." },
  { title: "Study Medicine from Pakistan", href: "/study-medicine-italy-from-pakistan", description: "Step-by-step Italian medical school guide for Pakistani students." },
  { title: "Study Medicine from Bangladesh", href: "/study-medicine-italy-from-bangladesh", description: "Medical admissions and visa requirements from Bangladesh." },
  { title: "IMAT Syllabus 2027", href: "/imat-syllabus-2026", description: "Detailed topic breakdown for Biology, Chemistry, and Physics." },
  { title: "Exam Dates & Deadlines", href: "/imat-exam-dates-2026", description: "Official Mur timeline for the 2027 intake." },
  { title: "Registration Guide", href: "/imat-registration-2026", description: "Step-by-step Universitaly application process." },
  { title: "Preparation Strategy", href: "/imat-preparation-strategy-2026", description: "How to score 50+ using the authority framework." },
  { title: "Cutoff Trends", href: "/imat-cutoff-trends-2026", description: "Historical scores for all 15+ public universities." },
  { title: "Previous Year Papers", href: "/imat-previous-year-papers-pdf", description: "Download official PDFs from 2011 to 2025." },
];

export const CENTS_CLUSTER: SEOLink[] = [
  { title: "CEnT-S Exam Fees (€35)", href: "/cent-s-exam-fees", description: "Official CISIA fee breakdown, payment methods, and waivers." },
  { title: "Free CEnT-S Practice Test", href: "/cent-s-free-practice-test", description: "15-question online practice with instant results." },
  { title: "CEnT-S for Turkish Students", href: "/cent-s-for-turkish-students", description: "Italian STEM admission guide for students from Turkey." },
  { title: "CENT-S Syllabus", href: "/cent-s-syllabus-2026", description: "Mastering the 5-section CISIA structure." },
  { title: "Exam Pattern & Scoring", href: "/cent-s-exam-pattern-2026", description: "Understanding the +1/-0.25 scoring and normalization." },
  { title: "Important Dates", href: "/cent-s-important-dates-2026", description: "Monthly session windows and best times to take the test." },
  { title: "Registration Process", href: "/cent-s-registration-process-2026", description: "CISIA portal guide for international students." },
  { title: "Cutoff Analysis", href: "/cent-s-cutoff-2026", description: "Score requirements for Engineering & Economics." },
  { title: "Passing Score Explained", href: "/cent-s-passing-score-explained", description: "Raw vs Normalized: What you need to succeed." },
];

export const STUDY_IN_ITALY_CLUSTER: SEOLink[] = [
  { title: "Universitaly Pre-Enrollment Guide", href: "/universitaly-pre-enrollment-guide", description: "Step-by-step portal walkthrough, CIMEA, and visa." },
  { title: "Study Medicine from Pakistan", href: "/study-medicine-italy-from-pakistan", description: "Pakistani student admissions, DSU scholarships, and visa." },
  { title: "Study Medicine from Bangladesh", href: "/study-medicine-italy-from-bangladesh", description: "Bangladeshi student admission guide and document checklist." },
  { title: "IMAT from India Guide", href: "/imat-from-india", description: "Indian medical admissions and test center guide." },
  { title: "University Ranking 2027", href: "/study-in-italy/universities-2026" },
  { title: "Study Without IELTS", href: "/study-in-italy/without-ielts" },
  { title: "Tuition Fees & Scholarships", href: "/study-in-italy/tuition-fees-2026" },
  { title: "How to Apply (Full Cycle)", href: "/study-in-italy/how-to-apply" },
];
