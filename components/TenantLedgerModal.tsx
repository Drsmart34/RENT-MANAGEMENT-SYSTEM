'use client';

import React from 'react';
import { useRentFlow } from '@/lib/store';
import { X, BookOpen, Printer, Download, ShieldCheck } from 'lucide-react';

export default function TenantLedgerModal({
  tenancyId,
  onClose,
}: {
  tenancyId: string;
  onClose: () => void;
}) {
  const { getTenantLedger, getTenancyById, getTenantById, getUnitById, getPropertyById } = useRentFlow();

  const tenancy = getTenancyById(tenancyId);
  const tenant = tenancy ? getTenantById(tenancy.tenantId) : null;
  const unit = tenancy ? getUnitById(tenancy.unitId) : null;
  const prop = tenancy ? getPropertyById(tenancy.propertyId) : null;

  const ledger = getTenantLedger(tenancyId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <div>
              <span className="text-sm font-bold tracking-tight">
                Auditable Tenant Rent Ledger
              </span>
              <span className="text-xs text-slate-400 ml-2 font-mono">
                Section 8 Accounting Control
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Ledger</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Header Metadata */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {tenant?.fullName || 'Tenant Statement'}
              </h2>
              <div className="text-xs text-slate-600">
                Unit {unit?.unitNumber} · {prop?.name} ({prop?.gpsAddress})
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Agreed Rent Rate</div>
              <div className="text-base font-bold font-mono text-slate-900">
                GH¢{tenancy?.rentAmount.toLocaleString()} / {tenancy?.billingFrequency}
              </div>
              <div className="text-[11px] text-teal-700 font-medium">
                {tenancy?.advanceMonths} Months Advance Terms
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200/60">
            <span>Phone: <strong className="text-slate-800 font-mono">{tenant?.phone}</strong></span>
            <span>·</span>
            <span>Ghana Card: <strong className="text-slate-800 font-mono">{tenant?.idNumber}</strong></span>
            <span>·</span>
            <span>Tenancy Start: <strong className="text-slate-800 font-mono">{tenancy?.startDate}</strong></span>
          </div>
        </div>

        {/* Ledger Table - Exact Match to PDF Section 8 Example */}
        <div className="p-6 space-y-4">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Debit (Charge)</th>
                  <th className="py-3 px-4 text-right">Payment (Credit)</th>
                  <th className="py-3 px-4 text-right">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {ledger.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-sans">
                      No ledger transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  ledger.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        {new Date(entry.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </td>
                      <td className="py-3 px-4 font-sans font-medium text-slate-900">
                        {entry.description}
                        {entry.reference && (
                          <span className="ml-2 text-[10px] text-slate-400 font-mono">
                            [{entry.reference}]
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-900 font-semibold">
                        {entry.debit ? `GH¢${entry.debit.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right text-teal-700 font-semibold">
                        {entry.payment ? `GH¢${entry.payment.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        GH¢{entry.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>* Debits represent rent obligations accrued; payments represent confirmed settlements allocated.</span>
            <span className="font-mono font-semibold text-slate-700">
              Current Outstanding Balance: GH¢{ledger.length > 0 ? ledger[ledger.length - 1].balance.toLocaleString() : '0'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
