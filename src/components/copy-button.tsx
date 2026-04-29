"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

export function CopyButton({ textToCopy, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors w-fit",
        isCopied ? "text-emerald-400" : "text-white/70 hover:text-white",
        className
      )}
    >
      {isCopied ? (
        <>
          <Check className="h-3 w-3" /> TERSALIN
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" /> SALIN PROMPT
        </>
      )}
    </button>
  );
}
