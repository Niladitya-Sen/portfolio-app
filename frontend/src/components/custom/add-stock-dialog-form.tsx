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
import { useStocks } from "@/context/StocksContext";
import { useQuote } from '@/hooks/hooks';
import { useToast } from "@/hooks/use-toast";
import { APIURL, cn, finhubAPIURL } from '@/lib/utils';
import { LoaderCircle, PlusCircle } from "lucide-react";
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

export default function AddStockDialogForm() {
    const [selectedStock, setSelectedStock] = useState<SelectedStockType>();
    const { getQuote } = useQuote();
    const { setStock } = useStocks();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const loadOptions = async (inputValue: string) => {
        const response = await fetch(finhubAPIURL('search', 'exchange=US', 'q=' + inputValue));
        const data: { count: number, result: SearchResultType[] } = await response.json();
        return data.result.map(item => ({
            label: item.description,
            value: item.symbol
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token'))?.split('=')[1];
            const response = await fetch(APIURL('stocks'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(selectedStock)
            });
            const data = await response.json();
            if (response.ok) {
                setStock({
                    id: data.id,
                    name: data.name,
                    symbol: data.symbol,
                    quantity: data.quantity,
                    price: data.buyPrice,
                    currentPrice: data.buyPrice
                });
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Add
                    <PlusCircle />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Add a Stock</DialogTitle>
                </DialogHeader>
                <form className='grid sm:grid-cols-2 gap-4' onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="stockname">Stock Name</Label>
                        <AsyncSelect id="stockname" name="name" loadOptions={loadOptions} onChange={async (val) => {
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
                    <Button className='col-span-full' disabled={loading}>
                        Add
                        <LoaderCircle className={cn("hidden ", {
                            "animate-spin block": loading
                        })} />
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
