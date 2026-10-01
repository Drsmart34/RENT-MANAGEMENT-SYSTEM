'use client';

import React from 'react';
import { useRentFlow } from '@/lib/store';
import { Building2, Bell, Smartphone, ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const {
    currentView,
    setCurrentView,
    activeLandlord,
    landlords,
    setActiveLandlordId,
    notifications,
    openTenantPortal,
    tenants,
  } = useRentFlow();

  const queuedNotifsCount = notifications.filter((n) => n.status === 'Queued').length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2 text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white font-bold text-base shadow-sm">
            RF
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              RentFlow
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
              Ghana v0.3
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`transition-colors hover:text-slate-900 ${
            currentView === 'dashboard' ? 'text-teal-700 font-semibold border-b-2 border-teal-700 py-5' : ''
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentView('properties')}
          className={`transition-colors hover:text-slate-900 ${
            currentView === 'properties' ? 'text-teal-700 font-semibold border-b-2 border-teal-700 py-5' : ''
          }`}
        >
          Properties
        </button>
        <button
          onClick={() => setCurrentView('invoices')}
          className={`transition-colors hover:text-slate-900 ${
            currentView === 'invoices' ? 'text-teal-700 font-semibold border-b-2 border-teal-700 py-5' : ''
          }`}
        >
          Billing & Invoices
        </button>
        <button
          onClick={() => setCurrentView('payments')}
          className={`transition-colors hover:text-slate-900 ${
            currentView === 'payments' ? 'text-teal-700 font-semibold border-b-2 border-teal-700 py-5' : ''
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => {
            const firstTenant = tenants[0];
            if (firstTenant) openTenantPortal(firstTenant.portalToken);
          }}
          className={`flex items-center gap-1.5 transition-colors hover:text-slate-900 ${
            currentView === 'tenant-portal' ? 'text-teal-700 font-semibold border-b-2 border-teal-700 py-5' : ''
          }`}
        >
          <Smartphone className="w-4 h-4 text-teal-600" />
          <span>Tenant Portal</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions & Role / Landlord switcher */}
      <div className="flex items-center gap-3">
        {/* Landlord portfolio selector */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
          <Building2 className="w-4 h-4 text-slate-500" />
          <select
            value={activeLandlord.id}
            onChange={(e) => setActiveLandlordId(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
          >
            {landlords.map((l) => (
              <option key={l.id} value={l.id}>
                {l.businessName}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Shortcut */}
        <button
          onClick={() => setCurrentView('notifications')}
          className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-lg hover:bg-slate-100"
          title="Notification Queue"
        >
          <Bell className="w-4 h-4" />
          {queuedNotifsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>

        {/* Admin Switcher */}
        <button
          onClick={() => setCurrentView('admin')}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            currentView === 'admin'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Platform Admin</span>
        </button>

        {/* Quick Record Payment */}
        <button
          onClick={() => setCurrentView('payments')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Payment</span>
        </button>
      </div>
    </header>
  );
}
