import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    GraduationCap, ArrowRight, Clock, Play, Star,
    ShieldCheck, Lock, Zap, BookOpen, Users, Award,
    CheckCircle, Sparkles, ChevronRight, Loader2, MessageCircle, Calendar
} from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import PWNavbar from '@/components/home/PWNavbar';
import { supabase } from '@/integrations/supabase/client';
// Ensure mock layout works, leaving TRUST and GUARANTEE intact
const TRUST = [
    { icon: Users, value: '3,800+', label: 'Students Enrolled' },
    { icon: Star, value: '4.8★', label: 'Average Rating' },
    { icon: Award, value: '92%', label: 'Pass Rate Improvement' },
    { icon: BookOpen, value: '42+', label: 'Expert-Led Chapters' },
];

const GUARANTEE = [
    'Lifetime access once purchased — no expiry',
    'Structured learning path by Italian exam experts',
    'Downloadable notes & formula sheets',
    'Practice questions after every chapter',
    'Works on mobile, tablet & desktop',
];

function CourseCard({ course, index }: { course: any; index: number }) {
    const hasINR = course.regional_prices?.INR && course.regional_prices.INR > 0;
    const isFree = course.is_free;
    
    // Euro calculation
    const baseEuro = course.price_eur || 0;
    const discountEuro = course.discount_price_eur || baseEuro;
    const finalEuro = discountEuro;
    const origEuro = baseEuro > discountEuro ? baseEuro : Math.round(finalEuro * 1.5);
    const pctEuro = isFree ? 100 : Math.round(((origEuro - finalEuro) / origEuro) * 100);

    // INR calculation
    const baseInr = hasINR ? course.regional_prices.INR : 0;
    const discountInr = (hasINR && course.regional_prices.INR_discount) ? course.regional_prices.INR_discount : baseInr;
    const finalInr = discountInr;
    const origInr = baseInr > discountInr ? baseInr : Math.round(finalInr * 1.5);
    const pctInr = (hasINR && origInr > 0) ? Math.round(((origInr - finalInr) / origInr) * 100) : 0;

    const currencySymbol = hasINR ? '₹' : '€';
    const currentPrice = hasINR ? finalInr : finalEuro;
    const originalPrice = hasINR ? origInr : origEuro;
    const discountPercent = hasINR ? pctInr : pctEuro;

    const abstractArts = [
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop", // Dark wavy
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop", // Abstract geometry
        "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800&auto=format&fit=crop", // Smooth waves
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", // Color flow
        "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop", // Dark fluid
        "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=800&auto=format&fit=crop", // Colorful blocks
    ];
    const fallbackArt = abstractArts[index % abstractArts.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-white rounded-xl border border-slate-200 border-t-[4px] border-t-[#5A4BDA] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative"
        >
            {/* ONLINE Tag Ribbon - PW Image */}
            <div className="absolute top-[0px] left-0 z-10 w-[72px]">
                <img src="https://static.pw.live/images/onlineTag_20241022124328.webp" alt="online" className="w-full object-contain" />
            </div>

            {/* Thumbnail */}
            <div className={`relative w-full aspect-[16/9] overflow-hidden flex-shrink-0 bg-slate-900`}>
                {course.banner_url ? (
                    <img src={course.banner_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                    <>
                        {/* Abstract Art Background */}
                        <img src={fallbackArt} alt="Abstract Art" className="w-full h-full object-cover absolute inset-0 opacity-80 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#1b2124]/90 to-[#5A4BDA]/40 pointer-events-none" />
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                            {course.badge && (
                                <span className={`bg-[#f0c14b] text-slate-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm mb-3 shadow-sm`}>
                                    {course.badge}
                                </span>
                            )}
                            <h3 className="text-[20px] font-black text-white leading-tight uppercase tracking-tight drop-shadow-lg">{course.title}</h3>
                        </div>
                    </>
                )}
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
                {/* Title & Language */}
                <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-[17px] font-bold text-slate-800 leading-[1.3]">{course.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {course.lecture_type && (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${course.lecture_type === 'Live' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#f1f5f9] text-[#1b2124]'}`}>
                                {course.lecture_type === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>}
                                {course.lecture_type.toUpperCase()}
                            </span>
                        )}
                        <span className="bg-[#f1f5f9] text-[#1b2124] text-[10px] font-semibold px-2 py-1 rounded-full">
                            {course.language || 'English'}
                        </span>
                        {/* WhatsApp icon */}
                        <a href="https://chat.whatsapp.com/CfVh7u9L6vT7ZFpZwwVa4A" target="_blank" rel="noopener noreferrer" className="w-[26px] h-[26px] flex items-center justify-center -mt-px hover:scale-110 transition-transform">
                            <img alt="WAIcon" src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/cac77a2f-7e6f-464f-ac8b-81059f83e42d.fc62406e" className="w-full h-full object-contain" />
                        </a>
                    </div>
                </div>

                {/* Meta details */}
                <div className="space-y-1.5 mb-5 mt-2">
                    <div className="flex items-center gap-2 text-[11px] text-[#757575] font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12.0004 12.4794C12.1655 12.4931 12.3323 12.5 12.5009 12.5C13.1998 12.5 13.8707 12.3805 14.4945 12.1608C14.4987 12.1078 14.5009 12.0541 14.5009 12C14.5009 10.8954 13.6054 10 12.5009 10C12.0825 10 11.6941 10.1285 11.373 10.3482M12.0004 12.4794C12.0005 12.4863 12.0005 12.4931 12.0005 12.5C12.0005 12.65 11.9922 12.7981 11.9761 12.9438C10.805 13.6158 9.4476 14 8.00049 14C6.55337 14 5.196 13.6158 4.02483 12.9438C4.00874 12.7981 4.00049 12.65 4.00049 12.5C4.00049 12.4932 4.00051 12.4863 4.00054 12.4795M12.0004 12.4794C11.9965 11.6951 11.7668 10.9641 11.373 10.3482M11.373 10.3482C10.6624 9.23679 9.41747 8.5 8.00049 8.5C6.58368 8.5 5.33892 9.23661 4.62828 10.3477M4.62828 10.3477C4.30731 10.1283 3.91913 10 3.50098 10C2.39641 10 1.50098 10.8954 1.50098 12C1.50098 12.0541 1.50313 12.1078 1.50735 12.1608C2.13111 12.3805 2.80209 12.5 3.50098 12.5C3.6692 12.5 3.83582 12.4931 4.00054 12.4795M4.62828 10.3477C4.23429 10.9638 4.00448 11.6949 4.00054 12.4795M10.0005 4.5C10.0005 5.60457 9.10506 6.5 8.00049 6.5C6.89592 6.5 6.00049 5.60457 6.00049 4.5C6.00049 3.39543 6.89592 2.5 8.00049 2.5C9.10506 2.5 10.0005 3.39543 10.0005 4.5ZM14.0005 6.5C14.0005 7.32843 13.3289 8 12.5005 8C11.6721 8 11.0005 7.32843 11.0005 6.5C11.0005 5.67157 11.6721 5 12.5005 5C13.3289 5 14.0005 5.67157 14.0005 6.5ZM5.00049 6.5C5.00049 7.32843 4.32892 8 3.50049 8C2.67206 8 2.00049 7.32843 2.00049 6.5C2.00049 5.67157 2.67206 5 3.50049 5C4.32892 5 5.00049 5.67157 5.00049 6.5Z" stroke="#7B7F86" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        For {course.exam_model_name?.toUpperCase() || 'ALL'} Aspirants
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-[#757575]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 2V3.5M11.5 2V3.5M2 12.5V5C2 4.17157 2.67157 3.5 3.5 3.5H12.5C13.3284 3.5 14 4.17157 14 5V12.5M2 12.5C2 13.3284 2.67157 14 3.5 14H12.5C13.3284 14 14 13.3284 14 12.5M2 12.5V7.5C2 6.67157 2.67157 6 3.5 6H12.5C13.3284 6 14 6.67157 14 7.5V12.5M8 8.5H8.005V8.505H8V8.5ZM8 10H8.005V10.005H8V10ZM8 11.5H8.005V11.505H8V11.5ZM6.5 10H6.505V10.005H6.5V10ZM6.5 11.5H6.505V11.505H6.5V11.5ZM5 10H5.005V10.005H5V10ZM5 11.5H5.005V11.505H5V11.5ZM9.5 8.5H9.505V8.505H9.5V8.5ZM9.5 10H9.505V10.005H9.5V10ZM9.5 11.5H9.505V11.505H9.5V11.5ZM11 8.5H11.005V8.505H11V8.5ZM11 10H11.005V10.005H11V10Z" stroke="#7B7F86" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        <span>Starts on <span className="text-[#1b2124]">{course.launch_date || 'Immediately'}</span></span>
                        <span className="mx-1">Ends on <span className="text-[#1b2124]">{course.expiry_days ? `${course.expiry_days} Days` : 'Exam Date'}</span></span>
                    </div>
                </div>

                {/* Premium Strip */}
                <div className="bg-[#1b2124] rounded-lg px-4 py-[10px] flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1">
                        <span className="text-[12px] font-bold text-[#d9d9da]">Full Syllabus</span>
                        <span className="text-[12px] font-medium text-[#d9d9da]">Covered</span>
                    </div>
                    <div className="h-[24px]">
                        <svg width="68" height="26" viewBox="0 0 85 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.8" filter="url(#filter0_d)"><path d="M9.84799 8.33775C10.3841 6.33943 12.1885 4.94503 14.2574 4.93025L69.5041 4.53542C71.4972 4.52118 73.2727 5.79233 73.9015 7.68373L77.2825 17.8538C78.2724 20.8314 76.0558 23.9042 72.9179 23.9042L11.6678 23.904C8.64305 23.9039 6.44179 21.0343 7.22556 18.1128L9.84799 8.33775Z" fill="url(#paint0_linear)" stroke="url(#paint1_linear)" strokeWidth="1.02209"></path><g><mask id="path-2-outside-1" maskUnits="userSpaceOnUse" x="15.9814" y="9.50977" width="52" height="10" fill="black"><rect fill="white" x="15.9814" y="9.50977" width="52" height="10"></rect></mask><path d="M18.0306 16.1946L18.0306 12.3833L17.2705 12.3833C17.1492 12.3833 17.0635 12.2298 17.0136 11.9229C16.9922 11.7731 16.9814 11.6196 16.9814 11.4626C16.9814 11.3056 16.9922 11.1521 17.0136 11.0022C17.0635 10.6953 17.1492 10.5419 17.2705 10.5419L20.8677 10.5419C20.989 10.5419 21.0711 10.6953 21.1139 11.0022C21.1425 11.1521 21.1567 11.3056 21.1567 11.4626C21.1567 11.6196 21.1425 11.7731 21.1139 11.9229C21.0711 12.2298 20.989 12.3833 20.8677 12.3833L20.1504 12.3833L20.1504 16.1946L20.8998 16.1946C21.0211 16.1946 21.1068 16.348 21.1567 16.6549C21.1853 16.8048 21.1996 16.9583 21.1996 17.1153C21.1996 17.2723 21.1853 17.4258 21.1567 17.5756C21.1068 17.8825 21.0211 18.036 20.8998 18.036L17.2919 18.036C17.1706 18.036 17.0885 17.8825 17.0457 17.5756C17.0171 17.4258 17.0029 17.2723 17.0029 17.1153C17.0029 16.9583 17.0171 16.8048 17.0457 16.6549C17.0885 16.348 17.1706 16.1946 17.2919 16.1946L18.0306 16.1946Z" fill="white"></path><path d="M28.6041 17.8005C28.6041 17.9504 28.2687 18.0253 27.5978 18.0253C26.9269 18.0253 26.5629 17.9718 26.5058 17.8647L24.7179 14.5245L24.7179 17.854C24.7179 17.9825 24.386 18.0467 23.7222 18.0467C23.0656 18.0467 22.7373 17.9825 22.7373 17.854L22.7373 10.6918C22.7373 10.5847 23.0192 10.5312 23.5831 10.5312C23.8043 10.5312 24.0613 10.5526 24.3539 10.5954C24.6536 10.6311 24.8356 10.7025 24.8999 10.8095L26.6128 14.1069L26.6128 10.7453C26.6128 10.6097 26.9447 10.5419 27.6085 10.5419C28.2722 10.5419 28.6041 10.6097 28.6041 10.7453L28.6041 17.8005Z" fill="white"></path><path d="M34.5069 10.5419C34.6283 10.5419 34.6889 10.8595 34.6889 11.4947C34.6889 12.1228 34.6283 12.4368 34.5069 12.4368L32.5477 12.4368L32.5477 13.6573L33.8539 13.6573C33.9752 13.6573 34.0359 13.9356 34.0359 14.4924C34.0359 15.0419 33.9788 15.3167 33.8646 15.3167L32.5477 15.3167L32.5477 17.8968C32.5477 17.9967 32.4121 18.061 32.1409 18.0895C31.8768 18.1252 31.6556 18.1431 31.4772 18.1431L30.974 18.1216C30.6242 18.0788 30.4494 18.0075 30.4494 17.9075L30.4494 10.8202C30.4494 10.706 30.4708 10.6311 30.5136 10.5954C30.5636 10.5597 30.635 10.5419 30.7277 10.5419L34.5069 10.5419Z" fill="white"></path><path d="M37.0828 16.1946L37.0828 12.3833L36.3227 12.3833C36.2013 12.3833 36.1157 12.2298 36.0657 11.9229C36.0443 11.7731 36.0336 11.6196 36.0336 11.4626C36.0336 11.3056 36.0443 11.1521 36.0657 11.0022C36.1157 10.6953 36.2013 10.5419 36.3227 10.5419L39.9198 10.5419C40.0412 10.5419 40.1233 10.6953 40.1661 11.0022C40.1946 11.1521 40.2089 11.3056 40.2089 11.4626C40.2089 11.6196 40.1946 11.7731 40.1661 11.9229C40.1233 12.2298 40.0412 12.3833 39.9198 12.3833L39.2025 12.3833L39.2025 16.1946L39.952 16.1946C40.0733 16.1946 40.1589 16.348 40.2089 16.6549C40.2374 16.8048 40.2517 16.9583 40.2517 17.1153C40.2517 17.2723 40.2374 17.4258 40.2089 17.5756C40.1589 17.8825 40.0733 18.036 39.952 18.036L36.3441 18.036C36.2227 18.036 36.1407 17.8825 36.0978 17.5756C36.0693 17.4258 36.055 17.2723 36.055 17.1153C36.055 16.9583 36.0693 16.8048 36.0978 16.6549C36.1407 16.348 36.2227 16.1946 36.3441 16.1946L37.0828 16.1946Z" fill="white"></path><path d="M47.6563 17.8005C47.6563 17.9504 47.3208 18.0253 46.6499 18.0253C45.979 18.0253 45.615 17.9718 45.5579 17.8647L43.77 14.5245L43.77 17.854C43.77 17.9825 43.4382 18.0467 42.7744 18.0467C42.1178 18.0467 41.7895 17.9825 41.7895 17.854L41.7895 10.6918C41.7895 10.5847 42.0714 10.5312 42.6352 10.5312C42.8565 10.5312 43.1134 10.5526 43.406 10.5954C43.7058 10.6311 43.8878 10.7025 43.952 10.8095L45.665 14.1069L45.665 10.7453C45.665 10.6097 45.9969 10.5419 46.6606 10.5419C47.3244 10.5419 47.6563 10.6097 47.6563 10.7453L47.6563 17.8005Z" fill="white"></path><path d="M50.2617 16.1946L50.2617 12.3833L49.5015 12.3833C49.3802 12.3833 49.2946 12.2298 49.2446 11.9229C49.2232 11.7731 49.2125 11.6196 49.2125 11.4626C49.2125 11.3056 49.2232 11.1521 49.2446 11.0022C49.2946 10.6953 49.3802 10.5419 49.5015 10.5419L53.0987 10.5419C53.2201 10.5419 53.3021 10.6953 53.345 11.0022C53.3735 11.1521 53.3878 11.3056 53.3878 11.4626C53.3878 11.6196 53.3735 11.7731 53.345 11.9229C53.3021 12.2298 53.2201 12.3833 53.0987 12.3833L52.3814 12.3833L52.3814 16.1946L53.1308 16.1946C53.2522 16.1946 53.3378 16.348 53.3878 16.6549C53.4163 16.8048 53.4306 16.9583 53.4306 17.1153C53.4306 17.2723 53.4163 17.4258 53.3878 17.5756C53.3378 17.8825 53.2522 18.036 53.1308 18.036L49.523 18.036C49.4016 18.036 49.3195 17.8825 49.2767 17.5756C49.2482 17.4258 49.2339 17.2723 49.2339 17.1153C49.2339 16.9583 49.2482 16.8048 49.2767 16.6549C49.3195 16.348 49.4016 16.1946 49.523 16.1946L50.2617 16.1946Z" fill="white"></path><path d="M58.1908 17.8647C58.1908 18.0075 57.8375 18.0788 57.1309 18.0788C56.4243 18.0788 56.071 18.0075 56.071 17.8647L56.071 12.4904L54.7863 12.4904C54.665 12.4904 54.5794 12.3262 54.5294 11.9979C54.508 11.8409 54.4973 11.6803 54.4973 11.5161C54.4973 11.352 54.508 11.1914 54.5294 11.0344C54.5794 10.706 54.665 10.5419 54.7863 10.5419L59.4434 10.5419C59.5647 10.5419 59.6504 10.706 59.7003 11.0344C59.7217 11.1914 59.7325 11.352 59.7325 11.5161C59.7325 11.6803 59.7217 11.8409 59.7003 11.9979C59.6504 12.3262 59.5647 12.4904 59.4434 12.4904L58.1908 12.4904L58.1908 17.8647Z" fill="white"></path><path d="M64.8914 10.8952C64.9841 10.6454 65.4409 10.5205 66.2617 10.5205C66.4687 10.5205 66.7114 10.5347 66.9897 10.5633C67.2752 10.5918 67.4072 10.6275 67.3858 10.6704L65.159 15.1454L65.159 17.7576C65.159 17.879 64.9627 17.9646 64.5702 18.0146C64.3703 18.0431 64.1741 18.0574 63.9814 18.0574C63.7887 18.0574 63.596 18.0467 63.4032 18.0253C63.0107 17.9753 62.8144 17.8861 62.8144 17.7576L62.8144 15.2096L60.5127 10.6918C60.4841 10.6489 60.6304 10.6097 60.9516 10.574C61.2728 10.5312 61.544 10.5098 61.7652 10.5098C62.6431 10.5098 63.1249 10.6382 63.2105 10.8952L63.9921 13.0792L64.8914 10.8952Z" fill="white"></path></g></g><defs><filter id="filter0_d" x="0.5" y="-0.492188" width="83.5322" height="33.9922" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="2"></feOffset><feGaussianBlur stdDeviation="3"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0.210449 0 0 0 0 0.187481 0 0 0 0 0.148106 0 0 0 1 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><linearGradient id="paint0_linear" x1="11.501" y1="9.54908" x2="66.2997" y2="26.9689" gradientUnits="userSpaceOnUse"><stop stopColor="#6E4C0C"></stop><stop offset="0.28" stopColor="#BE903E"></stop><stop offset="0.48" stopColor="#EEB626"></stop><stop offset="0.675" stopColor="#E8B65C"></stop><stop offset="0.943813" stopColor="#B57F24"></stop></linearGradient><linearGradient id="paint1_linear" x1="41.5259" y1="4.22394" x2="41.672" y2="24.6652" gradientUnits="userSpaceOnUse"><stop stopColor="#9B701C"></stop><stop offset="1" stopColor="#EEDEB4" stopOpacity="0.82"></stop></linearGradient></defs></svg>
                    </div>
                </div>

                <div className="mt-auto">
                    {/* Price details */}
                    <div className="flex items-end justify-between mb-4">
                        <div className="flex flex-col">
                            {course.is_free ? (
                                <span className="text-[24px] font-bold text-[#1b2124]">FREE</span>
                            ) : (
                                <>
                                    <div className="flex items-baseline gap-2 leading-none mb-1">
                                        <span className="text-[20px] font-bold text-[#1b2124]">{currencySymbol}{currentPrice}</span>
                                        <span className="text-[13px] font-medium text-[#71717a] line-through">{currencySymbol}{originalPrice}</span>
                                    </div>
                                    <span className="text-[11px] font-medium text-[#757575] mt-1">
                                        (For Full Batch)
                                    </span>
                                </>
                            )}
                        </div>
                        
                        {!course.is_free && (
                            <div className="flex bg-[#dff1e4] h-[24px] rounded-r-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="24" viewBox="0 0 11 24" fill="none"><path d="M1.07059 12.6562C0.743397 12.2799 0.743397 11.7201 1.07059 11.3438L10.5 0.5L10.5 23.5L1.07059 12.6562Z" fill="#DFF1E4"></path></svg>
                                <div className="flex items-center gap-1.5 px-2">
                                    <svg width="14" height="15" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="heroicons-mini/tag"><path id="Subtract" fillRule="evenodd" clipRule="evenodd" d="M5.5 3.5C4.11929 3.5 3 4.61929 3 6V8.87868C3 9.54172 3.26339 10.1776 3.73223 10.6464L10.2322 17.1464C11.2085 18.1228 12.7915 18.1228 13.7678 17.1464L16.6464 14.2678C17.6228 13.2915 17.6228 11.7085 16.6464 10.7322L10.1464 4.23223C9.67761 3.76339 9.04172 3.5 8.37868 3.5H5.5ZM6 7.5C6.55228 7.5 7 7.05228 7 6.5C7 5.94772 6.55228 5.5 6 5.5C5.44772 5.5 5 5.94772 5 6.5C5 7.05228 5.44772 7.5 6 7.5Z" fill="#1B7938"></path></g></svg>
                                    <span className="text-[10px] font-semibold text-[#1b7938] leading-none">Discount of {discountPercent}% applied</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <Link
                            to={`/courses/${course.slug || course.id}`}
                            className="flex items-center justify-center bg-white border border-[#5A4BDA] text-[#5A4BDA] font-semibold text-[14px] py-[10px] rounded-[6px] hover:bg-[#f8f7ff] transition-colors"
                        >
                            EXPLORE
                        </Link>
                        <a
                            href={course.launch_date?.toLowerCase() === 'coming soon' ? '#' : `https://app.italostudy.com/courses?highlight=${course.id}`}
                            className={`flex items-center justify-center font-semibold text-[14px] py-[10px] rounded-[6px] transition-colors ${course.launch_date?.toLowerCase() === 'coming soon' ? "bg-[#e2e8f0] text-slate-500 cursor-not-allowed pointer-events-none" : "bg-[#5A4BDA] text-white hover:bg-[#483aab]"}`}
                        >
                            {course.launch_date?.toLowerCase() === 'coming soon' ? 'COMING SOON' : 'BUY NOW'}
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function CoursesMarketplace() {
    const [activeExam, setActiveExam] = useState<'all' | 'IMAT' | 'CEnT-S' | 'TOLC-MED' | 'TOLC-I' | string>('all');
    const [sortPricing, setSortPricing] = useState<string>('');
    const [languageFilter, setLanguageFilter] = useState<string>('');
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentSlide, setCurrentSlide] = useState(0);

    const bannerSlides = [
        {
            tag: "New Batches Launched",
            title: "Your Gateway to Italian Medical Schools",
            titleHighlight: "Top Educators",
            desc: "Structured courses for IMAT, TOLC-MED, TOLC-I, and CEnT-S. Taught by top educators in Italy.",
            bgFrom: "from-[#5A4BDA]",
            bgTo: "to-[#4b3c9c]",
            accent: "text-[#f0c14b]",
            icon: GraduationCap
        },
        {
            tag: "Premium Features",
            title: "Live Classes & Comprehensive Materials",
            titleHighlight: "Everything You Need",
            desc: "Get access to interactive live sessions, recorded video lectures, and thousands of mock questions.",
            bgFrom: "from-[#0f172a]",
            bgTo: "to-[#1e293b]",
            accent: "text-[#38bdf8]",
            icon: Play
        },
        {
            tag: "Limited Time",
            title: "Unlock Exclusive Discounts on Full Batches",
            titleHighlight: "Lifetime Access",
            desc: "Enroll now and secure your future with our lifetime access options at unbeatable prices.",
            bgFrom: "from-[#1b2124]",
            bgTo: "to-[#2a3338]",
            accent: "text-[#10b981]",
            icon: Zap
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [bannerSlides.length]);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                // Fetch exam models to map UUID to Name
                const { data: exams } = await supabase.from('exams' as any).select('slug, name');
                const examMap = (exams || []).reduce((acc: any, e: any) => ({ ...acc, [e.slug]: e.name }), {});

                const { data } = await supabase.from('courses' as any).select('*').eq('is_active', true).order('created_at', { ascending: false });
                if (data) {
                    const mapped = data.map((c: any) => ({
                        ...c,
                        exam_model_name: c.exam_model_id ? (examMap[c.exam_model_id] || c.exam_model_id) : 'General'
                    }));
                    setCourses(mapped);
                }
            } catch (err) {
                console.error(err);
            }
            setIsLoading(false);
        };
        fetchCourses();
    }, []);

    let filtered = activeExam === 'all' ? courses : courses.filter(c => c.exam_model_name && c.exam_model_name.toLowerCase().includes(activeExam.toLowerCase()));
    
    if (languageFilter) {
        filtered = filtered.filter(c => (c.language || 'English').toLowerCase() === languageFilter.toLowerCase());
    }

    if (sortPricing === 'low-to-high') {
        filtered = [...filtered].sort((a, b) => (a.price_eur || 0) - (b.price_eur || 0));
    } else if (sortPricing === 'high-to-low') {
        filtered = [...filtered].sort((a, b) => (b.price_eur || 0) - (a.price_eur || 0));
    }

    return (
        <div className="min-h-screen bg-[#f4f3ff] font-sans text-slate-900 selection:bg-indigo-100 relative overflow-x-hidden">
            <SEO
                title="Online Courses for IMAT & CEnT-S | ItaloStudy"
                description="Expert-led online courses for IMAT Biology, Chemistry, Physics and CEnT-S. One-time payment, lifetime access. Italy's highest-rated Italian medical entrance exam prep."
                keywords="IMAT biology course, IMAT chemistry course, CEnT-S biology online course, Italian medical entrance exam preparation, IMAT online classes, best IMAT course 2026, CEnT-S preparation course"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "name": "ItaloStudy Online Courses",
                    "description": "Expert-led online courses for IMAT and CEnT-S Italian medical entrance exams",
                    "numberOfItems": courses.length,
                    "itemListElement": courses.map((c, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "name": c.title,
                        "url": `https://italostudy.com/courses#${c.id}`,
                        "offers": { "@type": "Offer", "price": c.price_eur, "priceCurrency": "EUR" }
                    }))
                }}
            />

            {/* Background blobs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-100/40 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[30%] w-[30%] h-[30%] bg-blue-100/20 rounded-full blur-[100px]" />
            </div>

            <PWNavbar />

            <main className="relative pt-24">
                {/* ── PW Style Carousel Banner ────────────────────────────────────────────── */}
                <section className="pt-4 pb-4 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 h-[380px] md:h-[280px]">
                            {bannerSlides.map((slide, i) => (
                                <div 
                                    key={i}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row items-center justify-center ${currentSlide === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgFrom} ${slide.bgTo} opacity-90`} />
                                    {/* Decorative blur */}
                                    <div className="absolute -top-24 -right-10 w-64 h-64 bg-white rounded-full blur-[100px] opacity-10 pointer-events-none" />
                                    
                                    <div className="relative z-10 p-6 md:p-12 md:w-2/3 h-full flex flex-col justify-center items-start">
                                        <span className={`inline-block px-3 py-1 bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider rounded-sm mb-4 border border-white/20`}>
                                            {slide.tag}
                                        </span>
                                        <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 text-left">
                                            {slide.title.split(slide.titleHighlight)[0]}
                                            {slide.title.includes(slide.titleHighlight) && (
                                                <span className={slide.accent}>{slide.titleHighlight}</span>
                                            )}
                                            {slide.title.split(slide.titleHighlight)[1]}
                                        </h1>
                                        <p className="text-slate-200 text-sm md:text-base font-medium mb-6 max-w-lg text-left">
                                            {slide.desc}
                                        </p>
                                        <a href="#courses" className="inline-flex items-center justify-center bg-white text-[#1b2124] font-bold text-[14px] px-6 py-3 rounded-md hover:bg-slate-100 transition-colors shadow-sm">
                                            EXPLORE BATCHES
                                        </a>
                                    </div>

                                    {/* Icon Illustration Area */}
                                    <div className="relative z-10 hidden md:flex items-center justify-center w-1/3 pr-12 pb-8 md:pb-0">
                                        <div className="w-40 h-40 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl relative transform transition-transform hover:scale-105">
                                            <slide.icon className="w-16 h-16 text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Slider Navigation Dots */}
                            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                                {bannerSlides.map((_, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setCurrentSlide(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${currentSlide === i ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Courses grid ────────────────────────────────────── */}
                <section id="courses" className="pt-8 pb-20 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-10">
                            {/* Top tabs PW style */}
                            <div className="flex border-b-[1.5px] border-[#e2e8f0] mb-5 overflow-x-auto no-scrollbar">
                                {(['all', 'CEnT-S', 'IMAT'] as const).map((f) => (
                                    <button key={f}
                                        onClick={() => setActiveExam(f)}
                                        className={`px-6 py-3.5 text-[15px] font-semibold whitespace-nowrap transition-all border-b-[3px] ${
                                            activeExam === f
                                                ? 'border-[#5A4BDA] text-[#5A4BDA]'
                                                : 'border-transparent text-slate-500 hover:text-slate-800'
                                        }`}>
                                        {f === 'all' ? 'All' : f}
                                    </button>
                                ))}
                            </div>

                            {/* Secondary Filter Bar */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <select 
                                    value={sortPricing} 
                                    onChange={(e) => setSortPricing(e.target.value)}
                                    className="px-4 py-2 rounded-full border border-slate-300 bg-white text-[13px] font-medium text-slate-700 outline-none focus:border-[#5A4BDA] cursor-pointer appearance-none pr-8 relative"
                                    style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '14px' }}
                                >
                                    <option value="">Pricing</option>
                                    <option value="high-to-low">High to Low</option>
                                    <option value="low-to-high">Low to High</option>
                                </select>

                                <select 
                                    value={languageFilter} 
                                    onChange={(e) => setLanguageFilter(e.target.value)}
                                    className="px-4 py-2 rounded-full border border-slate-300 bg-white text-[13px] font-medium text-slate-700 outline-none focus:border-[#5A4BDA] cursor-pointer appearance-none pr-8 relative"
                                    style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '14px' }}
                                >
                                    <option value="">Language</option>
                                    <option value="english">English</option>
                                    <option value="italian">Italian</option>
                                </select>
                            </div>
                            
                            <div className="text-left mb-6">
                                <p className="text-[14px] font-semibold text-slate-800">
                                    Showing {filtered.length} Total Batches
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {isLoading ? (
                                <div className="col-span-full py-10 flex justify-center">
                                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="col-span-full py-10 text-center text-slate-500">
                                    No courses found for this category.
                                </div>
                            ) : (
                                filtered.map((course, i) => (
                                    <CourseCard key={course.id} course={course} index={i} />
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Messaging: Courses vs Subscriptions ─────────────── */}
                <section className="py-20 px-4 bg-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]" />
                    </div>
                    <div className="container mx-auto max-w-5xl relative z-10">
                        <div className="text-center mb-12">
                            <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-2">Two Ways to Prepare</p>
                            <h2 className="text-3xl font-black text-white">Course vs Subscription — What's the Difference?</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Course */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-5">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white mb-1">Courses</h3>
                                    <p className="text-slate-400 text-sm">Buy Course — Lifetime Access</p>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    <strong className="text-white">Sell the outcome & the expert.</strong><br />
                                    "Master IMAT Biology in 30 days — with Italy's top instructors." Don't waste time on wrong resources. Follow a proven path.
                                </p>
                                <div className="space-y-2">
                                    {['Structured video lessons by experts', 'One-time payment, no subscription', 'Progress at your own pace', 'Downloadable notes included'].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                                            <CheckCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />{f}
                                        </div>
                                    ))}
                                </div>
                                <a href="#courses" className="flex items-center gap-2 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl w-fit hover:bg-indigo-700 transition-colors">
                                    Browse Courses <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                            {/* Subscription */}
                            <div className="bg-white/5 border border-violet-500/30 rounded-3xl p-8 space-y-5 relative">
                                <div className="absolute top-4 right-4 px-2.5 py-1 bg-violet-500 rounded-full text-[9px] font-black text-white uppercase tracking-widest">Daily Study Partner</div>
                                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white mb-1">Subscriptions</h3>
                                    <p className="text-slate-400 text-sm">Start Free → Upgrade when ready</p>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    <strong className="text-white">Sell continuity & confidence.</strong><br />
                                    "Your daily study partner — practice, mock, improve." Don't study blindly. Track your real progress every day.
                                </p>
                                <div className="space-y-2">
                                    {['Unlimited daily practice questions', 'Full-length mock exams', 'Real-time analytics & progress', 'Monthly subscription — cancel anytime'].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                                            <CheckCircle className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />{f}
                                        </div>
                                    ))}
                                </div>
                                <a href="/pricing" className="flex items-center gap-2 bg-violet-600 text-white font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl w-fit hover:bg-violet-700 transition-colors">
                                    View Subscription Plans <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Bundle upsell ────────────────────────────────────── */}
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-[2.5rem] p-10 md:p-14 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full mb-6">
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Bundle Deal</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                                    Course + Subscription.<br />The Ultimate Study Setup.
                                </h2>
                                <p className="text-white/70 text-base mb-8 max-w-xl mx-auto">
                                    Get a course for structured learning <strong className="text-white">and</strong> a Pro subscription for daily practice. Pay for both in one checkout — two separate, secure payments.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <a href="https://app.italostudy.com/courses"
                                        className="flex items-center gap-2 bg-white text-indigo-700 font-black text-sm uppercase tracking-widest px-8 py-3.5 rounded-xl hover:scale-105 transition-transform shadow-xl">
                                        Get the Bundle <ChevronRight className="w-4 h-4" />
                                    </a>
                                    <a href="/pricing" className="text-white/70 text-sm font-bold hover:text-white transition-colors">
                                        View plans first →
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── Guarantee ────────────────────────────────────────── */}
                <section className="py-16 px-4 bg-white border-t border-slate-100">
                    <div className="container mx-auto max-w-4xl">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                                    <ShieldCheck className="w-10 h-10 text-emerald-600" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">What You Get With Every Course</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {GUARANTEE.map(g => (
                                        <div key={g} className="flex items-center gap-2.5 text-sm text-slate-600">
                                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            {g}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
