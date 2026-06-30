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
    { number: 1,  color: 'text-indigo-600',  bg: 'bg-indigo-100',  title: 'Acceptance of Terms' },
    { number: 2,  color: 'text-blue-600',    bg: 'bg-blue-100',    title: 'About ItaloStudy' },
    { number: 3,  color: 'text-violet-600',  bg: 'bg-violet-100',  title: 'Eligibility & Account Registration' },
    { number: 4,  color: 'text-green-600',   bg: 'bg-green-100',   title: 'Services Provided' },
    { number: 5,  color: 'text-amber-600',   bg: 'bg-amber-100',   title: 'Subscriptions & Billing' },
    { number: 6,  color: 'text-orange-600',  bg: 'bg-orange-100',  title: 'Courses & Digital Products' },
    { number: 7,  color: 'text-fuchsia-600', bg: 'bg-fuchsia-100', title: 'ItaloStudy Store' },
    { number: 8,  color: 'text-rose-600',    bg: 'bg-rose-100',    title: 'Free / Explorer Plan' },
    { number: 9,  color: 'text-teal-600',    bg: 'bg-teal-100',    title: 'AI & Machine Learning Features' },
    { number: 10, color: 'text-cyan-600',    bg: 'bg-cyan-100',    title: 'Academic Integrity' },
    { number: 11, color: 'text-slate-600',   bg: 'bg-slate-100',   title: 'Intellectual Property' },
    { number: 12, color: 'text-red-600',     bg: 'bg-red-100',     title: 'Prohibited Conduct' },
    { number: 13, color: 'text-purple-600',  bg: 'bg-purple-100',  title: 'Account Suspension & Termination' },
    { number: 14, color: 'text-lime-600',    bg: 'bg-lime-100',    title: 'Disclaimer of Warranties' },
    { number: 15, color: 'text-pink-600',    bg: 'bg-pink-100',    title: 'Limitation of Liability' },
    { number: 16, color: 'text-sky-600',     bg: 'bg-sky-100',     title: 'Governing Law & Disputes' },
    { number: 17, color: 'text-emerald-600', bg: 'bg-emerald-100', title: 'Changes to These Terms' },
    { number: 18, color: 'text-gray-600',    bg: 'bg-gray-100',    title: 'Contact Us' },
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
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

export default function Terms() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
            <SEO
                title="Terms of Service | ItaloStudy"
                description="Read the full Terms of Service for ItaloStudy — covering subscriptions, courses, AI features, intellectual property, account rules, and dispute resolution."
            />

            <PWNavbar />

            <main className="flex-1 w-full max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-20">

                {/* Header */}
                <div className="mb-10">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Legal · Platform</p>
                    <h1 className="text-[32px] md:text-[40px] font-bold text-slate-900 leading-tight mb-4 font-fam-bold">
                        Terms of Service
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

                    {/* 1 — Acceptance */}
                    <section id="section-1">
                        <SectionBadge s={sections[0]} />
                        <p className="mb-3">
                            By accessing or using ItaloStudy — including the web application at <strong className="text-slate-900">app.italostudy.com</strong>, the public website at <strong className="text-slate-900">italostudy.com</strong>, or any associated mobile or desktop interface — you confirm that you have read, understood, and agree to be legally bound by these Terms of Service ("Terms").
                        </p>
                        <p>
                            If you do not agree to these Terms in their entirety, you must immediately discontinue use of the platform. Continued use constitutes ongoing acceptance.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 2 — About */}
                    <section id="section-2">
                        <SectionBadge s={sections[1]} />
                        <p className="mb-3">
                            ItaloStudy is an independent educational technology platform. We provide exam preparation services for internationally recognised academic entrance exams, including <strong>IMAT, CEnT-S, SAT, and IELTS</strong>.
                        </p>
                        <p>Our platform includes:</p>
                        <Ul items={[
                            'Expert-crafted practice question banks and mock examinations',
                            'Subject-specific courses and learning bundles',
                            'Downloadable study resources and book PDFs',
                            'AI tutoring and performance analytics',
                            'Community features and study tools',
                            'ItaloStudy Store — physical and digital educational products at store.italostudy.com',
                        ]} />
                    </section>

                    <hr className="border-slate-100" />

                    {/* 3 — Eligibility */}
                    <section id="section-3">
                        <SectionBadge s={sections[2]} />
                        <p className="mb-3">
                            You must be at least <strong className="text-slate-900">16 years of age</strong> to create an account. If you are under 18, you confirm that you have obtained parental or guardian consent before registering.
                        </p>
                        <p className="mb-3">By creating an account, you agree to:</p>
                        <Ul items={[
                            'Provide accurate, complete, and current registration information',
                            'Maintain the security of your password and accept responsibility for all activity under your account',
                            'Immediately notify us of any unauthorised access at contact@italostudy.com',
                            'Not share your account credentials with any third party',
                            'Not create more than one account per person without prior written permission',
                        ]} />
                        <p>
                            Accounts found to be shared or used by multiple individuals may be suspended without notice or refund.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 4 — Services */}
                    <section id="section-4">
                        <SectionBadge s={sections[3]} />
                        <p className="mb-3">
                            ItaloStudy offers a tiered service model:
                        </p>
                        <div className="grid gap-3 mb-4">
                            {[
                                { label: 'Explorer (Free)', desc: 'Limited daily practice questions, one mock attempt, and access to free resources.' },
                                { label: 'Global (Subscription)', desc: 'Unlimited practice, unlimited mock exams, AI explanations, AI tutor, and priority support.' },
                                { label: 'Courses', desc: 'Subject-specific courses sold as one-time purchases with time-limited access (e.g. 180 or 365 days).' },
                                { label: 'Book PDFs & Resources', desc: 'Downloadable digital study materials available for one-time purchase.' },
                                { label: 'ItaloStudy Store', desc: 'Physical and digital educational products available at store.italostudy.com. Operated separately from the main platform.' },
                            ].map((t, i) => (
                                <div key={i} className="border border-slate-100 rounded-xl p-4">
                                    <p className="font-semibold text-slate-900 text-[14px]">{t.label}</p>
                                    <p className="text-slate-500 text-[13px] mt-0.5">{t.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p>
                            We reserve the right to modify, suspend, or discontinue any feature or service at any time with reasonable notice. We are not liable for any loss resulting from changes to the service scope.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 5 — Subscriptions */}
                    <section id="section-5">
                        <SectionBadge s={sections[4]} />
                        <p className="mb-3">
                            Subscriptions are billed on a recurring basis (monthly, quarterly, or annually) depending on the plan you choose. By subscribing, you explicitly authorise ItaloStudy to charge your payment method at the beginning of each billing period.
                        </p>
                        <Ul items={[
                            'Subscriptions auto-renew unless cancelled before the renewal date via Account Settings → Billing.',
                            'Payments are processed by Dodo Payments (international), Razorpay (India/INR), or PayPal. We do not store your card details directly.',
                            'Prices are displayed in EUR by default; regional pricing in INR or other currencies may be shown based on your location.',
                            'Promotional pricing and coupon discounts apply only to the first billing cycle unless otherwise stated.',
                            'Plan downgrades take effect at the end of the current billing period. Upgrades take effect immediately.',
                            'We may update subscription prices with at least 14 days\' notice via email.',
                        ]} />
                        <p>
                            For cancellation and refund terms, please refer to our separate{' '}
                            <a href="/refund" className="text-indigo-600 hover:underline font-medium">Refund & Cancellation Policy</a>.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 6 — Courses */}
                    <section id="section-6">
                        <SectionBadge s={sections[5]} />
                        <p className="mb-3">
                            Courses and course bundles are sold as <strong className="text-slate-900">one-time purchases</strong>. Access is granted for a defined period stated on the product page (e.g. 180 days or 365 days from purchase date).
                        </p>
                        <Ul items={[
                            'Access periods begin immediately upon payment confirmation.',
                            'Access periods are non-extendable unless a system error caused downtime on our end.',
                            'Course content is subject to periodic updates; we do not guarantee that content will remain unchanged for the full access period.',
                            'Bundle purchases are subject to the same rules as individual courses. Bundles cannot be partially refunded.',
                            'Downloading or redistributing course content outside the platform is prohibited.',
                        ]} />
                        <p>
                            Book PDF purchases grant a personal, non-transferable, non-sublicensable licence to use the file for individual study purposes only. Redistribution, resale, or public sharing of any purchased PDF is a violation of our intellectual property rights.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 7 — ItaloStudy Store */}
                    <section id="section-7">
                        <SectionBadge s={sections[6]} />
                        <p className="mb-3">
                            The <strong className="text-slate-900">ItaloStudy Store</strong> (available at{' '}
                            <a href="https://store.italostudy.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">store.italostudy.com</a>)
                            is a separate storefront selling physical and digital educational products including printed books, stationery, revision materials, and downloadable content.
                        </p>
                        <p className="mb-3">By purchasing from the ItaloStudy Store, you agree that:</p>
                        <Ul items={[
                            'Physical product orders are subject to shipping timelines and carrier availability. We are not liable for delays caused by postal services or customs.',
                            'Digital products from the Store are delivered instantly and are non-refundable once downloaded.',
                            'Physical products may be eligible for return or replacement within 14 days of delivery if received damaged or incorrect. Contact us with photographic evidence.',
                            'Store orders are processed separately from your main ItaloStudy subscription and are billed independently.',
                            'Coupons and promotional codes may not be combinable across the Store and the main platform.',
                        ]} />
                        <p>
                            For Store-specific queries, contact us at <strong>contact@italostudy.com</strong> with your order number.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 8 — Free plan */}
                    <section id="section-8">
                        <SectionBadge s={sections[7]} />
                        <p className="mb-3">
                            The Explorer (Free) plan is provided without charge and is subject to usage limits that may change at our discretion. Free plan features include:
                        </p>
                        <Ul items={[
                            'Up to 15 practice questions per day across all subjects',
                            '1 full mock exam attempt (total, not per day)',
                            'Access to free resources in the resource library',
                        ]} />
                        <p>
                            We reserve the right to modify, reduce, or discontinue free-tier features at any time. Free plan users are not entitled to compensation or refund for changes to free features.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 9 — AI */}
                    <section id="section-9">
                        <SectionBadge s={sections[8]} />
                        <p className="mb-3">
                            All practice questions, mock exams, and core study materials on ItaloStudy are <strong className="text-slate-900">100% handcrafted by human academic experts</strong> (students who successfully passed the exams, and university professors teaching related content). We strictly do not use AI to generate questions or study content.
                        </p>
                        <p className="mb-3">
                            However, we do use AI and machine learning systems exclusively for <strong>performance analytics, personalization, and interactive tutoring</strong>. By using these features, you acknowledge:
                        </p>
                        <Ul items={[
                            'Our AI tutor is an interactive guide, but its responses should always be cross-referenced with official syllabi and authoritative sources.',
                            'Predicted scores, difficulty calibrations, and performance analytics are estimates, not guarantees of actual exam results.',
                            'We do not use your personal data to train AI models in a way that identifies you individually; all training data is anonymised.',
                            'AI tutor conversations are logged for quality assurance and safety monitoring purposes.',
                        ]} />
                        <p>
                            ItaloStudy is not responsible for any academic decisions made based on interactions with the AI tutor or predictive analytics.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 10 — Academic Integrity */}
                    <section id="section-10">
                        <SectionBadge s={sections[9]} />
                        <p className="mb-3">
                            ItaloStudy is designed exclusively for individual exam preparation. You agree that you will not use the platform:
                        </p>
                        <Ul items={[
                            'During or in connection with any official, invigilated examination session.',
                            'To obtain, share, or distribute official exam questions sourced from live examinations.',
                            'To assist other candidates in circumventing official examination procedures.',
                            'As a replacement for authorised exam materials or official syllabi.',
                        ]} />
                        <p>
                            Violations of academic integrity may result in immediate account termination and a report to relevant examination authorities where required by law.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 11 — IP */}
                    <section id="section-11">
                        <SectionBadge s={sections[10]} />
                        <p className="mb-3">
                            All content on the ItaloStudy platform — including but not limited to question banks, mock exam papers, AI explanations, course videos, book PDFs, user interface designs, branding, and proprietary algorithms — is the exclusive intellectual property of ItaloStudy.
                        </p>
                        <Ul items={[
                            'You may not reproduce, copy, distribute, scrape, or create derivative works from any platform content without prior written consent.',
                            'You may not use any ItaloStudy branding, trademarks, or logos without authorisation.',
                            'Automated scraping of questions, answers, or explanations via bots or scripts is strictly prohibited and constitutes a breach of these Terms.',
                            'Content you submit on the platform (e.g. feedback, bug reports) grants us a non-exclusive, royalty-free licence to use it for platform improvement.',
                        ]} />
                    </section>

                    <hr className="border-slate-100" />

                    {/* 12 — Prohibited */}
                    <section id="section-12">
                        <SectionBadge s={sections[11]} />
                        <p className="mb-3">You agree not to engage in any of the following on or through ItaloStudy:</p>
                        <Ul items={[
                            'Attempting to gain unauthorised access to other users\' accounts or platform infrastructure',
                            'Uploading malware, viruses, or any code designed to disrupt platform functionality',
                            'Reverse engineering, decompiling, or attempting to extract source code from the platform',
                            'Impersonating any person or entity, including ItaloStudy staff',
                            'Creating fake accounts, bot accounts, or using automation to manipulate usage metrics',
                            'Posting offensive, discriminatory, or harmful content in any community features',
                            'Using the platform for commercial purposes without our written permission (e.g. tutoring businesses reselling access)',
                            'Circumventing payment systems, account limits, or access restrictions',
                        ]} />
                    </section>

                    <hr className="border-slate-100" />

                    {/* 13 — Termination */}
                    <section id="section-13">
                        <SectionBadge s={sections[12]} />
                        <p className="mb-3">
                            We reserve the right to suspend or terminate your account at any time, with or without notice, if we reasonably believe you have:
                        </p>
                        <Ul items={[
                            'Violated any section of these Terms',
                            'Engaged in fraudulent, abusive, or harmful behaviour toward the platform or other users',
                            'Attempted to reverse engineer, scrape, or exploit platform systems',
                            'Provided false information during registration or payment',
                            'Initiated a chargeback or payment dispute without first contacting our support team',
                        ]} />
                        <p className="mb-3">
                            Upon termination:
                        </p>
                        <Ul items={[
                            'Your access to all platform features will be revoked immediately.',
                            'Any remaining subscription time is forfeited and is not subject to a refund if the termination was due to a Terms violation.',
                            'Data associated with your account may be retained for legal, fraud prevention, or audit purposes.',
                        ]} />
                        <p>
                            You may delete your own account at any time from Account Settings. Account deletion does not automatically entitle you to a refund.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 14 — Disclaimer */}
                    <section id="section-14">
                        <SectionBadge s={sections[13]} />
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-4">
                            <p>
                                ItaloStudy is provided on an <strong className="text-slate-900">"as is" and "as available" basis</strong>. We make no warranties, express or implied, regarding the platform's fitness for a particular purpose, uninterrupted availability, or freedom from errors.
                            </p>
                        </div>
                        <Ul items={[
                            'We do not guarantee that the platform will be available 100% of the time. Scheduled maintenance and unexpected downtime may occur.',
                            'We do not guarantee any specific improvement in exam scores or academic outcomes as a result of using ItaloStudy.',
                            'AI-generated content is provided without warranty of accuracy. It should not be used as the sole basis for academic decisions.',
                            'Third-party integrations (payment gateways, AI APIs, cloud providers) are subject to their own availability and terms.',
                        ]} />
                    </section>

                    <hr className="border-slate-100" />

                    {/* 15 — Liability */}
                    <section id="section-15">
                        <SectionBadge s={sections[14]} />
                        <p className="mb-3">
                            To the maximum extent permitted by applicable law, ItaloStudy, and its officers, employees, and agents shall not be liable for:
                        </p>
                        <Ul items={[
                            'Any indirect, incidental, consequential, or punitive damages arising from your use of the platform',
                            'Loss of data, loss of revenue, or academic loss arising from platform downtime or service interruption',
                            'Exam failure or academic outcomes resulting from reliance on platform content',
                            'Unauthorised access to your account by third parties due to your failure to maintain account security',
                            'Issues caused by third-party services including payment gateways, internet service providers, or device software',
                        ]} />
                        <p>
                            In no event will our total liability to you exceed the amount you paid us in the <strong className="text-slate-900">12 months preceding the claim</strong>.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 16 — Governing Law */}
                    <section id="section-16">
                        <SectionBadge s={sections[15]} />
                        <p className="mb-3">
                            These Terms are governed by and construed in accordance with the laws of <strong className="text-slate-900">Italy</strong>, without regard to conflict of law principles. Any dispute arising from or relating to these Terms or the platform shall first be attempted to be resolved through good-faith negotiation.
                        </p>
                        <p className="mb-3">
                            If informal resolution fails, disputes will be submitted to the exclusive jurisdiction of the courts of <strong className="text-slate-900">Milan, Italy</strong>. Users in the European Union retain the right to use the EU Online Dispute Resolution platform at{' '}
                            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">ec.europa.eu/consumers/odr</a>.
                        </p>
                        <p>
                            These Terms do not affect any statutory rights you may have under the consumer protection laws of your country of residence.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 17 — Changes */}
                    <section id="section-17">
                        <SectionBadge s={sections[16]} />
                        <p className="mb-3">
                            We may update these Terms at any time. When material changes are made, we will:
                        </p>
                        <Ul items={[
                            'Update the "Last updated" date at the top of this page',
                            'Send an email notification to registered users if the changes materially affect their rights',
                            'Show an in-app notification for active subscribers',
                        ]} />
                        <p>
                            Your continued use of the platform after the effective date of revised Terms constitutes your acceptance of those changes. If you do not agree to updated Terms, you must stop using the platform and may close your account.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 18 — Contact */}
                    <section id="section-18">
                        <SectionBadge s={sections[17]} />
                        <p className="mb-6">
                            If you have any questions, concerns, or legal enquiries regarding these Terms, please contact us:
                        </p>
                        <div className="bg-slate-900 rounded-2xl p-7 text-white">
                            <p className="font-bold text-lg mb-1">ItaloStudy</p>
                            <p className="text-slate-400 text-[14px] mb-4">Independent educational technology platform</p>
                            <a
                                href="mailto:contact@italostudy.com"
                                className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-[14px] px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                ✉ contact@italostudy.com
                            </a>
                            <div className="mt-5 pt-5 border-t border-slate-700 flex flex-wrap gap-4 text-[13px] text-slate-400">
                                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="/refund" className="hover:text-white transition-colors">Refund Policy</a>
                                <a href="https://store.italostudy.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">ItaloStudy Store</a>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
