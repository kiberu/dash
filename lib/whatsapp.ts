import { formatUGX } from "@/lib/money";

export const TREASURER_WA_NUMBER = "256701423009";

export function buildTreasurerPledgeMessage(params: {
  name: string;
  amount: number;
  itemName?: string;
}) {
  const amountText = formatUGX(params.amount);
  // Keep wording exactly as specified.
  if (params.itemName) {
    return `Hi Katende, count me in for a contribution for Dash's Introduction ! I pledge ${amountText} towards ${params.itemName}. Name: ${params.name}. - From Website`;
  }

  return `Hi Katende, count me in for a contribution for Dash's Introduction ! I pledge ${amountText}. Name: ${params.name}. - From Website`;
}

export function getWhatsAppDeepLink(text: string, phone = TREASURER_WA_NUMBER) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

