"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { cn } from "@/lib/utils";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface ChartData {
  name: string;
  value: number;
}

const defaultOptions: ChartOptions<any> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleFont: {
        family: "Inter",
        size: 14,
        weight: "bold",
      },
      bodyFont: {
        family: "Inter",
        size: 13,
      },
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "rgba(156, 163, 175, 0.8)",
        font: {
          size: 10,
          weight: "bold",
        },
      },
    },
    y: {
      grid: {
        color: "rgba(156, 163, 175, 0.1)",
      },
      ticks: {
        color: "rgba(156, 163, 175, 0.8)",
        font: {
          size: 10,
          weight: "bold",
        },
      },
    },
  },
};

export function SimpleAreaChart({ data, color = "#3b82f6", height = 300 }: { data: ChartData[], color?: string, height?: number }) {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-muted-foreground italic text-xs">No data</div>;

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        fill: true,
        label: "Value",
        data: data.map((d) => d.value),
        borderColor: color,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, `${color}44`);
          gradient.addColorStop(1, `${color}00`);
          return gradient;
        },
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div style={{ height }} className="w-full">
      <Line options={defaultOptions} data={chartData} />
    </div>
  );
}

export function SimpleBarChart({ data, height = 300, dataKey = "value", labelKey = "name" }: any) {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-muted-foreground italic text-xs">No data</div>;

  const chartData = {
    labels: data.map((d: any) => d[labelKey]),
    datasets: [
      {
        label: "Value",
        data: data.map((d: any) => d[dataKey]),
        backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, "#a855f7bb");
            gradient.addColorStop(1, "#3b82f6bb");
            return gradient;
        },
        borderRadius: 8,
        hoverBackgroundColor: "#fff",
      },
    ],
  };

  return (
    <div style={{ height }} className="w-full">
      <Bar options={defaultOptions} data={chartData} />
    </div>
  );
}

export function SimplePieChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-muted-foreground italic text-xs">No data</div>;

  const colors = ["#3b82f6", "#a855f7", "#10b981", "#f59e0b", "#ef4444"];
  
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: colors.map(c => `${c}cc`),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 20,
      },
    ],
  };

  const doughnutOptions = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: "rgba(156, 163, 175, 0.8)",
          padding: 20,
          font: {
            size: 10,
            weight: "bold",
            family: "Inter",
          },
          usePointStyle: true,
        },
      },
    },
    scales: {
        x: { display: false },
        y: { display: false },
    },
    cutout: "70%",
  };

  return (
    <div className="h-[300px] w-full flex flex-col items-center justify-center relative">
      <Doughnut options={doughnutOptions} data={chartData} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+25px)] text-center pointer-events-none">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
          <p className="text-2xl font-black">{data.reduce((acc, d) => acc + d.value, 0)}</p>
      </div>
    </div>
  );
}
