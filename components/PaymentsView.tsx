'use client';

import React, { useState } from 'react';
import { useRentFlow } from '@/lib/store';
import { CreditCard, Plus, Search, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PaymentsView({
  onOpenRecordPayment,
}: {
  onOpenRecordPayment: () => void;
}) {
  const { payments, receipts, invoices, getTenantById, getUnitById, getPropertyById, openReceiptModal } = useRentFlow();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');

  const filteredPayments = payments.filter((pay) => {
    const tenant = getTenantById(pay.tenantId);
    const matchesSearch =
      pay.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.providerReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesMethod = selectedMethod === 'ALL' || pay.paymentMethod === selectedMethod;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Payments, Allocations & Receipts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section 7 auditable payment records linked to rent invoices with Ghanaian MoMo & bank provider references.
          </p>
        </div>
        <button
          onClick={onOpenRecordPayment}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search payment ref, MoMo ID, tenant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto self-stretch sm:self-auto">
          {['ALL', 'Mobile Money', 'Bank Transfer', 'Card', 'Cash'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMethod(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedMethod === m
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m === 'ALL' ? 'All Methods' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Payment Ref</th>
                <th className="py-3 px-4">Provider Ref</th>
                <th className="py-3 px-4">Tenant / Payer</th>
                <th className="py-3 px-4">Residence</th>
                <th className="py-3 px-4">Method & Network</th>
                <th className="py-3 px-4 text-right">Amount (GH¢)</th>
                <th className="py-3 px-4">Allocated To</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => {
                  const tenant = getTenantById(pay.tenantId);
                  const unit = getUnitById(pay.unitId);
                  const receipt = receipts.find((r) => r.paymentId === pay.id);

                  // Find which invoice was settled
                  const allocatedInvoiceIds = pay.allocations.map((a) => a.invoiceId);
                  const settledInvoices = invoices.filter((inv) => allocatedInvoiceIds.includes(inv.id));

                  return (
                    <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {pay.paymentReference}
                      </td>
                      <td className="py-3 px-4 font-mono text-teal-700 font-medium">
                        {pay.providerReference}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {tenant?.fullName || pay.payerName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {pay.payerPhone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        Unit {unit?.unitNumber || 'A1'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{pay.paymentMethod}</div>
                        <div className="text-[11px] text-slate-500">{pay.providerNetwork}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        GH¢{pay.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {settledInvoices.length > 0 ? (
                          settledInvoices.map((si) => (
                            <span
                              key={si.id}
                              className="inline-block bg-slate-100 text-slate-700 text-[11px] font-mono px-2 py-0.5 rounded mr-1"
                            >
                              {si.invoiceNumber}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px]">General Ledger</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px] font-mono whitespace-nowrap">
                        {new Date(pay.paymentDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {receipt ? (
                          <button
                            onClick={() => openReceiptModal(receipt)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded font-medium text-xs transition-colors"
                            title="View / Print Ghana Rent Receipt"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                            <span>{receipt.receiptNumber}</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
