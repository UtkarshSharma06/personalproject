import { useEffect, useRef, HTMLAttributes } from 'react';
import 'katex/dist/katex.min.css';

interface MathTextProps extends HTMLAttributes<HTMLDivElement> {
    content: string;
    isHtml?: boolean;
}

declare global {
    interface Window {
        renderMathInElement: (el: HTMLElement, options?: any) => void;
    }
}

export const MathText = ({ content, className, isHtml = false, ...props }: MathTextProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderMath = () => {
            if (containerRef.current && window.renderMathInElement) {
                try {
                    window.renderMathInElement(containerRef.current, {
                        delimiters: [
                            { left: '\\[', right: '\\]', display: true },
                            { left: '\\(', right: '\\)', display: false },
                            { left: '$$', right: '$$', display: true },
                            { left: '$', right: '$', display: false }
                        ],
                        throwOnError: false,
                        errorColor: '#cc0000',
                        trust: true,
                        strict: false,
                        fleqn: false
                    });
                } catch (error) {
                    console.error('KaTeX rendering error:', error);
                }
            }
        };

        // Set content first, then render math
        if (containerRef.current) {
            if (isHtml) {
                // For HTML content (from TinyMCE), do not replace newlines as it breaks tags
                containerRef.current.innerHTML = content || '';
            } else {
                // For raw text/markdown, replace newlines with <br> tags
                const formattedContent = (content || '').replace(/\n/g, '<br/>');
                containerRef.current.innerHTML = formattedContent;
            }

            // Wait for KaTeX to load if not already loaded
            if (window.renderMathInElement) {
                setTimeout(renderMath, 50); // Small delay to ensure DOM is ready
            } else {
                let attempts = 0;
                const checkKatex = setInterval(() => {
                    attempts++;
                    if (window.renderMathInElement) {
                        clearInterval(checkKatex);
                        renderMath();
                    } else if (attempts > 50) {
                        clearInterval(checkKatex);
                        console.warn('KaTeX did not load in time');
                    }
                }, 100);

                return () => clearInterval(checkKatex);
            }
        }
    }, [content, isHtml]);

    return (
        <div
            ref={containerRef}
            className={className}
            {...props}
        />
    );
};
