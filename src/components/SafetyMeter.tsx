import { LRS_LIMIT, formatINR } from "@/lib/tcs-logic";
import { Shield, AlertTriangle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SafetyMeterProps {
  totalUsed: number;
}

export default function SafetyMeter({ totalUsed }: SafetyMeterProps) {
  const pct = Math.min((totalUsed / LRS_LIMIT) * 100, 120);
  const remaining = Math.max(0, LRS_LIMIT - totalUsed);
  const status = pct >= 100 ? "danger" : pct >= 80 ? "warning" : "safe";

  const statusConfig = {
    safe: { icon: Shield, label: "Within Safe Limit", barClass: "bg-safe" },
    warning: { icon: AlertTriangle, label: "Approaching Limit", barClass: "bg-warning" },
    danger: { icon: XCircle, label: "Limit Exceeded", barClass: "bg-danger" },
  };

  const { icon: Icon, label, barClass } = statusConfig[status];

  return (
    <div className="rounded-lg bg-card p-5 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${status === "safe" ? "text-safe" : status === "warning" ? "text-warning" : "text-danger"}`} />
          <h3 className="font-heading text-sm font-semibold tracking-tight">{label}</h3>
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
        <span>{remaining > 0 ? `${formatINR(remaining)} remaining` : "Limit exceeded"}</span>
      </div>
    </div>
  );
}
