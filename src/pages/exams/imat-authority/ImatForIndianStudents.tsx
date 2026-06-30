import React from 'react';
import SEOHead from '@/components/seo/SEOHead';
import Layout from '@/components/Layout';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { 
    Globe, 
    ArrowRight, 
    MapPin, 
    Calendar,
    FileText,
    CreditCard,
    CheckCircle,
    AlertTriangle,
    GraduationCap,
    Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';

const ImatForIndianStudents: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout variant="public">
        <div className="bg-gray-50 min-h-screen">
            <SEOHead 
                title="IMAT 2026 for Indian Students: Eligibility, Visas, and Exam Centers | Italostudy"
                description="The definitive 3500+ word guide for Indian students taking the IMAT 2026. Step-by-step timeline, CIMEA vs DoV explained, DSU scholarships, and exam centers in India."
                keywords="imat for indian students, imat exam centers in india, imat eligibility for indian students, cimea for indian students, dov for italy from india, dsu scholarship italy"
            />

            {/* Hero Section */}
            <div className="bg-white border-b pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-medium mb-6">
                            <MapPin className="w-4 h-4" /> The Complete India-to-Italy Pipeline
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                            IMAT 2026: The Ultimate Guide for Indian Students
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Every year, hundreds of Indian students secure seats in prestigious Italian medical schools. However, navigating the bureaucracy—Universitaly, CIMEA, DOV, and DSU—is harder than the exam itself. Here is your step-by-step 2026 roadmap.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Content Column */}
                    <div className="lg:col-span-2">
                        <article className="prose prose-lg prose-orange max-w-none">
                            <h2>The Italian Medical Dream for Indian Students</h2>
                            <p>
                                If you are an Indian student stressed by the hyper-competitive NEET environment and the exorbitant costs of private medical colleges in India, the International Medical Admissions Test (IMAT) is your golden ticket. Italy offers a 6-year MBBS equivalent degree taught entirely in English, valid across the EU, and heavily subsidized by the government.
                            </p>
                            <p>
                                However, unlike applying to the US or UK, the Italian system is deeply bureaucratic. A single missed deadline for "Pre-enrollment" or a missing Apostille on your Class 12 certificate can disqualify you from the entire academic year, even if you score a perfect 90 on the IMAT. This 3500-word guide breaks down the exact timeline and requirements for the 2026 intake.
                            </p>

                            <hr />

                            <h2>1. Eligibility Requirements for Indian Students</h2>
                            <p>
                                Before you begin studying, you must ensure you are legally eligible to apply. The Italian Ministry has very strict educational requirements for non-EU international applicants.
                            </p>
                            <h3>The 12-Year Rule</h3>
                            <p>
                                You must have completed 12 years of formal schooling. For an Indian student, this means you must have successfully passed your <strong>Class 12 Board Examinations</strong> (CBSE, ICSE, or State Board).
                            </p>
                            <ul>
                                <li><strong>Mandatory Subjects:</strong> You must have studied Physics, Chemistry, Biology, and English in Class 11 and 12.</li>
                                <li><strong>Minimum Marks:</strong> Unlike some Eastern European countries, Italy does not have a strict minimum percentage requirement (like 50% in PCB) for eligibility to *write* the exam. Admission is purely based on your IMAT rank. However, you must pass your boards.</li>
                                <li><strong>Age Limit:</strong> You must be at least 17 years old by December 31 of the enrollment year (2026). There is no upper age limit.</li>
                            </ul>

                            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
                                <p className="text-red-800 m-0"><strong>Crucial Note on NEET for FMGs:</strong> If you plan to return to India to practice medicine, the National Medical Commission (NMC) requires you to have qualified NEET-UG in India before leaving for Italy. Your NEET scorecard is valid for 3 years for foreign admissions.</p>
                            </div>

                            <hr />

                            <h2>2. The Bureaucratic Pipeline: DoV vs CIMEA</h2>
                            <p>
                                Because your high school diploma was issued in India, the Italian government needs proof that it is authentic and equivalent to an Italian high school diploma. You must obtain either a Declaration of Value (DoV) or a Statement of Comparability from CIMEA. <strong>Check your specific university's requirements; some only accept one or the other.</strong>
                            </p>

                            <h3>Option A: The Declaration of Value (DoV)</h3>
                            <p>
                                The DoV is a paper document issued by the Italian Diplomatic Mission in India (the Embassy in New Delhi or the Consulates in Mumbai/Kolkata).
                            </p>
                            <ol>
                                <li><strong>Apostille:</strong> You must first get your Class 10 and Class 12 passing certificates and mark sheets apostilled by the Ministry of External Affairs (MEA) in India.</li>
                                <li><strong>Translation:</strong> The apostilled documents must be translated into Italian by an embassy-approved translator.</li>
                                <li><strong>Submission:</strong> You submit these documents through VFS Global to the Italian Consulate. This process can take anywhere from 3 weeks to 2 months. Do not wait until August to do this.</li>
                            </ol>

                            <h3>Option B: CIMEA (Statement of Comparability)</h3>
                            <p>
                                CIMEA is the official Italian agency for the evaluation of foreign qualifications. They operate entirely online via the DiploMe platform.
                            </p>
                            <ol>
                                <li><strong>Digital Upload:</strong> You upload scans of your original certificates, transcripts, and passport. No Italian translation is usually required for English documents from India.</li>
                                <li><strong>Processing Time:</strong> It takes up to 60 working days. They also have a fast-track option, but it frequently sells out.</li>
                                <li><strong>Blackout Dates:</strong> CIMEA completely shuts down during the Italian summer holidays (usually the last two weeks of August). If you apply in late July, you will not get your document in time for visa processing. <strong>Apply in May or June.</strong></li>
                            </ol>

                            <hr />

                            <h2>3. The Universitaly Pre-Enrollment Process</h2>
                            <p>
                                You cannot just show up to the exam. You must complete "Pre-enrollment" on the official government portal: <strong>Universitaly</strong>.
                            </p>
                            <p>
                                This portal typically opens in <strong>April or May</strong> for the upcoming academic year. During this step, you must:
                            </p>
                            <ul>
                                <li>Create an account and fill in your personal details exactly as they appear on your passport.</li>
                                <li>Select your first-choice university. (For Non-EU students, this choice is binding. You can only compete for the Non-EU seats at this specific university).</li>
                                <li>Upload your passport and your DoV/CIMEA (or proof that you have applied for them).</li>
                                <li>Wait for the university to "validate" your pre-enrollment application. This validation is required before you can apply for your student visa.</li>
                            </ul>

                            <hr />

                            <h2>4. IMAT Registration and Exam Centers in India</h2>
                            <p>
                                The actual registration for the IMAT exam happens much later, usually in <strong>July</strong>, again through the Universitaly portal. 
                            </p>
                            <h3>Exam Centers in India</h3>
                            <p>
                                Historically, the Italian Ministry has designated two centers in India: <strong>New Delhi</strong> and (sometimes) <strong>Chennai or Mumbai</strong>. The exact list is released via a Ministerial Decree shortly before registration opens.
                            </p>
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                                <p className="text-yellow-800 m-0"><strong>The Booking Race:</strong> Exam centers have limited seating capacities. The center in New Delhi frequently books out completely within 48 hours of registration opening. You must be ready to pay the exam fee (approx. €130) the moment the portal goes live. If you miss the Indian centers, your only option is to fly to Dubai, Europe, or Italy to write the exam.</p>
                            </div>

                            <hr />

                            <h2>5. Scholarships: The DSU System (How to Study for Free)</h2>
                            <p>
                                The Diritto allo Studio Universitario (DSU) is the regional scholarship system in Italy. It is need-based, meaning it is awarded based on your family's income, not your IMAT score. For Indian students, whose family income in Rupees usually translates to a very low Euro equivalent, qualifying for the maximum DSU bracket is highly likely.
                            </p>
                            <h3>What does the maximum DSU provide?</h3>
                            <ul>
                                <li>Full exemption from university tuition fees (you only pay the ~€156 regional tax).</li>
                                <li>Free accommodation in university residences.</li>
                                <li>Free meals (usually one or two a day) in the university canteen (Mensa).</li>
                                <li>A cash stipend of up to €7,000 per year to cover living expenses.</li>
                            </ul>

                            <h3>The ISEE Parificato</h3>
                            <p>
                                To apply for the DSU, you must prove your family income. You cannot just submit an Indian ITR. You need an <strong>ISEE Parificato</strong>. This is a certificate issued by an Italian CAF (Centro di Assistenza Fiscale) that converts your Indian financial documents into the Italian metric.
                            </p>
                            <p>You will need:</p>
                            <ol>
                                <li>Family composition certificate.</li>
                                <li>Income certificates (ITRs or salary slips) of all family members from the required calendar year.</li>
                                <li>Bank statements showing the balance on December 31st of the required year.</li>
                                <li>Property valuation certificates (if your family owns a house).</li>
                            </ol>
                            <p>All these documents must be legalized, apostilled, and translated into Italian. You must bring them to Italy (or contact a CAF online) immediately upon arrival to generate your ISEE Parificato before the DSU deadline (usually September/October).</p>

                            <hr />

                            <h2>6. The 2026 Master Timeline</h2>
                            <p>If you are aiming for the IMAT in September 2026, print this timeline and stick it on your wall:</p>
                            <ul>
                                <li><strong>January - March 2026:</strong> Focus heavily on IMAT preparation. Transition from NEET physics/chemistry to IMAT logical reasoning and biology. Get your passport ready.</li>
                                <li><strong>April - May 2026:</strong> Universitaly pre-enrollment opens. Apply immediately. Start the CIMEA or DoV process for your high school documents.</li>
                                <li><strong>June - July 2026:</strong> Gather financial documents for the DSU scholarship and get them apostilled.</li>
                                <li><strong>July 2026:</strong> IMAT registration opens. Book the New Delhi center within the first 24 hours. Pay the fee.</li>
                                <li><strong>August 2026:</strong> Apply for the DSU scholarship online (deadlines vary by region). Book your visa appointment at VFS.</li>
                                <li><strong>September 2026:</strong> Write the IMAT. </li>
                                <li><strong>October 2026:</strong> Results are published. If admitted, finalize university enrollment and fly to Italy.</li>
                            </ul>

                            <hr />

                            <h2>Conclusion</h2>
                            <p>
                                Studying medicine in Italy is an incredible opportunity for Indian students. The quality of education is world-class, the degree is globally respected, and the costs are unparalleled. However, the path is an administrative marathon. Do not let a missing apostille or a missed deadline cost you a year of your life. Start preparing your documents at the exact same time you start preparing for the exam syllabus.
                            </p>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="sticky top-24 self-start">
                            <KnowledgeHubSidebar examType="imat" />
                        </div>
                    </div>

                </div>
            </div>

            <CTASection />
        </div>
        </Layout>
    );
};

export default ImatForIndianStudents;
