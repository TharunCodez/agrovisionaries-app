"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-transform duration-300 bg-black/40",
        open ? "translate-x-0" : "translate-x-full"
      )}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-neutral-900 shadow-xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
