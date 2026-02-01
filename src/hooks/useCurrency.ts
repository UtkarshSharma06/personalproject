import { useState, useEffect } from 'react';

interface CurrencyInfo {
    code: string;
    symbol: string;
    country: string;
}

const DEFAULT_CURRENCY: CurrencyInfo = {
    code: 'EUR',
    symbol: '€',
    country: 'IT'
};

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
    CA: { code: 'CAD', symbol: 'C$' },
    AU: { code: 'AUD', symbol: 'A$' },
    SG: { code: 'SGD', symbol: 'S$' },
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
                    try {
                        const parsedCache = JSON.parse(cached);
                        const cacheAge = Date.now() - parsedCache.timestamp;
                        // Cache for 24 hours
                        if (parsedCache.data && cacheAge < 24 * 60 * 60 * 1000) {
                            setCurrency(parsedCache.data);
                            setIsLoading(false);
                            return;
                        }
                    } catch (e) {
                        console.warn('Failed to parse cached currency');
                    }
                }

                // PRIMARY API: ipwhois.app
                let data;
                try {
                    const response = await fetch('https://ipwhois.app/json/');
                    data = await response.json();
                } catch (e) {
                    // SECONDARY API FALLBACK: ipapi.co
                    console.log('Primary IP API failed, trying fallback...');
                    const response = await fetch('https://ipapi.co/json/');
                    data = await response.json();
                }

                if (data && (data.success !== false || data.status !== 'fail')) {
                    const countryCode = data.country_code || data.country;

                    // Prioritize API returned currency info if available
                    const apiCurrencyCode = data.currency_code || data.currency;
                    const apiCurrencySymbol = data.currency_symbol || data.symbol;

                    let currencyInfo: CurrencyInfo;

                    if (apiCurrencyCode && apiCurrencySymbol) {
                        currencyInfo = {
                            code: apiCurrencyCode,
                            symbol: apiCurrencySymbol,
                            country: countryCode || 'XX'
                        };
                    } else {
                        const mappedCurrency = CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;
                        currencyInfo = {
                            ...mappedCurrency,
                            country: countryCode || 'XX'
                        };
                    }

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
                console.error('Currency detection totally failed:', error);
                setCurrency(DEFAULT_CURRENCY);
            } finally {
                setIsLoading(false);
            }
        };

        detectCurrency();
    }, []);

    const formatPrice = (priceInEUR: number): string => {
        if (priceInEUR === 0) return 'Free';

        // Exchange rates (approximate, EUR as base)
        const exchangeRates: Record<string, number> = {
            'EUR': 1,
            'USD': 1.08,    // 1 EUR ≈ 1.08 USD
            'GBP': 0.86,    // 1 EUR ≈ 0.86 GBP
            'INR': 90.5,    // 1 EUR ≈ 90.5 INR
            'NGN': 1650,    // 1 EUR ≈ 1650 NGN (Volatile)
            'EGP': 55,      // 1 EUR ≈ 55 EGP
            'PKR': 305,     // 1 EUR ≈ 305 PKR
            'BDT': 120,     // 1 EUR ≈ 120 BDT
            'TRY': 33,      // 1 EUR ≈ 33 TRY
            'BRL': 5.4,     // 1 EUR ≈ 5.4 BRL
            'KWD': 0.33,    // 1 EUR ≈ 0.33 KWD
            'RSD': 117,     // 1 EUR ≈ 117 RSD
            'MAD': 10.8,    // 1 EUR ≈ 10.8 MAD
            'NPR': 145,     // 1 EUR ≈ 145 NPR
            'KRW': 1450,    // 1 EUR ≈ 1450 KRW
            'HUF': 390,     // 1 EUR ≈ 390 HUF
            'CAD': 1.46,    // 1 EUR ≈ 1.46 CAD
            'AUD': 1.65,    // 1 EUR ≈ 1.65 AUD
            'SGD': 1.45,    // 1 EUR ≈ 1.45 SGD
        };

        const rate = exchangeRates[currency.code] || exchangeRates['USD']; // Fallback to USD if unknown
        const convertedPrice = priceInEUR * rate;

        // Special formatting for high-value currencies
        if (['KRW', 'JPY', 'VND'].includes(currency.code)) {
            return `${currency.symbol}${Math.round(convertedPrice).toLocaleString()}`;
        }

        return `${currency.symbol}${convertedPrice.toLocaleString(undefined, {
            minimumFractionDigits: rate > 10 ? 0 : 2,
            maximumFractionDigits: rate > 10 ? 0 : 2
        })}`;
    };

    return {
        currency,
        isLoading,
        formatPrice
    };
}
