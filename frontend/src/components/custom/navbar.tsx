"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { finhubAPIURL } from '@/lib/utils';
import { ChevronDown, LogOut, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';


type SearchResultType = {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
};

export default function Navbar() {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState<string | undefined>();

    useEffect(() => {
        setUsername(document.cookie.split('; ').find(row => row.startsWith('username'))?.split('=')[1]);
    }, []);

    useEffect(() => {
        setLoading(true);

        async function getStocks() {
            if (!search) return;

            try {
                const response = await fetch(finhubAPIURL('search', 'exchange=US', 'q=' + search));
                const data = await response.json();
                setSearchResults(data.result);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        const interval = setTimeout(() => {
            getStocks();
        }, 200);

        return () => {
            clearTimeout(interval);
        }
    }, [search]);

    return (
        <nav className='px-4 py-4 shadow-md flex items-center justify-between gap-4'>
            <h1>Portfolio App</h1>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='flex gap-2 items-center justify-center w-[40%] border-2 overflow-hidden border-border pl-3 rounded-lg group focus-within:border-primary transition-all'>
                        <Search size={20} className='text-gray-500 group-focus-within:text-primary transition-all' />
                        <input
                            type="text"
                            className='w-full h-full py-2.5 pr-3 outline-none'
                            readOnly
                        />
                    </div>
                </DialogTrigger>
                <DialogContent className='p-0 gap-0 min-h-[200px] max-h-[500px]'>
                    <DialogTitle className='hidden'>Results</DialogTitle>
                    <div className='flex gap-2 items-center justify-center w-full h-fit overflow-hidden pl-3 border-b-2 rounded-t-lg'>
                        <Search size={20} className='text-gray-500 group-focus-within:text-primary transition-all' />
                        <input
                            type="text"
                            className='w-full py-2.5 pr-3 outline-none'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className='max-h-[400px] h-[400px] overflow-y-auto flex flex-col' style={{ scrollbarWidth: 'thin' }}>
                        <p className='ml-4 mt-4 mb-1 font-medium'>Results</p>
                        {
                            !loading ? (
                                searchResults.map((result) => (
                                    <Link href={`/stocks/${result.symbol}`} key={result.symbol} className='p-3 hover:bg-muted mx-2 rounded-lg'>
                                        <p>{result.description}</p>
                                    </Link>
                                ))
                            ) : (
                                search && (
                                    <div className="grid mx-2">
                                        {
                                            Array.from({ length: 8 }, (_, index) => (
                                                <Skeleton key={index} className="p-3 h-12 rounded-lg mb-3" />
                                            ))
                                        }
                                    </div>
                                )
                            )
                        }
                    </div>
                </DialogContent>
            </Dialog>

            {
                username && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex flex-row gap-2 items-center justify-center">
                            <div className='w-12 aspect-square rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium'>
                                <p>{`${username.charAt(0).toUpperCase()}${username.split(" ").at(-1)?.charAt(0).toUpperCase()}`}</p>
                            </div>
                            <ChevronDown size={20} className='' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mr-4 mt-4">
                            <DropdownMenuItem onClick={() => {
                                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                                document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                                window.location.replace('/');
                            }}>
                                <LogOut size={20} className='mr-2' />
                                <p>Logout</p>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                )
            }
        </nav>
    )
}
