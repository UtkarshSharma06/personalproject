import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import EditableText from '@/components/cms/EditableText';
import { usePageContent } from '@/hooks/usePageContent';

const ExamCountdown = () => {
    const { getField } = usePageContent('landing-global');
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Dynamic target date from CMS
    const targetDateStr = getField('exam_countdown_date', '2026-04-15T09:00:00');
    const TARGET_DATE = new Date(targetDateStr).getTime();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = TARGET_DATE - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [TARGET_DATE]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center gap-6 px-8 py-3 bg-slate-900/5 backdrop-blur-md border border-slate-200 rounded-3xl shadow-sm mx-auto"
        >
            <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                    <EditableText fieldKey="exam_countdown_label" fallback="Session 1 Countdown" />
                </span>
            </div>

            <div className="flex gap-4">
                {[
                    { label: 'D', value: timeLeft.days },
                    { label: 'H', value: timeLeft.hours },
                    { label: 'M', value: timeLeft.minutes },
                    { label: 'S', value: timeLeft.seconds }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <span className="text-xl font-black text-slate-900 leading-none">
                            {item.value.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">{item.label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ExamCountdown;
