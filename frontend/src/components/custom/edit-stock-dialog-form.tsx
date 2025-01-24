"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StockType, useStocks } from "@/context/StocksContext";
import { useQuote } from "@/hooks/hooks";
import { APIURL, finhubAPIURL } from '@/lib/utils';
import { Edit } from "lucide-react";
import React, { useState } from 'react';
import AsyncSelect from "react-select/async";

type SearchResultType = {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
};

type SelectedStockType = {
    name: string;
    symbol: string;
    quantity: number;
    buyPrice: number;
}

export default function EditStockDialogForm({ id, name, price, quantity, symbol }: Readonly<StockType>) {
    const [selectedStock, setSelectedStock] = useState<SelectedStockType>({
        name,
        symbol,
        quantity,
        buyPrice: price
    });
    const { getQuote } = useQuote();
    const [open, setOpen] = useState(false);
    const { setStocks, stocks } = useStocks();

    const loadOptions = async (inputValue: string) => {
        console.log(inputValue);
        const response = await fetch(finhubAPIURL('search', 'exchange=US', 'q=' + inputValue));
        const data: { count: number, result: SearchResultType[] } = await response.json();
        return data.result.map(item => ({
            label: item.description,
            value: item.symbol
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const token = document.cookie.split('; ').find(row => row.startsWith('token'))?.split('=')[1];
        const response = await fetch(APIURL('stocks'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id, ...selectedStock })
        });
        const data = await response.json();
        if (response.ok) {
            setStocks([
                ...stocks.filter(stock => stock.id !== data.id),
                {
                    id: data.id,
                    name: data.name,
                    symbol: data.symbol,
                    quantity: data.quantity,
                    price: data.buyPrice,
                    currentPrice: data.buyPrice
                }
            ]);
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'icon'}>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Edit Stock</DialogTitle>
                </DialogHeader>
                <form className='grid sm:grid-cols-2 gap-4' onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="stockname">Stock Name</Label>
                        <AsyncSelect
                            id="stockname"
                            name="name"
                            loadOptions={loadOptions}
                            defaultValue={{ label: name, value: symbol }}
                            onChange={async (val) => {
                                if (!val) return;

                                const data = await getQuote(val.value);

                                setSelectedStock({
                                    name: val.label,
                                    symbol: val.value,
                                    quantity: 1,
                                    buyPrice: data.c
                                });
                            }} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input type='text' id="symbol" name="symbol" readOnly value={selectedStock?.symbol || ""} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input type='number' id="quantity" name="quantity" defaultValue={1} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="buyprice">Buy Price</Label>
                        <Input type='number' id="buyprice" name="buyprice" readOnly value={selectedStock?.buyPrice || ""} />
                    </div>
                    <Button className='col-span-full'>Edit</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
