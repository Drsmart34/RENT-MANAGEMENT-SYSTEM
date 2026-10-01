'use client';

import React, { useState } from 'react';
import { useRentFlow } from '@/lib/store';
import { PaymentMethod, PropertyType, BillingFrequency } from '@/lib/types';
import { X, CheckCircle2, DollarSign, ShieldCheck } from 'lucide-react';

export default function ActionModals({
  activeModal,
  preselectedInvoiceId,
  onClose,
}: {
  activeModal: 'record-payment' | 'add-property' | 'add-unit' | 'add-tenant' | 'create-tenancy' | null;
  onClose: () => void;
  preselectedInvoiceId?: string;
}) {
  const {
    properties,
    units,
    tenants,
    invoices,
    tenancies,
    activeLandlord,
    addProperty,
    addUnit,
    addTenant,
    createTenancy,
    recordPayment,
    openReceiptModal,
    getTenantById,
    getUnitById,
    getPropertyById,
  } = useRentFlow();

  // 1. Record Payment State
  const initialInvoice = invoices.find((i) => i.id === preselectedInvoiceId) || invoices.find((i) => i.balance > 0) || invoices[0];
  const [payInvoiceId, setPayInvoiceId] = useState(initialInvoice?.id || '');
  const [payAmount, setPayAmount] = useState<number>(initialInvoice?.balance || 1500);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Mobile Money');
  const [payNetwork, setPayNetwork] = useState('MTN MoMo');
  const [payProviderRef, setPayProviderRef] = useState('MTN-MOMO-9418203');
  const [payPayerName, setPayPayerName] = useState(
    getTenantById(initialInvoice?.tenantId || '')?.fullName || ''
  );
  const [payPayerPhone, setPayPayerPhone] = useState(
    getTenantById(initialInvoice?.tenantId || '')?.phone || '0244128934'
  );
  const [payNotes, setPayNotes] = useState('');

  // 2. Add Property State
  const [propName, setPropName] = useState('');
  const [propType, setPropType] = useState<PropertyType>('Apartment Complex');
  const [propAddress, setPropAddress] = useState('');
  const [propCity, setPropCity] = useState('Accra');
  const [propGps, setPropGps] = useState('GA-492-3841');
  const [propUnits, setPropUnits] = useState(8);
  const [propDesc, setPropDesc] = useState('');

  // 3. Add Unit State
  const [unitPropId, setUnitPropId] = useState(properties[0]?.id || '');
  const [unitNum, setUnitNum] = useState('');
  const [unitType, setUnitType] = useState('2 Bedroom Standard');
  const [unitRent, setUnitRent] = useState(1500);
  const [unitDeposit, setUnitDeposit] = useState(3000);

  // 4. Add Tenant State
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('024 ');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantIdNum, setTenantIdNum] = useState('GHA-');
  const [tenantOccupation, setTenantOccupation] = useState('');
  const [tenantEmergName, setTenantEmergName] = useState('');
  const [tenantEmergPhone, setTenantEmergPhone] = useState('');

  // 5. Create Tenancy State
  const [tcyTenantId, setTcyTenantId] = useState(tenants[0]?.id || '');
  const [tcyUnitId, setTcyUnitId] = useState(units.find((u) => u.status === 'Vacant')?.id || units[0]?.id || '');
  const [tcyStartDate, setTcyStartDate] = useState('2026-10-01');
  const [tcyEndDate, setTcyEndDate] = useState('2027-09-30');
  const [tcyRent, setTcyRent] = useState(1500);
  const [tcyFreq, setTcyFreq] = useState<BillingFrequency>('MONTHLY');
  const [tcyAdvance, setTcyAdvance] = useState(12);
  const [tcyDeposit, setTcyDeposit] = useState(3000);

  if (!activeModal) return null;

  // Handlers
  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = invoices.find((i) => i.id === payInvoiceId);
    if (!inv) return;

    const result = recordPayment({
      tenancyId: inv.tenancyId,
      invoiceId: inv.id,
      amount: payAmount,
      paymentMethod: payMethod,
      providerNetwork: payNetwork,
      providerReference: payProviderRef,
      payerName: payPayerName || 'Tenant',
      payerPhone: payPayerPhone || '0244128934',
      notes: payNotes,
    });

    onClose();
    // Open the generated receipt immediately
    openReceiptModal(result.receipt);
  };

  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProperty({
      landlordId: activeLandlord.id,
      name: propName,
      type: propType,
      address: propAddress,
      city: propCity,
      region: 'Greater Accra',
      gpsAddress: propGps,
      totalUnits: propUnits,
      description: propDesc,
      imageUrl: '/images/general_apartment.jpg',
    });
    onClose();
  };

  const handleAddUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUnit({
      propertyId: unitPropId,
      unitNumber: unitNum,
      type: unitType,
      monthlyRent: unitRent,
      securityDeposit: unitDeposit,
      status: 'Vacant',
      amenities: ['Prepaid ECG Meter', 'Ghana Water', 'Dedicated Parking'],
    });
    onClose();
  };

  const handleAddTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTenant({
      fullName: tenantName,
      phone: tenantPhone,
      email: tenantEmail,
      idType: 'Ghana Card',
      idNumber: tenantIdNum,
      occupation: tenantOccupation,
      emergencyContactName: tenantEmergName,
      emergencyContactPhone: tenantEmergPhone,
    });
    onClose();
  };

  const handleCreateTenancySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenUnit = units.find((u) => u.id === tcyUnitId);
    if (!chosenUnit) return;

    createTenancy({
      landlordId: activeLandlord.id,
      tenantId: tcyTenantId,
      unitId: tcyUnitId,
      propertyId: chosenUnit.propertyId,
      startDate: tcyStartDate,
      endDate: tcyEndDate,
      rentAmount: tcyRent,
      billingFrequency: tcyFreq,
      advanceMonths: tcyAdvance,
      securityDeposit: tcyDeposit,
      dueDay: 1,
      status: 'Active',
      agreementNotes: `${tcyAdvance} months advance lease agreement with RentFlow automated billing.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal 1: Record Payment */}
        {activeModal === 'record-payment' && (
          <div>
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Record Rent Payment & Issue Receipt</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Section 7 payment allocation engine linked to invoice
                </p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Rent Obligation / Invoice
                </label>
                <select
                  value={payInvoiceId}
                  onChange={(e) => {
                    setPayInvoiceId(e.target.value);
                    const inv = invoices.find((i) => i.id === e.target.value);
                    if (inv) {
                      setPayAmount(inv.balance);
                      const t = getTenantById(inv.tenantId);
                      if (t) {
                        setPayPayerName(t.fullName);
                        setPayPayerPhone(t.phone);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                >
                  {invoices.map((inv) => {
                    const t = getTenantById(inv.tenantId);
                    const u = getUnitById(inv.unitId);
                    return (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoiceNumber} · {t?.fullName} (Unit {u?.unitNumber}) · Due: GH¢{inv.balance.toLocaleString()} ({inv.status})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Amount Received (GH¢)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Mobile Money">Mobile Money (MoMo)</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash (Direct)</option>
                    <option value="Card">Debit / Credit Card</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Network / Financial Channel
                  </label>
                  <input
                    type="text"
                    required
                    value={payNetwork}
                    onChange={(e) => setPayNetwork(e.target.value)}
                    placeholder="MTN MoMo, Telecel Cash, GCB Bank..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Provider Transaction Reference
                  </label>
                  <input
                    type="text"
                    required
                    value={payProviderRef}
                    onChange={(e) => setPayProviderRef(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Payer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={payPayerName}
                    onChange={(e) => setPayPayerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Payer Phone (for SMS Receipt)
                  </label>
                  <input
                    type="text"
                    required
                    value={payPayerPhone}
                    onChange={(e) => setPayPayerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Accounting Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. October advance installment"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal 2: Add Property */}
        {activeModal === 'add-property' && (
          <div>
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Add Property Portfolio</h3>
                <p className="text-xs text-slate-400 mt-0.5">Register new building or townhouse complex</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddPropertySubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roman Ridge Executive Suites"
                  value={propName}
                  onChange={(e) => setPropName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Apartment Complex">Apartment Complex</option>
                    <option value="Residential Townhouse">Residential Townhouse</option>
                    <option value="Commercial Office">Commercial Office</option>
                    <option value="Mixed Use">Mixed Use</option>
                    <option value="Single Family">Single Family</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={propCity}
                    onChange={(e) => setPropCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ghana Post GPS Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GA-492-3841"
                    value={propGps}
                    onChange={(e) => setPropGps(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Units Planned</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={propUnits}
                    onChange={(e) => setPropUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18 Patrice Lumumba Road, Airport Residential"
                  value={propAddress}
                  onChange={(e) => setPropAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Features, security gatehouse, generator, amenities..."
                  value={propDesc}
                  onChange={(e) => setPropDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold">
                  Create Property
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal 3: Add Unit */}
        {activeModal === 'add-unit' && (
          <div>
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Add Rentable Unit</h3>
                <p className="text-xs text-slate-400 mt-0.5">Assign room number and cedi rent rate</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddUnitSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Property</label>
                <select
                  value={unitPropId}
                  onChange={(e) => setUnitPropId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.gpsAddress})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Number / Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A3, Flat 4, Suite 102"
                    value={unitNum}
                    onChange={(e) => setUnitNum(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Type</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 Bedroom Luxury"
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Rent (GH¢)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={unitRent}
                    onChange={(e) => setUnitRent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Security Deposit (GH¢)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={unitDeposit}
                    onChange={(e) => setUnitDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold">
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal 4: Add Tenant */}
        {activeModal === 'add-tenant' && (
          <div>
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Register Tenant</h3>
                <p className="text-xs text-slate-400 mt-0.5">Captures Ghana Card & generates portal token</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddTenantSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwadwo Agyeman"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ghana Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="024 123 4567"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="tenant@domain.gh"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ghana Card PIN</label>
                  <input
                    type="text"
                    required
                    placeholder="GHA-7XXXXXXXX-X"
                    value={tenantIdNum}
                    onChange={(e) => setTenantIdNum(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Banker, Legal Counsel"
                    value={tenantOccupation}
                    onChange={(e) => setTenantOccupation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    required
                    placeholder="Name & Relationship"
                    value={tenantEmergName}
                    onChange={(e) => setTenantEmergName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="020 987 6543"
                    value={tenantEmergPhone}
                    onChange={(e) => setTenantEmergPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold">
                  Register Tenant
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal 5: Create Tenancy */}
        {activeModal === 'create-tenancy' && (
          <div>
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Create Tenancy Agreement</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Link tenant to unit, define advance period & auto-generate first invoice
                </p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTenancySubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenant</label>
                  <select
                    value={tcyTenantId}
                    onChange={(e) => setTcyTenantId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>{t.fullName} ({t.phone})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Available Unit</label>
                  <select
                    value={tcyUnitId}
                    onChange={(e) => {
                      setTcyUnitId(e.target.value);
                      const u = units.find((x) => x.id === e.target.value);
                      if (u) {
                        setTcyRent(u.monthlyRent);
                        setTcyDeposit(u.securityDeposit);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {units.map((u) => {
                      const p = getPropertyById(u.propertyId);
                      return (
                        <option key={u.id} value={u.id}>
                          Unit {u.unitNumber} - {p?.name} ({u.status})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rent Amount (GH¢)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={tcyRent}
                    onChange={(e) => setTcyRent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Billing Frequency</label>
                  <select
                    value={tcyFreq}
                    onChange={(e) => setTcyFreq(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="HALF_YEARLY">Half-Yearly (6 Months)</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Advance Rent Period</label>
                  <select
                    value={tcyAdvance}
                    onChange={(e) => setTcyAdvance(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-teal-800"
                  >
                    <option value={1}>1 Month (Standard)</option>
                    <option value={6}>6 Months Advance</option>
                    <option value={12}>12 Months Advance (1 Year)</option>
                    <option value={24}>24 Months Advance (2 Years)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Security Deposit (GH¢)</label>
                  <input
                    type="number"
                    value={tcyDeposit}
                    onChange={(e) => setTcyDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={tcyStartDate}
                    onChange={(e) => setTcyStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={tcyEndDate}
                    onChange={(e) => setTcyEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-[11px] text-teal-900 leading-normal">
                RentFlow will automatically switch the unit to <strong>Occupied</strong>, assign the tenant, and generate the first cycle invoice obligation ready for payment and receipt allocation.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold">
                  Execute Agreement
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
