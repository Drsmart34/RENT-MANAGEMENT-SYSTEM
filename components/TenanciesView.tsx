'use client';

import React, { useState } from 'react';
import { useRentFlow } from '@/lib/store';
import { FileText, Plus, Search, BookOpen, Smartphone, CheckCircle, Calendar } from 'lucide-react';

export default function TenanciesView({
  onOpenCreateTenancy,
}: {
  onOpenCreateTenancy: () => void;
}) {
  const { tenancies, getTenantById, getUnitById, getPropertyById, openLedgerModal, openTenantPortal } = useRentFlow();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenancies = tenancies.filter((tcy) => {
    const tenant = getTenantById(tcy.tenantId);
    const unit = getUnitById(tcy.unitId);
    const prop = getPropertyById(tcy.propertyId);

    return (
      (tenant?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (unit?.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (prop?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tenancy Agreements & Leases
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ghana standard lease terms, advance rent terms (6/12/24 months), security deposits, and billing schedules.
          </p>
        </div>
        <button
          onClick={onOpenCreateTenancy}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Tenancy</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search tenancy by tenant, unit, property..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
        />
      </div>

      {/* Tenancies Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Tenant</th>
                <th className="py-3 px-4">Property & Unit</th>
                <th className="py-3 px-4 text-right">Rent / Frequency</th>
                <th className="py-3 px-4 text-right">Advance Period</th>
                <th className="py-3 px-4 text-right">Deposit</th>
                <th className="py-3 px-4">Tenancy Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ledger & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTenancies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No active tenancy agreements found.
                  </td>
                </tr>
              ) : (
                filteredTenancies.map((tcy) => {
                  const tenant = getTenantById(tcy.tenantId);
                  const unit = getUnitById(tcy.unitId);
                  const prop = getPropertyById(tcy.propertyId);

                  return (
                    <tr key={tcy.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{tenant?.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{tenant?.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">Unit {unit?.unitNumber}</div>
                        <div className="text-[11px] text-slate-500">{prop?.name}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-bold text-slate-900">
                          GH¢{tcy.rentAmount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {tcy.billingFrequency}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-medium text-slate-800">
                          {tcy.advanceMonths} months
                        </span>
                        <div className="text-[10px] text-teal-700 font-semibold">Advance Rent</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        GH¢{tcy.securityDeposit.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{tcy.startDate} to {tcy.endDate}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Due day {tcy.dueDay}st of cycle</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle className="w-3 h-3" />
                          {tcy.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openLedgerModal(tcy.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-xs transition-colors"
                          title="View Page 4 Auditable Ledger"
                        >
                          <BookOpen className="w-3 h-3 text-slate-600" />
                          <span>Ledger</span>
                        </button>
                        {tenant && (
                          <button
                            onClick={() => openTenantPortal(tenant.portalToken)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded font-medium text-xs transition-colors"
                          >
                            <Smartphone className="w-3 h-3 text-teal-600" />
                            <span>Portal</span>
                          </button>
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
