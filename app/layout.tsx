import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'RentFlow - Ghana Property & Rent Management Platform',
  description: 'Multi-landlord rent and property management system for Ghana. Manage properties, units, tenants, tenancies, automated rent billing, Mobile Money payments, arrears, ledger, receipt generation, and tenant self-service portal.',
  openGraph: {
    title: 'RentFlow - Ghana Property & Rent Management Platform',
    description: 'Multi-landlord rent and property management system for Ghana. Manage properties, units, tenants, tenancies, automated rent billing, Mobile Money payments, arrears, ledger, receipt generation, and tenant self-service portal.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentFlow - Ghana Property & Rent Management Platform',
    description: 'Multi-landlord rent and property management system for Ghana. Manage properties, units, tenants, tenancies, automated rent billing, Mobile Money payments, arrears, ledger, receipt generation, and tenant self-service portal.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
