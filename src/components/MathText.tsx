import { useEffect, useRef } from 'react';

interface MathTextProps {
    content: string;
    className?: string;
}

declare global {
    interface Window {
        renderMathInElement: (el: HTMLElement, options?: any) => void;
    }
}

export const MathText = ({ content, className }: MathTextProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && window.renderMathInElement) {
            window.renderMathInElement(containerRef.current, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }
    }, [content]);

    return (
        <div
            ref={containerRef}
            className={className}
            dangerouslySetInnerHTML={{ __html: (content || '').replace(/\n/g, '<br/>') }}
        />
    );
};
