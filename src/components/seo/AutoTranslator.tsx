import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reads the `googtrans` cookie and returns the target language code (e.g. 'tr', 'it'),
 * or null if no translation cookie is set.
 */
function getCookieLang(): string | null {
  try {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Sets the googtrans cookie on all relevant domains so Google Translate
 * picks it up on page load or after SPA navigation.
 */
function setTranslateCookie(lang: string) {
  const domains = [
    window.location.hostname,
    '.' + window.location.hostname,
    'italostudy.com',
    '.italostudy.com',
  ];
  document.cookie = `googtrans=/en/${lang}; path=/;`;
  domains.forEach(d => {
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${d}`;
  });
}

/**
 * Clears the googtrans cookie from all relevant domains.
 */
function clearTranslateCookie() {
  const domains = [
    window.location.hostname,
    '.' + window.location.hostname,
    'localhost',
    '.localhost',
    'italostudy.com',
    '.italostudy.com',
  ];
  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = `googtrans=; ${expired}`;
  domains.forEach(d => {
    document.cookie = `googtrans=; ${expired} domain=${d}`;
  });
}

/**
 * Programmatically triggers Google Translate to apply a translation.
 * Retries up to `maxAttempts` times with a 200ms delay between each.
 */
function triggerTranslation(lang: string, maxAttempts = 30) {
  const attempt = (count: number) => {
    if ((window as any).doGTranslate) {
      (window as any).doGTranslate(`en|${lang}`);
    } else {
      // Inline doGTranslate definition
      const gtElement = document.getElementById('google_translate_element');
      const select = gtElement?.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        // We consider it successful if we fired the event
      } else if (count < maxAttempts) {
        setTimeout(() => attempt(count + 1), 200);
      }
    }
  };
  attempt(0);
}

/**
 * Injects the Google Translate widget script once, hidden from the UI.
 * The cookie set before this runs tells GT which language to apply on init.
 */
function injectGoogleTranslateScript() {
  if (document.getElementById('google-translate-script')) return;

  // Hidden container required by the GT widget API
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  // GT initialisation callback
  (window as any).googleTranslateElementInit = () => {
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        autoDisplay: false,
        layout: 0, // SIMPLE
      },
      'google_translate_element'
    );
  };

  // Script tag
  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src =
    'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);

  // CSS to hide every piece of Google Translate UI
  if (!document.getElementById('goog-translate-hide-css')) {
    const style = document.createElement('style');
    style.id = 'goog-translate-hide-css';
    style.innerHTML = `
      /* Hide the top banner iframe and the skip-translate bar */
      .skiptranslate, iframe.skiptranslate { display: none !important; }
      /* Prevent GT from pushing the page body down */
      body { top: 0px !important; }
      /* Hide the hover tooltip */
      #goog-gt-tt { display: none !important; }
      /* Remove text-highlight on translated words */
      .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
      /* Hide the widget container itself */
      #google_translate_element { display: none !important; }
      /* Hide the floating banner */
      .goog-te-banner-frame { display: none !important; }
      .goog-te-menu-frame { display: none !important; }
    `;
    document.head.appendChild(style);
  }
}

/**
 * AutoTranslator — mounts once at the app root (inside BrowserRouter).
 *
 * Language resolution order (highest priority first):
 *  1. googtrans cookie  (set by the language switcher in PWNavbar)
 *  2. URL prefix        (/tr → Turkish, /it → Italian)
 *  3. Default           (English — no translation)
 *
 * On every React Router navigation it re-triggers translation so the
 * selected language persists across all pages without a full reload.
 */
export default function AutoTranslator() {
  const location = useLocation();
  // Tracks whether we have already injected the GT script in this session
  const scriptInjected = useRef(false);

  useEffect(() => {
    // --- 1. Determine target language ---
    const cookieLang = getCookieLang();
    const urlLang = location.pathname.startsWith('/tr')
      ? 'tr'
      : location.pathname.startsWith('/it')
      ? 'it'
      : null;

    // Cookie wins; URL prefix is the fallback
    const targetLang = cookieLang ?? urlLang;

    // --- 2. English / no translation ---
    if (!targetLang) {
      // If there was a cookie before, make sure it is fully cleared
      if (cookieLang) clearTranslateCookie();
      return;
    }

    // --- 3. Sync cookie if URL prefix implied a language but cookie missing ---
    if (!cookieLang && targetLang) {
      setTranslateCookie(targetLang);
    }

    // --- 4. GT script already injected — just re-trigger on this new route ---
    if (scriptInjected.current || document.getElementById('google-translate-script')) {
      scriptInjected.current = true;
      triggerTranslation(targetLang);
      return;
    }

    // --- 5. First run — inject GT script; cookie is already set so GT will
    //        apply the right language as soon as the widget initialises ---
    scriptInjected.current = true;
    injectGoogleTranslateScript();

    // Also try to trigger programmatically after the script loads, as a safety net
    // in case the cookie-based auto-translate doesn't fire fast enough on this route.
    triggerTranslation(targetLang);
  }, [location.pathname]);

  return null;
}
