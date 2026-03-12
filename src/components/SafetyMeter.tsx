import { LRS_LIMIT, formatINR } from "@/lib/tcs-logic";
import { Shield, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SafetyMeterProps {
  totalUsed: number;
}

export default function SafetyMeter({ totalUsed }: SafetyMeterProps) {
  const pct = Math.min((totalUsed / LRS_LIMIT) * 100, 120);
  const remaining = Math.max(0, LRS_LIMIT - totalUsed);
  const status = pct >= 100 ? "milestone" : pct >= 80 ? "warning" : "safe";

  const statusConfig = {
    safe: { icon: Shield, label: "Within Safe Limit", barClass: "bg-safe", iconClass: "text-safe" },
    warning: { icon: AlertTriangle, label: "Approaching Limit", barClass: "bg-warning", iconClass: "text-warning" },
    milestone: { icon: Info, label: "Limit Milestone Reached", barClass: "bg-milestone", iconClass: "text-milestone" },
  };

  const { icon: Icon, label, barClass, iconClass } = statusConfig[status];

  return (
    <div className="rounded-lg bg-card p-5 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconClass}`} />
          <h3 className="font-heading text-sm font-semibold tracking-tight">{label}</h3>
          {status === "milestone" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs" side="bottom">
                You've reached the ₹10 Lakh threshold. This is just a heads-up; you can continue with your transactions, and we'll help you manage any applicable tax implications seamlessly.
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {formatINR(totalUsed)} / {formatINR(LRS_LIMIT)}
        </span>
      </div>

      <div className="h-3 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{Math.round(pct)}% used</span>
        <span>{remaining > 0 ? `${formatINR(remaining)} remaining` : "Threshold reached — you're all set to continue"}</span>
      </div>

      {status === "milestone" && (
        <p className="mt-3 text-xs text-muted-foreground bg-milestone/10 border border-milestone/20 rounded-md p-3">
          TCS will apply on amounts above ₹10L going forward. Don't worry — TCS is fully refundable when you file your ITR. Your transactions are not blocked.
        </p>
      )}
    </div>
  );
}
