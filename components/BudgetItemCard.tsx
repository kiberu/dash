"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatUGX } from "@/lib/money";

export type BudgetItem = {
  id: string;
  sectionKey: string;
  sectionLabel: string;
  name: string;
  quantity?: string;
  unitPrice: number | null;
  total: number;
};

type BudgetItemCardProps = {
  item: BudgetItem;
  onPledge: (item: BudgetItem) => void;
};

export function BudgetItemCard({ item, onPledge }: BudgetItemCardProps) {
  return (
    <article className="rounded-[26px] border border-white/10 bg-[var(--surface)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <Badge className="max-w-[70%]" title={item.sectionLabel}>
          {item.sectionLabel}
        </Badge>
        <div className="text-right">
          <p className="text-xs font-semibold tracking-wide text-white/60">
            TOTAL
          </p>
          <p className="mt-1 text-base font-extrabold tracking-tight text-[var(--gold)]">
            {formatUGX(item.total)}
          </p>
        </div>
      </div>

      <h3 className="mt-4 line-clamp-2 text-lg font-extrabold uppercase tracking-wide text-white">
        {item.name}
      </h3>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm text-white/65">
          {item.quantity ? (
            <>
              Qty: <span className="font-semibold text-white/85">{item.quantity}</span>
            </>
          ) : (
            <span className="italic text-white/45">No quantity</span>
          )}
        </p>

        <Button
          variant="gold"
          size="pill"
          className="h-10 px-6 text-sm font-extrabold tracking-[0.14em]"
          onClick={() => onPledge(item)}
        >
          PLEDGE
        </Button>
      </div>
    </article>
  );
}

