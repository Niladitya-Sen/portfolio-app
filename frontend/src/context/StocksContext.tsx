"use client";

import { useQuote } from '@/hooks/hooks';
import { APIURL } from '@/lib/utils';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type StockType = {
    id: number;
    name: string;
    symbol: string;
    quantity: number;
    price: number;
    currentPrice: number;
}

export type StockContextType = {
    loading: boolean;
    onceLoaded: boolean;
    stocks: StockType[];
    setStock: (stock: StockType) => void;
    setStocks: (stocks: StockType[]) => void;
}

const StockContext = createContext<StockContextType | null>(null);

export const useStocks = () => {
    const context = useContext(StockContext);

    if (!context) {
        throw new Error('useStocks must be used within a StocksProvider');
    }

    return context;
}

export default function StocksContextProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [stocks, setStocks] = useState<StockType[]>([]);
    const { getQuote } = useQuote();
    const [loading, setLoading] = useState(false);
    const onceLoaded = useRef(false);

    useEffect(() => {
        async function getStocks() {
            setLoading(true);

            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token'))?.split('=')[1];
                const response = await fetch(APIURL('stocks'), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    method: 'GET'
                });
                const data: StockType[] = await response.json();
                const quotes = await Promise.all(data.map(stock => getQuote(stock.symbol)));
                const stocks = data.map((stock, index) => {
                    return {
                        ...stock,
                        currentPrice: quotes[index].c
                    }
                });
                setStocks(stocks);
            } catch (error) {
                console.log(error);
            } finally {
                onceLoaded.current = true;
                setLoading(false);
            }
        }
        getStocks();

        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                getStocks();
            }
        }, 120000); // Update every 2 minute

        return () => {
            clearInterval(interval);
        }
    }, []);

    const setStock = (stock: StockType) => {
        setStocks(prev => [...prev, stock]);
    }

    const value = useMemo(() => ({
        loading,
        onceLoaded: onceLoaded.current,
        stocks,
        setStock,
        setStocks
    }), [stocks, loading, onceLoaded]);

    return (
        <StockContext.Provider value={value}>
            {children}
        </StockContext.Provider>
    )
}
