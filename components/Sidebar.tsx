'use client';

import React from 'react';
import { useRentFlow } from '@/lib/store';
import {
  LayoutDashboard,
  Building,
  DoorOpen,
  Users,
  FileText,
  ReceiptText,
  CreditCard,
  Wrench,
  BellRing,
  Smartphone,
  Shield,
  RotateCcw,
} from 'lucide-react';

export default function Sidebar() {
  const { currentView, setCurrentView, notifications, resetToSampleData } = useRentFlow();

  const queuedCount = notifications.filter((n) => n.status === 'Queued').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building },
    { id: 'units', label: 'Units', icon: DoorOpen },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'tenancies', label: 'Tenancies', icon: FileText },
    { id: 'invoices', label: 'Rent Invoices', icon: ReceiptText },
    { id: 'payments', label: 'Payments & Receipts', icon: CreditCard },
    { id: 'maintenance', label: 'Expenses & Repairs', icon: Wrench },
    {
      id: 'notifications',
      label: 'Notification Queue',
      icon: BellRing,
      badge: queuedCount > 0 ? `${queuedCount} queued` : undefined,
    },
    { id: 'tenant-portal', label: 'Tenant Self-Service', icon: Smartphone },
    { id: 'admin', label: 'Platform Admin', icon: Shield },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
          Ghana Property Suite
        </div>
        <div className="text-sm font-medium text-slate-200 truncate">
          Ahugbah Asset Management
        </div>
        <div className="text-xs text-teal-400 font-mono mt-0.5">
          MoMo & Bank Reconciliation
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Demo Reset & Platform Info */}
      <div className="p-4 border-t border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Currency: GHS (GH¢)</span>
          <span className="text-teal-400 font-mono">v0.3 Live</span>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset to initial RentFlow sample data?')) {
              resetToSampleData();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors text-[11px]"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
}
