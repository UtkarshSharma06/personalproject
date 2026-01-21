import { useState, useEffect } from 'react';

interface CurrencyInfo {
    code: string;
    symbol: string;
    country: string;
}

const CURRENCY_MAP: Record<string, { code: string; symbol: string }> = {
    // Europe
    IT: { code: 'EUR', symbol: '€' },
    DE: { code: 'EUR', symbol: '€' },
    FR: { code: 'EUR', symbol: '€' },
    ES: { code: 'EUR', symbol: '€' },
    AT: { code: 'EUR', symbol: '€' },
    NL: { code: 'EUR', symbol: '€' },
    BE: { code: 'EUR', symbol: '€' },
    PT: { code: 'EUR', symbol: '€' },
    GR: { code: 'EUR', symbol: '€' },
    IE: { code: 'EUR', symbol: '€' },

    // Major Markets
    US: { code: 'USD', symbol: '$' },
    GB: { code: 'GBP', symbol: '£' },
    IN: { code: 'INR', symbol: '₹' },
    NG: { code: 'NGN', symbol: '₦' },
    EG: { code: 'EGP', symbol: 'E£' },
    PK: { code: 'PKR', symbol: '₨' },
    BD: { code: 'BDT', symbol: '৳' },
    TR: { code: 'TRY', symbol: '₺' },
    BR: { code: 'BRL', symbol: 'R$' },
    KW: { code: 'KWD', symbol: 'KD' },
    RS: { code: 'RSD', symbol: 'RSD' },
    MA: { code: 'MAD', symbol: 'DH' },
    NP: { code: 'NPR', symbol: '₨' },
    KR: { code: 'KRW', symbol: '₩' },
    HU: { code: 'HUF', symbol: 'Ft' },
};

const DEFAULT_CURRENCY: CurrencyInfo = {
    code: 'EUR',
    symbol: '€',
    country: 'IT'
};

export function useCurrency() {
    const [currency, setCurrency] = useState<CurrencyInfo>(DEFAULT_CURRENCY);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const detectCurrency = async () => {
            try {
                // Check localStorage cache first
                const cached = localStorage.getItem('userCurrency');
                if (cached) {
                    const parsedCache = JSON.parse(cached);
                    const cacheAge = Date.now() - parsedCache.timestamp;
                    // Cache for 24 hours
                    if (cacheAge < 24 * 60 * 60 * 1000) {
                        setCurrency(parsedCache.data);
                        setIsLoading(false);
                        return;
                    }
                }

                // Fetch from IP geolocation API (ipwhois.io - no API key required)
                const response = await fetch('https://ipwhois.app/json/');
                const data = await response.json();

                if (data.success !== false && data.country_code) {
                    const countryCode = data.country_code;
                    const currencyData = CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;

                    const currencyInfo: CurrencyInfo = {
                        code: currencyData.code,
                        symbol: currencyData.symbol,
                        country: countryCode
                    };

                    // Cache the result
                    localStorage.setItem('userCurrency', JSON.stringify({
                        data: currencyInfo,
                        timestamp: Date.now()
                    }));

                    setCurrency(currencyInfo);
                } else {
                    setCurrency(DEFAULT_CURRENCY);
                }
            } catch (error) {
                console.error('Currency detection failed:', error);
                setCurrency(DEFAULT_CURRENCY);
            } finally {
                setIsLoading(false);
            }
        };

        detectCurrency();
    }, []);

    const formatPrice = (priceInINR: number): string => {
        if (priceInINR === 0) {
            return 'Free';
        }

        // Exchange rates (approximate, INR as base)
        const exchangeRates: Record<string, number> = {
            'INR': 1,
            'EUR': 0.011,    // 1 INR ≈ 0.011 EUR
            'USD': 0.012,    // 1 INR ≈ 0.012 USD
            'GBP': 0.0095,   // 1 INR ≈ 0.0095 GBP
            'NGN': 18.5,     // 1 INR ≈ 18.5 NGN
            'EGP': 0.60,     // 1 INR ≈ 0.60 EGP
            'PKR': 3.35,     // 1 INR ≈ 3.35 PKR
            'BDT': 1.32,     // 1 INR ≈ 1.32 BDT
            'TRY': 0.41,     // 1 INR ≈ 0.41 TRY
            'BRL': 0.070,    // 1 INR ≈ 0.070 BRL
            'KWD': 0.0037,   // 1 INR ≈ 0.0037 KWD
            'RSD': 1.30,     // 1 INR ≈ 1.30 RSD
            'MAD': 0.12,     // 1 INR ≈ 0.12 MAD
            'NPR': 1.60,     // 1 INR ≈ 1.60 NPR
            'KRW': 16.2,     // 1 INR ≈ 16.2 KRW
            'HUF': 4.30,     // 1 INR ≈ 4.30 HUF
        };

        const rate = exchangeRates[currency.code] || 1;
        const convertedPrice = priceInINR * rate;

        // Format based on currency
        if (['JPY', 'KRW'].includes(currency.code)) {
            // No decimals for these currencies
            return `${currency.symbol}${Math.round(convertedPrice)}`;
        }

        return `${currency.symbol}${convertedPrice.toFixed(2)}`;
    };

    return {
        currency,
        isLoading,
        formatPrice
    };
}
