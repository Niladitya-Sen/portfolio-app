"use client";

import { Chart as ChartJS } from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

ChartJS.register();

const colors = [
    "#ef4444",
    "#f97316",
    "#fbbf24",
    "#84cc16",
    "#22c55e",
    "#0284c7",
    "#2563eb",
    "#4f46e5",
    "#7c3aed",
    "#c026d3",
    "#ec4899",
    "#fb7185"
];

export default function PieChart({ data, labels }: Readonly<{ data: number[], labels: string[] }>) {
    return (
        <Pie
            data={{
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: colors,
                    },
                ]
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
                }
            }}
        />
    )
}
