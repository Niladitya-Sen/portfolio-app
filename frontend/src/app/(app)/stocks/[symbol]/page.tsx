"use client";

import LineChart from '@/components/custom/line-chart';
import { Button } from '@/components/ui/button';
import { alphaVantageApiUrl, finhubAPIURL } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type CompanyProfileType = {
    country: string;
    currency: string;
    exchange: string;
    ipo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
    logo: string;
    finnhubIndustry: string;
};

type WSEventType = {
    data: {
        s: string;
        p: number;
        t: number;
        v: number;
    }[];
    type: string;
}

export default function StockDetails() {
    const params = useParams();
    const [companyProfile, setCompanyProfile] = useState<CompanyProfileType>();
    const [lastPrice, setLastPrice] = useState<number>();
    const [socket, setSocket] = useState<WebSocket>();
    const [data, setData] = useState<Record<string, number>>();
    const [fullData, setFullData] = useState<Record<string, number>>();
    const [selectedData, setSelectedData] = useState<Record<string, number>>();

    async function getStockHistoryData(func: string, outputsize: string, interval?: string) {
        const response = await fetch(alphaVantageApiUrl(`function=${func}`, `symbol=${params.symbol}`, `outputsize=${outputsize}`, interval ? `interval=${interval}` : ""));

        const data = await response.json();
        const keys = Object.keys(data);
        const dates = Object.keys(data[keys[1]]);

        if (outputsize === 'compact') {
            const history = dates.map(date => ({
                [date]: Number(data[keys[1]][date]['4. close'])
            })).toReversed().reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setData(history);
        } else {
            const history = dates.map(date => ({
                [date]: Number(data[keys[1]][date]['4. close'])
            })).reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setFullData(history);
        }
    }

    useEffect(() => {
        setSelectedData({ ...data });
    }, [data]);

    useEffect(() => {
        getStockHistoryData("TIME_SERIES_DAILY", "full");
    }, []);

    useEffect(() => {
        getStockHistoryData("TIME_SERIES_INTRADAY", "compact", "5min");
    }, []);

    useEffect(() => {
        async function getCompanyProfile() {
            try {
                const response = await fetch(finhubAPIURL('stock/profile2', 'symbol=' + params.symbol));
                const data = await response.json();
                setCompanyProfile(data);
            } catch (error) {
                console.log(error);
            }
        }

        getCompanyProfile();
    }, []);

    useEffect(() => {
        const socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINHUB_API_KEY}`);

        socket.addEventListener('open', () => {
            socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': params.symbol }));
        });

        socket.addEventListener('message', function (event) {
            const data_: WSEventType = JSON.parse(event.data);
            if (data_.data && data_.data.length > 0) {
                setLastPrice(data_.data[0].p);
                setData(prev => ({
                    ...prev,
                    [new Date(data_.data[0].t).toLocaleTimeString()]: data_.data[0].p
                }));
            }
        });

        setSocket(socket);

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': params.symbol }));
            }

            socket.close();
        }
    }, []);

    useEffect(() => {
        if (data && Object.keys(data).length >= 200) {
            setData(prev => {
                if (prev) {
                    delete prev[Object.keys(prev)[0]];
                }
                return prev;
            })
        }
    }, [data]);

    function setRangeData(range: number) {
        let count = range;
        let history: Record<string, number> = {};

        for (const key in fullData) {
            if (count === 0) break;

            history = {
                [key]: fullData[key],
                ...history
            };
            count--;
        }
        setSelectedData(history);
    }

    return (
        <main className='max-w-screen-lg mx-auto w-full p-4 mb-4'>
            <Button size={'icon'} variant={'ghost'} onClick={() => window.history.back()} className='text-xl mb-4'>
                &larr;
            </Button>
            <div className='flex items-center justify-start gap-4'>
                <img src={companyProfile?.logo} alt={companyProfile?.name} className='w-20 h-20 rounded-lg' />
                <div>
                    <h1 className='text-xl font-semibold text-black/60 mb-1'>{companyProfile?.name}</h1>
                    <h2 className='text-3xl font-semibold'>{lastPrice?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    })}</h2>
                </div>
            </div>
            {
                data && (
                    <div className='aspect-video mt-4'>
                        <LineChart data={selectedData || data} />
                        <hr className='h-[0.75px] bg-black/60 my-4' />
                        <div className='flex gap-2'>
                            <Button variant={'outline'} size={'sm'} onClick={() => {
                                setSelectedData(data);
                                socket?.send(JSON.stringify({ 'type': 'subscribe', 'symbol': params.symbol }));
                            }}>1D</Button>
                            <Button
                                variant={'outline'} size={'sm'}
                                onClick={() => {
                                    socket?.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': params.symbol }));
                                    setRangeData(7);
                                }}
                            >
                                1W
                            </Button>
                            <Button
                                variant={'outline'} size={'sm'}
                                onClick={() => {
                                    socket?.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': params.symbol }));
                                    setRangeData(30);
                                }}
                            >
                                1M
                            </Button>
                            <Button
                                variant={'outline'} size={'sm'}
                                onClick={() => {
                                    socket?.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': params.symbol }));
                                    setRangeData(5 * 30);
                                }}
                            >
                                5M
                            </Button>
                            <Button
                                variant={'outline'} size={'sm'}
                                onClick={() => {
                                    socket?.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': params.symbol }));
                                    setRangeData(365);
                                }}
                            >
                                1Y
                            </Button>
                        </div>
                    </div>
                )
            }
        </main>
    )
}
