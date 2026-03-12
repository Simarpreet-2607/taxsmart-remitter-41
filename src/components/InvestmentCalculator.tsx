import { useState } from "react";
import { calculateTCS, formatINR, LRS_LIMIT, PURPOSE_LABELS, type RemittancePurpose, getTCSRate } from "@/lib/tcs-logic";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface Props {
  totalUsed: number;
}

export default function InvestmentCalculator({ totalUsed }: Props) {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState<RemittancePurpose>("investment");

  const numAmount = Number(amount.replace(/,/g, "")) || 0;
  const { tcs, totalOutflow, remaining } = calculateTCS(numAmount, totalUsed, purpose);
  const willCrossLimit = totalUsed + numAmount > LRS_LIMIT;
  const rate = getTCSRate(purpose);

  return (
    <div className="rounded-lg bg-card p-5 shadow-sm border border-border">
      <h3 className="font-heading text-sm font-semibold tracking-tight mb-4">Investment Calculator</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Amount (₹)</label>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="e.g. 5,00,000"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ""))}
            className="font-heading text-lg"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Purpose of Remittance</label>
          <Select value={purpose} onValueChange={(v) => setPurpose(v as RemittancePurpose)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(PURPOSE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {numAmount > 0 && (
        <div className="mt-4 space-y-3">
          {/* Calculation breakdown */}
          <div className="rounded-md bg-secondary/60 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remittance Amount</span>
              <span className="font-medium">{formatINR(numAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">TCS ({(rate * 100).toFixed(1)}% above limit)</span>
              <span className={`font-medium ${tcs > 0 ? "text-milestone" : "text-safe"}`}>{formatINR(tcs)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
              <span>Total Outflow</span>
              <span className="flex items-center gap-1">
                <ArrowRight className="h-3.5 w-3.5" />
                {formatINR(totalOutflow)}
              </span>
            </div>
          </div>

          {/* Smart Warning */}
          {willCrossLimit ? (
            <div className="flex gap-2 items-start rounded-md bg-milestone/10 border border-milestone/20 p-3">
              <Info className="h-4 w-4 text-milestone shrink-0 mt-0.5" />
              <p className="text-xs text-foreground">
                This transfer crosses your ₹10L threshold. <strong>{formatINR(tcs)}</strong> will be collected as TCS at {(rate * 100).toFixed(1)}% — fully refundable when you file ITR. You're good to proceed!
              </p>
            </div>
          ) : (
            <div className="flex gap-2 items-start rounded-md bg-safe/10 border border-safe/20 p-3">
              <CheckCircle2 className="h-4 w-4 text-safe shrink-0 mt-0.5" />
              <p className="text-xs text-foreground">
                You have <strong>{formatINR(remaining)}</strong> left before any tax applies. Great time to invest!
              </p>
            </div>
          )}

          <div className="flex gap-2 items-start text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>TCS is refundable when you file your ITR. It's not a tax—it's a pre-collection.</span>
          </div>
        </div>
      )}
    </div>
  );
}
