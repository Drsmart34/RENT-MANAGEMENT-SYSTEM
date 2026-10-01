'use client';

import React from 'react';
import { useRentFlow } from '@/lib/store';
import { Receipt } from '@/lib/types';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Building } from 'lucide-react';

export default function ReceiptModal({
  receipt,
  onClose,
}: {
  receipt: Receipt;
  onClose: () => void;
}) {
  const { getTenantById, getUnitById, getPropertyById, payments, activeLandlord } = useRentFlow();

  const tenant = getTenantById(receipt.tenantId);
  const unit = getUnitById(receipt.unitId);
  const prop = getPropertyById(receipt.propertyId);
  const payment = payments.find((p) => p.id === receipt.paymentId);

  const handlePrint = () => {
    window.print();
  };

  // Convert number to words helper for Ghana Cedi
  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero Ghana Cedis';
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      const rem = num % 1000;
      return `${ones[thousands]} Thousand ${rem > 0 ? numberToWords(rem) : 'Ghana Cedis Only'}`;
    }
    if (num >= 100) {
      const hundreds = Math.floor(num / 100);
      const rem = num % 100;
      return `${ones[hundreds]} Hundred ${rem > 0 ? 'and ' + numberToWords(rem) : 'Ghana Cedis Only'}`;
    }
    if (num >= 20) {
      const t = Math.floor(num / 10);
      const rem = num % 10;
      return `${tens[t]} ${rem > 0 ? ones[rem] : ''} Ghana Cedis Only`;
    }
    return `${ones[num]} Ghana Cedis Only`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-semibold tracking-wide">
              Official Electronic Rent Receipt · Verified
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 space-y-6 bg-white text-slate-800 font-sans print:p-6" id="printable-receipt">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-teal-700 flex items-center justify-center text-white font-bold text-base">
                  RF
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  RentFlow
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Ghana Rent Management & Billing System
              </div>
              <div className="text-[11px] font-mono text-teal-800">
                Republic of Ghana Rent Act Standard
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Rent Receipt
              </div>
              <div className="text-lg font-mono font-bold text-slate-900 mt-0.5">
                {receipt.receiptNumber}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Issue Date: {receipt.issueDate}
              </div>
            </div>
          </div>

          {/* Landlord & Tenant Metadata (Clean 2-Column Unboxed Text) */}
          <div className="grid grid-cols-2 gap-6 text-xs py-2 border-b border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Landlord / Property Manager
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {activeLandlord.businessName}
              </div>
              <div className="text-slate-600 mt-0.5">Manager: {activeLandlord.name}</div>
              <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                Phone: {activeLandlord.phone}
              </div>
              <div className="text-slate-500 font-mono text-[11px]">
                Ghana Card: {activeLandlord.ghanaCardNumber}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Tenant (Tenant Identification)
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {tenant?.fullName || 'Tenant'}
              </div>
              <div className="text-slate-600 mt-0.5">
                {tenant?.occupation || 'Private Tenant'}
              </div>
              <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                Phone: {tenant?.phone}
              </div>
              <div className="text-slate-500 font-mono text-[11px]">
                Ghana Card: {tenant?.idNumber}
              </div>
            </div>
          </div>

          {/* Premises / Demised Property Details */}
          <div className="p-3.5 bg-slate-50 rounded-lg text-xs space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Premises Let & Occupied
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-bold text-slate-900 text-sm">
                Unit {unit?.unitNumber || 'A1'} · {prop?.name || 'Property'}
              </span>
              <span className="font-mono text-teal-800 font-semibold text-[11px]">
                GPS: {prop?.gpsAddress || 'GA-492-3841'}
              </span>
            </div>
            <div className="text-slate-600">
              Address: {prop?.address}, {prop?.city}, {prop?.region}
            </div>
          </div>

          {/* Payment & Allocation Specifics */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-slate-100/75 px-4 py-2 font-semibold text-slate-700 flex justify-between">
              <span>Description / Tenancy Obligation</span>
              <span className="text-right">Amount (GHS)</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900">
                    Rent Obligation Settlement
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Period: {receipt.periodCovered}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Internal Ref: {payment?.paymentReference || 'RF-PAY-2026'} · Provider Ref: {payment?.providerReference || 'MOMO-GH'}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Channel: <span className="font-semibold">{payment?.paymentMethod}</span> ({payment?.providerNetwork})
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-slate-900 text-sm">
                  GH¢{receipt.amountPaid.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Total Paid & Amount in words */}
            <div className="bg-teal-50/60 p-4 border-t border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Amount Paid Received:</span>
                <span className="font-mono text-teal-800 text-base">
                  GH¢{receipt.amountPaid.toLocaleString()}.00
                </span>
              </div>
              <div className="text-xs text-slate-600 italic">
                Amount in words: <span className="font-semibold text-slate-800">{numberToWords(receipt.amountPaid)}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-teal-200/50">
                <span className="text-slate-600">Outstanding Balance Remaining for Period:</span>
                <span className="font-mono font-bold text-slate-800">
                  GH¢{receipt.balanceRemaining.toLocaleString()}.00
                </span>
              </div>
            </div>
          </div>

          {/* Statutory & Legal Note */}
          <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-200 pt-3">
            <p>
              * In compliance with the Rent Act, 1963 (Act 220) and the National Rent Control Department of Ghana. This receipt serves as prima facie evidence of rent payment received and duly allocated to the specified demised premises.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-2 gap-8 pt-4 items-end">
            <div>
              <div className="h-10 border-b border-slate-400 flex items-end pb-1">
                <span className="text-xs font-serif italic text-slate-700">
                  {activeLandlord.name}
                </span>
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">
                Authorized Signature / Landlord
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="w-24 h-12 border-2 border-teal-700/50 rounded flex flex-col items-center justify-center p-1 text-[9px] uppercase font-mono text-teal-800 font-bold tracking-tighter">
                <span>RentFlow</span>
                <span>AUTHENTICATED</span>
                <span>VERIFIED GRA</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                System Generated Electronic Seal
              </div>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <div className="text-xs text-slate-500">
            Tenant can also view this receipt in their self-service portal.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
