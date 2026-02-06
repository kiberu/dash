"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseUGX } from "@/lib/money";
import type { BudgetItem } from "@/components/BudgetItemCard";

type PledgeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: BudgetItem | null;
  onSend: (payload: {
    name: string;
    amount: number;
    item: BudgetItem | null;
  }) => void;
};

export function PledgeDialog({
  open,
  onOpenChange,
  item,
  onSend,
}: PledgeDialogProps) {
  const [name, setName] = React.useState("");
  const [amountText, setAmountText] = React.useState("");

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem("pledge_name");
      if (saved) setName(saved);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      if (name.trim()) window.localStorage.setItem("pledge_name", name);
    } catch {
      // ignore
    }
  }, [name]);

  React.useEffect(() => {
    if (!open) return;
    // When opening for a new item, keep name but reset amount.
    setAmountText("");
  }, [open, item?.id]);

  const amount = parseUGX(amountText);
  const isValid = name.trim().length > 1 && amount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wide">
            Pledge Contribution
          </DialogTitle>
          <DialogDescription>
            {item ? (
              <>
                You’re pledging towards{" "}
                <span className="font-semibold text-white">{item.name}</span>.
              </>
            ) : (
              "You’re making a general pledge (no specific item)."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-2">
            <label className="text-xs font-semibold tracking-[0.16em] text-white/70">
              NAME
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-semibold tracking-[0.16em] text-white/70">
              PLEDGE AMOUNT (UGX)
            </label>
            <Input
              inputMode="numeric"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              placeholder="e.g. 100,000"
            />
            <p className="text-xs text-white/50">
              Tip: you can type with or without commas.
            </p>
          </div>

          <Button
            variant="gold"
            size="lg"
            className="mt-1 w-full rounded-full text-xs font-extrabold tracking-[0.16em]"
            disabled={!isValid}
            onClick={() => {
              const trimmed = name.trim();
              if (trimmed.length <= 1) return;
              const parsed = parseUGX(amountText);
              if (!(parsed > 0)) return;
              onSend({ name: trimmed, amount: parsed, item });
            }}
          >
            SEND PLEDGE TO TREASURER
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

