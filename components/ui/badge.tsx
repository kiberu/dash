"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
    "border border-white/10",
  ].join(" "),
  {
    variants: {
      variant: {
        surface: "bg-white/5 text-white/90",
        gold: "bg-[var(--gold)] text-black border-black/10",
      },
    },
    defaultVariants: {
      variant: "surface",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

