/**
 * SharedStorage - Handles auth state across subdomains on Web.
 * This implementation uses cookies scoped to the root domain (.italostudy.com)
 * to allow Single Sign-On between the marketing site and the application.
 */
const SharedStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window !== 'undefined') {
      // WEB: Try cookie first for cross-subdomain
      const name = key + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
      }
      // Fallback to localStorage
      const local = localStorage.getItem(key);
      if (local) return local;
    }
    return null;
  },
  
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window !== 'undefined') {
      const isItalostudyDomain = window.location.hostname.endsWith('italostudy.com');
      const domain = isItalostudyDomain ? '; domain=.italostudy.com' : '';
      const expires = "; max-age=" + (60 * 60 * 24 * 365);
      
      document.cookie = `${key}=${value}${expires}${domain}; path=/; SameSite=Lax${isItalostudyDomain ? '; Secure' : ''}`;
      localStorage.setItem(key, value);
    }
  },
  
  removeItem: async (key: string): Promise<void> => {
    if (typeof window !== 'undefined') {
      const isItalostudyDomain = window.location.hostname.endsWith('italostudy.com');
      const domain = isItalostudyDomain ? '; domain=.italostudy.com' : '';
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${domain}; path=/`;
      localStorage.removeItem(key);
    }
  }
};

export default SharedStorage;
