"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-semibold tracking-wide",
    "transition-colors outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
  ].join(" "),
  {
    variants: {
      variant: {
        gold: [
          "bg-[var(--gold)] text-black",
          "hover:bg-[color-mix(in_oklab,var(--gold),white_10%)]",
        ].join(" "),
        surface: [
          "bg-[var(--surface)] text-white",
          "hover:bg-[color-mix(in_oklab,var(--surface),white_8%)]",
        ].join(" "),
        outline: [
          "border border-white/15 bg-transparent text-white",
          "hover:bg-white/5",
        ].join(" "),
      },
      size: {
        pill: "h-11 rounded-full px-6",
        sm: "h-9 rounded-full px-4",
        lg: "h-12 rounded-full px-7 text-base",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "pill",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      type={type ?? "button"}
      {...props}
    />
  );
}

export { Button, buttonVariants };

