import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ViolationType {
  type: 'tab_switch' | 'window_blur' | 'fullscreen_exit' | 'devtools' | 'multiple_faces' | 'no_face' | 'mobile_detected' | 'audio_detected';
  severity: 'warning' | 'critical' | 'terminal';
  description: string;
}

interface UseProctoringProps {
  testId: string;
  userId: string;
  enabled: boolean;
  onDisqualify: () => void;
}

interface ProctoringState {
  cameraAllowed: boolean;
  microphoneAllowed: boolean;
  isFullscreen: boolean;
  violationCount: number;
  isDisqualified: boolean;
}

const MAX_WARNINGS = 3;

export function useProctoring({ testId, userId, enabled, onDisqualify }: UseProctoringProps) {
  const { toast } = useToast();
  const [state, setState] = useState<ProctoringState>({
    cameraAllowed: false,
    microphoneAllowed: false,
    isFullscreen: false,
    violationCount: 0,
    isDisqualified: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Log violation to database
  const logViolation = useCallback(async (violation: ViolationType) => {
    if (!enabled || state.isDisqualified) return;

    const newCount = state.violationCount + 1;
    setState(prev => ({ ...prev, violationCount: newCount }));

    // Insert violation record
    await supabase.from('proctoring_violations').insert({
      test_id: testId,
      user_id: userId,
      violation_type: violation.type,
      severity: violation.severity,
      description: violation.description,
    });

    // Update test violation count
    await supabase
      .from('tests')
      .update({ violation_count: newCount })
      .eq('id', testId);

    // Handle based on severity
    if (violation.severity === 'terminal') {
      handleDisqualify(violation.description);
      return;
    }

    if (newCount >= MAX_WARNINGS) {
      handleDisqualify('Maximum violations exceeded');
      return;
    }

    // Show warning
    toast({
      title: violation.severity === 'critical' ? '⚠️ Critical Warning' : '⚠️ Warning',
      description: `${violation.description} (${newCount}/${MAX_WARNINGS} warnings)`,
      variant: 'destructive',
    });
  }, [enabled, state.violationCount, state.isDisqualified, testId, userId, toast]);

  const handleDisqualify = useCallback(async (reason: string) => {
    setState(prev => ({ ...prev, isDisqualified: true }));

    // Update test status
    await supabase
      .from('tests')
      .update({
        proctoring_status: 'disqualified',
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', testId);

    toast({
      title: '🚫 Exam Terminated',
      description: reason,
      variant: 'destructive',
    });

    // Stop media streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    onDisqualify();
  }, [testId, toast, onDisqualify]);

  // Request camera/microphone permissions
  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      streamRef.current = stream;
      setState(prev => ({
        ...prev,
        cameraAllowed: true,
        microphoneAllowed: true,
      }));

      return true;
    } catch (error) {
      console.error('Permission denied:', error);
      toast({
        title: 'Permissions Required',
        description: 'Camera and microphone access is required for mock exams.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Fullscreen management
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setState(prev => ({ ...prev, isFullscreen: true }));
      return true;
    } catch (error) {
      console.error('Fullscreen failed:', error);
      return false;
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setState(prev => ({ ...prev, isFullscreen: false }));
  }, []);

  // Set video element reference
  const setVideoElement = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && streamRef.current) {
      element.srcObject = streamRef.current;
    }
  }, []);

  // Monitor for violations
  useEffect(() => {
    if (!enabled) return;

    // Tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation({
          type: 'tab_switch',
          severity: 'warning',
          description: 'Tab switched or minimized',
        });
      }
    };

    // Window blur
    const handleWindowBlur = () => {
      logViolation({
        type: 'window_blur',
        severity: 'warning',
        description: 'Window lost focus',
      });
    };

    // Fullscreen change
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && state.isFullscreen) {
        setState(prev => ({ ...prev, isFullscreen: false }));
        logViolation({
          type: 'fullscreen_exit',
          severity: 'critical',
          description: 'Exited fullscreen mode',
        });
      }
    };

    // DevTools detection (basic)
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        logViolation({
          type: 'devtools',
          severity: 'critical',
          description: 'Developer tools detected',
        });
      }
    };

    // Keyboard shortcuts
    const handleKeydown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        logViolation({
          type: 'devtools',
          severity: 'warning',
          description: 'Attempted to open developer tools',
        });
      }
    };

    // Right-click prevention
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', detectDevTools);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', detectDevTools);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [enabled, state.isFullscreen, logViolation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    ...state,
    requestPermissions,
    enterFullscreen,
    exitFullscreen,
    setVideoElement,
    logViolation,
    videoStream: streamRef.current,
  };
}
