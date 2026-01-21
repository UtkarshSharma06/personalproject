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
    title = "ItaloStudy | The #1 Platform for Abroad Universities Admission",
    description = "Accelerate your academic journey with ItaloStudy. Free IMAT, SAT, and IELTS preparation with unlimited free mocks and admission support.",
    keywords = "IMAT, SAT, IELTS, Free Practice, Free Mocks, Study in Italy, Medical Admission Italy, Free IMAT mocks, Unlimited free mocks",
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
