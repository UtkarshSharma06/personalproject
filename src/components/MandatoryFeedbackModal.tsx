import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Star, Send, Bug, ThumbsUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface MandatoryFeedbackModalProps {
    onComplete: () => void;
}

const FEATURES = [
    'Practice Tests',
    'Mock Exams',
    'Analytics',
    'Learning Modules',
    'Speaking Practice',
    'Reading Practice',
    'Writing Practice',
    'Listening Practice'
];

export function MandatoryFeedbackModal({ onComplete }: MandatoryFeedbackModalProps) {
    const { user } = useAuth();
    const { toast } = useToast();

    // Existing fields
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [majorQuestions, setMajorQuestions] = useState('');
    const [suggestions, setSuggestions] = useState('');

    // New detailed fields
    const [contentQualityRating, setContentQualityRating] = useState(0);
    const [explanationAccuracyRating, setExplanationAccuracyRating] = useState(0);
    const [navigationEaseRating, setNavigationEaseRating] = useState(0);
    const [performanceRating, setPerformanceRating] = useState(0);
    const [featuresUsed, setFeaturesUsed] = useState<string[]>([]);
    const [mostUsefulFeature, setMostUsefulFeature] = useState('');
    const [likedMost, setLikedMost] = useState('');
    const [frustrations, setFrustrations] = useState('');
    const [bugsExperienced, setBugsExperienced] = useState(false);
    const [bugDetails, setBugDetails] = useState('');
    const [npsScore, setNpsScore] = useState(5);
    const [npsReason, setNpsReason] = useState('');
    const [likelihoodToContinue, setLikelihoodToContinue] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const wordCount = review.trim().split(/\s+/).filter(Boolean).length;
    const maxWords = 100;

    const toggleFeature = (feature: string) => {
        setFeaturesUsed(prev =>
            prev.includes(feature)
                ? prev.filter(f => f !== feature)
                : [...prev, feature]
        );
    };

    const RatingStars = ({ value, onChange, label }: { value: number; onChange: (val: number) => void; label: string }) => {
        const [hovered, setHovered] = useState(0);
        return (
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{label}</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => onChange(star)}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            className="transition-all hover:scale-110"
                        >
                            <Star
                                className={cn(
                                    "w-8 h-8 transition-all",
                                    (hovered >= star || value >= star)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-slate-300"
                                )}
                            />
                        </button>
                    ))}
                    {value > 0 && <span className="ml-2 text-sm font-bold text-slate-600 self-center">{value}/5</span>}
                </div>
            </div>
        );
    };

    const handleSubmit = async () => {
        if (!user) return;

        if (rating === 0) {
            toast({ title: 'Rating Required', description: 'Please select an overall star rating', variant: 'destructive' });
            return;
        }

        if (wordCount > maxWords) {
            toast({ title: 'Review Too Long', description: `Please limit your review to ${maxWords} words`, variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);

        try {
            const { error: feedbackError } = await supabase
                .from('feedback')
                .insert([{
                    user_id: user.id,
                    rating,
                    review: review.trim() || null,
                    major_questions: majorQuestions.trim() || null,
                    suggestions: suggestions.trim() || null,
                    category: 'general',
                    status: 'pending',
                    // New fields
                    content_quality_rating: contentQualityRating || null,
                    explanation_accuracy_rating: explanationAccuracyRating || null,
                    navigation_ease_rating: navigationEaseRating || null,
                    performance_rating: performanceRating || null,
                    features_used: featuresUsed.length > 0 ? featuresUsed : null,
                    most_useful_feature: mostUsefulFeature || null,
                    liked_most: likedMost.trim() || null,
                    frustrations: frustrations.trim() || null,
                    bugs_experienced: bugsExperienced,
                    bug_details: bugDetails.trim() || null,
                    nps_score: npsScore,
                    nps_reason: npsReason.trim() || null,
                    likelihood_to_continue: likelihoodToContinue || null
                }]);

            if (feedbackError) throw feedbackError;

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ has_submitted_initial_feedback: true })
                .eq('id', user.id);

            if (profileError) throw profileError;

            toast({ title: 'Thank You!', description: 'Your feedback has been submitted successfully.' });
            onComplete();
        } catch (error: any) {
            toast({ title: 'Submission Failed', description: error.message, variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl m-4">
                {/* Mandatory Notice */}
                <div className="px-8 pt-6 pb-3">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border-2 border-amber-200">
                        <span className="text-sm font-black text-amber-900 uppercase tracking-widest text-center">
                            ⚠️ Mandatory Submit to Make Platform Better
                        </span>
                    </div>
                </div>

                {/* Header */}
                <div className="px-8 pb-6 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                We Need Your Detailed Feedback!
                            </h2>
                            <p className="text-sm text-slate-600 font-medium mt-1">
                                Help us improve by answering these questions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                    {/* 1. Overall Rating */}
                    <div className="space-y-3 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Star className="w-4 h-4" /> Overall Experience *
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-all hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        className={cn(
                                            "w-12 h-12 transition-all",
                                            (hoveredRating >= star || rating >= star)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-slate-300"
                                        )}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-3 text-sm font-bold text-slate-600 self-center">
                                    {rating} / 5 {rating === 5 ? '🎉' : rating >= 4 ? '😊' : rating >= 3 ? '🙂' : '😐'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 2. Content Quality Ratings */}
                    <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <ThumbsUp className="w-5 h-5" /> Content Quality
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <RatingStars value={contentQualityRating} onChange={setContentQualityRating} label="Practice Questions Quality" />
                            <RatingStars value={explanationAccuracyRating} onChange={setExplanationAccuracyRating} label="Explanations Accuracy" />
                        </div>
                    </div>

                    {/* 3. Features Used */}
                    <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100">
                        <h3 className="text-lg font-black text-slate-900">Which Features Have You Used?</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {FEATURES.map(feature => (
                                <label key={feature} className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        checked={featuresUsed.includes(feature)}
                                        onCheckedChange={() => toggleFeature(feature)}
                                    />
                                    <span className="text-sm font-medium text-slate-700">{feature}</span>
                                </label>
                            ))}
                        </div>

                        {featuresUsed.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Most Useful Feature</label>
                                <Select value={mostUsefulFeature} onValueChange={setMostUsefulFeature}>
                                    <SelectTrigger className="rounded-xl border-2">
                                        <SelectValue placeholder="Select the most useful feature" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {featuresUsed.map(feature => (
                                            <SelectItem key={feature} value={feature}>{feature}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* 4. User Experience */}
                    <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100">
                        <h3 className="text-lg font-black text-slate-900">User Experience</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">
                                    What Did You Like Most?
                                </label>
                                <Textarea
                                    value={likedMost}
                                    onChange={(e) => setLikedMost(e.target.value)}
                                    placeholder="Tell us what you enjoyed..."
                                    className="min-h-[80px] rounded-xl border-2"
                                />
                            </div>

                            <RatingStars value={navigationEaseRating} onChange={setNavigationEaseRating} label="Navigation Ease" />

                            <div>
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">
                                    What Was Frustrating or Confusing?
                                </label>
                                <Textarea
                                    value={frustrations}
                                    onChange={(e) => setFrustrations(e.target.value)}
                                    placeholder="Help us understand pain points..."
                                    className="min-h-[80px] rounded-xl border-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5. Performance & Bugs */}
                    <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-100">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Performance & Bugs
                        </h3>
                        <RatingStars value={performanceRating} onChange={setPerformanceRating} label="Platform Speed/Performance" />

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={bugsExperienced}
                                    onCheckedChange={(checked) => setBugsExperienced(checked as boolean)}
                                />
                                <span className="text-sm font-bold text-slate-700">I experienced bugs or errors</span>
                            </label>

                            {bugsExperienced && (
                                <Textarea
                                    value={bugDetails}
                                    onChange={(e) => setBugDetails(e.target.value)}
                                    placeholder="Please describe the bugs you encountered..."
                                    className="min-h-[100px] rounded-xl border-2"
                                />
                            )}
                        </div>
                    </div>

                    {/* 6. Review */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                Detailed Review
                            </label>
                            <span className={cn(
                                "text-xs font-bold",
                                wordCount > maxWords ? "text-red-600" : "text-slate-400"
                            )}>
                                {wordCount} / {maxWords} words
                            </span>
                        </div>
                        <Textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your overall experience..."
                            className="min-h-[120px] rounded-xl border-2"
                        />
                    </div>

                    {/* 7. Questions */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">
                            Questions or Concerns
                        </label>
                        <Textarea
                            value={majorQuestions}
                            onChange={(e) => setMajorQuestions(e.target.value)}
                            placeholder="Any questions about features, content, or functionality?"
                            className="min-h-[80px] rounded-xl border-2"
                        />
                    </div>

                    {/* 8. Suggestions */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">
                            Suggestions for Improvement
                        </label>
                        <Textarea
                            value={suggestions}
                            onChange={(e) => setSuggestions(e.target.value)}
                            placeholder="What features or improvements would you like to see?"
                            className="min-h-[80px] rounded-xl border-2"
                        />
                    </div>

                    {/* 9. NPS Score */}
                    <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100">
                        <h3 className="text-lg font-black text-slate-900">Would You Recommend Us?</h3>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                On a scale of 0-10, how likely are you to recommend this platform?
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold">Not Likely</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={npsScore}
                                    onChange={(e) => setNpsScore(parseInt(e.target.value))}
                                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-200"
                                    style={{
                                        background: `linear-gradient(to right, #ef4444 0%, #facc15 50%, #22c55e 100%)`
                                    }}
                                />
                                <span className="text-xs font-bold">Very Likely</span>
                                <span className="ml-2 text-2xl font-black text-indigo-600 min-w-[40px]">{npsScore}</span>
                            </div>
                            <Textarea
                                value={npsReason}
                                onChange={(e) => setNpsReason(e.target.value)}
                                placeholder="Why or why not?"
                                className="min-h-[60px] rounded-xl border-2"
                            />
                        </div>
                    </div>

                    {/* 10. Future Use */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">
                            Likelihood to Continue Using
                        </label>
                        <Select value={likelihoodToContinue} onValueChange={setLikelihoodToContinue}>
                            <SelectTrigger className="rounded-xl border-2">
                                <SelectValue placeholder="Select your likelihood..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="very-likely">Very Likely - I love it!</SelectItem>
                                <SelectItem value="likely">Likely - It's useful</SelectItem>
                                <SelectItem value="neutral">Neutral - Not sure yet</SelectItem>
                                <SelectItem value="unlikely">Unlikely - Missing features</SelectItem>
                                <SelectItem value="very-unlikely">Very Unlikely - Not for me</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Submit Button - Fixed at bottom */}
                <div className="p-8 border-t border-slate-200 bg-slate-50">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || rating === 0 || wordCount > maxWords}
                        className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-base uppercase tracking-widest shadow-lg disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 mr-2" />
                                Submit Detailed Feedback
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
