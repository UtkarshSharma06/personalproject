import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Card } from '@/components/ui/card';
import { Grid, ChevronRight, Star, BookOpen, TrendingUp, Globe } from 'lucide-react';

interface KnowledgeHubSidebarProps {
    examType: 'imat' | 'cents' | 'study-italy' | 'tolc';
}

import { imatLinks, centsLinks, studyItalyLinks, tolcLinks } from '@/lib/nav-links';


const KnowledgeHubSidebar: React.FC<KnowledgeHubSidebarProps> = ({ examType }) => {
    let links = imatLinks;
    let title = "IMAT Knowledge Hub";
    let authorityDesc = "This guide is maintained by medical admissions experts with years of experience navigating the Italian medical school registration process.";

    // Determine paths for fast links
    const getDatesPath = () => {
        if (examType === 'imat') return "/imat-exam-dates-2026";
        if (examType === 'cents') return "/cent-s-important-dates-2026";
        return "/study-in-italy/how-to-apply"; // Default for study-italy
    };

    const getPapersPath = () => {
        if (examType === 'imat') return "/imat-previous-year-papers-pdf";
        if (examType === 'cents') return "/cent-s-previous-year-papers-pdf";
        return "/study-in-italy/guide-2026"; // Default for study-italy
    };

    const getStrategyPath = () => {
        if (examType === 'imat') return "/imat-preparation-strategy-2026";
        if (examType === 'cents') return "/cent-s-preparation-strategy-2026";
        return "/study-in-italy/guide-2026"; // Default for study-italy
    };

    if (examType === 'cents') {
        links = centsLinks;
        title = "CENT-S Knowledge Hub";
        authorityDesc = "This guide is compiled by educational researchers with specific expertise in Italian common science entrance tests.";
    } else if (examType === 'study-italy') {
        links = studyItalyLinks;
        title = "Study Italy Hub";
        authorityDesc = "This content is verified by education consultants specializing in Italian university admissions for international students.";
    } else if (examType === 'tolc') {
        links = tolcLinks;
        title = "TOLC Knowledge Hub";
        authorityDesc = "This guide is maintained by university admissions experts specializing in the CISIA TOLC testing system.";
    }

    const isStaticPath = (path: string) => {
        return ['/method', '/exams', '/imat', '/cent-s', '/contact'].includes(path) || 
               path.startsWith('/cent-s-') || 
               path.startsWith('/best-books-for-cent-s-') ||
               path.startsWith('/imat-') ||
               path.startsWith('/tolc-') ||
               path.startsWith('/til-i-') ||
               path.startsWith('/study-in-italy');
    };

    const renderLink = (path: string, label: React.ReactNode, className: string, key?: any) => {
        const isStatic = isStaticPath(path);
        if (isStatic) {
            return (
                <a key={key} href={path} className={className}>
                    {label}
                </a>
            );
        }
        return (
            <Link key={key} to={path} className={className}>
                {label}
            </Link>
        );
    };

    return (
        <div className="space-y-6">
            {/* Main Knowledge Hub Links */}
            <Card className="p-6 border-slate-900 border-2 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-3xl">
                <h4 className="text-sm font-black mb-4 flex items-center gap-2 uppercase tracking-widest text-slate-900">
                    <Grid className="text-indigo-600" size={16} />
                    {title}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {links.map((link, i) => (
                        renderLink(
                            link.path,
                            <span className="truncate">{link.label}</span>,
                            "flex items-center px-2 py-1.5 rounded-lg hover:bg-indigo-50 group font-bold text-slate-500 hover:text-indigo-600 transition-all text-[8px] uppercase tracking-tighter border border-transparent hover:border-indigo-100",
                            i
                        )
                    ))}
                </div>
            </Card>

            {/* Free Mock Test Card */}
            <Card className="p-6 border-indigo-600 border-2 bg-indigo-50/50 rounded-3xl relative overflow-hidden group">
                <div className="relative z-10">
                    <h4 className="text-base font-black text-indigo-900 mb-2">Ready to see your real score?</h4>
                    <p className="text-[11px] text-indigo-700/80 font-medium leading-relaxed mb-4">
                        Free full-length 2026 mock exam. Find your weak spots before test day.
                    </p>
                    {renderLink(
                        examType === 'cents' ? '/cent-s-mock' : examType === 'tolc' ? '/tolc-mock-test-free-2026' : '/imat-mock',
                        <>
                            <span>Take Free Mock Test</span>
                            <ChevronRight size={14} />
                        </>,
                        "flex items-center justify-between w-full bg-indigo-600 text-white p-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-colors"
                    )}
                </div>
            </Card>

            {/* Expert Picks / Books */}
            <Card className="p-6 border-slate-100 shadow-sm bg-white rounded-3xl">
                <h4 className="text-sm font-black text-slate-900 mb-2">Expert Study Picks</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">
                    Vetted study materials for the 2026 cycle.
                </p>
                {renderLink(
                    examType === 'cents' ? '/best-books-for-cent-s-2026' : examType === 'tolc' ? '/tolc-best-books-2026' : '/imat-best-books-2026',
                    <>
                        <span className="border-b-2 border-indigo-600 pb-0.5">View Recommended Books</span>
                    </>,
                    "inline-flex font-bold text-indigo-600 hover:text-slate-900 transition-colors text-[10px] uppercase tracking-widest"
                )}
            </Card>

            {/* Authority Badge */}
            <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 text-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-indigo-100">
                    <Star className="text-indigo-600" fill="currentColor" size={20} />
                </div>
                <div className="font-black text-indigo-900 text-xs mb-1 uppercase tracking-widest">ItaloStudy Authority</div>
                <p className="text-indigo-700/70 text-[10px] font-medium leading-relaxed">
                    {authorityDesc}
                </p>
            </div>
        </div>
    );
};

export default KnowledgeHubSidebar;
