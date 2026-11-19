import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import EditableText from "@/components/cms/EditableText";
import { usePageContent } from "@/hooks/usePageContent";

interface CTASectionProps {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    fieldKeyPrefix?: string;
    targetUrl?: string;
}

const CTASection = ({
    title = "Ready to Ace the CENT-S 2027?",
    subtitle = "Practice with real exam-level questions and get instant performance insights.",
    buttonText = "Start Free Mock Test",
    fieldKeyPrefix = "cta",
    targetUrl
}: CTASectionProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getField } = usePageContent();

    const handleCTAClick = () => {
        if (targetUrl) {
            if (targetUrl.startsWith('http')) {
                window.location.href = targetUrl;
            } else {
                navigate(targetUrl);
            }
            return;
        }

        const path = (location.pathname || '').toLowerCase();
        if (path.includes('imat')) {
            navigate('/imat-mock');
            return;
        }
        if (path.includes('tolc')) {
            navigate('/tolc-mock-test-free-2026');
            return;
        }
        if (path.includes('cent-s') || path.includes('cents')) {
            navigate('/cent-s-mock');
            return;
        }

        // Default: Seamless signup flow with intent and UTM parameters preserved
        window.location.href = "https://app.italostudy.com/auth?redirect=/mock-exams&utm_source=seo&utm_medium=cta_section&utm_campaign=mock_test";
    };

    return (
        <Card className="p-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-none shadow-xl my-12 overflow-hidden relative rounded-3xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={120} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <EditableText fieldKey={`${fieldKeyPrefix}_title`} as="h2" className="text-3xl font-bold mb-4">
                        {getField(`${fieldKeyPrefix}_title`, title)}
                    </EditableText>
                    <EditableText fieldKey={`${fieldKeyPrefix}_subtitle`} multiline as="p" className="text-indigo-100 text-lg max-w-xl">
                        {getField(`${fieldKeyPrefix}_subtitle`, subtitle)}
                    </EditableText>
                </div>
                <Button
                    onClick={handleCTAClick}
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-lg px-8 py-6 h-auto shadow-lg group transition-all duration-300 transform hover:scale-105"
                >
                    <EditableText fieldKey={`${fieldKeyPrefix}_button`} as="span">
                        {getField(`${fieldKeyPrefix}_button`, buttonText)}
                    </EditableText>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </Card>
    );
};

export default CTASection;
