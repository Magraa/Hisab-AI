"use client";

import { useState } from "react";
import { useHisab } from "@/lib/store";
import { entityLabel, withinRange } from "@/lib/selectors";
import { getCategory } from "@/lib/categories";
import { SubPageHeader } from "@/components/layout/SubPageHeader";

const RANGE_OPTIONS = [
  { value: "this_month", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "all_time", label: "All time" },
];

export default function ExportPage() {
  const { transactions, entities, categories } = useHisab();
  const [range, setRange] = useState("this_month");

  function getRows() {
    const now = new Date();
    let start = new Date(2000, 0, 1);
    let end = now;

    if (range === "this_month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === "last_month") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    }

    return transactions.filter((t) => withinRange(t.createdAt, start, end));
  }

  function exportCsv() {
    const rows = getRows();
    const table = [
      ["Date", "Description", "Category", "Amount", "Payment Method"],
      ...rows.map((t) => [
        new Date(t.createdAt).toLocaleString("en-IN"),
        t.entityId ? entityLabel(entities, t.entityId) ?? t.description : t.description,
        t.entityId ? "Account" : getCategory(categories, t.categoryId).label,
        String(t.amount),
        t.paymentMethod,
      ]),
    ];
    const csv = table.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hisab_${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="pb-8">
      <SubPageHeader title="Export your Hisab" />

      <div className="mx-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Date range</span>
          <div className="flex gap-2">
            {RANGE_OPTIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-medium ${
                  range === r.value ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-ink"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Format</span>
          <button
            onClick={exportCsv}
            className="rounded-xl border border-border bg-surface py-3 text-left text-sm font-medium text-ink"
          >
            CSV — spreadsheet-ready file
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-xl border border-border bg-surface py-3 text-left text-sm font-medium text-ink"
          >
            PDF — print or save from your browser
          </button>
        </div>

        <p className="text-xs text-muted">{getRows().length} transactions in this range.</p>
      </div>
    </div>
  );
}
