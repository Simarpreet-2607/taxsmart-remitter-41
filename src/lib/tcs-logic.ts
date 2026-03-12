export const LRS_LIMIT = 1000000; // ₹10,00,000

export type RemittancePurpose = "investment" | "education-loan" | "education-self" | "medical" | "others";

export const PURPOSE_LABELS: Record<RemittancePurpose, string> = {
  investment: "Investment",
  "education-loan": "Education (via Loan)",
  "education-self": "Education (Self-funded)",
  medical: "Medical Treatment",
  others: "Others",
};

export function getTCSRate(purpose: RemittancePurpose): number {
  switch (purpose) {
    case "education-loan": return 0.005;
    case "education-self":
    case "medical": return 0.05;
    case "investment":
    case "others":
    default: return 0.20;
  }
}

export function calculateTCS(
  amount: number,
  totalUsed: number,
  purpose: RemittancePurpose
): { tcs: number; taxableAmount: number; totalOutflow: number; remaining: number } {
  const remaining = Math.max(0, LRS_LIMIT - totalUsed);
  const taxableAmount = Math.max(0, amount - remaining);
  const rate = getTCSRate(purpose);
  const tcs = Math.round(taxableAmount * rate);
  return { tcs, taxableAmount, totalOutflow: amount + tcs, remaining };
}

export function formatINR(n: number): string {
  if (n < 0) return "-" + formatINR(-n);
  const s = Math.round(n).toString();
  if (s.length <= 3) return "₹" + s;
  let result = s.slice(-3);
  let rest = s.slice(0, -3);
  while (rest.length > 2) {
    result = rest.slice(-2) + "," + result;
    rest = rest.slice(0, -2);
  }
  if (rest.length > 0) result = rest + "," + result;
  return "₹" + result;
}

export interface Remittance {
  id: string;
  date: string;
  amount: number;
  purpose: RemittancePurpose;
  description: string;
}
