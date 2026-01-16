import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Practice from "./pages/Practice";
import MockExams from "./pages/MockExams";
import Analytics from "./pages/Analytics";
import Test from "./pages/Test";
import Results from "./pages/Results";
import History from "./pages/History";
import ResetPassword from "./pages/ResetPassword";
import Bookmarks from "./pages/Bookmarks";
import Admin from "./pages/Admin";
import InternationalMockWaitingRoom from "./pages/InternationalMockWaitingRoom";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import ExamIMAT from "./pages/ExamIMAT";
import ExamCENTS from "./pages/ExamCENTS";
import Method from "./pages/Method";
import Learning from "./pages/Learning";
import StartTest from "./pages/StartTest";
import SpeakingLobby from "./pages/speaking/SpeakingLobby";
import SpeakingSession from "./pages/speaking/SpeakingSession";
import ReadingTest from "./pages/reading/ReadingTest";
import ReadingResult from "./pages/reading/ReadingResult";
import ListeningTest from "./pages/listening/ListeningTest";
import ListeningResult from "./pages/listening/ListeningResult";
import WritingTest from "./pages/writing/WritingTest";
import WritingHistory from "@/pages/writing/WritingHistory";
import SpeakingHistory from "@/pages/speaking/SpeakingHistory";
import ReadingHistory from "@/pages/reading/ReadingHistory";
import ListeningHistory from "@/pages/listening/ListeningHistory";
import Settings from "./pages/Settings";
import IELTSFlow from "./pages/IELTSFlow";
import MockExamResults from "./pages/MockExamResults";
import Community from "./pages/Community";
import Institutional from "./pages/Institutional";
import Syllabus from "./pages/Syllabus";
import Onboarding from "./pages/Onboarding";
import Concierge from "./pages/Concierge";
import ConsultantDashboard from "./pages/ConsultantDashboard";
import ConsultantActivation from "./pages/ConsultantActivation";
import ConsultantApply from "./pages/ConsultantApply";
import ConciergeApply from "./pages/ConciergeApply";
import ConciergeUpgrade from "./pages/ConciergeUpgrade";
import CommunityUpgrade from "./pages/CommunityUpgrade";
import ApplicationDetail from "./pages/ApplicationDetail";
import StudentApplicationStatus from "./pages/StudentApplicationStatus";
import GetAdmission from "./pages/GetAdmission";
import SecurityEnforcer from "@/components/SecurityEnforcer";

import { ExamProvider } from "@/context/ExamContext";
import { AIProvider } from "@/context/AIContext";

import NetworkStatus from "@/components/NetworkStatus";
import ConsultantApplicationReview from "./pages/ConsultantApplicationReview";
import ConsultantApplicationChat from "./pages/ConsultantApplicationChat";
import ConsultantApplicationOffer from "./pages/ConsultantApplicationOffer";
import AdminRoute from "@/components/auth/AdminRoute";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AIProvider>
        <ExamProvider>
          <TooltipProvider>
            <NetworkStatus />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SecurityEnforcer />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ExamProvider>
      </AIProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
