'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRentFlow } from '@/lib/store';
import { MobileMoneyNetwork } from '@/lib/types';
import {
  Smartphone,
  CreditCard,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Building,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Wrench,
  Send,
} from 'lucide-react';

export default function TenantPortalView() {
  const {
    tenants,
    tenancies,
    units,
    properties,
    invoices,
    payments,
    receipts,
    selectedTenantPortalToken,
    openTenantPortal,
    openReceiptModal,
    tenantPayRent,
    getPropertyById,
    getUnitById,
    addMaintenanceTicket,
  } = useRentFlow();

  // Find selected tenant or default to first tenant
  const currentTenant =
    tenants.find((t) => t.portalToken === selectedTenantPortalToken) || tenants[0];

  const currentTenancy = tenancies.find(
    (tcy) => tcy.tenantId === currentTenant?.id && tcy.status === 'Active'
  );
  const currentUnit = currentTenancy ? getUnitById(currentTenancy.unitId) : null;
  const currentProperty = currentTenancy ? getPropertyById(currentTenancy.propertyId) : null;

  // Invoices for this tenant
  const tenantInvoices = invoices.filter((inv) => inv.tenantId === currentTenant?.id);
  // Unpaid invoices
  const unpaidInvoices = tenantInvoices.filter((inv) => inv.balance > 0);
  const totalBalanceDue = unpaidInvoices.reduce((acc, inv) => acc + inv.balance, 0);

  // Payments & Receipts for this tenant
  const tenantPayments = payments.filter((p) => p.tenantId === currentTenant?.id);
  const tenantReceipts = receipts.filter((r) => r.tenantId === currentTenant?.id);

  // Pay Rent Modal / Flow State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    unpaidInvoices[0]?.id || tenantInvoices[0]?.id || ''
  );
  const [payAmount, setPayAmount] = useState<number>(
    unpaidInvoices[0]?.balance || 1500
  );
  const [network, setNetwork] = useState<MobileMoneyNetwork>('MTN MoMo');
  const [phoneNumber, setPhoneNumber] = useState(currentTenant?.phone || '024 412 8934');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<{
    receiptNumber: string;
    amount: number;
  } | null>(null);

  // Maintenance form toggle
  const [isMaintOpen, setIsMaintOpen] = useState(false);
  const [maintTitle, setMaintTitle] = useState('');
  const [maintCategory, setMaintCategory] = useState<'Plumbing' | 'Electrical' | 'Water Supply' | 'AC / HVAC' | 'General'>('Plumbing');
  const [maintDesc, setMaintDesc] = useState('');
  const [maintSubmitted, setMaintSubmitted] = useState(false);

  const handleStartPayment = (invoiceId?: string) => {
    const inv = invoices.find((i) => i.id === invoiceId) || unpaidInvoices[0];
    if (inv) {
      setSelectedInvoiceId(inv.id);
      setPayAmount(inv.balance);
    }
    setPaymentSuccess(null);
    setIsPayModalOpen(true);
  };

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId || payAmount <= 0) return;

    setIsProcessing(true);
    try {
      const result = await tenantPayRent({
        tenantId: currentTenant.id,
        invoiceId: selectedInvoiceId,
        amount: payAmount,
        network,
        phoneNumber,
      });

      setIsProcessing(false);
      setPaymentSuccess({
        receiptNumber: result.receipt.receiptNumber,
        amount: result.payment.amount,
      });
    } catch {
      setIsProcessing(false);
    }
  };

  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProperty) return;

    addMaintenanceTicket({
      propertyId: currentProperty.id,
      unitId: currentUnit?.id,
      tenantId: currentTenant.id,
      title: maintTitle,
      description: maintDesc,
      category: maintCategory,
      priority: 'Medium',
      status: 'Open',
    });

    setMaintSubmitted(true);
    setTimeout(() => {
      setMaintSubmitted(false);
      setIsMaintOpen(false);
      setMaintTitle('');
      setMaintDesc('');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner & Switcher bar (simulating token URL) */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white shadow-sm">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-400 font-semibold">
              Tenant Self-Service Portal (Ghana v0.3)
            </div>
            <div className="text-base font-bold text-slate-100">
              {currentTenant ? currentTenant.fullName : 'Guest'}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Token: {currentTenant?.portalToken}
            </div>
          </div>
        </div>

        {/* Quick Tenant Switcher (Simulates clicking different links from SMS / WhatsApp) */}
        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl text-xs">
          <span className="text-slate-400">Switch Tenant:</span>
          <select
            value={currentTenant?.portalToken}
            onChange={(e) => openTenantPortal(e.target.value)}
            className="bg-slate-900 text-teal-300 font-semibold px-2 py-1 rounded border border-slate-700 focus:outline-none cursor-pointer"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.portalToken}>
                {t.fullName} ({t.phone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Tenant Balance Hero Card (Page 9 & 10 Mockup) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Apartment Building Visual Banner */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-100">
          <Image
            src={currentProperty?.imageUrl || '/images/general_apartment.jpg'}
            alt={currentProperty?.name || 'Apartment Building'}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-300">
                {currentProperty?.name || 'Apartment Complex'}
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Unit {currentUnit?.unitNumber || 'A1'} · {currentUnit?.type || 'Apartment'}
              </h2>
              <div className="text-xs text-slate-200 mt-0.5">
                {currentProperty?.address}, {currentProperty?.city} · GPS:{' '}
                <span className="font-mono text-teal-300">{currentProperty?.gpsAddress}</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-300">Billing Terms</span>
              <div className="text-sm font-semibold text-white font-mono">
                GH¢{currentTenancy?.rentAmount.toLocaleString()} / {currentTenancy?.billingFrequency || 'MONTHLY'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Building className="w-4 h-4 text-teal-700" />
              <span>Premises: <strong>{currentProperty?.name}</strong></span>
              <span>·</span>
              <span>Status: <strong className="text-emerald-700">Lease Active</strong></span>
            </div>
            <div className="text-slate-500 font-mono">
              Next Due Date: <strong className="text-slate-900">{unpaidInvoices[0]?.dueDate || '01 Nov 2026'}</strong>
            </div>
          </div>

        {/* Big Balance & Pay Rent Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Outstanding Balance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-4xl font-black font-mono tracking-tight ${totalBalanceDue > 0 ? 'text-amber-700' : 'text-teal-700'}`}>
                GH¢{totalBalanceDue.toLocaleString()}.00
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {totalBalanceDue > 0
                ? `${unpaidInvoices.length} active rent obligation(s) pending payment`
                : 'All scheduled rent obligations are fully settled.'}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleStartPayment()}
              disabled={totalBalanceDue === 0}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                totalBalanceDue > 0
                  ? 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Pay Rent (Ghana MoMo)</span>
            </button>
            <button
              onClick={() => setIsMaintOpen(!isMaintOpen)}
              className="w-full sm:w-auto px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Tenant Maintenance Request Panel */}
      {isMaintOpen && (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Submit Repair or Maintenance Ticket
            </h3>
            <button
              onClick={() => setIsMaintOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          {maintSubmitted ? (
            <div className="p-4 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Your maintenance request has been submitted to property management!</span>
            </div>
          ) : (
            <form onSubmit={handleCreateMaintenance} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AC leaking, Borehole water pressure low"
                    value={maintTitle}
                    onChange={(e) => setMaintTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={maintCategory}
                    onChange={(e) => setMaintCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Water Supply">Water Supply / Borehole</option>
                    <option value="AC / HVAC">AC / Split Unit</option>
                    <option value="General">General Compound</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Provide details about the issue..."
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold"
              >
                Submit Ticket
              </button>
            </form>
          )}
        </div>
      )}

      {/* Invoices Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              My Rent Invoices & Schedules
            </h3>
            <p className="text-xs text-slate-500">Scheduled tenancy obligations and balances</p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {tenantInvoices.length} invoices
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Billed</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenantInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {inv.periodStart} to {inv.periodEnd}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">{inv.dueDate}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                    GH¢{inv.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-teal-700">
                    GH¢{inv.paidAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    <span className={inv.balance > 0 ? 'text-amber-700' : 'text-slate-400'}>
                      GH¢{inv.balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {inv.status === 'Paid' && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Paid
                      </span>
                    )}
                    {inv.status === 'Partially Paid' && (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Partially Paid
                      </span>
                    )}
                    {inv.status === 'Due' && (
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        Due
                      </span>
                    )}
                    {inv.status === 'Overdue' && (
                      <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                        Overdue
                      </span>
                    )}
                    {inv.status === 'Upcoming' && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Upcoming
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {inv.balance > 0 ? (
                      <button
                        onClick={() => handleStartPayment(inv.id)}
                        className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded font-semibold text-xs transition-colors"
                      >
                        Pay GH¢{inv.balance.toLocaleString()}
                      </button>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History & Downloadable Receipts */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Payment History & Official Receipts
            </h3>
            <p className="text-xs text-slate-500">Verified transactions and downloadable PDF receipts</p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {tenantPayments.length} payments recorded
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {tenantPayments.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              No payments on record yet.
            </div>
          ) : (
            tenantPayments.map((p) => {
              const rec = tenantReceipts.find((r) => r.paymentId === p.id);

              return (
                <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        GH¢{p.amount.toLocaleString()}.00 via {p.providerNetwork || p.paymentMethod}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Ref: {p.paymentReference} · Provider: {p.providerReference}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">
                      {new Date(p.paymentDate).toLocaleDateString('en-GB')}
                    </span>
                    {rec && (
                      <button
                        onClick={() => openReceiptModal(rec)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-teal-700" />
                        <span>Receipt #{rec.receiptNumber}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pay Rent Modal / Mobile Money Interactive Sandbox Checkout */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Ghana Mobile Money Checkout</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant settlement & RentFlow automated receipt issuance
                </p>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Payment Confirmed!</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    GH¢{paymentSuccess.amount.toLocaleString()} was successfully paid via {network}.
                  </p>
                  <p className="text-xs font-mono text-teal-800 font-semibold mt-2">
                    Official Receipt #{paymentSuccess.receiptNumber} generated
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <button
                    onClick={() => {
                      const rec = receipts.find((r) => r.receiptNumber === paymentSuccess.receiptNumber);
                      if (rec) openReceiptModal(rec);
                      setIsPayModalOpen(false);
                    }}
                    className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    View Official Rent Receipt
                  </button>
                  <button
                    onClick={() => setIsPayModalOpen(false)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecutePayment} className="p-6 space-y-4 text-xs">
                {/* Invoice to Settle */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Rent Obligation
                  </label>
                  <select
                    value={selectedInvoiceId}
                    onChange={(e) => {
                      setSelectedInvoiceId(e.target.value);
                      const inv = invoices.find((i) => i.id === e.target.value);
                      if (inv) setPayAmount(inv.balance);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    {tenantInvoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoiceNumber} - {inv.periodStart} to {inv.periodEnd} (Balance: GH¢{inv.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount to Pay */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Payment Amount (GHS / GH¢)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-500 font-mono">
                      GH¢
                    </span>
                    <input
                      type="number"
                      min={1}
                      required
                      value={payAmount}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      className="w-full pl-12 pr-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Supports partial payment, exact balance, or overpayment advance.
                  </span>
                </div>

                {/* Payment Network */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Select Ghanaian Mobile Money Network
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['MTN MoMo', 'Telecel Cash', 'AT Money'] as MobileMoneyNetwork[]).map((net) => (
                      <button
                        type="button"
                        key={net}
                        onClick={() => setNetwork(net)}
                        className={`p-2.5 text-center rounded-xl border transition-all ${
                          network === net
                            ? 'border-teal-700 bg-teal-50 text-teal-900 font-bold shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-semibold">{net}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Money Phone */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Money Wallet Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 024 412 8934"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    You will receive an instant USSD prompt on your phone to approve payment.
                  </span>
                </div>

                {/* Sandbox Info */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 leading-normal">
                  <span className="font-bold text-slate-800">RentFlow Payment Gateway Sandbox:</span>{' '}
                  Clicking Authorize simulates the Ghanaian mobile money network callback, reconciles the ledger, and generates your downloadable PDF rent receipt.
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing USSD Mobile Money Prompt...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize Payment of GH¢{payAmount.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
