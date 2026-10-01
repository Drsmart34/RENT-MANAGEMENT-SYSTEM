'use client';

import React, { useState } from 'react';
import { useRentFlow } from '@/lib/store';
import { Users, Plus, Search, ExternalLink, Smartphone, Copy, Check, ShieldCheck } from 'lucide-react';

export default function TenantsView({ onOpenAddTenant }: { onOpenAddTenant: () => void }) {
  const { tenants, tenancies, units, properties, openTenantPortal, getPropertyById, getUnitById } = useRentFlow();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const filteredTenants = tenants.filter((t) => {
    return (
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.phone.includes(searchTerm) ||
      t.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.occupation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tenant Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered tenants, verified Ghana Card IDs, emergency contacts, and self-service portal tokens.
          </p>
        </div>
        <button
          onClick={onOpenAddTenant}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Tenant</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by name, phone, Ghana Card, occupation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
        />
      </div>

      {/* Tenants Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Tenant Name</th>
                <th className="py-3 px-4">Ghana Card / ID</th>
                <th className="py-3 px-4">Phone & Email</th>
                <th className="py-3 px-4">Current Residence</th>
                <th className="py-3 px-4">Occupation</th>
                <th className="py-3 px-4">Emergency Contact</th>
                <th className="py-3 px-4 text-right">Self-Service Portal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No tenants found.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => {
                  const tenancy = tenancies.find((tcy) => tcy.tenantId === t.id && tcy.status === 'Active');
                  const unit = tenancy ? getUnitById(tenancy.unitId) : null;
                  const prop = tenancy ? getPropertyById(tenancy.propertyId) : null;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{t.fullName}</div>
                        <div className="text-[11px] text-slate-400">
                          Joined {new Date(t.createdAt).toLocaleDateString('en-GB')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-700 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                          <span>{t.idNumber}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{t.idType} Verified</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-medium text-slate-800">{t.phone}</div>
                        <div className="text-[11px] text-slate-500">{t.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        {unit && prop ? (
                          <div>
                            <span className="font-medium text-slate-900">Unit {unit.unitNumber}</span>
                            <div className="text-[11px] text-slate-500">{prop.name}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No active tenancy</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {t.occupation}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-700">{t.emergencyContactName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{t.emergencyContactPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyLink(t.portalToken)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                            title="Copy Portal Link"
                          >
                            {copiedToken === t.portalToken ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => openTenantPortal(t.portalToken)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded font-medium text-xs transition-colors"
                          >
                            <Smartphone className="w-3 h-3 text-teal-600" />
                            <span>Portal</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
