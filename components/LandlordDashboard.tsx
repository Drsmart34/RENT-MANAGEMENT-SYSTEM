'use client';

import React, { useState } from 'react';
import { useRentFlow } from '@/lib/store';
import {
  Building2,
  DoorOpen,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Send,
  Plus,
  ArrowRight,
  FileCheck,
  Receipt,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';

export default function LandlordDashboard({
  onOpenRecordPayment,
  onOpenAddProperty,
  onOpenAddUnit,
  onOpenAddTenant,
  onOpenCreateTenancy,
}: {
  onOpenRecordPayment: () => void;
  onOpenAddProperty: () => void;
  onOpenAddUnit: () => void;
  onOpenAddTenant: () => void;
  onOpenCreateTenancy: () => void;
}) {
  const {
    metrics,
    properties,
    units,
    tenancies,
    invoices,
    payments,
    receipts,
    openReceiptModal,
    openLedgerModal,
    openTenantPortal,
    getTenantById,
    getPropertyById,
    getUnitById,
    runReminderEngine,
    setCurrentView,
  } = useRentFlow();

  const [reminderMessage, setReminderMessage] = useState<string | null>(null);

  const handleRunReminders = () => {
    const result = runReminderEngine();
    setReminderMessage(result.message);
    setTimeout(() => setReminderMessage(null), 5000);
  };

  // Monthly breakdown trend (last 4 months)
  const monthlyTrends = [
    { month: 'Jul 2026', expected: 68000, collected: 64500 },
    { month: 'Aug 2026', expected: 70000, collected: 67200 },
    { month: 'Sep 2026', expected: 72500, collected: 68100 },
    { month: 'Oct 2026 (Current)', expected: metrics.expectedRent, collected: metrics.collectedRent },
  ];

  const overdueInvoices = invoices.filter((inv) => inv.status === 'Overdue');

  return (
    <div className="space-y-6">
      {/* Top Banner & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Portfolio Performance & Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time rent collection, occupancy metrics, and reconciliation ledger for Greater Accra.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRunReminders}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-teal-600" />
            <span>Dispatch Rent Reminders</span>
          </button>
          <button
            onClick={onOpenRecordPayment}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {reminderMessage && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{reminderMessage}</span>
          </div>
          <button
            onClick={() => setCurrentView('notifications')}
            className="text-teal-900 font-semibold underline text-xs ml-4"
          >
            View Queue
          </button>
        </div>
      )}

      {/* KPI Metrics Grid (Matches Section 9: 12 properties | 47 units | 43 occupied | GH¢72,500 expected | GH¢58,200 collected | GH¢14,300 outstanding | 80.3% collection rate) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Properties & Units */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Properties & Units</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {metrics.totalProperties}
            </span>
            <span className="text-xs text-slate-500">properties</span>
            <span className="text-slate-300">/</span>
            <span className="text-lg font-bold font-mono text-slate-700">
              {metrics.totalUnits}
            </span>
            <span className="text-xs text-slate-500">units</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-teal-700 font-semibold">{metrics.occupiedUnits} Occupied</span>
            <span>·</span>
            <span className="text-slate-600">{metrics.vacantUnits} Vacant</span>
          </div>
        </div>

        {/* Expected Rent */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Expected Rent</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            GH¢{metrics.expectedRent.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Scheduled obligations for current period
          </div>
        </div>

        {/* Collected Rent */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Collected Rent</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-700">
            GH¢{metrics.collectedRent.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-teal-800 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{metrics.collectionRate.toFixed(1)}% collection rate</span>
          </div>
        </div>

        {/* Outstanding Arrears */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Outstanding / Arrears</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700">
            GH¢{metrics.outstandingRent.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-red-600 font-semibold">{metrics.overdueInvoicesCount} Overdue</span>
            <span>·</span>
            <span>Due on or before 1st</span>
          </div>
        </div>
      </div>

      {/* Overdue Alert Strip (if any overdue) */}
      {overdueInvoices.length > 0 && (
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Attention: {overdueInvoices.length} Overdue Rent Invoices Requiring Follow-up
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Total overdue balance: <span className="font-mono font-bold">GH¢{overdueInvoices.reduce((a, b) => a + b.balance, 0).toLocaleString()}</span>. Automatic WhatsApp and SMS notices can be dispatched immediately.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunReminders}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Send Notices Now
            </button>
            <button
              onClick={() => setCurrentView('invoices')}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/50 rounded-lg text-xs font-medium transition-colors"
            >
              View Invoices
            </button>
          </div>
        </div>
      )}

      {/* Main Visuals & Split View: Collection Trend & Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Trend (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Rent Collection Trend
              </h3>
              <p className="text-xs text-slate-500">Expected vs Actual Collections in Ghana Cedis</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-200 inline-block"></span>
                <span>Expected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-teal-600 inline-block"></span>
                <span>Collected</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4 space-y-4">
            {monthlyTrends.map((t, idx) => {
              const maxVal = 80000;
              const expWidth = Math.min(100, (t.expected / maxVal) * 100);
              const colWidth = Math.min(100, (t.collected / maxVal) * 100);
              const rate = ((t.collected / t.expected) * 100).toFixed(1);

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{t.month}</span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-500">GH¢{t.expected.toLocaleString()}</span>
                      <span className="text-slate-300">/</span>
                      <span className="font-bold text-teal-700">GH¢{t.collected.toLocaleString()}</span>
                      <span className="text-slate-400">({rate}%)</span>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-md overflow-hidden flex relative">
                    <div
                      style={{ width: `${expWidth}%` }}
                      className="h-full bg-slate-200/80 rounded-md transition-all duration-500"
                    />
                    <div
                      style={{ width: `${colWidth}%` }}
                      className="h-full bg-teal-600 absolute left-0 top-0 rounded-md transition-all duration-500 opacity-90"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
            <span>Portfolio collection efficiency target: 90%</span>
            <button
              onClick={() => setCurrentView('payments')}
              className="text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1 text-xs"
            >
              <span>View Payment Allocations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Occupancy & Quick Breakdown (1 Col) */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Unit Occupancy
            </h3>
            <span className="text-xs font-mono font-bold text-teal-700">
              {metrics.occupancyRate.toFixed(1)}%
            </span>
          </div>

          {/* Simple Radial Bar / Progress bar */}
          <div className="py-2 text-center">
            <div className="inline-flex items-center justify-center p-6 rounded-full border-8 border-teal-600/20 bg-teal-50/40 relative">
              <div className="text-center">
                <span className="block text-3xl font-extrabold font-mono text-slate-900">
                  {metrics.occupiedUnits}
                </span>
                <span className="text-xs text-slate-500">of {metrics.totalUnits} Units</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Occupied Units</span>
              <span className="font-mono font-semibold text-slate-900">{metrics.occupiedUnits}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Vacant Units</span>
              <span className="font-mono font-semibold text-amber-600">{metrics.vacantUnits}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600">Managed Properties</span>
              <span className="font-mono font-semibold text-slate-900">{metrics.totalProperties}</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('units')}
            className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <DoorOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Manage All Units</span>
          </button>
        </div>
      </div>

      {/* Featured Properties Quick Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Managed Portfolios & Properties
            </h3>
            <p className="text-xs text-slate-500">Accra prime locations with Ghana Post GPS addresses</p>
          </div>
          <button
            onClick={() => setCurrentView('properties')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All ({properties.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {properties.slice(0, 3).map((prop) => {
            const propUnits = units.filter((u) => u.propertyId === prop.id);
            const occupied = propUnits.filter((u) => u.status === 'Occupied').length;

            return (
              <div
                key={prop.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-shadow hover:shadow-sm"
              >
                <div className="relative h-36 w-full bg-slate-100">
                  <Image
                    src={prop.imageUrl || '/images/general_apartment.jpg'}
                    alt={prop.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-mono px-2 py-0.5 rounded">
                    {prop.gpsAddress}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{prop.name}</h4>
                      <p className="text-xs text-slate-500">{prop.address}, {prop.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-600">
                      {occupied}/{prop.totalUnits} Units Occupied
                    </span>
                    <button
                      onClick={() => setCurrentView('units')}
                      className="text-teal-700 hover:text-teal-800 font-medium text-xs flex items-center gap-0.5"
                    >
                      <span>Units</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Lower Section: Recent Financial Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payment & Billing Activity (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Financial Transactions & Receipts
            </h3>
            <button
              onClick={() => setCurrentView('payments')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>All Payments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {payments.slice(0, 5).map((pay) => {
              const tenant = getTenantById(pay.tenantId);
              const unit = getUnitById(pay.unitId);
              const receipt = receipts.find((r) => r.paymentId === pay.id);

              return (
                <div key={pay.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {tenant?.fullName || pay.payerName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Unit {unit?.unitNumber || 'A1'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                        <span>{pay.paymentMethod}</span>
                        <span>·</span>
                        <span className="font-mono">{pay.providerReference}</span>
                        <span>·</span>
                        <span>{new Date(pay.paymentDate).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-teal-700">
                        +GH¢{pay.amount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-medium">Confirmed</div>
                    </div>
                    {receipt && (
                      <button
                        onClick={() => openReceiptModal(receipt)}
                        className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-50 rounded border border-slate-200"
                        title="Download / Print Receipt"
                      >
                        <FileCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Operations Panel (1 Col) */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Quick Operations
          </h3>

          <div className="space-y-2">
            <button
              onClick={onOpenRecordPayment}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-teal-900 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-teal-700" />
                <div>
                  <div className="text-xs font-bold">Record Rent Payment</div>
                  <div className="text-[11px] text-teal-700">Allocate to invoice & generate receipt</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-teal-700" />
            </button>

            <button
              onClick={onOpenCreateTenancy}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="text-xs font-bold">Create Tenancy Agreement</div>
                  <div className="text-[11px] text-slate-500">Link tenant, unit, advance & schedule</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={onOpenAddTenant}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="text-xs font-bold">Register New Tenant</div>
                  <div className="text-[11px] text-slate-500">Ghana Card ID & portal token</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={onOpenAddProperty}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="text-xs font-bold">Add Property</div>
                  <div className="text-[11px] text-slate-500">Ghana Post GPS address & units</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={onOpenAddUnit}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <DoorOpen className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="text-xs font-bold">Add Unit / Room</div>
                  <div className="text-[11px] text-slate-500">Prepaid ECG meter & rent in GH¢</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-2">Simulate Tenant Self-Service:</div>
            <button
              onClick={() => {
                const firstTenant = getTenantById('ten_kofi_mensah');
                if (firstTenant) openTenantPortal(firstTenant.portalToken);
              }}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span>Launch Kofi Mensah Portal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
