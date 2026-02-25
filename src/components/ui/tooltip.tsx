"use client";

import { ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className="relative group inline-flex">
      {children}

      <div
        className="
          pointer-events-none
          absolute -top-10 left-1/2 -translate-x-1/2
          whitespace-nowrap
          rounded-md bg-zinc-900 px-2.5 py-1
          text-xs text-white
          opacity-0 scale-95
          transition-all duration-150
          group-hover:opacity-100 group-hover:scale-100
        "
      >
        {text}

        {/* Flechita */}
        <div
          className="
            absolute left-1/2 top-full -translate-x-1/2
            h-2 w-2 rotate-45 bg-zinc-900
          "
        />
      </div>
    </div>
  );
}
