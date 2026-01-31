/**
 * Proxies a Supabase storage URL to a local /assets path to hide the Supabase domain.
 * Example: https://xxx.supabase.co/storage/v1/object/public/learning-assets/file.pdf 
 * becomes /assets/learning-assets/file.pdf
 */
export const getProxiedUrl = (url: string | null | undefined): string => {
    if (!url) return '';

    // Check if it's a Supabase storage URL
    if (url.includes('.supabase.co/storage/v1/object/public/')) {
        const parts = url.split('/storage/v1/object/public/');
        if (parts.length === 2) {
            return `/assets/${parts[1]}`;
        }
    }

    return url;
};
