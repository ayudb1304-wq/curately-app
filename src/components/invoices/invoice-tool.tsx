"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/components/theme-provider";
import type { Theme } from "@/types/theme";

type StepId = "brand" | "deliverables" | "payment";

type Deliverable = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function InvoiceStepPill({
  id,
  label,
  active,
  onSelect,
  theme,
}: {
  id: StepId;
  label: string;
  active: boolean;
  onSelect: (id: StepId) => void;
  theme: Theme;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        "rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest transition-colors border",
        active
          ? cn(theme.accentBg, theme.id === "cyber" ? "text-black" : "text-white", "border-transparent")
          : "bg-background text-zinc-600 dark:text-zinc-300 border-zinc-200/70 dark:border-zinc-800/80 hover:bg-accent"
      )}
    >
      {label}
    </button>
  );
}

function InvoicePreview({
  compact,
  projectName,
  invoiceNumber,
  paymentTerms,
  brandName,
  brandEmail,
  subtotal,
  currency,
  deliverables,
  notes,
  theme,
}: {
  compact?: boolean;
  projectName: string;
  invoiceNumber: string;
  paymentTerms: string;
  brandName: string;
  brandEmail: string;
  subtotal: number;
  currency: string;
  deliverables: Deliverable[];
  notes: string;
  theme: Theme;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/30",
        compact ? "p-4" : "p-6"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
            Signal Invoicer
          </div>
          <div className={cn("text-xl font-black tracking-tight font-heading")}>Invoice</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {projectName ? projectName : "Campaign / Project"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
            Invoice #
          </div>
          <div className="font-mono text-sm">{invoiceNumber}</div>
          <div className="mt-2">
            <Badge variant="secondary" className="border border-zinc-200/70 dark:border-zinc-800/80">
              {paymentTerms}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/20 p-3">
          <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
            Bill To
          </div>
          <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {brandName || "Brand / Agency"}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300">{brandEmail || "billing@brand.com"}</div>
        </div>
        <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/20 p-3">
          <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
            Total
          </div>
          <div className={cn("mt-1 text-2xl font-black tracking-tight", theme.id === "cyber" ? "font-metrics" : "font-heading")}>
            {formatMoney(subtotal, currency)}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Subtotal (no taxes applied)</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
            Deliverables
          </div>
          <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
            Qty × Rate
          </div>
        </div>
        <div className="mt-2 divide-y divide-zinc-200/70 dark:divide-zinc-800/80 rounded-xl border border-zinc-200/70 dark:border-zinc-800/80 overflow-hidden">
          {deliverables.map((d) => (
            <div key={d.id} className="flex items-start justify-between gap-4 bg-white/60 dark:bg-zinc-950/20 p-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                  {d.description || "Deliverable"}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-zinc-600 dark:text-zinc-300">
                  {d.quantity} × {formatMoney(d.rate, currency)}
                </div>
                <div className="text-sm font-black">{formatMoney(d.quantity * d.rate, currency)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/20 p-3">
        <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
          Notes
        </div>
        <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap">
          {notes || "Add terms, usage, and payment notes."}
        </div>
      </div>
    </div>
  );
}

export function InvoiceTool({
  mode = "page",
  onClose,
}: {
  mode?: "page" | "modal";
  onClose?: () => void;
}) {
  const { theme } = useTheme();
  const [step, setStep] = useState<StepId>("brand");

  const [brandName, setBrandName] = useState("");
  const [brandEmail, setBrandEmail] = useState("");
  const [projectName, setProjectName] = useState("");

  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: "d1", description: "1x Instagram Reel (30–45s)", quantity: 1, rate: 1500 },
    { id: "d2", description: "3x Instagram Story frames", quantity: 3, rate: 150 },
  ]);

  const [currency, setCurrency] = useState<"USD" | "GBP" | "EUR">("USD");
  const [paymentTerms, setPaymentTerms] = useState("Net 14");
  const [notes, setNotes] = useState(
    "Usage: organic social posting. Paid amplification available as an add-on."
  );

  const subtotal = useMemo(
    () =>
      deliverables.reduce(
        (sum, d) => sum + (Number.isFinite(d.quantity) ? d.quantity : 0) * (Number.isFinite(d.rate) ? d.rate : 0),
        0
      ),
    [deliverables]
  );

  const invoiceNumber = useMemo(() => {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `CR-${y}${m}${d}`;
  }, []);

  const [previewOpen, setPreviewOpen] = useState(false);
  const isMobile = mode === "page";

  return (
    <div className={cn(mode === "page" ? "p-4 sm:p-6 lg:p-8" : "p-0")}>
      {mode === "page" && (
        <header className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
                Utility Tool
              </div>
              <h1 className={cn("text-2xl sm:text-3xl font-black tracking-tight font-heading")}>
                Signal Invoicer
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                A professional invoicer that captures clean brand/deliverable structure for demand signals.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <InvoiceStepPill id="brand" label="Brand" active={step === "brand"} onSelect={setStep} theme={theme} />
              <InvoiceStepPill id="deliverables" label="Deliverables" active={step === "deliverables"} onSelect={setStep} theme={theme} />
              <InvoiceStepPill id="payment" label="Payment" active={step === "payment"} onSelect={setStep} theme={theme} />
            </div>
          </div>
        </header>
      )}

      <div className={cn("grid gap-6", mode === "page" ? "lg:grid-cols-2" : "grid-cols-1")}>
        {/* Left: Form */}
        <Card className="border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20 backdrop-blur shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                {step === "brand" ? "Brand details" : step === "deliverables" ? "Deliverables" : "Payment info"}
              </CardTitle>
              {mode === "modal" && (
                <Button variant="outline" size="sm" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-2">
              <InvoiceStepPill id="brand" label="Brand" active={step === "brand"} onSelect={setStep} theme={theme} />
              <InvoiceStepPill id="deliverables" label="Deliverables" active={step === "deliverables"} onSelect={setStep} theme={theme} />
              <InvoiceStepPill id="payment" label="Payment" active={step === "payment"} onSelect={setStep} theme={theme} />
            </div>

            {step === "brand" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Brand / Agency Name
                  </label>
                  <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Acme Studios" />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Billing Email
                  </label>
                  <Input value={brandEmail} onChange={(e) => setBrandEmail(e.target.value)} placeholder="billing@acme.com" />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Project Name
                  </label>
                  <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Spring Launch Campaign" />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    className={cn(theme.accentBg, theme.id === "cyber" ? "text-black" : "text-white")}
                    onClick={() => setStep("deliverables")}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === "deliverables" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {deliverables.map((d) => (
                    <div
                      key={d.id}
                      className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-background/60 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                              Description
                            </label>
                            <Input
                              value={d.description}
                              onChange={(e) =>
                                setDeliverables((prev) =>
                                  prev.map((x) => (x.id === d.id ? { ...x, description: e.target.value } : x))
                                )
                              }
                              placeholder="Deliverable"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                                Quantity
                              </label>
                              <Input
                                inputMode="numeric"
                                value={String(d.quantity)}
                                onChange={(e) => {
                                  const next = Number(e.target.value);
                                  setDeliverables((prev) =>
                                    prev.map((x) => (x.id === d.id ? { ...x, quantity: Number.isFinite(next) ? next : 0 } : x))
                                  );
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                                Rate
                              </label>
                              <Input
                                inputMode="decimal"
                                value={String(d.rate)}
                                onChange={(e) => {
                                  const next = Number(e.target.value);
                                  setDeliverables((prev) =>
                                    prev.map((x) => (x.id === d.id ? { ...x, rate: Number.isFinite(next) ? next : 0 } : x))
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeliverables((prev) => prev.filter((x) => x.id !== d.id))}
                          aria-label="Remove deliverable"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setDeliverables((prev) => [
                        ...prev,
                        { id: `d${prev.length + 1}`, description: "", quantity: 1, rate: 0 },
                      ])
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add deliverable
                  </Button>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
                      Subtotal
                    </div>
                    <div className={cn("text-lg font-black", theme.id === "cyber" ? "font-metrics" : "font-heading")}>
                      {formatMoney(subtotal, currency)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep("brand")}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    className={cn(theme.accentBg, theme.id === "cyber" ? "text-black" : "text-white")}
                    onClick={() => setStep("payment")}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                      Currency
                    </label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as typeof currency)}
                    >
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                      Payment Terms
                    </label>
                    <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="Net 14" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Notes / Usage / Terms
                  </label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep("deliverables")}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    className={cn(theme.accentBg, theme.id === "cyber" ? "text-black" : "text-white")}
                    onClick={() => {
                      if (mode === "modal") onClose?.();
                      else setPreviewOpen(true);
                    }}
                  >
                    {mode === "modal" ? "Done" : "Preview"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Live Preview (desktop) */}
        {mode === "page" && (
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
                    Live Preview
                  </div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    Updates as you type
                  </div>
                </div>
                <Badge variant="outline" className="border-zinc-200/70 dark:border-zinc-800/80">
                  Premium Draft
                </Badge>
              </div>
              <InvoicePreview
                projectName={projectName}
                invoiceNumber={invoiceNumber}
                paymentTerms={paymentTerms}
                brandName={brandName}
                brandEmail={brandEmail}
                subtotal={subtotal}
                currency={currency}
                deliverables={deliverables}
                notes={notes}
                theme={theme}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Preview button */}
      {isMobile && mode === "page" && (
        <div className="lg:hidden fixed bottom-24 right-4 z-40">
          <Button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className={cn("shadow-xl rounded-2xl", theme.accentBg, theme.id === "cyber" ? "text-black" : "text-white")}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Live Invoice Preview</DialogTitle>
          </DialogHeader>
          <InvoicePreview
            compact
            projectName={projectName}
            invoiceNumber={invoiceNumber}
            paymentTerms={paymentTerms}
            brandName={brandName}
            brandEmail={brandEmail}
            subtotal={subtotal}
            currency={currency}
            deliverables={deliverables}
            notes={notes}
            theme={theme}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

