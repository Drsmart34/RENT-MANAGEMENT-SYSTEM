'use client';

import React, { useState } from 'react';
import { useRentFlow } from '@/lib/store';
import { InvoiceStatus } from '@/lib/types';
import { ReceiptText, Plus, Search, Calendar, AlertCircle, CheckCircle, Clock, Send, CreditCard } from 'lucide-react';

export default function InvoicesView({
  onOpenRecordPayment,
}: {
  onOpenRecordPayment: (preselectedInvoiceId?: string) => void;
}) {
  const { invoices, getTenantById, getUnitById, getPropertyById, generateNextCycleInvoices, runReminderEngine } = useRentFlow();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cycleMsg, setCycleMsg] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const tenant = getTenantById(inv.tenantId);
    const unit = getUnitById(inv.unitId);
    const prop = getPropertyById(inv.propertyId);

    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (unit?.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (prop?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleGenerateNextCycle = () => {
    const count = generateNextCycleInvoices('2026-11');
    if (count > 0) {
      setCycleMsg(`Successfully generated ${count} rent invoices for November 2026 billing cycle.`);
    } else {
      setCycleMsg('All active tenancies already have generated invoices for the upcoming cycle.');
    }
    setTimeout(() => setCycleMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Rent Invoices & Obligations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated billing engine tracking Due, Partially Paid, Paid and Overdue rent schedules.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleGenerateNextCycle}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Generate Next Cycle</span>
          </button>
          <button
            onClick={() => onOpenRecordPayment()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {cycleMsg && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{cycleMsg}</span>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice #, tenant, unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto self-stretch sm:self-auto">
          {['ALL', 'Due', 'Overdue', 'Partially Paid', 'Paid', 'Upcoming'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Invoices' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Tenant & Unit</th>
                <th className="py-3 px-4">Billing Period</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Billed Amount</th>
                <th className="py-3 px-4 text-right">Paid Amount</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No invoices matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const tenant = getTenantById(inv.tenantId);
                  const unit = getUnitById(inv.unitId);
                  const prop = getPropertyById(inv.propertyId);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{tenant?.fullName}</div>
                        <div className="text-[11px] text-slate-500">
                          Unit {unit?.unitNumber} · {prop?.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {inv.periodStart} to {inv.periodEnd}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {inv.dueDate}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        GH¢{inv.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-teal-700">
                        GH¢{inv.paidAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span className={inv.balance > 0 ? (inv.status === 'Overdue' ? 'text-red-600' : 'text-amber-700') : 'text-slate-400'}>
                          GH¢{inv.balance.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {inv.status === 'Paid' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle className="w-3 h-3" />
                            Paid
                          </span>
                        )}
                        {inv.status === 'Partially Paid' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3" />
                            Partially Paid
                          </span>
                        )}
                        {inv.status === 'Due' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3" />
                            Due
                          </span>
                        )}
                        {inv.status === 'Overdue' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </span>
                        )}
                        {inv.status === 'Upcoming' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            Upcoming
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {inv.balance > 0 ? (
                          <button
                            onClick={() => onOpenRecordPayment(inv.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded font-medium text-xs transition-colors"
                          >
                            <CreditCard className="w-3 h-3 text-teal-600" />
                            <span>Settle</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Settled</span>
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
