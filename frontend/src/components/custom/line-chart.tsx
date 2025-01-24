"use client";

import { cn } from '@/lib/utils';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

ChartJS.register();

export default function LineChart({ data }: Readonly<{ data: Record<string, number> }>) {
    return (
        <Line
            className={cn('border-2 rounded-lg bg-muted/50')}
            data={{
                labels: Object.keys(data),
                datasets: [
                    {
                        label: '',
                        data: Object.values(data),
                        pointRadius: 0,
                        borderColor: 'hsl(221.2 83.2% 53.3%)',
                    },
                ],
            }}
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                interaction: {
                    intersect: false,
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            display: false,
                        },
                        border: {
                            display: false,
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawOnChartArea: false,
                        },
                        ticks: {
                            display: false,
                        },
                        border: {
                            display: false,
                        }
                    },
                }
            }}
        />
    )
}
