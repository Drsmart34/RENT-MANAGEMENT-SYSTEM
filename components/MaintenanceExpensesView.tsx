'use client';

import React, { useState } from 'react';
import { useRentFlow } from '@/lib/store';
import { MaintenanceTicket, ExpenseRecord } from '@/lib/types';
import { Wrench, Plus, DollarSign, CheckCircle2, Clock, AlertTriangle, Building } from 'lucide-react';

export default function MaintenanceExpensesView() {
  const {
    maintenanceTickets,
    expenses,
    properties,
    units,
    tenants,
    updateMaintenanceStatus,
    addMaintenanceTicket,
    addExpense,
    getPropertyById,
    getUnitById,
    getTenantById,
  } = useRentFlow();

  const [activeTab, setActiveTab] = useState<'maintenance' | 'expenses'>('maintenance');

  // New Ticket State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketPropId, setTicketPropId] = useState(properties[0]?.id || '');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState<MaintenanceTicket['category']>('Plumbing');
  const [ticketPriority, setTicketPriority] = useState<MaintenanceTicket['priority']>('Medium');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketCost, setTicketCost] = useState(0);

  // New Expense State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expPropId, setExpPropId] = useState(properties[0]?.id || '');
  const [expCategory, setExpCategory] = useState<ExpenseRecord['category']>('ECG Electricity');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState(500);
  const [expVendor, setExpVendor] = useState('Electricity Company of Ghana (ECG)');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    addMaintenanceTicket({
      propertyId: ticketPropId,
      title: ticketTitle,
      category: ticketCategory,
      priority: ticketPriority,
      description: ticketDesc,
      status: 'Open',
      estimatedCost: ticketCost > 0 ? ticketCost : undefined,
    });
    setIsTicketModalOpen(false);
    setTicketTitle('');
    setTicketDesc('');
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      propertyId: expPropId,
      category: expCategory,
      description: expDesc,
      amount: expAmount,
      date: new Date().toISOString().split('T')[0],
      vendorName: expVendor,
      receiptReference: `VEND-EXP-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setIsExpenseModalOpen(false);
    setExpDesc('');
  };

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Expenses & Property Maintenance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track ECG electricity, Ghana Water, borehole repairs, security vendor costs, and tenant tickets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'maintenance' ? (
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Maintenance Ticket</span>
            </button>
          ) : (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'maintenance'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maintenance Tickets ({maintenanceTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'expenses'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Operating Expenses (GH¢{totalExpenses.toLocaleString()})
          </button>
        </div>
      </div>

      {/* Tab 1: Maintenance Tickets */}
      {activeTab === 'maintenance' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Property & Unit</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-right">Est. Cost (GH¢)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {maintenanceTickets.map((t) => {
                  const prop = getPropertyById(t.propertyId);
                  const unit = t.unitId ? getUnitById(t.unitId) : null;
                  const tenant = t.tenantId ? getTenantById(t.tenantId) : null;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-bold text-slate-900">{t.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {t.description}
                        </div>
                        {tenant && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Reported by {tenant.fullName}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{prop?.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {unit ? `Unit ${unit.unitNumber}` : 'General Compound'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {t.category}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            t.priority === 'Emergency'
                              ? 'bg-red-100 text-red-800'
                              : t.priority === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                        {t.estimatedCost ? `GH¢${t.estimatedCost.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        {t.status === 'Resolved' && (
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Resolved
                          </span>
                        )}
                        {t.status === 'In Progress' && (
                          <span className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            In Progress
                          </span>
                        )}
                        {t.status === 'Open' && (
                          <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Open
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={t.status}
                          onChange={(e) => updateMaintenanceStatus(t.id, e.target.value as any)}
                          className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs focus:outline-none"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Operating Expenses */}
      {activeTab === 'expenses' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount (GH¢)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((e) => {
                  const prop = getPropertyById(e.propertyId);

                  return (
                    <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {e.category}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{e.description}</td>
                      <td className="py-3 px-4 text-slate-600">{prop?.name}</td>
                      <td className="py-3 px-4 text-slate-500">{e.vendorName}</td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{e.date}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        GH¢{e.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Log Maintenance Ticket</h3>
              <button onClick={() => setIsTicketModalOpen(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property</label>
                <select
                  value={ticketPropId}
                  onChange={(e) => setTicketPropId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Borehole filtration filter replacement"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="AC / HVAC">AC / HVAC</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Cost (GH¢)</label>
                <input
                  type="number"
                  value={ticketCost}
                  onChange={(e) => setTicketCost(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Record Operating Expense</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property</label>
                <select
                  value={expPropId}
                  onChange={(e) => setExpPropId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="ECG Electricity">ECG Electricity</option>
                    <option value="Ghana Water Bill">Ghana Water Bill</option>
                    <option value="Facility Security">Facility Security</option>
                    <option value="Borehole Servicing">Borehole Servicing</option>
                    <option value="Repairs">Repairs</option>
                    <option value="Grounds Maintenance">Grounds Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (GH¢)</label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  required
                  value={expVendor}
                  onChange={(e) => setExpVendor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly prepaid meter topup for security post"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
