import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star, Send, MessageSquare, Lightbulb, HelpCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export function FeedbackDialog() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [review, setReview] = useState('');
    const [majorQuestions, setMajorQuestions] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [category, setCategory] = useState('general');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const wordCount = review.trim().split(/\s+/).filter(Boolean).length;
    const maxWords = 100;

    const handleSubmit = async () => {
        if (!user) {
            toast({ title: 'Error', description: 'Please sign in to submit feedback', variant: 'destructive' });
            return;
        }

        if (rating === 0) {
            toast({ title: 'Rating Required', description: 'Please select a rating', variant: 'destructive' });
            return;
        }

        if (wordCount > maxWords) {
            toast({ title: 'Review Too Long', description: `Please limit your review to ${maxWords} words`, variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('feedback')
                .insert([{
                    user_id: user.id,
                    rating,
                    review: review.trim() || null,
                    major_questions: majorQuestions.trim() || null,
                    suggestions: suggestions.trim() || null,
                    category
                }]);

            if (error) throw error;

            toast({
                title: 'Feedback Submitted!',
                description: 'Thank you for helping us improve.',
            });

            // Reset form
            setRating(0);
            setReview('');
            setMajorQuestions('');
            setSuggestions('');
            setCategory('general');
            setIsOpen(false);
        } catch (error: any) {
            toast({
                title: 'Submission Failed',
                description: error.message,
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        { value: 'general', label: 'General Feedback', icon: MessageSquare },
        { value: 'feature', label: 'Feature Request', icon: Lightbulb },
        { value: 'bug', label: 'Bug Report', icon: HelpCircle },
        { value: 'content', label: 'Content Quality', icon: Star },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="h-10 px-4 rounded-xl border-2 border-slate-200 dark:border-border hover:border-indigo-600 hover:bg-indigo-50 font-bold text-sm transition-all group"
                >
                    <MessageSquare className="w-4 h-4 mr-2 group-hover:text-indigo-600 transition-colors" />
                    Give Feedback
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
                <DialogHeader className="p-8 pb-6 border-b border-slate-100 dark:border-border bg-gradient-to-br from-indigo-50 to-purple-50">
                    <DialogTitle className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        Share Your Feedback
                    </DialogTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                        Help us improve your learning experience
                    </p>
                </DialogHeader>

                <div className="p-8 space-y-6">
                    {/* Rating Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                            Overall Rating *
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
                                            "w-10 h-10 transition-all",
                                            (hoveredRating >= star || rating >= star)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-slate-300"
                                        )}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-3 text-sm font-bold text-slate-600 dark:text-slate-400 self-center">
                                    {rating} / 5 {rating === 5 ? '🎉' : rating >= 4 ? '😊' : rating >= 3 ? '🙂' : '😐'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                            Feedback Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setCategory(value)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border-2 transition-all font-bold text-sm",
                                        category === value
                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                            : "border-slate-200 dark:border-border hover:border-slate-300 text-slate-600 dark:text-slate-400"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                                Your Review
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
                            placeholder="Share your experience with the platform..."
                            className="min-h-[120px] rounded-xl border-2 border-slate-200 dark:border-border focus:border-indigo-600 resize-none font-medium"
                        />
                    </div>

                    {/* Major Questions */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-indigo-600" />
                            Major Questions or Concerns
                        </label>
                        <Textarea
                            value={majorQuestions}
                            onChange={(e) => setMajorQuestions(e.target.value)}
                            placeholder="Any questions about features, content, or functionality?"
                            className="min-h-[80px] rounded-xl border-2 border-slate-200 dark:border-border focus:border-indigo-600 resize-none font-medium"
                        />
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-indigo-600" />
                            Suggestions for Improvement
                        </label>
                        <Textarea
                            value={suggestions}
                            onChange={(e) => setSuggestions(e.target.value)}
                            placeholder="What features or improvements would you like to see?"
                            className="min-h-[80px] rounded-xl border-2 border-slate-200 dark:border-border focus:border-indigo-600 resize-none font-medium"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={() => setIsOpen(false)}
                            variant="outline"
                            className="flex-1 h-12 rounded-xl border-2 border-slate-200 dark:border-border hover:border-slate-900 font-black text-sm uppercase tracking-widest"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || rating === 0 || wordCount > maxWords}
                            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm uppercase tracking-widest shadow-lg disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Feedback
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
