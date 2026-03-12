import { useState } from "react";
import { type Remittance, type RemittancePurpose, PURPOSE_LABELS, formatINR } from "@/lib/tcs-logic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Receipt } from "lucide-react";

interface Props {
  transactions: Remittance[];
  onAdd: (r: Remittance) => void;
  onRemove: (id: string) => void;
}

export default function TransactionLedger({ transactions, onAdd, onRemove }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: "", purpose: "investment" as RemittancePurpose, description: "", date: new Date().toISOString().slice(0, 10) });

  const handleAdd = () => {
    const amount = Number(form.amount.replace(/,/g, ""));
    if (!amount || amount <= 0) return;
    onAdd({
      id: crypto.randomUUID(),
      date: form.date,
      amount,
      purpose: form.purpose,
      description: form.description || PURPOSE_LABELS[form.purpose],
    });
    setForm({ amount: "", purpose: "investment", description: "", date: new Date().toISOString().slice(0, 10) });
    setOpen(false);
  };

  return (
    <div className="rounded-lg bg-card p-5 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-heading text-sm font-semibold tracking-tight">Past Remittances</h3>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" />Add New</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle className="font-heading">Add Past Remittance</DialogTitle></DialogHeader>
            <div className="grid gap-3 mt-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount (₹)</label>
                <Input placeholder="e.g. 2,00,000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/[^0-9,]/g, "") })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Purpose</label>
                <Select value={form.purpose} onValueChange={(v) => setForm({ ...form, purpose: v as RemittancePurpose })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PURPOSE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Description (optional)</label>
                <Input placeholder="e.g. Vested deposit" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <Button onClick={handleAdd} className="mt-1">Add Remittance</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No remittances added yet. Add your past transfers to track your LRS limit.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs pl-5">Date</TableHead>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-xs">Purpose</TableHead>
                <TableHead className="text-xs text-right">Amount</TableHead>
                <TableHead className="text-xs text-right pr-5 w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-xs pl-5 text-muted-foreground">{new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                  <TableCell className="text-xs font-medium">{t.description}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{PURPOSE_LABELS[t.purpose]}</TableCell>
                  <TableCell className="text-xs text-right font-medium">{formatINR(t.amount)}</TableCell>
                  <TableCell className="text-right pr-5">
                    <button onClick={() => onRemove(t.id)} className="text-muted-foreground hover:text-danger transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
