import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function AutoTranslator() {
  const location = useLocation();

  useEffect(() => {
    // Determine language from URL
    const isTr = location.pathname.startsWith('/tr');
    const isIt = location.pathname.startsWith('/it');
    
    const targetLang = isTr ? 'tr' : isIt ? 'it' : 'en';

    // Set the Google Translate cookie
    if (targetLang === 'en') {
      // Clear cookie to revert to English aggressively across all subdomains
      const domains = [window.location.hostname, '.' + window.location.hostname, 'localhost', '.localhost', 'italostudy.com', '.italostudy.com'];
      domains.forEach(d => {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${d}`;
      });
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Do NOT inject the Google Translate script if we are just displaying English
      return;
    } else {
      // Set cookie for auto-translation (from English to target)
      document.cookie = `googtrans=/en/${targetLang}; path=/;`;
      document.cookie = `googtrans=/en/${targetLang}; path=/; domain=` + window.location.hostname;
      document.cookie = `googtrans=/en/${targetLang}; path=/; domain=.` + window.location.hostname;
    }

    // Inject the Google Translate script if it doesn't exist
    if (!document.getElementById('google-translate-script')) {
      // Create a hidden div for the widget
      const widgetDiv = document.createElement('div');
      widgetDiv.id = 'google_translate_element';
      widgetDiv.style.display = 'none';
      document.body.appendChild(widgetDiv);

      // Define the callback
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: 'en', autoDisplay: false },
          'google_translate_element'
        );
      };

      // Inject the script
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      // Inject CSS to hide the Google Translate banner, tooltip, and all logos
      const style = document.createElement('style');
      style.innerHTML = `
        /* Hide all skiptranslate elements including the top banner and iframe */
        .skiptranslate, iframe.skiptranslate { display: none !important; }
        /* Prevent Google from pushing the body down */
        body { top: 0px !important; }
        /* Hide the tooltip that appears on hover */
        #goog-gt-tt { display: none !important; }
        /* Remove background highlight color when hovering over translated text */
        .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
        /* Hide the widget container entirely */
        #google_translate_element { display: none !important; }
        /* Hide the banner frame specifically */
        .goog-te-banner-frame { display: none !important; }
      `;
      document.head.appendChild(style);
    } else if ((window as any).google && (window as any).google.translate) {
      // If script is already loaded and we just changed language, reload the page to apply the new cookie
      // Or we can try to trigger translation via the widget, but reloading is safer for Google Translate
      // Actually, since this runs on initial load and route changes, let's just let it be.
      // If a user clicks from /tr to /it, they might need a hard reload.
      // But if they just click internal links on /tr, the cookie stays 'tr', no need to reload.
    }
  }, [location.pathname]);

  return null;
}
