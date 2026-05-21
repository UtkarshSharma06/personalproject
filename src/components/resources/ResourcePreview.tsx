import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Loader2, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResourcePreviewProps {
    fileUrl: string;
    title: string;
    onDownload?: () => void;
}

export default function ResourcePreview({ fileUrl, title, onDownload }: ResourcePreviewProps) {
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isImageError, setIsImageError] = useState(false);

    // Function to transform PDF URL to Cloudinary Page Image URL
    const getPageImageUrl = (url: string, pageNum: number) => {
        if (!url.includes('cloudinary.com')) return url;

        // Ensure we are using 'image' resource type for transformation
        // even if it was uploaded as 'raw' (Cloudinary allows this for PDFs)
        let transformedUrl = url.replace('/raw/upload/', '/image/upload/');

        // Remove file extension for image conversion if it's a PDF
        transformedUrl = transformedUrl.replace(/\.pdf$/i, '.jpg');

        // Insert pg_N transformation
        if (transformedUrl.includes('/upload/')) {
            return transformedUrl.replace('/upload/', `/upload/pg_${pageNum}/`);
        }
        return transformedUrl;
    };

    const handleNext = () => {
        setIsLoading(true);
        setIsImageError(false);
        setPage(p => p + 1);
    };

    const handlePrev = () => {
        if (page > 1) {
            setIsLoading(true);
            setIsImageError(false);
            setPage(p => p - 1);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        setIsImageError(false);
    }, [fileUrl]);

    const imageUrl = getPageImageUrl(fileUrl, page);

    return (
        <div className="relative w-full mt-12">
            <div className="max-w-4xl mx-auto flex flex-col items-center">

                {/* Book Header / Controls */}
                <div className="flex items-center justify-between w-full mb-6 text-slate-400">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 line-clamp-1">{title}</h4>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Page {page}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* Maximize button removed */}
                    </div>
                </div>

                {/* The 3D Book Container */}
                <div className="relative group cursor-pointer w-full max-w-2xl aspect-[3/4] perspective-[1500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={page}
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -90, opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-full h-full relative preserve-3d"
                        >
                            {/* Page Texture / Shadow */}
                            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none rounded-l-2xl" />

                            {/* Main Image */}
                            <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative">
                                {isLoading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Opening Page...</span>
                                    </div>
                                )}

                                {isImageError ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                                        <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100/50">
                                            <FileText className="w-8 h-8 text-indigo-400" />
                                        </div>
                                        <h5 className="font-bold text-slate-800 mb-1">Preview Fallback</h5>
                                        <p className="text-[10px] text-slate-500 mb-6 max-w-[200px] mx-auto leading-relaxed">
                                            This PDF was uploaded as a "Raw" file. Please re-upload it in the Admin Panel to enable the 3D Book Preview.
                                        </p>

                                        <div className="w-full h-full max-h-[300px] border rounded-xl overflow-hidden bg-white mb-4">
                                            <iframe
                                                src={`${fileUrl}#toolbar=0&view=FitH`}
                                                className="w-full h-full border-none"
                                                title="PDF Fallback"
                                            />
                                        </div>

                                        <Button
                                            variant="outline"
                                            className="rounded-xl font-black uppercase tracking-widest text-[9px] h-8"
                                            onClick={() => onDownload ? onDownload() : window.open(fileUrl, '_blank')}
                                        >
                                            View Full PDF
                                        </Button>
                                    </div>
                                ) : (
                                    <img
                                        src={imageUrl}
                                        alt={`${title} - Page ${page}`}
                                        className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                                        onLoad={() => setIsLoading(false)}
                                        onError={() => {
                                            setIsLoading(false);
                                            setIsImageError(true);
                                        }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Overlays */}
                    <div className="absolute inset-y-0 -left-12 lg:-left-20 flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={page === 1}
                            onClick={handlePrev}
                            className={`w-12 h-12 rounded-full bg-white shadow-xl border border-slate-100 text-slate-900 transition-all ${page === 1 ? 'opacity-0' : 'opacity-100 hover:-translate-x-1'}`}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </div>

                    <div className="absolute inset-y-0 -right-12 lg:-right-20 flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={isImageError}
                            onClick={handleNext}
                            className={`w-12 h-12 rounded-full bg-white shadow-xl border border-slate-100 text-slate-900 transition-all ${isImageError ? 'opacity-0' : 'opacity-100 hover:translate-x-1'}`}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Page Indicator Dot */}
                <div className="mt-8 flex gap-1.5">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${page % 3 === i ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-200'}`}
                        />
                    ))}
                </div>

                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-bounce">
                    Flip to preview
                </p>
            </div>

            <style>{`
                .perspective-{
                    perspective: 1500px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
            `}</style>
        </div>
    );
}
