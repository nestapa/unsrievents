"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChartData {
  name: string;
  value: number;
}

interface AreaChartProps {
  data: ChartData[];
  color?: string;
  height?: number;
  className?: string;
}

export function SimpleAreaChart({ data, color = "var(--primary)", height = 200, className }: AreaChartProps) {
  if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-muted-foreground italic text-xs">No data available</div>;

  const max = Math.max(...data.map((d) => d.value), 1);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.value / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className={cn("w-full relative group", className)} style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area */}
        <polyline
          points={areaPoints}
          fill="url(#chartGradient)"
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - (d.value / max) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.5"
              fill={color}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          );
        })}
      </svg>
      
      {/* X-Axis Labels */}
      <div className="flex justify-between mt-4">
        {data.filter((_, i) => i % (data.length > 6 ? 2 : 1) === 0).map((d, i) => (
          <span key={i} className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}

interface BarChartProps {
  data: any[];
  height?: number;
  className?: string;
  dataKey?: string;
  labelKey?: string;
}

export function SimpleBarChart({ data, height = 200, className, dataKey = "value", labelKey = "name" }: BarChartProps) {
  if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-muted-foreground italic text-xs">No data available</div>;

  const max = Math.max(...data.map((d) => d[dataKey]), 1);

  return (
    <div className={cn("w-full flex flex-col justify-end gap-2 group", className)} style={{ height }}>
      <div className="flex items-end justify-between h-full gap-2 px-2">
        {data.map((d, i) => {
          const percentage = (d[dataKey] / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="relative w-full group/bar">
                    <div 
                        className="w-full bg-primary/20 hover:bg-primary transition-all duration-500 rounded-t-lg relative"
                        style={{ height: `${percentage}%` }}
                    >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[10px] font-black bg-foreground text-background px-1.5 py-0.5 rounded">
                            {d[dataKey]}
                        </div>
                    </div>
                </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between border-t border-border/50 pt-2">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-[8px] font-black text-muted-foreground uppercase text-center truncate px-1">
            {d[labelKey]}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SimplePieChart({ data }: { data: ChartData[] }) {
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-muted-foreground italic text-xs">No data available</div>;

    const total = data.reduce((acc, d) => acc + d.value, 0);
    let cumulativePercent = 0;

    const colors = [
        "var(--primary)",
        "#a855f7", // purple-500
        "#10b981", // emerald-500
        "#f59e0b", // amber-500
        "#ef4444", // red-500
        "#3b82f6", // blue-500
    ];

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative h-40 w-40">
                <svg viewBox="0 0 32 32" className="h-full w-full -rotate-90">
                    {data.map((d, i) => {
                        const percent = d.value / total;
                        const strokeDasharray = `${percent * 100} 100`;
                        const strokeDashoffset = -cumulativePercent * 100;
                        cumulativePercent += percent;

                        return (
                            <circle
                                key={i}
                                r="16"
                                cx="16"
                                cy="16"
                                fill="transparent"
                                stroke={colors[i % colors.length]}
                                strokeWidth="32"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000 hover:opacity-80 cursor-pointer"
                            />
                        );
                    })}
                    <circle r="12" cx="16" cy="16" fill="var(--card)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black tracking-tighter">{total}</span>
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">TOTAL</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                        <span className="text-[10px] font-black uppercase tracking-tight truncate flex-1">{d.name}</span>
                        <span className="text-[10px] font-bold text-muted-foreground">{d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
