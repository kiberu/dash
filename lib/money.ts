export function formatUGX(amount: number) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `${safe.toLocaleString("en-US")} UGX`;
}

export function parseUGX(input: string) {
  const normalized = input.replaceAll(/[,\s]/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

