import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import PWNavbar from '@/components/home/PWNavbar';
import Footer from '@/components/Footer';

const LAST_UPDATED = 'July 1, 2026';

interface Section {
    number: number;
    color: string;
    bg: string;
    title: string;
}

const sections: Section[] = [
    { number: 1,  color: 'text-indigo-600',  bg: 'bg-indigo-100',  title: 'Information We Collect' },
    { number: 2,  color: 'text-blue-600',    bg: 'bg-blue-100',    title: 'How We Use Your Data' },
    { number: 3,  color: 'text-rose-600',    bg: 'bg-rose-100',    title: 'Camera & Proctored Exams' },
    { number: 4,  color: 'text-violet-600',  bg: 'bg-violet-100',  title: 'AI & Performance Processing' },
    { number: 5,  color: 'text-green-600',   bg: 'bg-green-100',   title: 'Data Sovereignty & Account Deletion' },
    { number: 6,  color: 'text-amber-600',   bg: 'bg-amber-100',   title: 'Third-Party Services & Billing' },
    { number: 7,  color: 'text-cyan-600',    bg: 'bg-cyan-100',    title: 'Cookies & Tracking Technologies' },
    { number: 8,  color: 'text-teal-600',    bg: 'bg-teal-100',    title: 'Data Security' },
    { number: 9,  color: 'text-purple-600',  bg: 'bg-purple-100',  title: 'Children\'s Privacy' },
    { number: 10, color: 'text-slate-600',   bg: 'bg-slate-100',   title: 'Contact Us' },
];

function SectionBadge({ s }: { s: Section }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <span className={`w-8 h-8 rounded-full ${s.bg} ${s.color} flex items-center justify-center text-sm font-black flex-shrink-0`}>
                {s.number}
            </span>
            <h2 className="text-[20px] font-bold text-slate-900">{s.title}</h2>
        </div>
    );
}

function Ul({ items }: { items: string[] }) {
    return (
        <ul className="space-y-2 my-4">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                </li>
            ))}
        </ul>
    );
}

export default function Privacy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
            <SEO
                title="Privacy Policy | ItaloStudy"
                description="Read ItaloStudy's Privacy Policy. Learn exactly how we collect, use, and protect your data, including our strict client-side proctoring rules and account deletion procedures."
            />

            <PWNavbar />

            <main className="flex-1 w-full max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-20">

                {/* Header */}
                <div className="mb-10">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Legal · Privacy</p>
                    <h1 className="text-[32px] md:text-[40px] font-bold text-slate-900 leading-tight mb-4 font-fam-bold">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-500 text-[15px]">Last updated: {LAST_UPDATED}</p>
                </div>

                {/* Table of Contents */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-12">
                    <p className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-4">Contents</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                        {sections.map(s => (
                            <a
                                key={s.number}
                                href={`#section-${s.number}`}
                                className="text-[13px] text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
                            >
                                <span className="text-[11px] font-black text-slate-300">{String(s.number).padStart(2, '0')}</span>
                                {s.title}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="space-y-12 text-[15px] leading-[1.8] text-slate-600">

                    {/* Intro */}
                    <p>
                        At ItaloStudy, we respect your privacy and believe in total transparency regarding your data. This Privacy Policy explains what information we collect, why we collect it, and the strict boundaries we set on how it is used.
                    </p>

                    <hr className="border-slate-100" />

                    {/* 1 */}
                    <section id="section-1">
                        <SectionBadge s={sections[0]} />
                        <p className="mb-3">
                            When you register and use ItaloStudy, we collect the bare minimum information required to operate the platform and communicate with you. This includes:
                        </p>
                        <Ul items={[
                            'Account Details: Your email address, mobile number, and display name.',
                            'Academic Profile: Your target exams (e.g., IMAT, CEnT-S) to personalize your dashboard.',
                            'Usage Data: Your practice session results, mock exam scores, and time spent on questions.',
                        ]} />
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-4">
                            <p className="font-bold text-indigo-800 text-[14px] uppercase tracking-wide mb-1">Strict Contact-Only Policy</p>
                            <p className="text-indigo-900 text-[14px]">
                                We collect your email address and mobile number <strong className="font-bold">for communication and account security purposes only</strong> (such as password resets, purchase receipts, and important platform updates). We <strong className="font-bold">never</strong> sell your contact details or use your personalized data, profile picture, or phone number to serve you third-party advertisements.
                            </p>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 2 */}
                    <section id="section-2">
                        <SectionBadge s={sections[1]} />
                        <p className="mb-3">
                            We use your data strictly to improve your educational experience and our platform functionality.
                        </p>
                        <Ul items={[
                            'To track your personal progress and display your learning analytics.',
                            'To process your subscription payments securely.',
                            'To provide customer support and respond to technical issues.',
                        ]} />
                    </section>

                    <hr className="border-slate-100" />

                    {/* 3 */}
                    <section id="section-3">
                        <SectionBadge s={sections[2]} />
                        <p className="mb-3">
                            To ensure a realistic exam environment, ItaloStudy offers "Proctored Mock Exams" that may request access to your device's camera.
                        </p>
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
                            <p className="font-bold text-rose-800 text-[14px] uppercase tracking-wide mb-1">100% Client-Side Processing</p>
                            <p className="text-rose-900">
                                Proctored mocks are completely processed <strong className="font-bold">on your device (client-side)</strong>. We <strong>do not record video, we do not take pictures, and we do not transmit or save any visual data to our servers</strong>. The camera access is strictly used in real-time by your local browser to detect motion or tab-switching, acting solely as a focus enforcement tool during the test. Once the test ends, the video feed disappears instantly.
                            </p>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 4 */}
                    <section id="section-4">
                        <SectionBadge s={sections[3]} />
                        <p className="mb-3">
                            We use anonymized practice sessions and statistical data (such as which questions users get wrong most often) to refine our platform.
                        </p>
                        <Ul items={[
                            'By analyzing aggregate, anonymous data, we can adjust question difficulty, fix errors, and build better study resources for all students.',
                            'Your individual, identifiable academic data is never shared publicly or with other users.',
                        ]} />
                    </section>

                    <hr className="border-slate-100" />

                    {/* 5 */}
                    <section id="section-5">
                        <SectionBadge s={sections[4]} />
                        <p className="mb-3">
                            Your data belongs to you. We have built our platform so you have full control over your information.
                        </p>
                        <Ul items={[
                            'You can update or correct your profile information at any time from your Account Settings.',
                            'You have the right to request a copy of your personal data.',
                        ]} />
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mt-4">
                            <p className="font-bold text-green-800 text-[14px] uppercase tracking-wide mb-1">Account Deletion Requests</p>
                            <p className="text-green-900 text-[14px]">
                                To request the deletion of your account and personal data, please email <strong className="font-bold">contact@italostudy.com</strong> from the email address associated with your account. For security reasons, we will verify your identity before processing the request. Please note that we may be legally required to retain certain transactional data (such as past billing records) for tax and compliance purposes.
                            </p>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 6 */}
                    <section id="section-6">
                        <SectionBadge s={sections[5]} />
                        <p className="mb-3">
                            We use trusted, enterprise-grade third-party services to operate the platform. We only share the absolute minimum data required for these services to function:
                        </p>
                        <Ul items={[
                            'Database & Authentication: Hosted on Supabase, ensuring enterprise-grade encryption.',
                            'Payments: Processed securely by Stripe, Dodo Payments, PayPal, or Razorpay. We do not store or process your credit card numbers on our servers.',
                            'Hosting: Our application is securely hosted on Vercel.',
                        ]} />
                    </section>

                    <hr className="border-slate-100" />

                    {/* 7 */}
                    <section id="section-7">
                        <SectionBadge s={sections[6]} />
                        <p className="mb-3">
                            ItaloStudy uses standard cookies and local storage tokens strictly to maintain your logged-in session, remember your preferences (like Dark Mode), and ensure platform security. 
                        </p>
                        <p>
                            We may use basic analytics tools (like Google Analytics) to understand generic site traffic, but we explicitly opt out of invasive cross-site advertising networks. We do not track you across the internet.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 8 */}
                    <section id="section-8">
                        <SectionBadge s={sections[7]} />
                        <p className="mb-3">
                            We protect your information using industry-standard security measures, including:
                        </p>
                        <Ul items={[
                            'End-to-end SSL/TLS encryption for all data transmitted between your device and our servers.',
                            'Encryption-at-rest for sensitive database fields.',
                            'Row Level Security (RLS) policies to ensure users can only access their own data.',
                        ]} />
                    </section>

                    <hr className="border-slate-100" />

                    {/* 9 */}
                    <section id="section-9">
                        <SectionBadge s={sections[8]} />
                        <p>
                            ItaloStudy is designed for students preparing for university entrance exams. We do not knowingly collect personal information from children under the age of 13. If you are under 16, you must obtain parental consent before using our platform. If we become aware that we have collected data from a child under 13 without verifiable parental consent, we will delete that information immediately.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 10 */}
                    <section id="section-10">
                        <SectionBadge s={sections[9]} />
                        <p className="mb-6">
                            If you have questions about your privacy, wish to exercise your data rights, or want to report a security concern, please contact us:
                        </p>
                        <div className="bg-slate-900 rounded-2xl p-7 text-white">
                            <p className="font-bold text-lg mb-1">ItaloStudy</p>
                            <p className="text-slate-400 text-[14px] mb-4">Independent educational technology platform</p>
                            <a
                                href="mailto:contact@italostudy.com?subject=Privacy Enquiry"
                                className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-[14px] px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                ✉ contact@italostudy.com
                            </a>
                            <div className="mt-5 pt-5 border-t border-slate-700 flex flex-wrap gap-4 text-[13px] text-slate-400">
                                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                                <a href="/refund" className="hover:text-white transition-colors">Refund Policy</a>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
