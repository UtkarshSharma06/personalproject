import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    schema?: Record<string, any>;
    canonicalUrl?: string;
}

export default function SEO({
    title = "Free Prep for CEnT-S, IMAT, SAT & IELTS, Simplified | ItaloStudy",
    description = "Free preparation for CEnT-S, IMAT, SAT, and IELTS. Access unlimited mock exams, study materials, and simplified guides for abroad university entrance exams.",
    keywords = "IMAT preparation, IMAT free practice tests, IMAT past papers online, IMAT study guide, IMAT exam tips, IMAT preparation Italy, CEnT-S preparation, CEnT-S free practice, CEnT-S exam guide, CEnT-S past papers, SAT preparation free, SAT practice tests online, SAT study guide free, SAT exam tips, SAT preparation for international students, IELTS preparation free, IELTS practice tests online, IELTS study guide free, IELTS exam tips, IELTS preparation for study abroad, study abroad Italy, free study abroad preparation, international university admissions, Italy medical school admissions, study abroad exam prep, best universities in Italy for medicine, how to apply to Italian universities, study abroad scholarships Italy, study abroad entrance exams, study abroad preparation platform, free exam preparation website, online exam practice free, international exam preparation, global student admissions support, exam prep made simple, free study resources online, online learning for exams, exam success tips, best exam preparation platform, free exam prep for students, how to prepare for IMAT exam free, best free IMAT practice tests online, free SAT preparation for Indian students, IELTS preparation for beginners free, CEnT-S exam preparation step by step, IMAT exam preparation for medical school Italy, SAT preparation tips for international students, IELTS free resources for study abroad, CEnT-S preparation for global students, IMAT exam preparation made simple, Italian university admissions guide, free admissions support Italy, international student admissions Italy, medical school entrance exam Italy, study abroad admissions simplified, how to apply for IMAT exam, admissions preparation for global students, Italy medical school entrance exam prep, international admissions preparation free, study abroad admissions platform, free IMAT preparation online, free SAT practice tests, free IELTS practice tests, free CEnT-S exam prep, study abroad exam preparation free, best free exam prep website, online study abroad preparation free, free exam prep for medical students, admissions support for international students, free exam prep made easy, IMAT blog preparation tips, SAT blog study guide, IELTS blog free resources, CEnT-S blog exam tips, study abroad blog Italy, medical school blog Italy admissions, free exam prep blog, international student blog admissions, study abroad blog exam prep, global student blog resources, IMAT vs SAT preparation, IELTS vs TOEFL preparation free, CEnT-S vs IMAT exam guide, SAT vs ACT preparation free, study abroad vs local admissions, free exam prep vs paid courses, IMAT exam difficulty guide, SAT exam difficulty tips, IELTS exam difficulty explained, CEnT-S exam difficulty guide, join free IMAT preparation, sign up free SAT prep, register free IELTS practice, enroll free CEnT-S prep, start free exam preparation today, free exam prep for study abroad students, free IMAT preparation for medical school, free SAT preparation for global students, free IELTS preparation for international admissions, free CEnT-S preparation for study abroad, study abroad, study in Italy, study in Europe, university admission abroad, IMAT preparation, IMAT practice test, CENT-S preparation, SAT preparation, IELTS preparation, free mocks, medical school Italy, medical university admission, study medicine in Italy, Italian universities, European universities, abroad admission, scholarship abroad, free exam preparation, university entrance exam, study abroad free, medical admission Italy, engineering admission Europe, IMAT free test, TOLC preparation, student visa Italy, study abroad platform, international students Italy, medical degree Italy, study medicine Europe, NEET alternative, study MBBS abroad, medical universities Europe, free study resources, exam practice platform, unlimited free mocks, IMAT coaching, SAT coaching, IELTS coaching, abroad education, international education, study overseas, foreign universities admission, free IMAT preparation, free SAT preparation, free IELTS preparation",
    image = "/logo.png",
    url = "https://italostudy.com", // Fallback URL
    type = "website",
    schema,
    canonicalUrl
}: SEOProps) {
    const siteTitle = title.includes("ItaloStudy") ? title : `${title} | ItaloStudy`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            <meta name='author' content='ItaloStudy' />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Additional SEO Meta Tags */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <meta name="distribution" content="global" />
            <meta name="rating" content="general" />
            <meta name="theme-color" content="#6366f1" />

            {/* Geo Targeting */}
            <meta name="geo.region" content="IT" />
            <meta name="geo.placename" content="Italy" />

            {/* Mobile Optimization */}
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="ItaloStudy" />

            {/* Educational & Topic Tags */}
            <meta name="subject" content="Education, University Admission, Exam Preparation" />
            <meta name="topic" content="Study Abroad, Medical Education, University Entrance Exams" />
            <meta name="category" content="Education" />
            <meta name="coverage" content="Worldwide" />
            <meta name="audience" content="Students, Aspiring Medical Students, International Students" />

            {/* Additional Open Graph */}
            <meta property="og:site_name" content="ItaloStudy" />
            <meta property="og:locale" content="en_US" />
            <meta property="article:publisher" content="https://italostudy.com" />

            {/* Additional Twitter Tags */}
            <meta name="twitter:site" content="@italostudy" />
            <meta name="twitter:creator" content="@italostudy" />
            <meta name="twitter:domain" content="italostudy.com" />

            {/* Canonical */}
            <link rel="canonical" href={canonicalUrl || url} />

            {/* Structured Data (JSON-LD) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
}
