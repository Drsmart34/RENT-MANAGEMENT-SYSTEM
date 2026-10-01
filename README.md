# RentFlow 🇬🇭 — Rent Management Platform

**RentFlow** is a modern, enterprise-ready Property & Rent Management system engineered specifically for the Ghanaian real estate market. It empowers landlords, estate managers, and tenants with automated billing schedules, Mobile Money & bank reconciliation, Ghana Card KYC, GhanaPost GPS digital addressing, auditable tenant financial ledgers, legally compliant rent receipts, and a self-service tenant portal.

## 💡 Why RentFlow?

Managing residential and commercial rental properties in Ghana presents unique operational challenges:
- **Rent Advance Practices:** Tenancies often involve 6, 12, or 24-month advance payments alongside recurring cycles.
- **Mobile Money Domination:** Most rent payments happen via MTN MoMo, Telecel Cash, or AT Money rather than checks or traditional card rails.
- **Dispute Resolution & Rent Control:** The Ghana Rent Control Department requires clear, unalterable transaction ledgers and valid rent receipts with landlord/tenant details.
- **Local Address Standards:** Property verification relies heavily on GhanaPost GPS digital addresses (e.g., `GA-492-3841`) and national Ghana Cards (`GHA-xxxxxxxxx-x`).
- **Utility & Facility Overhead:** Landlords frequently manage borehole servicing, standby generator fuel, ECG prepaid meters, and security gatehouses.

RentFlow solves these challenges out-of-the-box in a unified, beautifully styled web application.

---

## ✨ Core Features

### 1. Ghana-Specific Real Estate Workflows
- **Ghana Card KYC:** Enforce national identification standards (`GHA-xxxxxxxxx-x`) for both landlords and tenants.
- **GhanaPost GPS Digital Addressing:** Store and display exact digital address codes for all properties and buildings.
- **Advance Rent Structuring:** Configure billing frequencies (Monthly, Quarterly, Semi-Annually, Annually) with advance duration allowances (6 months, 1 year, 2 years).
- **Utility Tracking:** Log facility expenses such as ECG electricity bills, Ghana Water Company (GWCL) invoices, and borehole maintenance.

### 2. Multi-Landlord & Property Portfolio Management
- **Multi-Landlord Support:** Seamlessly manage individual private landlords or corporate real estate firms with distinct bank accounts and MoMo merchant IDs.
- **Hierarchical Asset Hierarchy:** Landlord ➔ Properties ➔ Units ➔ Tenancies.
- **Unit Status Tracking:** Real-time visibility into `Occupied`, `Vacant`, and `Under Maintenance` units with rental rates and security deposit requirements.

### 3. Automated Invoicing, Arrears & Rent Advances
- Automated rent invoice generation based on tenancy start dates and billing terms.
- Status management: `Upcoming`, `Due`, `Partially Paid`, `Paid`, and `Overdue`.
- Real-time arrears calculations with visual overdue alerts and payment countdown timers.

### 4. Multi-Channel Payments & Instant Reconciliation
- Log payments across **MTN MoMo**, **Telecel Cash**, **AT Money**, **Bank Transfer**, **Cash**, and **Card**.
- Automatic payment allocation to outstanding invoices (partial payments and multi-invoice splits).
- Tracking of internal transaction references (`RF-PAY-...`) and telco/bank provider references (`MTN-MOMO-...`, `GCB-...`).

### 5. Official Rent Receipts & Auditable Tenant Ledgers
- **Official Printable Receipts:** Generate high-resolution, print-ready digital rent receipts complete with serial numbers, payer details, period covered, balance remaining, authorized signature line, and verification QR code.
- **Auditable Tenant Financial Ledger:** View a running statement of accounts with debits (rent due), credits (payments received), and running balance—ideal for audits and dispute settlement.

### 6. Tenant Self-Service Portal
- Dedicated tenant view with secure portal token access.
- Allows tenants to check their active tenancy terms, view upcoming invoices, verify payment history, download past receipts, and submit maintenance tickets directly to the landlord.

### 7. Maintenance, Utilities & Facility Expenses
- Log maintenance tickets with severity levels (`Low`, `Medium`, `High`, `Emergency`) and categories (`Plumbing`, `Electrical`, `Water Supply`, `AC / HVAC`, `Carpentry`, `General`).
- Track operational property expenses with vendor details and receipt references.

### 8. Multi-Channel Notifications (SMS, WhatsApp, Email)
- Pre-configured notifications for upcoming rent due dates, payment confirmations, and overdue arrears alerts.
- Filter by delivery channel: **SMS**, **WhatsApp**, **Email**, and **In-App**.

---

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 15 (App Router)** | Full-stack React framework with server and client components |
| **React 19** | Modern UI rendering and component architecture |
| **TypeScript** | Strict type safety for data models, invoices, and accounting math |
| **Tailwind CSS 4** | Clean, responsive, and accessible styling |
| **Motion (`motion/react`)** | Fluid micro-interactions and modal transitions |
| **Lucide React** | Consistent iconography across dashboards and badges |

---

## 📂 Project Structure

```
├── app/
│   ├── globals.css          # Tailwind CSS global styles
│   ├── layout.tsx           # Root layout with metadata and OpenGraph configuration
│   └── page.tsx             # Main view router & modal container
├── components/
│   ├── ActionModals.tsx     # Modals for recording payments, creating units/tenants
│   ├── AdminConsoleView.tsx # Platform administration & multi-landlord management
│   ├── InvoicesView.tsx     # Rent invoices, billing schedules & arrears
│   ├── LandlordDashboard.tsx# Core financial dashboard, occupancy & quick stats
│   ├── MaintenanceExpensesView.tsx # Repair tickets & property operating expenses
│   ├── Navbar.tsx           # Global top navigation with landlord switcher
│   ├── NotificationsView.tsx# Automated SMS, WhatsApp, and Email log
│   ├── PaymentsView.tsx     # Transaction ledger & payment reconciliation
│   ├── PropertiesView.tsx   # Property portfolio directory with GPS addresses
│   ├── ReceiptModal.tsx     # Official printable rent receipt component
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── TenanciesView.tsx    # Active tenancy contracts & advance rent agreements
│   ├── TenantLedgerModal.tsx# Auditable financial statement ledger modal
│   ├── TenantPortalView.tsx # Tenant self-service portal
│   ├── TenantsView.tsx      # Tenant directory with Ghana Card KYC
│   └── UnitsView.tsx        # Unit occupancy & status manager
├── lib/
│   ├── sample-data.ts       # Realistic Ghana real estate seed dataset
│   ├── store.tsx            # Central state management (React Context)
│   ├── types.ts             # Complete TypeScript interface definitions
│   └── utils.ts             # Formatting utilities (GHS currency, dates, IDs)
├── public/
│   └── images/              # Property visuals and architecture photos
├── metadata.json            # AI Studio applet configuration
├── next.config.ts           # Next.js build configuration
├── package.json             # Dependencies and project scripts
└── tsconfig.json            # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.18.0` or higher (Node 20+ recommended)
- **npm** or **bun** / **yarn** / **pnpm**

#  Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/rentflow-ghana.git
   cd rentflow-ghana
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   *(Optional: configure `GEMINI_API_KEY` if utilizing server-side AI extensions).*

# Running the Development Server

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

# Building for Production

To create an optimized production build:
```bash
npm run build
npm start
```

---

## 🧭 Walkthrough & Common User Workflows

#  Recording a Mobile Money or Bank Payment
1. Navigate to the **Payments** or **Invoices** tab on the sidebar.
2. Click **Record Payment**.
3. Select the invoice or tenant you wish to credit.
4. Choose the payment method (**MTN MoMo**, **Telecel Cash**, **AT Money**, or **Bank Transfer**).
5. Enter the provider reference (e.g., `MTN-MOMO-9482103`) and payment amount.
6. The system automatically recalculates the invoice balance, issues an internal receipt number, and updates the tenant ledger.

#  Generating an Official Rent Receipt
1. Go to **Payments** and locate the confirmed payment transaction.
2. Click **View Receipt**.
3. A modal opens with the official, print-ready Ghana Rent Receipt displaying:
   - Landlord & property details
   - Tenant name and unit number
   - Amount in Ghana Cedis (GH₵)
   - Rent period covered
   - Stamp of authenticity and verification QR code.
4. Click **Print / Save as PDF** to generate a copy for the tenant.

#  Inspecting the Tenant Financial Ledger
1. In **Tenancies** or **Tenants**, click the **Ledger** button next to any active tenancy.
2. An auditable, double-entry statement displays all rent debits, payment credits, dates, transaction references, and running balances.

#  Accessing the Tenant Portal
1. On the top navigation bar or sidebar, select **Tenant Portal**.
2. Select any active tenant from the dropdown (e.g., *Kofi Mensah* or *Ama Serwaa Boateng*).
3. Experience the portal from the tenant's perspective: view outstanding balances, check lease start/end dates, download previous receipts, or submit a new maintenance request.

#  Switching Landlord Accounts
1. Use the landlord selector in the top-right header to switch between portfolios (e.g., *Ahugbah Real Estate & Asset Management* vs. *Asante Properties Ltd*).
2. The entire dashboard instantly recalculates revenues, collection percentages, and occupancy metrics for the active portfolio.

---
# ⚙️ Environment Configuration

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini API key for server-side smart assistance features | `""` |
| `APP_URL` | Base URL of the deployment | `http://localhost:3000` |

