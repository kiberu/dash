"use client";

import * as React from "react";
import { Globe, MapPin, Phone, PhoneCall, Search } from "lucide-react";

import type { BudgetItem } from "@/components/BudgetItemCard";
import { BudgetItemCard } from "@/components/BudgetItemCard";
import { HeroStatsCard } from "@/components/HeroStatsCard";
import { PledgeDialog } from "@/components/PledgeDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildTreasurerPledgeMessage,
  getWhatsAppDeepLink,
} from "@/lib/whatsapp";

type HomeClientProps = {
  cashReceived: number;
  totalPledged: number;
  targetTotal: number;
  items: BudgetItem[];
};

export function HomeClient({
  cashReceived,
  totalPledged,
  targetTotal,
  items,
}: HomeClientProps) {
  const [selected, setSelected] = React.useState<BudgetItem | null>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");

  const categories = React.useMemo(() => {
    const uniq = new Set(items.map((i) => i.sectionLabel).filter(Boolean));
    return ["all", ...Array.from(uniq).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (category !== "all" && it.sectionLabel !== category) return false;
      if (!q) return true;
      return it.name.toLowerCase().includes(q);
    });
  }, [items, query, category]);

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-10 sm:px-6">
      <header className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/60">
            #MugoleStockMpya
          </p>
          <Button
            variant="gold"
            size="pill"
            className="h-10 px-6 text-xs font-extrabold tracking-[0.16em]"
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
          >
            PLEDGE
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold uppercase tracking-[0.08em] text-white sm:text-5xl">
            MIVULE{" "}
            <span className="text-[var(--gold)] drop-shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
              ABBEY{" "}
            </span>
          </h1>
          <p
            className="text-4xl leading-none text-white/90"
            style={{ fontFamily: "var(--font-script)" }}
          >
            Dash
          </p>
        </div>
      </header>

      <HeroStatsCard
        cashReceived={cashReceived}
        totalPledged={totalPledged}
        targetTotal={targetTotal}
      />

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold uppercase tracking-[0.12em] text-white">
              Pledge Cart
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Pick an item and send your pledge via WhatsApp.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search an item..."
              className="pl-11"
              aria-label="Search items"
            />
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <label className="text-xs font-semibold tracking-[0.16em] text-white/60">
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={[
                "h-11 w-full sm:w-[260px]",
                "rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white",
                "outline-none transition-colors",
                "focus:border-white/20 focus:bg-white/7",
              ].join(" ")}
              aria-label="Filter by category"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#1F2125]">
                  {c === "all" ? "All categories" : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <BudgetItemCard
              key={item.id}
              item={item}
              onPledge={(it) => {
                setSelected(it);
                setOpen(true);
              }}
            />
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <p className="mt-6 text-sm text-white/55">
            No items match your search/filter.
          </p>
        ) : null}
      </section>

      <footer className="mt-12 rounded-[26px] border border-white/10 bg-white/5 p-5 text-white/80">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5">
              <PhoneCall className="h-5 w-5 text-[var(--gold)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Treasurer</p>
              <p className="text-sm text-white/70">+256 701 423009</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5">
              <PhoneCall className="h-5 w-5 text-[var(--gold)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Chairperson</p>
              <p className="text-sm text-white/70">+256 740 218383</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5">
              <PhoneCall className="h-5 w-5 text-[var(--gold)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Groom</p>
              <p className="text-sm text-white/70">+256 702 963404</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs leading-5 text-white/55">
          Pledges are sent via WhatsApp. Totals on the dashboard are updated
          daily by the treasurer.
        </p>

        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-xs text-white/55">
            Built by{" "}
            <span className="font-semibold text-white/80">Tola Media</span>
          </p>

          <div className="mt-3 grid gap-2 text-xs text-white/60 sm:grid-cols-3">
            <a
              className="inline-flex items-center gap-2 hover:text-white"
              href="https://www.pwcug.com/"
              target="_blank"
              rel="noreferrer"
            >
              <Globe className="h-4 w-4 text-[var(--gold)]" />
              <span className="text-[var(--gold)]">pwcug.com</span>
            </a>

            <div className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-[var(--gold)]" />
              <span>+(256)740218383</span>
            </div>

            <div className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--gold)]" />
              <span>Hive Colab, Kanjokya House</span>
            </div>
          </div>
        </div>
      </footer>

      <PledgeDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setSelected(null);
        }}
        item={selected}
        onSend={({ name, amount, item }) => {
          const message = buildTreasurerPledgeMessage({
            name,
            amount,
            itemName: item?.name,
          });
          const url = getWhatsAppDeepLink(message);
          window.location.assign(url);

          setOpen(false);
          setSelected(null);
        }}
      />
    </div>
  );
}

