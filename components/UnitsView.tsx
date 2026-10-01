'use client';

import React, { useState } from 'react';
import { useRentFlow } from '@/lib/store';
import { DoorOpen, Plus, Search, CheckCircle2, AlertCircle, Wrench, User } from 'lucide-react';

export default function UnitsView({
  onOpenAddUnit,
  onOpenCreateTenancy,
}: {
  onOpenAddUnit: () => void;
  onOpenCreateTenancy: () => void;
}) {
  const { units, properties, tenants, getPropertyById, getTenantById, openTenantPortal } = useRentFlow();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredUnits = units.filter((u) => {
    const prop = getPropertyById(u.propertyId);
    const tenant = u.currentTenantId ? getTenantById(u.currentTenantId) : null;

    const matchesSearch =
      u.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prop?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (tenant?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesProp = selectedPropertyId === 'ALL' || u.propertyId === selectedPropertyId;
    const matchesStatus = selectedStatus === 'ALL' || u.status === selectedStatus;

    return matchesSearch && matchesProp && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Units & Rooms Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track individual rentable units, monthly rent rates, occupancy status, and utility amenities.
          </p>
        </div>
        <button
          onClick={onOpenAddUnit}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Unit</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search unit, property, tenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>

          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="ALL">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status segmented controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto self-stretch sm:self-auto">
          {['ALL', 'Occupied', 'Vacant', 'Under Maintenance'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Units' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Units Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Unit Number</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Monthly Rent</th>
                <th className="py-3 px-4 text-right">Security Deposit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Current Tenant</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No units found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((u) => {
                  const prop = getPropertyById(u.propertyId);
                  const tenant = u.currentTenantId ? getTenantById(u.currentTenantId) : null;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {u.unitNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {prop?.name || 'Unknown Property'}
                        <div className="text-[11px] text-slate-400 font-mono">
                          {prop?.gpsAddress}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{u.type}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 text-right">
                        GH¢{u.monthlyRent.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-right">
                        GH¢{u.securityDeposit.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {u.status === 'Occupied' && (
                          <div className="flex items-center gap-1.5 text-teal-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Occupied</span>
                          </div>
                        )}
                        {u.status === 'Vacant' && (
                          <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Vacant</span>
                          </div>
                        )}
                        {u.status === 'Under Maintenance' && (
                          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Maintenance</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {tenant ? (
                          <div>
                            <div className="font-medium text-slate-900">{tenant.fullName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {tenant.phone}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None (Ready to lease)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {tenant ? (
                          <button
                            onClick={() => openTenantPortal(tenant.portalToken)}
                            className="text-teal-700 hover:text-teal-900 font-medium text-xs hover:underline"
                          >
                            Tenant Portal
                          </button>
                        ) : (
                          <button
                            onClick={onOpenCreateTenancy}
                            className="text-xs px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded font-medium transition-colors"
                          >
                            Create Tenancy
                          </button>
                        )}
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
