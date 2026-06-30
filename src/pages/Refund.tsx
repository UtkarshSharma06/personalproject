import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import PWNavbar from '@/components/home/PWNavbar';
import Footer from '@/components/Footer';

const LAST_UPDATED = 'July 1, 2026';

const validReasons = [
    {
        icon: '⚙️',
        title: 'Technical Inaccessibility',
        description: 'Your account is fully inaccessible due to a verified technical error on our platform — login failures, account corruption, or data loss caused by our systems — and the issue cannot be resolved within 5 business days.',
    },
    {
        icon: '💳',
        title: 'Duplicate Charge',
        description: 'You were charged more than once for the same subscription period or the same product due to a payment gateway error. Evidence (e.g., bank statement) is required.',
    },
    {
        icon: '🔄',
        title: 'Unauthorized Renewal',
        description: 'A recurring subscription was charged after you cancelled it through Account Settings before the renewal date, and the cancellation was confirmed by our system.',
    },
    {
        icon: '📦',
        title: 'Non-Delivery of Physical Goods',
        description: 'A physical product (e.g., printed book) was not delivered within the stated timeframe due to a logistics or dispatch error on our part.',
    },
    {
        icon: '🔐',
        title: 'Account Transfer Failure',
        description: 'You purchased a subscription or book PDF but a verified technical problem prevents us from transferring access to your account, and the only resolution available is moving the access to a new account (we will migrate your plan) or refunding the purchase.',
    },
    {
        icon: '🚫',
        title: 'Service Not as Described',
        description: 'A specific feature was explicitly advertised on the purchase page at the time of your payment but is provably absent or non-functional in your account — not merely a user preference or expectation.',
    },
];

const nonRefundable = [
    'Change of mind after accessing any part of the service',
    'Purchasing the wrong plan or cycle',
    'Forgetting to cancel before a renewal date (we send reminder emails)',
    'Poor exam performance or academic results',
    'Not using the subscription during the active period',
    'Dissatisfaction with content difficulty or teaching style',
    'Internet connectivity or device compatibility issues on the user\'s end',
    'Coupon codes not applied before checkout (discounts cannot be applied retroactively)',
    'Beta-period users requesting refunds after transitioning to the paid tier',
];

export default function Refund() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
            <SEO
                title="Refund & Cancellation Policy | ItaloStudy"
                description="ItaloStudy's clear and transparent refund policy. Understand what qualifies for a refund, what does not, and how to submit a request for subscriptions, book PDFs, and digital access."
            />

            <PWNavbar />

            <main className="flex-1 w-full max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-20">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Legal · Billing</p>
                    <h1 className="text-[32px] md:text-[40px] font-bold text-slate-900 leading-tight mb-4 font-fam-bold">
                        Refund &amp; Cancellation Policy
                    </h1>
                    <p className="text-slate-500 text-[15px]">Last updated: {LAST_UPDATED}</p>
                </div>

                {/* Intro */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-10 text-[15px] leading-[1.8] text-slate-600">
                    <p>
                        ItaloStudy provides <strong className="text-slate-900">digital educational services</strong> — including subscription-based platform access and downloadable book PDFs. Because these products are delivered instantly upon purchase and consumed digitally, our refund policy is strict by nature.
                    </p>
                    <p className="mt-3">
                        We do not offer discretionary refunds. Refunds are only issued when a specific, verifiable technical or billing failure has occurred on <strong className="text-slate-900">our end</strong>. We have listed every valid reason below, clearly and honestly.
                    </p>
                </div>

                <div className="space-y-12 text-[15px] leading-[1.8] text-slate-600">

                    {/* Section 1 — Subscriptions */}
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-black">1</span>
                            <h2 className="text-[20px] font-bold text-slate-900">Subscription Plans</h2>
                        </div>

                        <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-5">
                            <p className="font-bold text-red-700 text-[14px] uppercase tracking-wide mb-1">No Refunds on Subscriptions</p>
                            <p>
                                All subscription purchases — monthly, quarterly, and annual — are <strong>final and non-refundable</strong>. When you subscribe, you gain immediate access to the full premium platform. We do not offer a money-back guarantee or trial refund period.
                            </p>
                        </div>

                        <p className="mb-4">
                            <strong className="text-slate-900">Cancellation:</strong> You can cancel your subscription at any time from{' '}
                            <strong>Account Settings → Billing</strong>. After cancellation:
                        </p>
                        <ul className="space-y-2 pl-0">
                            {[
                                'You retain full premium access until the end of your current billing period.',
                                'No further automatic charges will be made.',
                                'Access will downgrade to the Explorer (free) tier at period end.',
                                'We do not issue pro-rated refunds for unused days remaining in a billing cycle.',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="mt-1 w-4 h-4 flex-shrink-0 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center font-black">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Section 2 — Book PDFs */}
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-black">2</span>
                            <h2 className="text-[20px] font-bold text-slate-900">Book PDFs &amp; Digital Downloads</h2>
                        </div>

                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-5">
                            <p className="font-bold text-orange-700 text-[14px] uppercase tracking-wide mb-1">No Refunds on Digital Downloads</p>
                            <p>
                                Digital book purchases and downloadable PDFs are <strong>non-refundable once delivered</strong> to your account. Because digital files cannot be "returned," no exceptions apply to change-of-mind requests.
                            </p>
                        </div>

                        <p className="mb-3">
                            <strong className="text-slate-900">The only exception for book PDFs</strong> is a verified technical failure where:
                        </p>
                        <ul className="space-y-2 pl-0 mb-4">
                            {[
                                'The file was never delivered to your account despite a successful payment.',
                                'The file is corrupted or unreadable and we are unable to re-issue a working copy.',
                                'A technical error on our platform prevents you from accessing the purchased download.',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="mt-1 w-4 h-4 flex-shrink-0 rounded-full bg-orange-100 text-orange-600 text-[10px] flex items-center justify-center font-black">!</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p>
                            In these cases, our first resolution is to <strong className="text-slate-900">re-deliver the file or restore access</strong>. A refund is issued only if we cannot fix the technical issue within <strong>5 business days</strong>.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Section 3 — Courses */}
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-black">3</span>
                            <h2 className="text-[20px] font-bold text-slate-900">Courses &amp; Bundles</h2>
                        </div>

                        <div className="bg-violet-50 border border-violet-100 rounded-xl p-5 mb-5">
                            <p className="font-bold text-violet-700 text-[14px] uppercase tracking-wide mb-1">No Refunds on Course Purchases</p>
                            <p>
                                Courses and course bundles are sold as <strong>one-time purchases with time-limited access</strong> (e.g., 180-day or 365-day validity). Because access is granted instantly upon payment, all course purchases are <strong>final and non-refundable</strong> as a general rule.
                            </p>
                        </div>

                        <p className="mb-4">
                            <strong className="text-slate-900">Exceptions — a course refund may be considered if:</strong>
                        </p>
                        <ul className="space-y-3 mb-5">
                            {[
                                {
                                    icon: '🔒',
                                    text: 'You paid successfully but access was never granted to your account, and the issue is not resolved within 48 hours of reporting it.',
                                },
                                {
                                    icon: '📋',
                                    text: 'The course content is materially different from what was explicitly described on the course purchase page at the time of your payment (e.g., a different exam syllabus, missing modules that were listed).',
                                },
                                {
                                    icon: '💳',
                                    text: 'You were charged twice for the same course due to a payment gateway error (duplicate charge).',
                                },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                                    <span className="text-slate-600 text-[14px]">{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="mb-3">
                            <strong className="text-slate-900">Course access validity is non-extendable</strong> — if your access period expires without full use, this does not constitute a valid reason for a refund or extension. Plan your enrollment accordingly.
                        </p>

                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[13px] text-slate-500">
                            <strong className="text-slate-700">Bundle purchases</strong> follow the same rules as individual courses. If one course in a bundle has an access issue, we will restore access to that specific course — not issue a full bundle refund.
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Section 4 — ItaloStudy Store */}
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="w-8 h-8 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center text-sm font-black">4</span>
                            <h2 className="text-[20px] font-bold text-slate-900">ItaloStudy Store (Physical &amp; Digital Goods)</h2>
                        </div>

                        <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-5 mb-5">
                            <p className="font-bold text-fuchsia-700 text-[14px] uppercase tracking-wide mb-1">Store Return Policy</p>
                            <p>
                                The ItaloStudy Store (<strong>store.italostudy.com</strong>) sells educational merchandise and physical study materials. Returns and refunds for store purchases are handled separately from main platform subscriptions.
                            </p>
                        </div>

                        <ul className="space-y-3 mb-5">
                            {[
                                {
                                    icon: '📦',
                                    text: 'Physical goods can be returned within 14 days of delivery only if they arrive damaged or incorrect. Contact us with photographic evidence to arrange a replacement or refund.',
                                },
                                {
                                    icon: '💻',
                                    text: 'Digital products purchased via the Store are delivered instantly and are completely non-refundable once downloaded.',
                                },
                                {
                                    icon: '🚚',
                                    text: 'Shipping fees are non-refundable. If you return an item, the cost of return shipping is your responsibility unless the item was damaged or incorrect upon arrival.',
                                },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                                    <span className="text-slate-600 text-[14px]">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Section 5 — Valid Reasons */}
                    <section>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-black">5</span>
                            <h2 className="text-[20px] font-bold text-slate-900">Valid Reasons for a Refund Request</h2>
                        </div>
                        <p className="text-slate-500 mb-6 text-[14px]">
                            The following are the <strong>only</strong> circumstances under which a refund may be considered. All requests are reviewed by our billing team. We may request evidence to process your claim.
                        </p>

                        <div className="grid gap-4">
                            {validReasons.map((r, i) => (
                                <div key={i} className="border border-slate-100 rounded-xl p-5 flex gap-4 hover:border-indigo-100 hover:bg-indigo-50/20 transition-colors">
                                    <span className="text-2xl flex-shrink-0 mt-0.5">{r.icon}</span>
                                    <div>
                                        <p className="font-bold text-slate-900 mb-1">{r.title}</p>
                                        <p className="text-slate-500 text-[14px] leading-relaxed">{r.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Section 6 — Account Transfer */}
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-black">6</span>
                            <h2 className="text-[20px] font-bold text-slate-900">Account Transfers Instead of Refunds</h2>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                            <p className="mb-3">
                                If you experience a <strong className="text-slate-900">verified technical problem</strong> with your account (such as being unable to log in, account data corruption, or inability to access purchased content), and the issue cannot be fixed within 5 business days, we will offer you a choice:
                            </p>
                            <ul className="space-y-2">
                                {[
                                    'Transfer your remaining premium access (subscription time or PDF license) to a new account at no cost.',
                                    'Issue a partial or full refund, depending on the unused portion of your purchase.',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="mt-1 w-5 h-5 flex-shrink-0 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-black">{i + 1}</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-3 text-[13px] text-blue-700">
                                We always prefer to resolve the issue first. Refunds are the last resort when technical resolution is impossible.
                            </p>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Section 7 — Not Eligible */}
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-black">7</span>
                            <h2 className="text-[20px] font-bold text-slate-900">What Does Not Qualify for a Refund</h2>
                        </div>

                        <p className="mb-5 text-slate-500">The following situations are explicitly excluded from refund eligibility:</p>

                        <ul className="space-y-3">
                            {nonRefundable.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="mt-1.5 w-3.5 h-3.5 flex-shrink-0 rounded-full bg-red-100 text-red-500 text-[9px] flex items-center justify-center font-black">✗</span>
                                    <span className="text-slate-600">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Section 8 — Process */}
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-black">8</span>
                            <h2 className="text-[20px] font-bold text-slate-900">How to Submit a Refund Request</h2>
                        </div>

                        <ol className="space-y-4">
                            {[
                                {
                                    step: 'Email us at contact@italostudy.com',
                                    detail: 'Use the subject line: "Refund Request — [Your Account Email]"',
                                },
                                {
                                    step: 'Include your transaction details',
                                    detail: 'Provide your order ID, payment date, the product purchased, and the payment method used (Dodo, Razorpay, or PayPal).',
                                },
                                {
                                    step: 'Describe the issue clearly',
                                    detail: 'Explain which of the valid reasons listed above applies to your case. Include screenshots or evidence if available.',
                                },
                                {
                                    step: 'Wait for review',
                                    detail: 'Our billing team reviews all requests within 3 business days. We may ask for additional information.',
                                },
                                {
                                    step: 'Resolution',
                                    detail: 'If approved, refunds are processed back to your original payment method within 5–10 business days. Approved account transfers are completed within 24 hours.',
                                },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <span className="w-7 h-7 flex-shrink-0 rounded-full bg-purple-100 text-purple-700 text-[13px] font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">{item.step}</p>
                                        <p className="text-slate-500 text-[14px] mt-0.5">{item.detail}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* Footer contact */}
                    <div className="bg-slate-900 rounded-2xl p-7 text-white mt-6">
                        <p className="font-bold text-lg mb-1">Have a billing issue?</p>
                        <p className="text-slate-400 text-[14px] mb-4">
                            Reach our billing team directly. We aim to respond within 1–2 business days.
                        </p>
                        <a
                            href="mailto:contact@italostudy.com?subject=Refund Request"
                            className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-[14px] px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            ✉ contact@italostudy.com
                        </a>
                        <p className="mt-5 text-slate-500 text-[12px]">
                            ItaloStudy is an independent educational technology platform.
                        </p>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
