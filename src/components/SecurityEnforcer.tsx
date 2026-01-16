import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SecurityEnforcer() {
    const location = useLocation();

    useEffect(() => {
        // Check if current route is whitelisted (Admin or Consultant dashboards)
        const isWhitelisted =
            location.pathname.startsWith('/admin') ||
            location.pathname.startsWith('/consultant');

        if (isWhitelisted) return;

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable F12
            if (e.key === 'F12') {
                e.preventDefault();
                return;
            }

            // Disable Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Elements)
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
                return;
            }

            // Disable Ctrl+U (View Source)
            if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
                e.preventDefault();
                return;
            }
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [location.pathname]);

    return null;
}
