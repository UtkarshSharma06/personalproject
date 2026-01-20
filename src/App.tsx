import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { lazy, Suspense } from "react";
import SecurityEnforcer from "@/components/SecurityEnforcer";

import { ExamProvider } from "@/context/ExamContext";
import { AIProvider } from "@/context/AIContext";

import NetworkStatus from "@/components/NetworkStatus";
import AdminRoute from "@/components/auth/AdminRoute";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Lazy Load Pages
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Subjects = lazy(() => import("./pages/Subjects"));
const Practice = lazy(() => import("./pages/Practice"));
const MockExams = lazy(() => import("./pages/MockExams"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Labs = lazy(() => import("./pages/Labs"));
const Test = lazy(() => import("./pages/Test"));
const Results = lazy(() => import("./pages/Results"));
const History = lazy(() => import("./pages/History"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Admin = lazy(() => import("./pages/Admin"));
const InternationalMockWaitingRoom = lazy(() => import("./pages/InternationalMockWaitingRoom"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Pricing = lazy(() => import("./pages/Pricing"));
const ExamIMAT = lazy(() => import("./pages/ExamIMAT"));
const ExamCENTS = lazy(() => import("./pages/ExamCENTS"));
const Method = lazy(() => import("./pages/Method"));
const Learning = lazy(() => import("./pages/Learning"));
const StartTest = lazy(() => import("./pages/StartTest"));
const SpeakingLobby = lazy(() => import("./pages/speaking/SpeakingLobby"));
const SpeakingSession = lazy(() => import("./pages/speaking/SpeakingSession"));
const ReadingTest = lazy(() => import("./pages/reading/ReadingTest"));
const ReadingResult = lazy(() => import("./pages/reading/ReadingResult"));
const ListeningTest = lazy(() => import("./pages/listening/ListeningTest"));
const ListeningResult = lazy(() => import("./pages/listening/ListeningResult"));
const WritingTest = lazy(() => import("./pages/writing/WritingTest"));
const WritingHistory = lazy(() => import("@/pages/writing/WritingHistory"));
const SpeakingHistory = lazy(() => import("@/pages/speaking/SpeakingHistory"));
const ReadingHistory = lazy(() => import("@/pages/reading/ReadingHistory"));
const ListeningHistory = lazy(() => import("@/pages/listening/ListeningHistory"));
const Settings = lazy(() => import("./pages/Settings"));
const IELTSFlow = lazy(() => import("./pages/IELTSFlow"));
const MockExamResults = lazy(() => import("./pages/MockExamResults"));
const Community = lazy(() => import("./pages/Community"));
const Institutional = lazy(() => import("./pages/Institutional"));
const Syllabus = lazy(() => import("./pages/Syllabus"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Concierge = lazy(() => import("./pages/Concierge"));
const ConsultantDashboard = lazy(() => import("./pages/ConsultantDashboard"));
const ConsultantActivation = lazy(() => import("./pages/ConsultantActivation"));
const ConsultantApply = lazy(() => import("./pages/ConsultantApply"));
const ConciergeApply = lazy(() => import("./pages/ConciergeApply"));
const ConciergeUpgrade = lazy(() => import("./pages/ConciergeUpgrade"));
const CommunityUpgrade = lazy(() => import("./pages/CommunityUpgrade"));
const ApplicationDetail = lazy(() => import("./pages/ApplicationDetail"));
const StudentApplicationStatus = lazy(() => import("./pages/StudentApplicationStatus"));
const GetAdmission = lazy(() => import("./pages/GetAdmission"));
const ConsultantApplicationReview = lazy(() => import("./pages/ConsultantApplicationReview"));
const ConsultantApplicationChat = lazy(() => import("./pages/ConsultantApplicationChat"));
const ConsultantApplicationOffer = lazy(() => import("./pages/ConsultantApplicationOffer"));

const queryClient = new QueryClient();

// Loading Fallback
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-muted-foreground font-medium animate-pulse">Loading ITALOSTUDY...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AIProvider>
        <ExamProvider>
          <TooltipProvider>
            <NetworkStatus />
            <Toaster />
            <Sonner />
            <VercelAnalytics />
            <BrowserRouter>
              <SecurityEnforcer />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />

                  {/* Protected Routes */}
                  <Route path="/onboarding" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Onboarding /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Dashboard /></ProtectedRoute>} />
                  <Route path="/community" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Community /></ProtectedRoute>} />
                  <Route path="/community/upgrade" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><CommunityUpgrade /></ProtectedRoute>} />
                  <Route path="/subjects" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Subjects /></ProtectedRoute>} />
                  <Route path="/practice" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Practice /></ProtectedRoute>} />
                  <Route path="/mock-exams" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MockExams /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Analytics /></ProtectedRoute>} />
                  <Route path="/admin" element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  } />
                  <Route path="/waiting-room/:sessionId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><InternationalMockWaitingRoom /></ProtectedRoute>} />
                  <Route path="/test/:testId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Test /></ProtectedRoute>} />
                  <Route path="/results/:testId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Results /></ProtectedRoute>} />
                  <Route path="/history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><History /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Settings /></ProtectedRoute>} />
                  <Route path="/bookmarks" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Bookmarks /></ProtectedRoute>} />

                  {/* Public Pages */}
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/institutional" element={<Institutional />} />
                  <Route path="/syllabus" element={<Syllabus />} />
                  <Route path="/method" element={<Method />} />
                  <Route path="/get-admission" element={<GetAdmission />} />

                  {/* Study Modules */}
                  <Route path="/exams/imat" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ExamIMAT /></ProtectedRoute>} />
                  <Route path="/exams/cent-s" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ExamCENTS /></ProtectedRoute>} />
                  <Route path="/learning" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Learning /></ProtectedRoute>} />
                  <Route path="/reading/:testId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ReadingTest /></ProtectedRoute>} />
                  <Route path="/reading/history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ReadingHistory /></ProtectedRoute>} />
                  <Route path="/reading/results/:submissionId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ReadingResult /></ProtectedRoute>} />
                  <Route path="/listening/:testId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ListeningTest /></ProtectedRoute>} />
                  <Route path="/listening/history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ListeningHistory /></ProtectedRoute>} />
                  <Route path="/listening/results/:submissionId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ListeningResult /></ProtectedRoute>} />
                  <Route path="/writing/:taskId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><WritingTest /></ProtectedRoute>} />
                  <Route path="/writing/history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><WritingHistory /></ProtectedRoute>} />
                  <Route path="/writing/results/:submissionId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><WritingTest /></ProtectedRoute>} />
                  <Route path="/speaking" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><SpeakingLobby /></ProtectedRoute>} />
                  <Route path="/speaking/history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><SpeakingHistory /></ProtectedRoute>} />
                  <Route path="/speaking/:sessionId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><SpeakingSession /></ProtectedRoute>} />
                  <Route path="/ielts-flow/:sessionId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><IELTSFlow /></ProtectedRoute>} />
                  <Route path="/mock-results/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MockExamResults /></ProtectedRoute>} />
                  <Route path="/start-test" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><StartTest /></ProtectedRoute>} />
                  <Route path="/labs" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Labs /></ProtectedRoute>} />

                  {/* Apply University Upgrade Page */}
                  <Route path="/apply-university/upgrade" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ConciergeUpgrade /></ProtectedRoute>} />

                  <Route path="/apply-university" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Concierge /></ProtectedRoute>} />
                  <Route path="/consultant/activate" element={<ConsultantActivation />} />
                  <Route path="/consultant/apply" element={<ConsultantApply />} />
                  <Route path="/consultant/dashboard" element={<ProtectedRoute allowedRoles={['consultant', 'admin']}><ConsultantDashboard /></ProtectedRoute>} />

                  {/* Student Application Wizard */}
                  <Route path="/apply-university/status/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><StudentApplicationStatus /></ProtectedRoute>} />
                  <Route path="/apply-university/apply" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ConciergeApply /></ProtectedRoute>} />
                  <Route path="/apply-university/apply/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ConciergeApply /></ProtectedRoute>} />
                  <Route path="/apply-university/application/:id" element={<ProtectedRoute allowedRoles={['consultant', 'admin', 'user']}><ApplicationDetail /></ProtectedRoute>} />

                  {/* Consultant Specific Application Pages */}
                  <Route path="/consultant/application/:id" element={<ProtectedRoute allowedRoles={['consultant', 'admin']}><ConsultantApplicationReview /></ProtectedRoute>} />
                  <Route path="/consultant/application/:id/chat" element={<ProtectedRoute allowedRoles={['consultant', 'admin']}><ConsultantApplicationChat /></ProtectedRoute>} />
                  <Route path="/consultant/application/:id/offer" element={<ProtectedRoute allowedRoles={['consultant', 'admin']}><ConsultantApplicationOffer /></ProtectedRoute>} />

                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ExamProvider>
      </AIProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
