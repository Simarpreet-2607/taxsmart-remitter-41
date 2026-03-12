import { useState } from "react";
import { type Remittance } from "@/lib/tcs-logic";
import SafetyMeter from "@/components/SafetyMeter";
import InvestmentCalculator from "@/components/InvestmentCalculator";
import TransactionLedger from "@/components/TransactionLedger";
import { IndianRupee, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const INITIAL: Remittance[] = [
  { id: "1", date: "2025-06-15", amount: 300000, purpose: "investment", description: "Vested US Stocks" },
  { id: "2", date: "2025-09-02", amount: 150000, purpose: "education-self", description: "Coursera Masters" },
  { id: "3", date: "2025-11-20", amount: 210000, purpose: "investment", description: "US ETF Purchase" },
];

export default function Index() {
  const [transactions, setTransactions] = useState<Remittance[]>(INITIAL);
  const totalUsed = transactions.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <IndianRupee className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-base tracking-tight">LRS Planner</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <HelpCircle className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs" side="bottom">
              Track your ₹10 Lakh annual LRS limit and calculate TCS on foreign remittances. TCS is refundable when filing ITR.
            </TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Main */}
      <main className="container py-6 space-y-5 max-w-3xl">
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight">TCS & LRS Tracker</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitor your ₹10 Lakh tax-free remittance limit for FY 2025–26</p>
        </div>

        <SafetyMeter totalUsed={totalUsed} />
        <InvestmentCalculator totalUsed={totalUsed} />
        <TransactionLedger
          transactions={transactions}
          onAdd={(r) => setTransactions((p) => [r, ...p])}
          onRemove={(id) => setTransactions((p) => p.filter((t) => t.id !== id))}
        />
      </main>
    </div>
  );
}
