"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportCSVButtonProps {
  data: any[];
  filename: string;
  columns: { key: string; label: string }[];
}

export function ExportCSVButton({ data, filename, columns }: ExportCSVButtonProps) {
  const handleDownload = () => {
    if (!data || data.length === 0) return;

    // Build CSV headers
    const headers = columns.map(col => col.label).join(",");
    
    // Build CSV rows
    const rows = data.map(item => {
      return columns.map(col => {
        // Resolve nested keys like "user.name"
        const keys = col.key.split('.');
        let value = item;
        for (const k of keys) {
            value = value?.[k];
        }
        
        // Escape quotes and wrap in quotes to handle commas within values
        if (typeof value === 'string') {
           return `"${value.replace(/"/g, '""')}"`;
        }
        return value || "";
      }).join(",");
    });

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      variant="outline"
      onClick={handleDownload}
      disabled={!data || data.length === 0}
      className="h-10 px-4 rounded-xl font-black text-[10px] tracking-widest uppercase gap-2"
    >
      <Download className="h-4 w-4" /> EXPORT EXCEL
    </Button>
  );
}
