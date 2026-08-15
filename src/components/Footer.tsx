import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { motion } from 'framer-motion';
import { Instagram, MessageCircle, Linkedin } from 'lucide-react';
import { imatLinks, centsLinks, studyItalyLinks } from '@/lib/nav-links';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export default function Footer() {
    const { t } = useTranslation();

    const footerColumns = [
        {
            title: 'Company',
            links: [
                { label: 'About Us', path: '/about' },
                { label: 'Blog & News', path: '/blog' },
                { label: 'Marketplace', path: 'https://store.italostudy.com' },
                { label: 'Pricing Plans', path: '/pricing' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'Status', path: '/status' }
            ]
        },
        {
            title: 'CENT-S 2026',
            links: centsLinks.slice(0, 6)
        },
        {
            title: 'IMAT 2026',
            links: imatLinks.slice(0, 6)
        },
        {
            title: 'Study in Italy',
            links: studyItalyLinks.slice(0, 6)
        }
    ];

    return (
        <footer className="py-12 bg-[#fcfcfc] border-t border-[#eaeaea] relative z-10 overflow-hidden text-left">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col items-start gap-5 shrink-0">
                        <Link to="/" className="notranslate block shrink-0" translate="no">
                            <img
                                src="/logo.webp"
                                alt="Italostudy Logo"
                                className="h-8 w-auto object-contain notranslate"
                                translate="no"
                                width="140"
                                height="35"
                                loading="lazy"
                            />
                        </Link>
                        <p className="text-[13px] text-[#555555] max-w-xs leading-relaxed">
                            Empowering students for Italian entrance exams with expert-led preparation and strategic guidance for success.
                        </p>
                        <div className="flex gap-3">
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://www.instagram.com/italostudycom"
                                className="w-10 h-10 rounded-[4px] bg-white flex items-center justify-center text-[#555555] hover:text-[#5a4bda] transition-all border border-[#eaeaea] shadow-sm hover:border-[#5a4bda]/30"
                            >
                                <Instagram className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://chat.whatsapp.com/JZxQCS4A4ZO8k7bOEMYtTz"
                                className="w-10 h-10 rounded-[4px] bg-white flex items-center justify-center text-[#555555] hover:text-[#25D366] transition-all border border-[#eaeaea] shadow-sm hover:border-[#25D366]/30"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://www.linkedin.com/company/italostudy"
                                className="w-10 h-10 rounded-[4px] bg-white flex items-center justify-center text-[#555555] hover:text-[#0077b5] transition-all border border-[#eaeaea] shadow-sm hover:border-[#0077b5]/30"
                            >
                                <Linkedin className="w-5 h-5" />
                            </motion.a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {footerColumns.map((column) => (
                        <div key={column.title} className="flex flex-col gap-4">
                            <h4 className="text-[14px] font-bold text-[#333333] mb-2">
                                {column.title}
                            </h4>
                            <ul className="flex flex-col gap-2.5">
                                {column.links.map((link, idx) => (
                                    <li key={idx}>
                                        {link.path ? (
                                            (() => {
                                                const staticPaths = [
                                                    '/resources', '/cent-s-exam-preparation-book-pdf', '/status', '/roadmap', '/updates', 
                                                    '/method', '/imat', '/cent-s', '/exams', '/blog', 
                                                    '/cent-s-mock', '/imat-mock', '/it', '/tr'
                                                ];
                                                const isStatic = staticPaths.includes(link.path.split('?')[0]);
                                                const isExternal = link.path.startsWith('http');

                                                return (isExternal || isStatic) ? (
                                                    <a
                                                        href={link.path}
                                                        target={isExternal ? "_blank" : undefined}
                                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                                        className="text-[13px] text-[#555555] hover:text-[#5a4bda] transition-colors"
                                                    >
                                                        {link.label}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        to={link.path}
                                                        className="text-[13px] text-[#555555] hover:text-[#5a4bda] transition-colors"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                );
                                            })()
                                        ) : (
                                            <button
                                                onClick={link.action}
                                                className="text-[13px] text-[#555555] hover:text-[#5a4bda] transition-colors text-left"
                                            >
                                                {link.label}
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-[#eaeaea] flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center lg:items-start gap-1">
                        <p className="text-[13px] text-[#888888]">
                            © {new Date().getFullYear()} ITALOSTUDY EDUCATION TECHNOLOGIES. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-2">
                            <Link to="/privacy" className="text-[13px] text-[#888888] hover:text-[#5a4bda] transition-colors">Privacy</Link>
                            <Link to="/terms" className="text-[13px] text-[#888888] hover:text-[#5a4bda] transition-colors">Terms</Link>
                            <Link to="/refund" className="text-[13px] text-[#888888] hover:text-[#5a4bda] transition-colors">Refunds</Link>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                        {['visa', 'mastercard', 'amex', 'paypal', 'applepay', 'googlepay', 'ideal', 'pix', 'upi', 'cashapp'].map(logo => (
                            <img 
                                key={logo}
                                src={`/payments/${logo}.webp`} 
                                alt={logo} 
                                className="h-4 md:h-5 w-auto object-contain transition-transform hover:scale-110 opacity-90"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
