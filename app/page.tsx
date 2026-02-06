import budget from "@/data/budget.json";
import stats from "@/data/stats.json";
import { HomeClient } from "@/components/HomeClient";

export default function Home() {
  const items = budget.sections.flatMap((s) => s.items);
  const targetTotal = items.reduce((acc, i) => acc + (i.total ?? 0), 0);

  return (
    <HomeClient
      cashReceived={stats.cashReceived}
      totalPledged={stats.totalPledged}
      targetTotal={targetTotal}
      items={items}
    />
  );
}
