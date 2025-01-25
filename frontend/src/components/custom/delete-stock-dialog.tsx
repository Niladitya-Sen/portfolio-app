"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useStocks } from '@/context/StocksContext';
import { APIURL, cn } from '@/lib/utils';
import { LoaderCircle, Trash } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { useToast } from "@/hooks/use-toast";

export default function DeleteStockDialog({ id }: Readonly<{ id: number }>) {
    const [open, setOpen] = useState(false);
    const { setStocks, stocks } = useStocks();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    async function deleteStock() {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token'))?.split('=')[1];
            const response = await fetch(APIURL('stocks/' + id), {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setStocks(stocks.filter(stock => stock.id !== id));
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
                <Button size={'icon'} className='bg-red-600 hover:bg-red-500 mr-4'>
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the stock from your portfolio.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex justify-start items-center gap-2'>
                    <Button variant={'secondary'} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button className='bg-red-600 hover:bg-red-500' disabled={loading} onClick={() => {
                        deleteStock();
                        setOpen(false);
                    }}>
                        Delete
                        <LoaderCircle className={cn("hidden ", {
                            "animate-spin block": loading
                        })} />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

    )
}
