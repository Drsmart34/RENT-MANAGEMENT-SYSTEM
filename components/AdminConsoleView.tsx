'use client';

import React from 'react';
import { useRentFlow } from '@/lib/store';
import { ShieldCheck, Users, Building2, CreditCard, Activity, Lock, Database, CheckCircle2 } from 'lucide-react';

export default function AdminConsoleView() {
  const { landlords, properties, units, payments, invoices } = useRentFlow();

  const totalGtv = payments.reduce((acc, p) => acc + p.amount, 0);

  const auditEvents = [
    { time: '10 mins ago', action: 'Payment Allocation Confirmed', user: 'Billing Engine', details: 'GH¢1,000 allocated to INV-2026-001 (Kofi Mensah)' },
    { time: '1 hour ago', action: 'Tenancy Agreement Generated', user: 'Christian Ahugbah', details: 'Active 12-month advance for Unit A1 East Legon' },
    { time: '3 hours ago', action: 'SMS Reminder Dispatched', user: 'Reminder Queue', details: 'Notice sent to 0244128934 via Hubtel SMS' },
    { time: '1 day ago', action: 'Receipt Cryptographic Hash Signed', user: 'RentFlow Security', details: 'Receipt RF-REC-2026-0038 validated for GRA Rent Act' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Platform Administration & System Controls
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section 3 & 14 multi-landlord SaaS governance, gateway configuration, and audit logs.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>SaaS Platform Operational · MVP v0.3</span>
        </div>
      </div>

      {/* Global SaaS Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Landlords Onboarded
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {landlords.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Multi-tenant portfolio isolation</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Units Under Management
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {units.length}
          </div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">Across Greater Accra & Ashanti</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Gross Transaction Volume
          </div>
          <div className="text-2xl font-bold font-mono text-teal-700 mt-1">
            GH¢{totalGtv.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Processed through MoMo & Bank</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Statutory Compliance
          </div>
          <div className="text-base font-bold text-slate-800 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rent Act 1963 (Act 220)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">GRA Rent Tax Schedule Ready</div>
        </div>
      </div>

      {/* Multi-Landlord Accounts Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Registered Landlord Portfolios
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {landlords.map((l) => (
            <div key={l.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900">{l.businessName}</div>
                <div className="text-[11px] text-slate-500">
                  Principal: {l.name} · Phone: {l.phone} · Ghana Card: {l.ghanaCardNumber}
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="font-semibold text-slate-800">
                    {properties.filter((p) => p.landlordId === l.id).length} Properties
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Bank: {l.bankDetails?.bankName}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Active Subscription
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gateway Integration Status (PDF Section 16 & 17) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Payment & SMS Gateway Adapters
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">Ghanaian Mobile Money Gateway</div>
                <div className="text-[11px] text-slate-500">MTN MoMo, Telecel Cash, AT Money</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                SANDBOX / READY
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">Hubtel Bulk SMS Provider</div>
                <div className="text-[11px] text-slate-500">Ghana Sender ID: &quot;RentFlow&quot;</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                CONNECTED
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">Meta WhatsApp Cloud API</div>
                <div className="text-[11px] text-slate-500">Templates: Due notice, receipt delivery</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                CONNECTED
              </span>
            </div>
          </div>
        </div>

        {/* Security & Audit Log (PDF Section 14) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Security & Audit Activity Trail
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {auditEvents.map((ev, i) => (
              <div key={i} className="py-2.5 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{ev.action}</span>
                  <span className="text-[11px] font-mono text-slate-400">{ev.time}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {ev.details} · <span className="text-slate-700 font-medium">Actor: {ev.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
