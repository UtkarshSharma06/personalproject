import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Camera,
  Mic,
  Maximize,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';

interface ProctoringSetupProps {
  onPermissionsGranted: () => Promise<boolean>;
  onEnterFullscreen: () => Promise<boolean>;
  onStartExam: () => void;
  cameraAllowed: boolean;
  microphoneAllowed: boolean;
  isFullscreen: boolean;
  videoStream: MediaStream | null;
  isGenerating?: boolean;
}

const EXAM_RULES = [
  'Camera and microphone must remain ON throughout the exam',
  'Your face must remain visible at all times',
  'No mobile phones, books, notes, or second screens allowed',
  'No talking or external voices during the exam',
  'No screen switching or tab switching',
  'Leaving fullscreen mode will result in a warning',
  'Repeated violations will result in automatic disqualification',
];

export default function ProctoringSetup({
  onPermissionsGranted,
  onEnterFullscreen,
  onStartExam,
  cameraAllowed,
  microphoneAllowed,
  isFullscreen,
  videoStream,
  isGenerating = false,
}: ProctoringSetupProps) {
  const [step, setStep] = useState<'rules' | 'permissions' | 'ready'>('rules');
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [noMobileConfirm, setNoMobileConfirm] = useState(false);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Connect video stream to video element when ready
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream, step]);

  const handleAcceptRules = () => {
    if (acceptedRules && noMobileConfirm) {
      setStep('permissions');
    }
  };

  const handleRequestPermissions = async () => {
    setIsRequestingPermissions(true);
    const granted = await onPermissionsGranted();
    setIsRequestingPermissions(false);
    
    if (granted) {
      // Wait a bit then request fullscreen
      setTimeout(async () => {
        const fullscreenGranted = await onEnterFullscreen();
        if (fullscreenGranted) {
          setStep('ready');
        }
      }, 500);
    }
  };

  const allPermissionsGranted = cameraAllowed && microphoneAllowed && isFullscreen;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Exam Proctoring Setup</h2>
              <p className="text-sm text-muted-foreground">
                {step === 'rules' && 'Review exam rules and guidelines'}
                {step === 'permissions' && 'Grant required permissions'}
                {step === 'ready' && 'Ready to begin exam'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 'rules' && (
            <div className="space-y-6">
              {/* Rules list */}
              <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Important Exam Rules</h3>
                    <p className="text-sm text-muted-foreground">
                      Please read carefully. Violations may result in disqualification.
                    </p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {EXAM_RULES.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-warning font-medium">{index + 1}.</span>
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Confirmations */}
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={acceptedRules}
                    onCheckedChange={(checked) => setAcceptedRules(checked === true)}
                    className="mt-1"
                  />
                  <span className="text-sm text-foreground">
                    I have read and understood all the exam rules. I agree to follow them and accept that violations may result in disqualification.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={noMobileConfirm}
                    onCheckedChange={(checked) => setNoMobileConfirm(checked === true)}
                    className="mt-1"
                  />
                  <div className="flex items-start gap-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm text-foreground">
                      I confirm that I do not have any mobile phone, secondary device, or unauthorized materials within reach.
                    </span>
                  </div>
                </label>
              </div>

              <Button
                className="w-full gradient-primary text-primary-foreground"
                size="lg"
                disabled={!acceptedRules || !noMobileConfirm}
                onClick={handleAcceptRules}
              >
                Continue to Permissions
              </Button>
            </div>
          )}

          {step === 'permissions' && (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Please grant the following permissions to proceed with the exam:
              </p>

              {/* Permission status */}
              <div className="space-y-3">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  cameraAllowed
                    ? 'bg-success/10 border-success/30'
                    : 'bg-secondary/50 border-border'
                }`}>
                  <div className="flex items-center gap-3">
                    <Camera className={`w-5 h-5 ${cameraAllowed ? 'text-success' : 'text-muted-foreground'}`} />
                    <span className="font-medium">Camera Access</span>
                  </div>
                  {cameraAllowed ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  microphoneAllowed
                    ? 'bg-success/10 border-success/30'
                    : 'bg-secondary/50 border-border'
                }`}>
                  <div className="flex items-center gap-3">
                    <Mic className={`w-5 h-5 ${microphoneAllowed ? 'text-success' : 'text-muted-foreground'}`} />
                    <span className="font-medium">Microphone Access</span>
                  </div>
                  {microphoneAllowed ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isFullscreen
                    ? 'bg-success/10 border-success/30'
                    : 'bg-secondary/50 border-border'
                }`}>
                  <div className="flex items-center gap-3">
                    <Maximize className={`w-5 h-5 ${isFullscreen ? 'text-success' : 'text-muted-foreground'}`} />
                    <span className="font-medium">Fullscreen Mode</span>
                  </div>
                  {isFullscreen ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              <Button
                className="w-full gradient-primary text-primary-foreground"
                size="lg"
                onClick={handleRequestPermissions}
                disabled={isRequestingPermissions || allPermissionsGranted}
              >
                {isRequestingPermissions ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Requesting Permissions...
                  </span>
                ) : allPermissionsGranted ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    All Permissions Granted
                  </span>
                ) : (
                  'Grant Permissions'
                )}
              </Button>
            </div>
          )}

          {step === 'ready' && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Ready to Begin</h3>
                <p className="text-muted-foreground">
                  All permissions have been granted. Your exam session is being monitored.
                  Click below to start your exam.
                </p>
              </div>

              {/* Live Camera preview */}
              <div className="aspect-video bg-secondary/50 rounded-xl overflow-hidden relative">
                {videoStream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <Camera className="w-8 h-8 animate-pulse" />
                  </div>
                )}
                <p className="absolute bottom-2 left-2 text-xs text-foreground bg-background/80 px-2 py-1 rounded">
                  Camera Preview Active
                </p>
              </div>

              <Button
                className="w-full gradient-primary text-primary-foreground shadow-soft"
                size="lg"
                onClick={onStartExam}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Preparing Exam...
                  </span>
                ) : (
                  'I Agree & Start Exam'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
