"use client";

import AddStockDialogForm from "@/components/custom/add-stock-dialog-form";
import PieChart from "@/components/custom/pie-chart";
import TableList from "@/components/custom/table-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useStocks } from "@/context/StocksContext";

export default function Home() {
    const { stocks, loading, onceLoaded } = useStocks();
    const totalValue = stocks.reduce((acc, stock) => acc + stock.price * stock.quantity, 0);

    return (
        <main className="max-w-screen-xl w-full mx-auto p-4">
            <section className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="border-2 border-border rounded-lg p-4 w-full sm:w-[200px]">
                    <p className="text-sm font-medium mb-1 text-black/80">Total Value</p>
                    {
                        loading && !onceLoaded ? (
                            <Skeleton className="w-full rounded-lg h-8" />
                        ) : (
                            <p className="font-semibold text-2xl">{totalValue?.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            })}</p>
                        )
                    }
                </div>
                <div className="border-2 border-border rounded-lg p-4 w-full sm:w-fit">
                    <p className="text-sm mb-1 font-medium text-black/80">Top performing stock</p>
                    {
                        loading && !onceLoaded ? (
                            <Skeleton className="w-full rounded-lg h-8" />
                        ) : (
                            <p className="font-semibold text-xl">{stocks.toSorted((a, b) => {
                                const percentA = (a.currentPrice - a.price) / a.price;
                                const percentB = (b.currentPrice - b.price) / b.price;

                                return percentA - percentB;
                            }).at(-1)?.name}</p>
                        )
                    }
                </div>
            </section>
            <section className="mt-4 border-2 border-border rounded-lg flex flex-col items-center justify-center w-full sm:w-fit aspect-square p-4">
                <p className="text-sm mb-2 font-medium text-black/80">Portfolio Distribution</p>
                {
                    loading && !onceLoaded ? (
                        <Skeleton className="rounded-full w-[300px] aspect-square" />
                    ) : (
                        <PieChart
                            data={stocks.map(stock => (stock.currentPrice / totalValue) * 100)}
                            labels={stocks.map(stock => stock.name)}
                        />
                    )
                }
            </section>
            <section className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold">Holdings ({stocks.length})</h3>
                    <AddStockDialogForm />
                </div>
                <TableList
                    columns={["Symbol", "Name", "Price", "Quantity", "Buy Price"]}
                    data={stocks}
                />
            </section>
        </main>
    )
}
