import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { useTheme } from "next-themes";
import { lazy, Suspense, useEffect, useState } from "react";
import SecurityEnforcer from "@/components/SecurityEnforcer";

import { ExamProvider } from "@/context/ExamContext";
import { AIProvider } from "@/context/AIContext";
import OneSignal from 'onesignal-cordova-plugin';
import { Device } from '@capacitor/device';
import { PremiumSplashScreen } from "@/mobile/components/PremiumSplashScreen";
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { StatusBar, Style } from '@capacitor/status-bar';

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
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
const Contact = lazy(() => import("./pages/Contact"));
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
const StudentProfile = lazy(() => import("./pages/StudentProfile"));
const DownloadApp = lazy(() => import("./pages/DownloadApp"));
const AnnouncementBar = lazy(() => import("./components/AnnouncementBar"));

const Resources = lazy(() => import("./pages/Resources"));

const MobileIndex = lazy(() => import("./mobile/pages/MobileIndex"));
const MobileAuth = lazy(() => import("./mobile/pages/MobileAuth"));
const MobileDashboard = lazy(() => import("./mobile/pages/MobileDashboard"));
const MobilePractice = lazy(() => import("./mobile/pages/MobilePractice"));
const MobileAnalytics = lazy(() => import("./mobile/pages/MobileAnalytics"));
const MobileResults = lazy(() => import("./mobile/pages/MobileResults"));
const MobileStartTest = lazy(() => import("./mobile/pages/MobileStartTest"));
const MobileOnboarding = lazy(() => import("./mobile/pages/MobileOnboarding"));
const MobilePricing = lazy(() => import("./mobile/pages/MobilePricing"));
const MobileSubjects = lazy(() => import("./mobile/pages/MobileSubjects"));
const MobileLearning = lazy(() => import("./mobile/pages/MobileLearning"));
const MobileCommunity = lazy(() => import("./mobile/pages/MobileCommunity"));
const MobileCommunityUpgrade = lazy(() => import("./mobile/pages/MobileCommunityUpgrade"));
const MobileSettings = lazy(() => import("./mobile/pages/MobileSettings"));
const MobileTest = lazy(() => import("./mobile/pages/MobileTest"));
const MobileHistory = lazy(() => import("./mobile/pages/MobileHistory"));
const MobileMockExams = lazy(() => import("./mobile/pages/MobileMockExams"));
const MobileLabs = lazy(() => import("./mobile/pages/MobileLabs"));
const MobileConcierge = lazy(() => import("./mobile/pages/MobileConcierge"));
const MobileConciergeApply = lazy(() => import("./mobile/pages/MobileConciergeApply"));
const MobileStudentApplicationStatus = lazy(() => import("./mobile/pages/MobileStudentApplicationStatus"));
const MobileContact = lazy(() => import("./mobile/pages/MobileContact"));
const MobileMockWaitingRoom = lazy(() => import("./mobile/pages/MobileMockWaitingRoom"));
const MobileSectionedTest = lazy(() => import("./mobile/pages/MobileSectionedTest"));
const MobileStudentProfile = lazy(() => import("./mobile/pages/MobileStudentProfile"));
const MobileNotifications = lazy(() => import("./mobile/pages/MobileNotifications"));
const MobileResources = lazy(() => import("./mobile/pages/MobileResources"));
const MobileBookmarks = lazy(() => import("./mobile/pages/MobileBookmarks"));
const MobileLayout = lazy(() => import("./mobile/components/MobileLayout"));
const MobileIELTSPlayer = lazy(() => import("./mobile/pages/MobileIELTSPlayer"));
const MobileSpeakingLobby = lazy(() => import("./mobile/pages/MobileSpeakingLobby"));
const MobileSpeakingSession = lazy(() => import("./mobile/pages/MobileSpeakingSession"));
import { AppUpdateChecker } from "./mobile/components/AppUpdateChecker";

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

const WebRouter = () => (
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
    <Route path="/test/:testId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Test /></ProtectedRoute>} />
    <Route path="/results/:testId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Results /></ProtectedRoute>} />
    <Route path="/history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><History /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Settings /></ProtectedRoute>} />
    <Route path="/bookmarks" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Bookmarks /></ProtectedRoute>} />
    <Route path="/resources" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><Resources /></ProtectedRoute>} />

    {/* Public Pages */}
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/institutional" element={<Institutional />} />
    <Route path="/syllabus" element={<Syllabus />} />
    <Route path="/method" element={<Method />} />
    <Route path="/get-admission" element={<GetAdmission />} />
    <Route path="/waiting-room/:sessionId" element={<InternationalMockWaitingRoom />} />

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

    <Route path="/student/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><StudentProfile /></ProtectedRoute>} />
    <Route path="/download-app" element={<DownloadApp />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const MobileRouter = () => (
  <AppUpdateChecker>
    <Routes>
      <Route path="/" element={<MobileIndex />} />
      <Route path="/auth" element={<MobileAuth />} />

      <Route element={<MobileLayout />}>
        {/* Premium Custom Mobile Pages */}
        <Route path="/mobile/dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin']}><MobileDashboard /></ProtectedRoute>} />
        <Route path="/mobile/practice" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobilePractice /></ProtectedRoute>} />
        <Route path="/mobile/analytics" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileAnalytics /></ProtectedRoute>} />
        <Route path="/mobile/settings" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileSettings /></ProtectedRoute>} />
        <Route path="/mobile/student/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileStudentProfile /></ProtectedRoute>} />
        <Route path="/mobile/notifications" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileNotifications /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileSettings /></ProtectedRoute>} />

        {/* Coverage for all other features */}
        <Route path="/onboarding" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileOnboarding /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileResources /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileCommunity /></ProtectedRoute>} />
        <Route path="/community/upgrade" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileCommunityUpgrade /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileSubjects /></ProtectedRoute>} />
        <Route path="/pricing" element={<MobilePricing />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/learning/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileLearning /></ProtectedRoute>} />
        <Route path="/mock-exams" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileMockExams /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileHistory /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileBookmarks /></ProtectedRoute>} />

        {/* History Synced to Mobile History */}
        <Route path="/reading/history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileHistory /></ProtectedRoute>} />
        <Route path="/listening/history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileHistory /></ProtectedRoute>} />
        <Route path="/writing/history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileHistory /></ProtectedRoute>} />

        {/* IELTS & Exam Specifics */}
        <Route path="/exams/imat" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ExamIMAT /></ProtectedRoute>} />
        <Route path="/exams/cent-s" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ExamCENTS /></ProtectedRoute>} />

        {/* Consultant & University (Mobile Native) */}
        <Route path="/apply-university" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileConcierge /></ProtectedRoute>} />
        <Route path="/apply-university/status/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileStudentApplicationStatus /></ProtectedRoute>} />

        <Route path="/get-admission" element={<GetAdmission />} />
        <Route path="/consultant/dashboard" element={<ProtectedRoute allowedRoles={['consultant', 'admin']}><ConsultantDashboard /></ProtectedRoute>} />
        <Route path="/apply-university/upgrade" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><ConciergeUpgrade /></ProtectedRoute>} />

        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/mobile/dashboard" replace />} />
        <Route path="/practice" element={<Navigate to="/mobile/practice" replace />} />
        <Route path="/analytics" element={<Navigate to="/mobile/analytics" replace />} />
      </Route>

      {/* Immersive Mobile Experiences (Outside shared layout) */}
      <Route path="/labs" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileLabs /></ProtectedRoute>} />
      <Route path="/test/:testId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileTest /></ProtectedRoute>} />
      <Route path="/sectioned-test/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileSectionedTest /></ProtectedRoute>} />
      <Route path="/results/:testId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileResults /></ProtectedRoute>} />
      <Route path="/mock-results/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileResults /></ProtectedRoute>} />
      <Route path="/waiting-room/:sessionId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileMockWaitingRoom /></ProtectedRoute>} />
      <Route path="/start-test" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileStartTest /></ProtectedRoute>} />
      <Route path="/reading/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileIELTSPlayer /></ProtectedRoute>} />
      <Route path="/listening/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileIELTSPlayer /></ProtectedRoute>} />
      <Route path="/writing/:taskId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileIELTSPlayer /></ProtectedRoute>} />
      <Route path="/speaking" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileSpeakingLobby /></ProtectedRoute>} />
      <Route path="/speaking/:sessionId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileSpeakingSession /></ProtectedRoute>} />
      <Route path="/ielts-flow/:sessionId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><IELTSFlow /></ProtectedRoute>} />
      <Route path="/apply-university/apply" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileConciergeApply /></ProtectedRoute>} />
      <Route path="/apply-university/apply/:id" element={<ProtectedRoute allowedRoles={['user', 'admin', 'consultant']}><MobileConciergeApply /></ProtectedRoute>} />

      <Route path="/institutional" element={<Institutional />} />
      <Route path="/syllabus" element={<Syllabus />} />
      <Route path="/method" element={<Method />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<MobileContact />} />

      {/* Consultant & Application Parity */}
      <Route path="/apply-university/application/:id" element={<ProtectedRoute allowedRoles={['consultant', 'admin', 'user']}><ApplicationDetail /></ProtectedRoute>} />
      <Route path="/consultant/application/:id" element={<ProtectedRoute allowedRoles={['consultant', 'admin']}><ConsultantApplicationReview /></ProtectedRoute>} />
      <Route path="/consultant/application/:id/chat" element={<ProtectedRoute allowedRoles={['consultant', 'admin']}><ConsultantApplicationChat /></ProtectedRoute>} />
      <Route path="/consultant/application/:id/offer" element={<ProtectedRoute allowedRoles={['consultant', 'admin']}><ConsultantApplicationOffer /></ProtectedRoute>} />
      <Route path="/consultant/activate" element={<ConsultantActivation />} />
      <Route path="/consultant/apply" element={<ConsultantApply />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </AppUpdateChecker>
);


const App = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const { setTheme } = useTheme();

  useEffect(() => {
    const checkPlatform = async () => {
      try {
        const info = await Device.getInfo();
        const isNative = info.platform === 'android' || info.platform === 'ios';
        const isSmallScreen = window.innerWidth < 768;

        setIsMobile(isNative || isSmallScreen);

        if (isNative) {
          setTheme('dark');
          // Hide status bar and set overlay
          await StatusBar.hide();
          await StatusBar.setOverlaysWebView({ overlay: true });
          await StatusBar.setStyle({ style: Style.Dark });
        } else {
          setTheme('light');
        }
      } catch (e) {
        console.error("Native Setup Error", e);
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkPlatform();
  }, []);


  const OneSignalManager = () => {
    const { user } = useAuth();

    useEffect(() => {
      const initOneSignal = async () => {
        const info = await Device.getInfo();
        if (info.platform !== 'android' && info.platform !== 'ios') return;

        try {
          console.log("OneSignal: Initializing with ID: 36b31128-46ae-4b7c-a5ab-b4c483327a59");
          OneSignal.initialize("36b31128-46ae-4b7c-a5ab-b4c483327a59");

          // Request permission immediately on launch for Android 13+
          setTimeout(async () => {
            console.log("OneSignal: Requesting permissions...");
            await OneSignal.Notifications.requestPermission(true);
          }, 1000);

        } catch (e) {
          console.error("OneSignal Error:", e);
        }
      };

      initOneSignal();
    }, []);

    // Link Supabase User ID to OneSignal External ID
    useEffect(() => {
      const syncExternalId = async () => {
        const info = await Device.getInfo();
        if (info.platform !== 'android' && info.platform !== 'ios') return;

        if (user?.id) {
          console.log("OneSignal: Syncing External ID:", user.id);
          OneSignal.login(user.id);
        } else {
          console.log("OneSignal: Logging out/Removing External ID");
          OneSignal.logout();
        }
      };

      syncExternalId();
    }, [user?.id]);

    return null;
  };



  if (showSplash && isMobile !== false) { // Show premium splash on mobile/init
    return <PremiumSplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (isMobile === null) return <PageLoader />;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OneSignalManager />
        <AIProvider>
          <ExamProvider>
            <TooltipProvider>
              <NetworkStatus />
              <Toaster />
              <Sonner />
              {isMobile ? (
                <HashRouter>
                  <SecurityEnforcer />
                  <Suspense fallback={<PageLoader />}>
                    <MobileRouter />
                  </Suspense>
                </HashRouter>
              ) : (
                <BrowserRouter>
                  <SecurityEnforcer />
                  <Suspense fallback={<PageLoader />}>
                    <WebRouter />
                  </Suspense>
                </BrowserRouter>
              )}
            </TooltipProvider>
          </ExamProvider>
        </AIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
