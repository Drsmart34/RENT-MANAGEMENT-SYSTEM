'use client';

import React, { useState } from 'react';
import { useRentFlow } from '@/lib/store';
import { NotificationRecord, NotificationChannel, NotificationStatus } from '@/lib/types';
import {
  BellRing,
  Send,
  MessageSquare,
  Smartphone,
  Mail,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Search,
} from 'lucide-react';

export default function NotificationsView() {
  const { notifications, runReminderEngine, getTenantById } = useRentFlow();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [engineMsg, setEngineMsg] = useState<string | null>(null);
  const [previewNotif, setPreviewNotif] = useState<NotificationRecord | null>(null);

  const handleRunEngine = () => {
    const res = runReminderEngine();
    setEngineMsg(res.message);
    setTimeout(() => setEngineMsg(null), 5000);
  };

  const filteredNotifs = notifications.filter((n) => {
    const matchesSearch =
      n.recipient.includes(searchTerm) ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChannel = selectedChannel === 'ALL' || n.channel === selectedChannel;
    const matchesStatus = selectedStatus === 'ALL' || n.status === selectedStatus;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  const queuedCount = notifications.filter((n) => n.status === 'Queued').length;
  const sentCount = notifications.filter((n) => n.status === 'Sent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Rent Reminders & Notification Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section 18 automated multi-channel delivery engine for Ghanaian SMS, WhatsApp, and email alerts.
          </p>
        </div>
        <button
          onClick={handleRunEngine}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Run Reminder Engine</span>
        </button>
      </div>

      {engineMsg && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{engineMsg}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
            <span>Queued for Dispatch</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">{queuedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Pending gateway delivery cycle</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
            <span>Delivered & Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-700">{sentCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Provider acknowledged</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
            <span>Supported Gateways</span>
            <Smartphone className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-sm font-semibold text-slate-800 mt-1">
            Hubtel SMS · WhatsApp Business API
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Provider-ready v0.3 architecture</div>
        </div>
      </div>

      {/* Search & Channel Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search recipient, title, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto self-stretch sm:self-auto">
          {['ALL', 'SMS', 'WhatsApp', 'Email', 'In-App'].map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedChannel === ch
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {ch === 'ALL' ? 'All Channels' : ch}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Title & Content Preview</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Provider Ref</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">View Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotifs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No notifications in queue.
                  </td>
                </tr>
              ) : (
                filteredNotifs.map((n) => {
                  const tenant = getTenantById(n.tenantId);

                  return (
                    <tr key={n.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          {n.channel === 'SMS' && <Smartphone className="w-3.5 h-3.5 text-blue-600" />}
                          {n.channel === 'WhatsApp' && <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />}
                          {n.channel === 'Email' && <Mail className="w-3.5 h-3.5 text-purple-600" />}
                          {n.channel === 'In-App' && <BellRing className="w-3.5 h-3.5 text-teal-600" />}
                          <span>{n.channel}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {n.recipient}
                        {tenant && (
                          <div className="text-[10px] text-slate-500 font-sans font-normal">
                            {tenant.fullName}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 max-w-md">
                        <div className="font-semibold text-slate-900">{n.title}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {n.message}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {n.status === 'Sent' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            Sent
                          </span>
                        )}
                        {n.status === 'Queued' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3" />
                            Queued
                          </span>
                        )}
                        {n.status === 'Failed' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {n.providerReference || 'Pending Batch'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setPreviewNotif(n)}
                          className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium text-xs transition-colors"
                        >
                          Preview
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Preview Modal */}
      {previewNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-semibold">{previewNotif.channel} Delivery Preview</span>
              </div>
              <button
                onClick={() => setPreviewNotif(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 font-sans text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200 pb-2">
                  <span>To: <strong className="font-mono text-slate-800">{previewNotif.recipient}</strong></span>
                  <span className="font-mono">{previewNotif.status}</span>
                </div>
                <div className="font-bold text-slate-900">{previewNotif.title}</div>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {previewNotif.message}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div>Channel: {previewNotif.channel}</div>
                <div>Internal ID: {previewNotif.id}</div>
                {previewNotif.providerReference && (
                  <div>Provider Ref: {previewNotif.providerReference}</div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewNotif(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
