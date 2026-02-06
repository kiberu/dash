"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input">;

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        [
          "flex h-11 w-full rounded-2xl border border-white/10",
          "bg-white/5 px-4 py-2 text-sm text-white",
          "placeholder:text-white/40",
          "outline-none transition-colors",
          "focus:border-white/20 focus:bg-white/7",
          "disabled:cursor-not-allowed disabled:opacity-50",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export { Input };

