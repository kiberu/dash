import { formatUGX } from "@/lib/money";

type HeroStatsCardProps = {
  cashReceived: number;
  totalPledged: number;
  targetTotal: number;
};

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function HeroStatsCard({
  cashReceived,
  totalPledged,
  targetTotal,
}: HeroStatsCardProps) {
  const pledgedPct = clamp01(targetTotal ? totalPledged / targetTotal : 0);
  const receivedPct = clamp01(targetTotal ? cashReceived / targetTotal : 0);

  return (
    <section className="rounded-[28px] bg-[var(--gold)] p-6 text-black shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] opacity-80">
            INTRODUCTION &amp; WEDDING LAUNCH
          </p>
        </div>
        <div className="h-10 w-[3px] rounded-full bg-black/60" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-[22px] bg-black/10 p-4">
          <p className="text-[11px] font-semibold tracking-[0.18em] opacity-80">
            CASH RECEIVED
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight">
            {formatUGX(cashReceived)}
          </p>
        </div>
        <div className="rounded-[22px] bg-black/10 p-4">
          <p className="text-[11px] font-semibold tracking-[0.18em] opacity-80">
            TOTAL PLEDGED
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight">
            {formatUGX(totalPledged)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-3 w-full overflow-hidden rounded-full bg-black/30">
          <div className="relative h-full w-full">
            {/* pledged (behind) */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/55"
              style={{ width: `${pledgedPct * 100}%` }}
              aria-hidden="true"
            />
            {/* received (front) */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${receivedPct * 100}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

