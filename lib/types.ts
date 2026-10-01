export type BillingFrequency = 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';

export type InvoiceStatus = 'Upcoming' | 'Due' | 'Partially Paid' | 'Paid' | 'Overdue';

export type PaymentMethod = 'Mobile Money' | 'Bank Transfer' | 'Cash' | 'Card';

export type PaymentStatus = 'Confirmed' | 'Pending' | 'Failed';

export type MobileMoneyNetwork = 'MTN MoMo' | 'Telecel Cash' | 'AT Money';

export type UnitStatus = 'Occupied' | 'Vacant' | 'Under Maintenance';

export type PropertyType = 'Apartment Complex' | 'Residential Townhouse' | 'Commercial Office' | 'Mixed Use' | 'Single Family';

export type NotificationChannel = 'SMS' | 'WhatsApp' | 'Email' | 'In-App';

export type NotificationStatus = 'Queued' | 'Sent' | 'Failed';

export interface Landlord {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  ghanaCardNumber: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  momoDetails?: {
    network: MobileMoneyNetwork;
    phoneNumber: string;
    merchantName: string;
  };
}

export interface Property {
  id: string;
  landlordId: string;
  name: string;
  type: PropertyType;
  address: string;
  city: string;
  region: string;
  gpsAddress: string; // e.g. GA-492-3841
  totalUnits: number;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string; // e.g. "A1", "Suite 204"
  type: string; // "1 Bedroom", "2 Bedroom Luxury", "Office Suite"
  monthlyRent: number; // in GHS
  securityDeposit: number; // in GHS
  status: UnitStatus;
  currentTenantId?: string;
  amenities: string[];
}

export interface Tenant {
  id: string;
  fullName: string;
  phone: string; // Ghana format e.g. 0244123456
  email: string;
  idType: 'Ghana Card' | 'Passport' | 'Voter ID';
  idNumber: string; // e.g. GHA-723456789-0
  occupation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  portalToken: string; // e.g. "rf_tok_kofi_mensah"
  createdAt: string;
}

export interface Tenancy {
  id: string;
  landlordId: string;
  tenantId: string;
  unitId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  rentAmount: number; // in GHS per billing frequency
  billingFrequency: BillingFrequency;
  advanceMonths: number; // Ghana advance practice: 6, 12, 24 months
  securityDeposit: number;
  dueDay: number; // day of month (e.g. 1)
  status: 'Active' | 'Terminated' | 'Upcoming';
  agreementNotes?: string;
  createdAt: string;
}

export interface RentInvoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-001"
  tenancyId: string;
  tenantId: string;
  unitId: string;
  propertyId: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  amount: number; // Total billed in GHS
  paidAmount: number; // Total allocated so far in GHS
  balance: number; // amount - paidAmount
  status: InvoiceStatus;
  createdAt: string;
}

export interface PaymentAllocation {
  id: string;
  paymentId: string;
  invoiceId: string;
  amountAllocated: number; // in GHS
  allocatedAt: string;
}

export interface Payment {
  id: string;
  paymentReference: string; // Internal: RF-PAY-2026-0041
  providerReference: string; // External: MTN-MOMO-8392147 or GCB-9218
  tenancyId: string;
  tenantId: string;
  unitId: string;
  propertyId: string;
  amount: number; // in GHS
  paymentMethod: PaymentMethod;
  providerNetwork?: string; // MTN MoMo, Telecel Cash, AT Money, GCB, etc.
  paymentDate: string;
  status: PaymentStatus;
  payerName: string;
  payerPhone: string;
  receiptNumber?: string;
  notes?: string;
  allocations: PaymentAllocation[];
}

export interface Receipt {
  id: string;
  receiptNumber: string; // RF-REC-2026-0041
  paymentId: string;
  tenancyId: string;
  tenantId: string;
  unitId: string;
  propertyId: string;
  amountPaid: number;
  periodCovered: string;
  issueDate: string;
  issuedBy: string;
  balanceRemaining: number;
  notes?: string;
}

export interface NotificationRecord {
  id: string;
  tenantId: string;
  tenancyId?: string;
  invoiceId?: string;
  channel: NotificationChannel;
  recipient: string; // phone or email
  title: string;
  message: string;
  status: NotificationStatus;
  createdAt: string;
  sentAt?: string;
  providerReference?: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  debit?: number; // Rent obligation charged to tenant
  payment?: number; // Amount paid by tenant (credit)
  balance: number; // Running balance in GHS
  reference?: string;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'Water Supply' | 'AC / HVAC' | 'Carpentry' | 'General';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Open' | 'In Progress' | 'Resolved';
  reportedDate: string;
  estimatedCost?: number;
}

export interface ExpenseRecord {
  id: string;
  propertyId: string;
  category: 'ECG Electricity' | 'Ghana Water Bill' | 'Facility Security' | 'Borehole Servicing' | 'Repairs' | 'Grounds Maintenance';
  description: string;
  amount: number;
  date: string;
  vendorName: string;
  receiptReference?: string;
}
