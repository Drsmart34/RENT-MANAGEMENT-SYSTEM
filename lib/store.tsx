'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Landlord,
  Property,
  Unit,
  Tenant,
  Tenancy,
  RentInvoice,
  Payment,
  PaymentAllocation,
  Receipt,
  NotificationRecord,
  LedgerEntry,
  MaintenanceTicket,
  ExpenseRecord,
  PaymentMethod,
  MobileMoneyNetwork,
  BillingFrequency,
} from './types';
import {
  INITIAL_LANDLORDS,
  INITIAL_PROPERTIES,
  INITIAL_UNITS,
  INITIAL_TENANTS,
  INITIAL_TENANCIES,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_RECEIPTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MAINTENANCE,
  INITIAL_EXPENSES,
} from './sample-data';

interface RentFlowContextType {
  // Active Landlord
  landlords: Landlord[];
  activeLandlord: Landlord;
  setActiveLandlordId: (id: string) => void;

  // Portfolios & Entities
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  tenancies: Tenancy[];
  invoices: RentInvoice[];
  payments: Payment[];
  receipts: Receipt[];
  notifications: NotificationRecord[];
  maintenanceTickets: MaintenanceTicket[];
  expenses: ExpenseRecord[];

  // View state / Navigation
  currentView: 'dashboard' | 'properties' | 'units' | 'tenants' | 'tenancies' | 'invoices' | 'payments' | 'notifications' | 'maintenance' | 'reports' | 'tenant-portal' | 'admin';
  setCurrentView: (view: 'dashboard' | 'properties' | 'units' | 'tenants' | 'tenancies' | 'invoices' | 'payments' | 'notifications' | 'maintenance' | 'reports' | 'tenant-portal' | 'admin') => void;
  selectedTenantPortalToken: string | null;
  openTenantPortal: (token: string) => void;
  selectedReceipt: Receipt | null;
  openReceiptModal: (receipt: Receipt) => void;
  closeReceiptModal: () => void;
  selectedLedgerTenancyId: string | null;
  openLedgerModal: (tenancyId: string) => void;
  closeLedgerModal: () => void;

  // Actions
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  addTenant: (tenant: Omit<Tenant, 'id' | 'portalToken' | 'createdAt'>) => Tenant;
  createTenancy: (data: Omit<Tenancy, 'id' | 'createdAt'>) => void;
  recordPayment: (data: {
    tenancyId: string;
    invoiceId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    providerNetwork?: string;
    providerReference?: string;
    payerName: string;
    payerPhone: string;
    notes?: string;
  }) => { payment: Payment; receipt: Receipt };
  tenantPayRent: (data: {
    tenantId: string;
    invoiceId: string;
    amount: number;
    network: MobileMoneyNetwork;
    phoneNumber: string;
  }) => Promise<{ payment: Payment; receipt: Receipt }>;
  generateNextCycleInvoices: (periodMonthYear: string) => number;
  runReminderEngine: () => { queuedCount: number; message: string };
  addMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'reportedDate'>) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceTicket['status']) => void;
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  resetToSampleData: () => void;

  // Computed Queries
  getTenantLedger: (tenancyId: string) => LedgerEntry[];
  getTenantById: (id: string) => Tenant | undefined;
  getUnitById: (id: string) => Unit | undefined;
  getPropertyById: (id: string) => Property | undefined;
  getTenancyById: (id: string) => Tenancy | undefined;
  metrics: {
    totalProperties: number;
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    occupancyRate: number;
    expectedRent: number;
    collectedRent: number;
    outstandingRent: number;
    collectionRate: number;
    overdueInvoicesCount: number;
  };
}

const RentFlowContext = createContext<RentFlowContextType | null>(null);

const STORAGE_KEY = 'rentflow_ghana_v03_data';

function getStoredOrDefault<T>(field: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed[field]) return parsed[field];
    }
  } catch {
    // fallback
  }
  return defaultValue;
}

export function RentFlowProvider({ children }: { children: React.ReactNode }) {
  const [landlords] = useState<Landlord[]>(INITIAL_LANDLORDS);
  const [activeLandlordId, setActiveLandlordId] = useState<string>('lnd_christian_ahugbah');

  const [properties, setProperties] = useState<Property[]>(() => getStoredOrDefault('properties', INITIAL_PROPERTIES));
  const [units, setUnits] = useState<Unit[]>(() => getStoredOrDefault('units', INITIAL_UNITS));
  const [tenants, setTenants] = useState<Tenant[]>(() => getStoredOrDefault('tenants', INITIAL_TENANTS));
  const [tenancies, setTenancies] = useState<Tenancy[]>(() => getStoredOrDefault('tenancies', INITIAL_TENANCIES));
  const [invoices, setInvoices] = useState<RentInvoice[]>(() => getStoredOrDefault('invoices', INITIAL_INVOICES));
  const [payments, setPayments] = useState<Payment[]>(() => getStoredOrDefault('payments', INITIAL_PAYMENTS));
  const [receipts, setReceipts] = useState<Receipt[]>(() => getStoredOrDefault('receipts', INITIAL_RECEIPTS));
  const [notifications, setNotifications] = useState<NotificationRecord[]>(() => getStoredOrDefault('notifications', INITIAL_NOTIFICATIONS));
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => getStoredOrDefault('maintenanceTickets', INITIAL_MAINTENANCE));
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => getStoredOrDefault('expenses', INITIAL_EXPENSES));

  const [currentView, setCurrentView] = useState<'dashboard' | 'properties' | 'units' | 'tenants' | 'tenancies' | 'invoices' | 'payments' | 'notifications' | 'maintenance' | 'reports' | 'tenant-portal' | 'admin'>('dashboard');
  const [selectedTenantPortalToken, setSelectedTenantPortalToken] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [selectedLedgerTenancyId, setSelectedLedgerTenancyId] = useState<string | null>(null);

  // Save to localStorage
  const saveState = (updated: {
    properties?: Property[];
    units?: Unit[];
    tenants?: Tenant[];
    tenancies?: Tenancy[];
    invoices?: RentInvoice[];
    payments?: Payment[];
    receipts?: Receipt[];
    notifications?: NotificationRecord[];
    maintenanceTickets?: MaintenanceTicket[];
    expenses?: ExpenseRecord[];
  }) => {
    try {
      const dataToSave = {
        properties: updated.properties ?? properties,
        units: updated.units ?? units,
        tenants: updated.tenants ?? tenants,
        tenancies: updated.tenancies ?? tenancies,
        invoices: updated.invoices ?? invoices,
        payments: updated.payments ?? payments,
        receipts: updated.receipts ?? receipts,
        notifications: updated.notifications ?? notifications,
        maintenanceTickets: updated.maintenanceTickets ?? maintenanceTickets,
        expenses: updated.expenses ?? expenses,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // storage quota or incognito
    }
  };

  const activeLandlord = landlords.find((l) => l.id === activeLandlordId) || landlords[0];

  const getTenantById = (id: string) => tenants.find((t) => t.id === id);
  const getUnitById = (id: string) => units.find((u) => u.id === id);
  const getPropertyById = (id: string) => properties.find((p) => p.id === id);
  const getTenancyById = (id: string) => tenancies.find((t) => t.id === id);

  const openTenantPortal = (token: string) => {
    setSelectedTenantPortalToken(token);
    setCurrentView('tenant-portal');
  };

  const openReceiptModal = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
  };

  const closeReceiptModal = () => {
    setSelectedReceipt(null);
  };

  const openLedgerModal = (tenancyId: string) => {
    setSelectedLedgerTenancyId(tenancyId);
  };

  const closeLedgerModal = () => {
    setSelectedLedgerTenancyId(null);
  };

  // Add Property
  const addProperty = (data: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...data,
      id: `prop_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newProperty, ...properties];
    setProperties(updated);
    saveState({ properties: updated });
  };

  // Add Unit
  const addUnit = (data: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...data,
      id: `unit_${Date.now()}`,
    };
    const updatedUnits = [...units, newUnit];
    setUnits(updatedUnits);

    // Update property total units count
    const updatedProperties = properties.map((p) =>
      p.id === data.propertyId ? { ...p, totalUnits: p.totalUnits + 1 } : p
    );
    setProperties(updatedProperties);
    saveState({ units: updatedUnits, properties: updatedProperties });
  };

  // Add Tenant
  const addTenant = (data: Omit<Tenant, 'id' | 'portalToken' | 'createdAt'>): Tenant => {
    const slug = data.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newTenant: Tenant = {
      ...data,
      id: `ten_${Date.now()}`,
      portalToken: `rf_tok_${slug}_${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTenant, ...tenants];
    setTenants(updated);
    saveState({ tenants: updated });
    return newTenant;
  };

  // Create Tenancy
  const createTenancy = (data: Omit<Tenancy, 'id' | 'createdAt'>) => {
    const tenancyId = `tcy_${Date.now()}`;
    const newTenancy: Tenancy = {
      ...data,
      id: tenancyId,
      createdAt: new Date().toISOString(),
    };

    // Update unit occupancy & currentTenantId
    const updatedUnits = units.map((u) =>
      u.id === data.unitId ? { ...u, status: 'Occupied' as const, currentTenantId: data.tenantId } : u
    );

    // Auto-generate first rent invoice obligation
    const startDate = new Date(data.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(endDate.getDate() - 1);

    const firstInvoice: RentInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      tenancyId: tenancyId,
      tenantId: data.tenantId,
      unitId: data.unitId,
      propertyId: data.propertyId,
      periodStart: data.startDate,
      periodEnd: endDate.toISOString().split('T')[0],
      dueDate: data.startDate,
      amount: data.rentAmount,
      paidAmount: 0,
      balance: data.rentAmount,
      status: 'Due',
      createdAt: new Date().toISOString(),
    };

    const updatedTenancies = [newTenancy, ...tenancies];
    const updatedInvoices = [firstInvoice, ...invoices];

    setTenancies(updatedTenancies);
    setUnits(updatedUnits);
    setInvoices(updatedInvoices);

    saveState({
      tenancies: updatedTenancies,
      units: updatedUnits,
      invoices: updatedInvoices,
    });
  };

  // Record Payment with strict PaymentAllocation & Receipt Generation (PDF Section 7)
  const recordPayment = (data: {
    tenancyId: string;
    invoiceId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    providerNetwork?: string;
    providerReference?: string;
    payerName: string;
    payerPhone: string;
    notes?: string;
  }) => {
    const paymentId = `pay_${Date.now()}`;
    const payNum = String(payments.length + 1).padStart(4, '0');
    const paymentReference = `RF-PAY-2026-${payNum}`;
    const receiptNumber = `RF-REC-2026-${payNum}`;

    const targetInvoice = invoices.find((inv) => inv.id === data.invoiceId);
    const targetTenancy = tenancies.find((t) => t.id === data.tenancyId);

    const unitId = targetInvoice?.unitId || targetTenancy?.unitId || '';
    const propertyId = targetInvoice?.propertyId || targetTenancy?.propertyId || '';
    const tenantId = targetInvoice?.tenantId || targetTenancy?.tenantId || '';

    // Payment Allocation
    const allocation: PaymentAllocation = {
      id: `alloc_${Date.now()}`,
      paymentId,
      invoiceId: data.invoiceId,
      amountAllocated: data.amount,
      allocatedAt: new Date().toISOString(),
    };

    const newPayment: Payment = {
      id: paymentId,
      paymentReference,
      providerReference: data.providerReference || `MOMO-${Math.floor(1000000 + Math.random() * 9000000)}`,
      tenancyId: data.tenancyId,
      tenantId,
      unitId,
      propertyId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      providerNetwork: data.providerNetwork || 'MTN MoMo',
      paymentDate: new Date().toISOString(),
      status: 'Confirmed',
      payerName: data.payerName,
      payerPhone: data.payerPhone,
      receiptNumber,
      notes: data.notes || 'Payment recorded via RentFlow billing engine',
      allocations: [allocation],
    };

    // Update target invoice status and balance
    let remainingInvoiceBalance = 0;
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === data.invoiceId) {
        const newPaidAmount = inv.paidAmount + data.amount;
        const newBalance = Math.max(0, inv.amount - newPaidAmount);
        remainingInvoiceBalance = newBalance;
        let newStatus: RentInvoice['status'] = 'Due';
        if (newBalance <= 0) {
          newStatus = 'Paid';
        } else if (newPaidAmount > 0) {
          newStatus = 'Partially Paid';
        }
        return {
          ...inv,
          paidAmount: newPaidAmount,
          balance: newBalance,
          status: newStatus,
        };
      }
      return inv;
    });

    // Create unique official receipt
    const newReceipt: Receipt = {
      id: `rec_${Date.now()}`,
      receiptNumber,
      paymentId,
      tenancyId: data.tenancyId,
      tenantId,
      unitId,
      propertyId,
      amountPaid: data.amount,
      periodCovered: targetInvoice ? `${targetInvoice.periodStart} to ${targetInvoice.periodEnd}` : 'Tenancy Rent Schedule',
      issueDate: new Date().toISOString().split('T')[0],
      issuedBy: 'RentFlow Automated Billing System',
      balanceRemaining: remainingInvoiceBalance,
      notes: `Verified transaction. Provider ref: ${newPayment.providerReference}. Payment method: ${data.paymentMethod} (${newPayment.providerNetwork}).`,
    };

    // Auto-enqueue confirmation notification (SMS + WhatsApp)
    const newNotification: NotificationRecord = {
      id: `notif_${Date.now()}`,
      tenantId,
      tenancyId: data.tenancyId,
      invoiceId: data.invoiceId,
      channel: 'SMS',
      recipient: data.payerPhone,
      title: 'Rent Payment Confirmed',
      message: `RentFlow: GH¢${data.amount.toLocaleString()} received via ${newPayment.providerNetwork}. Receipt #${receiptNumber} generated. Remaining balance: GH¢${remainingInvoiceBalance.toLocaleString()}. Thank you!`,
      status: 'Sent',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      providerReference: `HUBTEL-SMS-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    const updatedPayments = [newPayment, ...payments];
    const updatedReceipts = [newReceipt, ...receipts];
    const updatedNotifications = [newNotification, ...notifications];

    setPayments(updatedPayments);
    setInvoices(updatedInvoices);
    setReceipts(updatedReceipts);
    setNotifications(updatedNotifications);

    saveState({
      payments: updatedPayments,
      invoices: updatedInvoices,
      receipts: updatedReceipts,
      notifications: updatedNotifications,
    });

    return { payment: newPayment, receipt: newReceipt };
  };

  // Tenant self-service pay rent (simulates MoMo prompt / gateway)
  const tenantPayRent = async (data: {
    tenantId: string;
    invoiceId: string;
    amount: number;
    network: MobileMoneyNetwork;
    phoneNumber: string;
  }) => {
    // Artificial 1.2s delay to simulate live Ghana MoMo USSD authorization
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const tenant = getTenantById(data.tenantId);
    const invoice = invoices.find((inv) => inv.id === data.invoiceId);
    const tenancy = tenancies.find((t) => t.id === invoice?.tenancyId);

    const providerRef = `${data.network === 'MTN MoMo' ? 'MTN-MOMO' : data.network === 'Telecel Cash' ? 'TEL-CASH' : 'ATM-MONEY'}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    return recordPayment({
      tenancyId: tenancy?.id || '',
      invoiceId: data.invoiceId,
      amount: data.amount,
      paymentMethod: 'Mobile Money',
      providerNetwork: data.network,
      providerReference: providerRef,
      payerName: tenant?.fullName || 'Tenant',
      payerPhone: data.phoneNumber,
      notes: `Self-service online payment via RentFlow Tenant Portal (${data.network}).`,
    });
  };

  // Reconstruct auditable Tenant Rent Ledger (PDF Page 4 Example)
  const getTenantLedger = (tenancyId: string): LedgerEntry[] => {
    const tcyInvoices = invoices.filter((inv) => inv.tenancyId === tenancyId);
    const tcyPayments = payments.filter((pay) => pay.tenancyId === tenancyId && pay.status === 'Confirmed');

    // Combine invoices (charges/debit) and payments (credits) chronologically
    type Event = {
      date: string;
      description: string;
      debit?: number;
      payment?: number;
      reference?: string;
    };

    const events: Event[] = [];

    tcyInvoices.forEach((inv) => {
      const monthName = new Date(inv.periodStart).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
      events.push({
        date: inv.periodStart,
        description: `${monthName} Rent Charge`,
        debit: inv.amount,
        reference: inv.invoiceNumber,
      });
    });

    tcyPayments.forEach((pay) => {
      events.push({
        date: pay.paymentDate.split('T')[0],
        description: `${pay.paymentMethod} Payment (${pay.providerNetwork || 'Direct'})`,
        payment: pay.amount,
        reference: pay.paymentReference,
      });
    });

    // Sort chronologically
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = 0;
    const ledger: LedgerEntry[] = events.map((ev, index) => {
      if (ev.debit) runningBalance += ev.debit;
      if (ev.payment) runningBalance -= ev.payment;
      return {
        id: `led_${index}`,
        date: ev.date,
        description: ev.description,
        debit: ev.debit,
        payment: ev.payment,
        balance: Math.max(0, runningBalance),
        reference: ev.reference,
      };
    });

    return ledger;
  };

  // Automatic rent billing generator for next cycle
  const generateNextCycleInvoices = (periodMonthYear: string): number => {
    // E.g., periodMonthYear = "2026-11"
    const activeTenancies = tenancies.filter((t) => t.status === 'Active');
    let generatedCount = 0;
    const newInvoices: RentInvoice[] = [];

    activeTenancies.forEach((tcy) => {
      // Check if invoice already exists for this period
      const exists = invoices.some(
        (inv) => inv.tenancyId === tcy.id && inv.periodStart.startsWith(periodMonthYear)
      );
      if (!exists) {
        const periodStart = `${periodMonthYear}-01`;
        const dateObj = new Date(periodStart);
        dateObj.setMonth(dateObj.getMonth() + 1);
        dateObj.setDate(0);
        const periodEnd = dateObj.toISOString().split('T')[0];

        const invNum = `INV-2026-${String(invoices.length + newInvoices.length + 1).padStart(3, '0')}`;
        newInvoices.push({
          id: `inv_${Date.now()}_${generatedCount}`,
          invoiceNumber: invNum,
          tenancyId: tcy.id,
          tenantId: tcy.tenantId,
          unitId: tcy.unitId,
          propertyId: tcy.propertyId,
          periodStart,
          periodEnd,
          dueDate: periodStart,
          amount: tcy.rentAmount,
          paidAmount: 0,
          balance: tcy.rentAmount,
          status: 'Upcoming',
          createdAt: new Date().toISOString(),
        });
        generatedCount++;
      }
    });

    if (newInvoices.length > 0) {
      const updated = [...newInvoices, ...invoices];
      setInvoices(updated);
      saveState({ invoices: updated });
    }

    return generatedCount;
  };

  // Run Rent Reminders Engine (Section 18)
  const runReminderEngine = () => {
    let queued = 0;
    const newNotifs: NotificationRecord[] = [];

    invoices.forEach((inv) => {
      if (inv.balance > 0 && (inv.status === 'Due' || inv.status === 'Overdue' || inv.status === 'Partially Paid')) {
        const tenant = getTenantById(inv.tenantId);
        const unit = getUnitById(inv.unitId);
        const prop = getPropertyById(inv.propertyId);

        if (tenant) {
          const isOverdue = inv.status === 'Overdue';
          const notif: NotificationRecord = {
            id: `notif_${Date.now()}_${queued}`,
            tenantId: tenant.id,
            tenancyId: inv.tenancyId,
            invoiceId: inv.id,
            channel: 'SMS',
            recipient: tenant.phone,
            title: isOverdue ? 'RentFlow: Overdue Notice' : 'RentFlow: Rent Due Reminder',
            message: `Dear ${tenant.fullName}, your rent of GH¢${inv.balance.toLocaleString()} for Unit ${unit?.unitNumber || ''} at ${prop?.name || 'Property'} is ${isOverdue ? 'OVERDUE' : 'due'}. Pay securely via Mobile Money: rentflow.gh/portal?token=${tenant.portalToken}`,
            status: 'Queued',
            createdAt: new Date().toISOString(),
          };
          newNotifs.push(notif);
          queued++;
        }
      }
    });

    if (newNotifs.length > 0) {
      const updated = [...newNotifs, ...notifications];
      setNotifications(updated);
      saveState({ notifications: updated });
    }

    return {
      queuedCount: queued,
      message: `Rent reminder engine dispatched! ${queued} reminders queued for delivery via SMS & WhatsApp gateway.`,
    };
  };

  // Add Maintenance Ticket
  const addMaintenanceTicket = (data: Omit<MaintenanceTicket, 'id' | 'reportedDate'>) => {
    const newTicket: MaintenanceTicket = {
      ...data,
      id: `maint_${Date.now()}`,
      reportedDate: new Date().toISOString().split('T')[0],
    };
    const updated = [newTicket, ...maintenanceTickets];
    setMaintenanceTickets(updated);
    saveState({ maintenanceTickets: updated });
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceTicket['status']) => {
    const updated = maintenanceTickets.map((m) => (m.id === id ? { ...m, status } : m));
    setMaintenanceTickets(updated);
    saveState({ maintenanceTickets: updated });
  };

  // Add Operating Expense
  const addExpense = (data: Omit<ExpenseRecord, 'id'>) => {
    const newExp: ExpenseRecord = {
      ...data,
      id: `exp_${Date.now()}`,
    };
    const updated = [newExp, ...expenses];
    setExpenses(updated);
    saveState({ expenses: updated });
  };

  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProperties(INITIAL_PROPERTIES);
    setUnits(INITIAL_UNITS);
    setTenants(INITIAL_TENANTS);
    setTenancies(INITIAL_TENANCIES);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setReceipts(INITIAL_RECEIPTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setMaintenanceTickets(INITIAL_MAINTENANCE);
    setExpenses(INITIAL_EXPENSES);
  };

  // Computed Metrics (matching Section 9 metrics)
  const totalProperties = properties.length;
  const totalUnits = units.length;
  const occupiedUnits = units.filter((u) => u.status === 'Occupied').length;
  const vacantUnits = totalUnits - occupiedUnits;
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

  // Expected Rent: sum of rent for all invoices for the current billing periods
  const expectedRent = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const collectedRent = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const outstandingRent = invoices.reduce((acc, inv) => acc + inv.balance, 0);
  const collectionRate = expectedRent > 0 ? (collectedRent / expectedRent) * 100 : 0;
  const overdueInvoicesCount = invoices.filter((i) => i.status === 'Overdue').length;

  return (
    <RentFlowContext.Provider
      value={{
        landlords,
        activeLandlord,
        setActiveLandlordId,
        properties,
        units,
        tenants,
        tenancies,
        invoices,
        payments,
        receipts,
        notifications,
        maintenanceTickets,
        expenses,
        currentView,
        setCurrentView,
        selectedTenantPortalToken,
        openTenantPortal,
        selectedReceipt,
        openReceiptModal,
        closeReceiptModal,
        selectedLedgerTenancyId,
        openLedgerModal,
        closeLedgerModal,
        addProperty,
        addUnit,
        addTenant,
        createTenancy,
        recordPayment,
        tenantPayRent,
        generateNextCycleInvoices,
        runReminderEngine,
        addMaintenanceTicket,
        updateMaintenanceStatus,
        addExpense,
        resetToSampleData,
        getTenantLedger,
        getTenantById,
        getUnitById,
        getPropertyById,
        getTenancyById,
        metrics: {
          totalProperties,
          totalUnits,
          occupiedUnits,
          vacantUnits,
          occupancyRate,
          expectedRent,
          collectedRent,
          outstandingRent,
          collectionRate,
          overdueInvoicesCount,
        },
      }}
    >
      {children}
    </RentFlowContext.Provider>
  );
}

export function useRentFlow() {
  const context = useContext(RentFlowContext);
  if (!context) {
    throw new Error('useRentFlow must be used within a RentFlowProvider');
  }
  return context;
}
