import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights as VercelSpeedInsights } from "@vercel/speed-insights/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { lazy, Suspense, useEffect } from "react";
import { LiveEditProvider } from "@/contexts/LiveEditContext";
import { getSkeletonForPath } from '@/lib/skeletons';
import { HelmetProvider } from "react-helmet-async";

import { PricingProvider, usePricing } from "@/context/PricingContext";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import AutoTranslator from "@/components/seo/AutoTranslator";


// Lazy Load Public Pages
// External Redirect Component
const ExternalRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return null;
};

// Forces a full-page reload for static HTML pages that React Router would otherwise 404 on.
// When <Link to="/imat"> is clicked, React Router matches this route, which triggers
// window.location.replace() → browser makes a fresh HTTP request → Vercel/Vite serves the static HTML.
const StaticRedirect = () => {
  useEffect(() => {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
  }, []);
  return null;
};

const Index = lazy(() => import("./pages/Index"));
const IndexItaly = lazy(() => import("./pages/IndexItaly"));
const IndexTurkey = lazy(() => import("./pages/IndexTurkey"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Refund = lazy(() => import("./pages/Refund"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseExplore = lazy(() => import("./pages/CourseExplore"));
const Institutional = lazy(() => import("./pages/Institutional"));
const Syllabus = lazy(() => import("./pages/Syllabus"));
const SyllabusDetail = lazy(() => import("./pages/SyllabusDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ResourceDetail = lazy(() => import("./pages/ResourceDetail"));

// Authority Clusters
const CentsUltimateGuide = lazy(() => import('@/pages/exams/cents-authority/CentsUltimateGuide'));
const CentsDetailedSyllabus = lazy(() => import('@/pages/exams/cents-authority/CentsDetailedSyllabus'));
const CentsPatternGuide = lazy(() => import('@/pages/exams/cents-authority/CentsPatternGuide'));
const CentsCutoffTrends = lazy(() => import('@/pages/exams/cents-authority/CentsCutoffTrends'));
const CentsFreeMockTest = lazy(() => import('@/pages/exams/cents-authority/CentsFreeMockTest'));
const CentsPreviousPapers = lazy(() => import('@/pages/exams/cents-authority/CentsPreviousPapers'));
const CentsPrepStrategy = lazy(() => import('@/pages/exams/cents-authority/CentsPrepStrategy'));
const CentsBooks = lazy(() => import('@/pages/exams/cents-authority/CentsBooks'));
const CentsEligibility = lazy(() => import('@/pages/exams/cents-authority/CentsEligibility'));
const CentsRegistration = lazy(() => import('@/pages/exams/cents-authority/CentsRegistration'));
const CentsDates = lazy(() => import('@/pages/exams/cents-authority/CentsDates'));
const CentsDifficultyAnalysis = lazy(() => import('@/pages/exams/cents-authority/CentsDifficultyAnalysis'));
const CentsPassingScore = lazy(() => import('./pages/exams/cents-authority/CentsPassingScore'));
const CentsMockLanding = lazy(() => import('@/pages/exams/cents-authority/CentsMockLanding'));

const ImatUltimateGuide = lazy(() => import('@/pages/exams/imat-authority/ImatUltimateGuide'));
const ImatDetailedSyllabus = lazy(() => import('@/pages/exams/imat-authority/ImatDetailedSyllabus'));
const ImatExamDates = lazy(() => import('@/pages/exams/imat-authority/ImatExamDates'));
const ImatRegistration = lazy(() => import('@/pages/exams/imat-authority/ImatRegistration'));
const ImatPrepStrategy = lazy(() => import('@/pages/exams/imat-authority/ImatPrepStrategy'));
const ImatVsCents = lazy(() => import('@/pages/exams/imat-authority/ImatVsCents'));
const ImatBooks = lazy(() => import('@/pages/exams/imat-authority/ImatBooks'));
const ImatCutoffTrends = lazy(() => import('@/pages/exams/imat-authority/ImatCutoffTrends'));
const ImatDifficultyAnalysis = lazy(() => import('@/pages/exams/imat-authority/ImatDifficultyAnalysis'));
const ImatEligibility = lazy(() => import('@/pages/exams/imat-authority/ImatEligibility'));
const ImatMockTest = lazy(() => import('@/pages/exams/imat-authority/ImatMockTest'));
const ImatPassingScore = lazy(() => import('@/pages/exams/imat-authority/ImatPassingScore'));
const ImatPatternGuide = lazy(() => import('@/pages/exams/imat-authority/ImatPatternGuide'));
const ImatPreviousPapers = lazy(() => import('@/pages/exams/imat-authority/ImatPreviousPapers'));
const ImatVsNeet = lazy(() => import('@/pages/exams/imat-authority/ImatVsNeet'));
const ImatScoreCalculator = lazy(() => import('@/pages/exams/imat-authority/ImatScoreCalculator'));
const ImatBiologySyllabus = lazy(() => import('@/pages/exams/imat-authority/ImatBiologySyllabus'));
const ImatLogicalReasoning = lazy(() => import('@/pages/exams/imat-authority/ImatLogicalReasoning'));
const ImatForIndianStudents = lazy(() => import('@/pages/exams/imat-authority/ImatForIndianStudents'));

const TolcUltimateGuide = lazy(() => import('@/pages/exams/tolc-authority/TolcUltimateGuide'));
const TolcDetailedSyllabus = lazy(() => import('@/pages/exams/tolc-authority/TolcDetailedSyllabus'));
const TolcBooks = lazy(() => import('@/pages/exams/tolc-authority/TolcBooks'));
const TolcDates = lazy(() => import('@/pages/exams/tolc-authority/TolcDates'));
const TolcPatternGuide = lazy(() => import('@/pages/exams/tolc-authority/TolcPatternGuide'));
const TolcEligibility = lazy(() => import('@/pages/exams/tolc-authority/TolcEligibility'));
const TolcRegistration = lazy(() => import('@/pages/exams/tolc-authority/TolcRegistration'));
const TolcMockTest = lazy(() => import('@/pages/exams/tolc-authority/TolcMockTest'));
const TolcPreviousPapers = lazy(() => import('@/pages/exams/tolc-authority/TolcPreviousPapers'));
const TolcPassingScore = lazy(() => import('@/pages/exams/tolc-authority/TolcPassingScore'));
const TolcCutoffTrends = lazy(() => import('@/pages/exams/tolc-authority/TolcCutoffTrends'));
const TolcDifficultyAnalysis = lazy(() => import('@/pages/exams/tolc-authority/TolcDifficultyAnalysis'));
const TolcPrepStrategy = lazy(() => import('@/pages/exams/tolc-authority/TolcPrepStrategy'));
const TolcVsImat = lazy(() => import('@/pages/exams/tolc-authority/TolcVsImat'));
const TiliUltimateGuide = lazy(() => import('@/pages/exams/tili-authority/TiliUltimateGuide'));
const StudyItalyGuide = lazy(() => import('@/pages/study-in-italy/StudyItalyGuide'));
const StudyItalyUniversities = lazy(() => import('@/pages/study-in-italy/StudyItalyUniversities'));
const StudyItalyWithoutIelts = lazy(() => import('@/pages/study-in-italy/StudyItalyWithoutIelts'));
const StudyItalyTuition = lazy(() => import('@/pages/study-in-italy/StudyItalyTuition'));
const StudyItalyApply = lazy(() => import('@/pages/study-in-italy/StudyItalyApply'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 15,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
  },
});

const PageLoader = () => {
  return getSkeletonForPath(window.location.pathname);
};

const PublicRouter = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/it" element={<IndexItaly />} />
    <Route path="/tr" element={<IndexTurkey />} />

    <Route path="/tr/*" element={<IndexTurkey />} />

    <Route path="/it/*" element={<IndexItaly />} />
    <Route path="/auth" element={<ExternalRedirect to="https://app.italostudy.com/auth" />} />
    <Route path="/reset-password" element={<ExternalRedirect to="https://app.italostudy.com/reset-password" />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/courses" element={<Courses />} />
    <Route path="/courses/:slug" element={<CourseExplore />} />
    <Route path="/institutional" element={<Institutional />} />
    <Route path="/about" element={<About />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/refund" element={<Refund />} />
    <Route path="/syllabus" element={<Navigate to="/exams" replace />} />
    <Route path="/syllabus/:examId" element={<SyllabusDetail />} />
    <Route path="/exams" element={<Syllabus />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    
    <Route path="/cent-s-exam-ultimate-guide" element={<CentsUltimateGuide />} />
    <Route path="/cent-s-syllabus-2026" element={<CentsDetailedSyllabus />} />
    <Route path="/cent-s-exam-pattern-2026" element={<CentsPatternGuide />} />
    <Route path="/cent-s-cutoff-2026" element={<CentsCutoffTrends />} />
    <Route path="/cent-s-mock-test-free-2026" element={<CentsFreeMockTest />} />
    <Route path="/cent-s-previous-year-papers-pdf" element={<CentsPreviousPapers />} />
    <Route path="/cent-s-preparation-strategy-2026" element={<CentsPrepStrategy />} />
    <Route path="/best-books-for-cent-s-2026" element={<CentsBooks />} />
    <Route path="/cent-s-eligibility-criteria" element={<CentsEligibility />} />
    <Route path="/cent-s-registration-process-2026" element={<CentsRegistration />} />
    <Route path="/cent-s-important-dates-2026" element={<CentsDates />} />
    <Route path="/cent-s-difficulty-level-analysis" element={<CentsDifficultyAnalysis />} />
    <Route path="/cent-s-passing-score-explained" element={<CentsPassingScore />} />
    <Route path="/cent-s-mock-landing" element={<CentsMockLanding />} />
    <Route path="/imat-exam-ultimate-guide-2026" element={<ImatUltimateGuide />} />
    <Route path="/imat-syllabus-2026" element={<ImatDetailedSyllabus />} />
    <Route path="/imat-exam-dates-2026" element={<ImatExamDates />} />
    <Route path="/imat-registration-2026" element={<ImatRegistration />} />
    <Route path="/imat-exam-pattern-2026" element={<ImatPatternGuide />} />
    <Route path="/imat-cutoff-trends-2026" element={<ImatCutoffTrends />} />
    <Route path="/imat-mock-test-free-2026" element={<ImatMockTest />} />
    <Route path="/imat-previous-year-papers-pdf" element={<ImatPreviousPapers />} />
    <Route path="/imat-preparation-strategy-2026" element={<ImatPrepStrategy />} />
    <Route path="/imat-best-books-2026" element={<ImatBooks />} />
    <Route path="/imat-eligibility-criteria-2026" element={<ImatEligibility />} />
    <Route path="/imat-passing-score-explained-2026" element={<ImatPassingScore />} />
    <Route path="/imat-difficulty-analysis-2026" element={<ImatDifficultyAnalysis />} />
    <Route path="/imat-vs-cents-2026" element={<ImatVsCents />} />
    <Route path="/imat-vs-neet-2026" element={<ImatVsNeet />} />
    <Route path="/imat-score-calculator" element={<ImatScoreCalculator />} />
    <Route path="/imat-biology-syllabus-2026" element={<ImatBiologySyllabus />} />
    <Route path="/imat-logical-reasoning-guide-2026" element={<ImatLogicalReasoning />} />
    <Route path="/imat-exam-for-indian-students" element={<ImatForIndianStudents />} />
    <Route path="/tolc-exam-ultimate-guide-2026" element={<TolcUltimateGuide />} />
    <Route path="/tolc-syllabus-2026" element={<TolcDetailedSyllabus />} />
    <Route path="/tolc-best-books-2026" element={<TolcBooks />} />
    <Route path="/tolc-exam-dates-2026" element={<TolcDates />} />
    <Route path="/tolc-exam-pattern-2026" element={<TolcPatternGuide />} />
    <Route path="/tolc-eligibility-criteria-2026" element={<TolcEligibility />} />
    <Route path="/tolc-registration-2026" element={<TolcRegistration />} />
    <Route path="/tolc-mock-test-free-2026" element={<TolcMockTest />} />
    <Route path="/tolc-previous-year-papers-pdf" element={<TolcPreviousPapers />} />
    <Route path="/tolc-passing-score-explained-2026" element={<TolcPassingScore />} />
    <Route path="/tolc-cutoff-trends-2026" element={<TolcCutoffTrends />} />
    <Route path="/tolc-difficulty-analysis-2026" element={<TolcDifficultyAnalysis />} />
    <Route path="/tolc-preparation-strategy-2026" element={<TolcPrepStrategy />} />
    <Route path="/tolc-vs-imat-2026" element={<TolcVsImat />} />
    <Route path="/til-i-exam-guide-2026" element={<TiliUltimateGuide />} />
    <Route path="/study-in-italy-guide-2026" element={<StudyItalyGuide />} />
    <Route path="/study-in-italy/universities-2026" element={<StudyItalyUniversities />} />
    <Route path="/study-in-italy/without-ielts" element={<StudyItalyWithoutIelts />} />
    <Route path="/study-in-italy/tuition-fees-2026" element={<StudyItalyTuition />} />
    <Route path="/study-in-italy/how-to-apply" element={<StudyItalyApply />} />
    <Route path="/resources/:slug" element={<ResourceDetail />} />

    {/* Canonical redirects — short slugs 301→ long authority slugs to prevent duplicate content */}
    <Route path="/imat" element={<Navigate to="/imat-exam-ultimate-guide-2026" replace />} />
    <Route path="/cent-s" element={<Navigate to="/cent-s-exam-ultimate-guide" replace />} />
    <Route path="/resources" element={<StaticRedirect />} />
    <Route path="/cent-s-mock" element={<StaticRedirect />} />
    <Route path="/imat-mock" element={<StaticRedirect />} />
    <Route path="/cent-s-exam-preparation-book-pdf-free-download" element={<StaticRedirect />} />
    <Route path="/status" element={<StaticRedirect />} />
    <Route path="/method" element={<StaticRedirect />} />
    <Route path="/roadmap" element={<StaticRedirect />} />
    <Route path="/updates" element={<StaticRedirect />} />

    <Route path="/store" element={<ExternalRedirect to="https://store.italostudy.com" />} />
    <Route path="/store/*" element={<ExternalRedirect to="https://store.italostudy.com" />} />
    <Route path="/dashboard" element={<ExternalRedirect to="https://app.italostudy.com/" />} />
    <Route path="/subjects" element={<ExternalRedirect to="https://app.italostudy.com/subjects" />} />
    <Route path="/practice" element={<ExternalRedirect to="https://app.italostudy.com/practice" />} />
    <Route path="/mock-exams" element={<ExternalRedirect to="https://app.italostudy.com/mock-exams" />} />
    
    <Route path="/contact" element={<StaticRedirect />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
        <GlobalErrorBoundary>
          <AuthProvider>
            <PricingProvider>
              <TooltipProvider>
                <LiveEditProvider>
                  {children}
                </LiveEditProvider>
              </TooltipProvider>
            </PricingProvider>
          </AuthProvider>
        </GlobalErrorBoundary>
    </QueryClientProvider>
  );
};

const RouterListener = () => {
  const location = useLocation();
  useEffect(() => {
    // Hide the HTML skeleton exactly when the lazy-loaded route has finished suspending and mounted.
    const sk = document.getElementById('sk-shell');
    if (sk) {
      sk.style.display = 'none';
    }
  }, [location.pathname]);
  return null;
};

const AuthBridge = () => {
  return (
    <BrowserRouter>
      <AutoTranslator />
      <ToasterProvider />
      <Suspense fallback={<PageLoader />}>
        <PublicRouter />
        <RouterListener />
      </Suspense>
      <VercelAnalytics />
      <VercelSpeedInsights />

    </BrowserRouter>
  );
};

const ToasterProvider = () => (
  <>
    <Toaster />
    <Sonner />
  </>
);

const App = () => {
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const message = 'error' in event ? event.message : (event.reason?.message || 'Unhandled Rejection');
      console.error("Global Error:", message);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleGlobalError);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, []);

  return (
    <HelmetProvider>
      <AppProviders>
        <AuthBridge />
      </AppProviders>
    </HelmetProvider>
  );
};

export default App;
