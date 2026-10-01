'use client';

import React, { useState } from 'react';
import { RentFlowProvider, useRentFlow } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import LandlordDashboard from '@/components/LandlordDashboard';
import PropertiesView from '@/components/PropertiesView';
import UnitsView from '@/components/UnitsView';
import TenantsView from '@/components/TenantsView';
import TenanciesView from '@/components/TenanciesView';
import InvoicesView from '@/components/InvoicesView';
import PaymentsView from '@/components/PaymentsView';
import NotificationsView from '@/components/NotificationsView';
import MaintenanceExpensesView from '@/components/MaintenanceExpensesView';
import AdminConsoleView from '@/components/AdminConsoleView';
import TenantPortalView from '@/components/TenantPortalView';
import ReceiptModal from '@/components/ReceiptModal';
import TenantLedgerModal from '@/components/TenantLedgerModal';
import ActionModals from '@/components/ActionModals';

function MainAppContent() {
  const {
    currentView,
    selectedReceipt,
    closeReceiptModal,
    selectedLedgerTenancyId,
    closeLedgerModal,
  } = useRentFlow();

  const [activeModal, setActiveModal] = useState<
    'record-payment' | 'add-property' | 'add-unit' | 'add-tenant' | 'create-tenancy' | null
  >(null);
  const [preselectedInvoiceId, setPreselectedInvoiceId] = useState<string | undefined>(undefined);

  const handleOpenRecordPayment = (invoiceId?: string) => {
    setPreselectedInvoiceId(invoiceId);
    setActiveModal('record-payment');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Bar adhering to Top Bar Contract */}
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Landlord & Platform Operations */}
        <Sidebar />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && (
            <LandlordDashboard
              onOpenRecordPayment={() => handleOpenRecordPayment()}
              onOpenAddProperty={() => setActiveModal('add-property')}
              onOpenAddUnit={() => setActiveModal('add-unit')}
              onOpenAddTenant={() => setActiveModal('add-tenant')}
              onOpenCreateTenancy={() => setActiveModal('create-tenancy')}
            />
          )}

          {currentView === 'properties' && (
            <PropertiesView onOpenAddProperty={() => setActiveModal('add-property')} />
          )}

          {currentView === 'units' && (
            <UnitsView
              onOpenAddUnit={() => setActiveModal('add-unit')}
              onOpenCreateTenancy={() => setActiveModal('create-tenancy')}
            />
          )}

          {currentView === 'tenants' && (
            <TenantsView onOpenAddTenant={() => setActiveModal('add-tenant')} />
          )}

          {currentView === 'tenancies' && (
            <TenanciesView onOpenCreateTenancy={() => setActiveModal('create-tenancy')} />
          )}

          {currentView === 'invoices' && (
            <InvoicesView onOpenRecordPayment={handleOpenRecordPayment} />
          )}

          {currentView === 'payments' && (
            <PaymentsView onOpenRecordPayment={() => handleOpenRecordPayment()} />
          )}

          {currentView === 'notifications' && <NotificationsView />}

          {currentView === 'maintenance' && <MaintenanceExpensesView />}

          {currentView === 'admin' && <AdminConsoleView />}

          {currentView === 'tenant-portal' && <TenantPortalView />}
        </main>
      </div>

      {/* Official PDF Rent Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal receipt={selectedReceipt} onClose={closeReceiptModal} />
      )}

      {/* Auditable Tenant Ledger Modal (PDF Section 8 & Page 4) */}
      {selectedLedgerTenancyId && (
        <TenantLedgerModal
          tenancyId={selectedLedgerTenancyId}
          onClose={closeLedgerModal}
        />
      )}

      {/* Operational Landlord Modals */}
      <ActionModals
        activeModal={activeModal}
        preselectedInvoiceId={preselectedInvoiceId}
        onClose={() => {
          setActiveModal(null);
          setPreselectedInvoiceId(undefined);
        }}
      />
    </div>
  );
}

export default function Page() {
  return (
    <RentFlowProvider>
      <MainAppContent />
    </RentFlowProvider>
  );
}
