import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { StockType, useStocks } from "@/context/StocksContext";
import { cn } from '@/lib/utils';
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import DeleteStockDialog from "./delete-stock-dialog";
import EditStockDialogForm from "./edit-stock-dialog-form";

type TableListProps = {
    columns: string[];
    data: StockType[];
};

function CustomTableRow({ id, name, symbol, quantity, price, currentPrice }: Readonly<StockType>) {
    const percentageProfit = ((currentPrice - price) / price) * 100;

    return (
        <TableRow className='h-16'>
            <TableCell>
                <span className="ml-4">
                    <Link href={`/stocks/${symbol}`} className="hover:text-primary">{symbol}</Link>
                </span>
            </TableCell>
            <TableCell>
                <span>
                    {name}
                </span>
            </TableCell>
            <TableCell className="min-w-[10rem]">
                <div>
                    {currentPrice.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    })} (
                    <span className={cn('font-medium', {
                        'text-green-700': percentageProfit > 0,
                        'text-red-500': percentageProfit < 0,
                    })}>
                        {percentageProfit > 0 ? "+" : ""}{percentageProfit.toFixed(2)}% {percentageProfit > 0 ? <>&uarr;</> : <>&darr;</>}
                    </span>)
                </div>
            </TableCell>
            <TableCell>
                <span>
                    {quantity}
                </span>
            </TableCell>
            <TableCell className="min-w-[6rem]">
                <span>
                    {(price * quantity).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    })}
                </span>
            </TableCell>
            <TableCell className='flex gap-2 items-center justify-start mt-1'>
                <EditStockDialogForm
                    id={id}
                    name={name}
                    price={price}
                    quantity={quantity}
                    symbol={symbol}
                    currentPrice={currentPrice}
                />
                <DeleteStockDialog id={id} />
            </TableCell>
        </TableRow>
    )
}

export default function TableList(props: Readonly<TableListProps>) {
    const { loading, onceLoaded } = useStocks();
    return (
        <Table className='border border-border rounded-lg'>
            <TableHeader className='bg-muted h-16'>
                <TableRow>
                    {props.columns.map((column, index) => (
                        <TableHead key={index}>
                            <span className={cn({
                                'ml-4': index === 0,
                            })}>{column}</span>
                        </TableHead>
                    ))}
                    <TableHead className=''>
                        <span className='mr-4'>Action</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    loading && !onceLoaded ? (
                        <TableRow>
                            <TableCell colSpan={6}>
                                <Skeleton className='flex items-center justify-center h-16'>
                                    Loading...
                                </Skeleton>
                            </TableCell>
                        </TableRow>
                    ) : (
                        props.data.map(row => (
                            <CustomTableRow key={row.id} {...row} />
                        ))
                    )
                }
            </TableBody>
        </Table>

    )
}
