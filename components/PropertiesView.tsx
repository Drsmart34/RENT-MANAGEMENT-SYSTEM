'use client';

import React, { useState } from 'react';
import { useRentFlow } from '@/lib/store';
import { Property, PropertyType } from '@/lib/types';
import { Building2, Plus, MapPin, Search, DoorOpen, Users } from 'lucide-react';
import Image from 'next/image';

export default function PropertiesView({ onOpenAddProperty }: { onOpenAddProperty: () => void }) {
  const { properties, units, setCurrentView } = useRentFlow();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.gpsAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || p.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Properties & Real Estate Assets
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Houses, apartment complexes, commercial plazas and townhouses across Ghana.
          </p>
        </div>
        <button
          onClick={onOpenAddProperty}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, address, or Ghana GPS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-stretch sm:self-auto overflow-x-auto">
          {['ALL', 'Apartment Complex', 'Residential Townhouse', 'Commercial Office'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type === 'ALL' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => {
          const propUnits = units.filter((u) => u.propertyId === prop.id);
          const occupied = propUnits.filter((u) => u.status === 'Occupied').length;
          const vacant = propUnits.filter((u) => u.status === 'Vacant').length;
          const occupancyPct = propUnits.length > 0 ? (occupied / propUnits.length) * 100 : 0;

          return (
            <div
              key={prop.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-shadow hover:shadow-sm flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-44 w-full bg-slate-100">
                <Image
                  src={prop.imageUrl || '/images/general_apartment.jpg'}
                  alt={prop.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-medium px-2 py-0.5 rounded shadow-sm">
                  {prop.type}
                </div>
                <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-teal-300 text-[11px] font-mono px-2 py-0.5 rounded">
                  {prop.gpsAddress}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{prop.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{prop.address}, {prop.city}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {prop.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Unit Occupancy</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {occupied} of {prop.totalUnits} Units ({occupancyPct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${occupancyPct}%` }}
                      className="h-full bg-teal-600 rounded-full transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span>{vacant} Vacant</span>
                    <button
                      onClick={() => setCurrentView('units')}
                      className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 text-xs"
                    >
                      <span>Manage Units</span>
                      <DoorOpen className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
