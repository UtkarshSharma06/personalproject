/**
 * SEO Structured Data (JSON-LD) Schemas for Italostudy 2027
 * These follow schema.org standards for Educational Organizations and Courses.
 */

export const getEducationalOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "OnlineBusiness"],
  "name": "ItaloStudy",
  "url": "https://italostudy.com",
  "logo": "https://italostudy.com/logo.webp",
  "description": "Italy's most advanced study simulator for CEnT-S, IMAT, SAT and IELTS entrance exam preparation. Join 5,000+ students with a 98% pass rate.",
  "sameAs": [
    "https://www.instagram.com/italostudycom",
    "https://chat.whatsapp.com/JZxQCS4A4ZO8k7bOEMYtTz",
    "https://www.facebook.com/italostudy",
    "https://www.linkedin.com/company/italostudy",
    "https://www.youtube.com/@italostudy",
    "https://x.com/italostudy"
  ],
  "teaches": ["CEnT-S", "IMAT", "SAT", "IELTS"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Exam Preparation Courses",
    "itemListElement": [
      {
        "@type": "Course",
        "name": "CEnT-S Exam Preparation",
        "url": "https://italostudy.com/cent-s-mock",
        "description": "Free full-length CEnT-S mock exams with AI-powered study tools and syllabus-aligned practice."
      },
      {
        "@type": "Course",
        "name": "IMAT Exam Preparation",
        "url": "https://italostudy.com/imat-exam-ultimate-guide-2026",
        "description": "Complete IMAT preparation with 100+ mock exams, proctored simulations and past papers."
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "5000"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IT"
  }
});

export const getCourseSchema = (id: 'imat' | 'cents' | 'tolc' | 'tili', locale: string = 'en') => {
  const titles = {
    imat: "IMAT 2027 Ultimate Preparation Course",
    cents: "CEnT-S 2027 Ultimate Preparation Course",
    tolc: "TOLC 2027 Ultimate Preparation Course",
    tili: "TIL-I 2027 Ultimate Preparation Course"
  };

  const descriptions = {
    imat: "Complete preparation for the International Medical Admissions Test (IMAT) featuring 100+ mock exams, proctored simulations, and comprehensive study materials.",
    cents: "Detailed preparation for the CEnT-S exam with real-time simulators, syllabus-aligned mock tests, and admission support.",
    tolc: "Comprehensive preparation guide for the CISIA TOLC exams (TOLC-E, TOLC-I, TOLC-F) for admission to Italian universities.",
    tili: "Complete preparation guide for the TIL-I exam required for admission to Engineering programs at Politecnico di Torino."
  };

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": titles[id],
    "description": descriptions[id],
    "provider": {
      "@type": "EducationalOrganization",
      "name": "ItaloStudy",
      "sameAs": "https://italostudy.com"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "instructor": {
        "@type": "Organization",
        "name": "ItaloStudy Academic Team"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "category": "Free"
    },
    "inLanguage": "en"
  };
};

export const getBreadcrumbSchema = (items: { name: string, item: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://italostudy.com${item.item}`
  }))
});

export const getWebApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ItaloStudy",
  "url": "https://italostudy.com",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "5000"
  }
});

export const getVideoObjectSchema = (title: string, description: string, thumbnailUrl: string, uploadDate: string, contentUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": title,
  "description": description,
  "thumbnailUrl": [
    thumbnailUrl
  ],
  "uploadDate": uploadDate,
  "contentUrl": contentUrl,
  "embedUrl": contentUrl,
  "publisher": {
    "@type": "Organization",
    "name": "ItaloStudy",
    "logo": {
      "@type": "ImageObject",
      "url": "https://italostudy.com/logo.webp"
    }
  }
});


export const getEventSchema = (
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  locationName: string = "Global Test Centers & Universitaly",
  url: string = "https://italostudy.com/imat-exam-dates-2026"
) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": name,
  "description": description,
  "startDate": startDate,
  "endDate": endDate,
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place",
    "name": locationName,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IT"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "MUR (Ministero dell'Università e della Ricerca)",
    "url": "https://www.universitaly.it"
  },
  "offers": {
    "@type": "Offer",
    "price": "130",
    "priceCurrency": "EUR",
    "url": url,
    "availability": "https://schema.org/InStock"
  }
});
