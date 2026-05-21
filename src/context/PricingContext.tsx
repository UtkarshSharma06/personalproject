import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Plan {
    id: string;
    name: string;
    description: string;
    monthlyPrice: number;
    quarterlyPrice: number;
    icon: string;
    color: string;
    isPopular: boolean;
    badge: string;
    isVisible: boolean;
    paddleId?: string; // Plan-level Paddle ID
    regionalPrices?: Record<string, number>; // New: Fixed regional prices (e.g. { "INR": 499, "TRY": 199 })
    cycles?: {
        id: string;
        name: string;
        price: number;
        durationValue: number;
        durationUnit: 'days' | 'months' | 'years';
        paddleId?: string; // Cycle-specific Paddle ID (Price ID)
        razorpayId?: string; // Auto-Pay Plan ID for Razorpay
        paypalId?: string; // Auto-Pay Plan ID for PayPal
        dodoId?: string; // Auto-Pay Plan ID for Dodo Payments
        regionalPrices?: Record<string, number>; // New: Fixed regional prices for this specific cycle
    }[];
}

export interface Feature {
    name: string;
    [key: string]: any;
}

export interface PricingConfig {
    plans: Plan[];
    comparison: Feature[];
    mode: 'beta' | 'live';
}

interface PricingContextType {
    config: PricingConfig | null;
    couponMessage: string | null;
    isLoading: boolean;
    refreshPricing: () => Promise<void>;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

const DEFAULT_CONFIG: PricingConfig = {
    plans: [],
    comparison: [],
    mode: 'beta'
};

export const PricingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<PricingConfig>(DEFAULT_CONFIG);
    const [couponMessage, setCouponMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPricing = async () => {
        setIsLoading(true);
        try {
            // Fetch pricing plans
            const { data: plansData } = await supabase
                .from('system_settings')
                .select('value')
                .eq('key', 'pricing_plans')
                .maybeSingle();

            if (plansData && plansData.value) {
                setConfig(plansData.value as unknown as PricingConfig);
            } else {
                setConfig(DEFAULT_CONFIG);
            }

            // Fetch coupon message
            const { data: messageData } = await supabase
                .from('system_settings')
                .select('value')
                .eq('key', 'pricing_coupon_message')
                .maybeSingle();

            if (messageData && messageData.value !== undefined) {
                const val = messageData.value;
                if (typeof val === 'string') {
                    setCouponMessage(val);
                } else if (val && typeof val === 'object' && (val as any).message) {
                    setCouponMessage(String((val as any).message));
                } else if (val && typeof val === 'object' && (val as any).text) {
                    setCouponMessage(String((val as any).text));
                } else if (val !== null) {
                    setCouponMessage(String(val));
                } else {
                    setCouponMessage(null);
                }
            } else {
                setCouponMessage(null);
            }
        } catch (err) {
            // console.error('Error fetching pricing context:', err); // Removed console.error
            setConfig(DEFAULT_CONFIG);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPricing();

        // Listen for changes
        const channel = supabase
            .channel('pricing_updates')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'system_settings' },
                (payload) => {
                    const { key } = payload.new as any;
                    if (key === 'pricing_plans' || key === 'pricing_coupon_message') {
                        fetchPricing();
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return (
        <PricingContext.Provider value={{
            config,
            couponMessage,
            isLoading,
            refreshPricing: fetchPricing
        }}>
            {children}
        </PricingContext.Provider>
    );
};

export const usePricing = () => {
    const context = useContext(PricingContext);
    if (context === undefined) {
        throw new Error('usePricing must be used within a PricingProvider');
    }
    return context;
};
