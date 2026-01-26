import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MessageCircle, MapPin, Send, Phone, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function MobileContact() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: t('contact.sent_success', "Message Sent"),
                description: t('contact.sent_desc', "We'll get back to you shortly.")
            });
            navigate(-1);
        }, 1500);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background pb-10">
            {/* Header */}
            <header className="px-6 py-6 flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-xl z-20">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-secondary/20">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-xl font-black uppercase tracking-tight">{t('contact.title', 'Get in Touch')}</h1>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('contact.subtitle', 'We are here to help')}</p>
                </div>
            </header>

            <div className="px-6 space-y-8 flex-1 overflow-y-auto">
                {/* Contact Cards */}
                <div className="grid gap-4">
                    <motion.a
                        href="mailto:support@italostudy.com"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-5 p-5 bg-card rounded-[2rem] border border-border/40 shadow-lg active:scale-95 transition-all"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-tight">Email Support</h3>
                            <p className="text-xs text-muted-foreground font-medium">support@italostudy.com</p>
                        </div>
                    </motion.a>

                    <motion.a
                        href="https://wa.me/1234567890" // Replace with real number
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-5 p-5 bg-card rounded-[2rem] border border-border/40 shadow-lg active:scale-95 transition-all"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-tight">WhatsApp</h3>
                            <p className="text-xs text-muted-foreground font-medium">Chat with an Advisor</p>
                        </div>
                    </motion.a>
                </div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card p-6 rounded-[2.5rem] border border-border/40 shadow-xl space-y-6"
                >
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                            {t('contact.subject', 'Subject')}
                        </label>
                        <Input placeholder="How can we help?" className="h-14 rounded-2xl bg-secondary/20 border-border/10 text-base font-semibold" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                            {t('contact.message', 'Message')}
                        </label>
                        <Textarea placeholder="Type your details here..." className="min-h-[120px] rounded-2xl bg-secondary/20 border-border/10 text-base font-medium resize-none p-4" />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-16 rounded-[1.5rem] bg-heading text-background font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all"
                    >
                        {isSubmitting ? t('common.sending', 'Sending...') : t('contact.send', 'Send Message')} <Send size={16} className="ml-2" />
                    </Button>
                </motion.div>

                {/* Info Footer */}
                <div className="text-center space-y-4 pt-4 pb-8 opacity-60">
                    <div className="flex justify-center gap-6">
                        <a href="#" className="p-3 bg-secondary/30 rounded-full hover:bg-secondary/50 transition-colors"><Globe size={18} /></a>
                        <a href="#" className="p-3 bg-secondary/30 rounded-full hover:bg-secondary/50 transition-colors"><Phone size={18} /></a>
                        <a href="#" className="p-3 bg-secondary/30 rounded-full hover:bg-secondary/50 transition-colors"><MapPin size={18} /></a>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Milan • Rome • Online
                    </p>
                </div>
            </div>
        </div>
    );
}
