import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, MapPin, Send, Loader2 } from 'lucide-react';
import PWNavbar from '@/components/home/PWNavbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData(e.currentTarget);
        // Add your Web3Forms Access Key here. You can get one for free at https://web3forms.com/
        formData.append("access_key", "233e892d-050a-4d81-86cd-c72cd92934d5");
        // Optional: Subject for the email notification
        formData.append("subject", "New Contact Submission from ItaloStudy");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setIsSubmitting(false);
                setIsSubmitted(true);
            } else {
                console.error("Form submission failed", data);
                setIsSubmitting(false);
                alert("Something went wrong. Please try emailing us directly.");
            }
        } catch (error) {
            console.error("Error submitting form", error);
            setIsSubmitting(false);
            alert("Something went wrong. Please try emailing us directly.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <SEO 
                title="Contact Us | ItaloStudy" 
                description="Get in touch with the ItaloStudy team. We're here to help you with your Italian university entrance exam preparation."
            />
            
            <PWNavbar />

            {/* Main Content */}
            <main className="flex-1 pt-24 pb-16 lg:pt-32 lg:pb-24">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight"
                        >
                            Get in Touch
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-600"
                        >
                            Have questions about our courses or studying in Italy? Our team is here to help you every step of the way.
                        </motion.p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-start">
                        
                        {/* Contact Info Cards - Takes up 2 columns */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            <a 
                                href="mailto:contact@italostudy.com"
                                className="group flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#5A4BDA] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#5A4BDA] transition-colors">
                                    <Mail className="w-6 h-6 text-[#5A4BDA] group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Email Us</h3>
                                    <p className="text-slate-600 mb-2">Our friendly team is here to help.</p>
                                    <span className="text-[#5A4BDA] font-medium">contact@italostudy.com</span>
                                </div>
                            </a>

                            <a 
                                href="https://chat.whatsapp.com/JZxQCS4A4ZO8k7bOEMYtTz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#25D366] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366] transition-colors">
                                    <MessageCircle className="w-6 h-6 text-[#25D366] group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">WhatsApp Community</h3>
                                    <p className="text-slate-600 mb-2">Join our active student group.</p>
                                    <span className="text-[#25D366] font-medium">Join Group Invite</span>
                                </div>
                            </a>

                            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Location</h3>
                                    <p className="text-slate-600">
                                        Proudly supporting students globally, with expert guidance for Italian universities.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form - Takes up 3 columns */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-3"
                        >
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 lg:p-10 relative overflow-hidden">
                                
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-indigo-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
                                
                                <h2 className="text-2xl font-bold text-slate-900 mb-8 relative z-10">Send us a message</h2>
                                
                                {isSubmitted ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative z-10 flex flex-col items-center justify-center py-12 text-center h-full min-h-[400px]"
                                    >
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                            <Send className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-4">Thanks for contacting us!</h3>
                                        <p className="text-lg text-slate-600 max-w-sm">
                                            Our team will respond to you via email within 24 hours.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    id="name" 
                                                    name="name"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A4BDA] focus:border-transparent transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    id="email" 
                                                    name="email"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A4BDA] focus:border-transparent transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
                                            <input 
                                                type="text" 
                                                id="subject" 
                                                name="topic"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A4BDA] focus:border-transparent transition-all"
                                                placeholder="How can we help you?"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                                            <textarea 
                                                id="message" 
                                                name="message"
                                                rows={5}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A4BDA] focus:border-transparent transition-all resize-none"
                                                placeholder="Tell us more about your inquiry..."
                                            ></textarea>
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full py-4 px-6 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 bg-[#5A4BDA] hover:bg-[#4a3bca] hover:shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
