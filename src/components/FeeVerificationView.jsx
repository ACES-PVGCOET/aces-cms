import { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ArrowUpDown, 
  Plus, 
  FileSpreadsheet, 
  Download, 
  ExternalLink, 
  Eye, 
  Copy, 
  Check, 
  Phone, 
  Filter, 
  LayoutList, 
  LayoutGrid, 
  RefreshCw, 
  FileText, 
  AlertCircle,
  Receipt,
  Users,
  CreditCard,
  Send
} from 'lucide-react';
import StatCard from './StatCard';
import MediaPreviewModal from './MediaPreviewModal';

function getDriveFileId(url) {
  if (!url) return '';
  const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : '';
}

function getDriveViewUrl(url) {
  const fileId = getDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }
  return url;
}

const CLASSES = ['ALL', 'SE', 'TE', 'BE'];
const PAYMENT_MODES = ['ALL', 'UPI', 'CASH'];

export function FeeVerificationView({
  registrations = [],
  filteredRegistrations = [],
  stats,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  classFilter,
  onClassFilterChange,
  paymentModeFilter,
  onPaymentModeFilterChange,
  sortBy,
  onSortChange,
  isLoading,
  onRefresh,
  onOpenAddModal,
  onOpenImportModal,
  onInspectRegistration,
  onVerifyRegistration,
  showToast,
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [copiedId, setCopiedId] = useState(null);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickVerify = async (e, item) => {
    e.stopPropagation();
    try {
      await onVerifyRegistration(item.id, {
        status: 'VERIFIED',
        remarks: item.remarks || '',
        amount: item.amount || 450,
      });
      if (showToast) {
        showToast(`Fee for ${item.fullName} verified successfully!`, 'success', 'Fee Verified');
      }
    } catch (err) {
      if (showToast) {
        showToast(err.message || 'Failed to verify fee.', 'error', 'Error');
      }
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      if (showToast) showToast('No registration data available to export.', 'info', 'Export CSV');
      return;
    }

    const headers = [
      'Full Name',
      'Class',
      'Contact Number',
      'Email',
      'Payment Mode',
      'Payment Date',
      'Amount',
      'Fee Status',
      'Receipt Number',
      'Receipt Status',
      'Verified By',
      'Verified At',
      'Remarks',
      'Transaction Screenshot URL',
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      `"${r.className || ''}"`,
      `"${r.contactNumber || ''}"`,
      `"${r.email || ''}"`,
      `"${r.paymentMode || ''}"`,
      `"${r.paymentDate || ''}"`,
      r.amount || 450,
      `"${r.status || ''}"`,
      `"${r.receiptNumber || ''}"`,
      `"${r.receiptStatus || ''}"`,
      `"${r.verifiedBy || ''}"`,
      `"${r.verifiedAt ? new Date(r.verifiedAt).toISOString() : ''}"`,
      `"${(r.remarks || '').replace(/"/g, '""')}"`,
      `"${r.transactionSsUrl || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aces_membership_fees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) {
      showToast(`Exported ${filteredRegistrations.length} records to CSV.`, 'success', 'CSV Downloaded');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header & Primary CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-primary shadow-xs">
              Fee Auditing & Verification
            </span>
            <span className="text-xs leading-4 font-bold btn-secondary px-2.5 py-0.5 rounded-md">
              {filteredRegistrations.length} of {registrations.length} records
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-extrabold tracking-tight mt-1">
            Membership Fee Hub
          </h1>
          <p className="text-sm leading-5 opacity-70 font-medium">
            Verify student fee transactions, inspect UPI payment receipts, and authorize ACES memberships.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold btn-secondary border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer transition-all"
            title="Import from Excel Spreadsheet in Downloads"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Import Spreadsheet</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold btn-secondary hover:bg-white/10 cursor-pointer transition-all"
            title="Export filtered records to CSV"
          >
            <Download className="w-4 h-4 opacity-80" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold btn-primary shadow-md bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Member</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Total Registrations"
            value={stats.total}
            description="Submitted membership responses"
            icon={<Users className="w-5 h-5" />}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Pending Verification"
            value={stats.pending}
            description="Payments awaiting review"
            icon={<Clock className="w-5 h-5 text-amber-400" />}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Verified Members"
            value={stats.verified}
            description="Fees confirmed & receipts queued"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Total Fees Collected"
            value={`₹${stats.totalCollected.toLocaleString()}`}
            description="Verified association fund"
            icon={<CreditCard className="w-5 h-5 text-indigo-400" />}
          />
        </div>
      </div>

      {/* 3. Search, Filters & Controls Toolbar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        
        {/* Top search & selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by student name, WhatsApp number, class, receipt ID..."
              className="w-full pl-9 pr-8 py-2 text-sm glass-input rounded-lg placeholder-slate-400 focus:outline-none transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100 cursor-pointer font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort & View Mode Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Sort Selector */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg btn-secondary text-sm font-bold">
              <ArrowUpDown className="w-4 h-4 opacity-80" />
              <label htmlFor="fee-sort" className="opacity-70 text-xs font-semibold">Sort:</label>
              <select
                id="fee-sort"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-lg btn-secondary">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                  viewMode === 'table' ? 'bg-black/30 dark:bg-white/10 text-white' : 'opacity-60 hover:opacity-100'
                }`}
                title="Dense Table View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                  viewMode === 'cards' ? 'bg-black/30 dark:bg-white/10 text-white' : 'opacity-60 hover:opacity-100'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg btn-secondary hover:bg-white/10 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 opacity-80 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>

        {/* Status Tabs & Class Pills */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full">
            {[
              { id: 'ALL', label: 'All Registrations', count: stats.total },
              { id: 'PENDING', label: 'Pending Verification', count: stats.pending, color: 'text-amber-300' },
              { id: 'VERIFIED', label: 'Verified', count: stats.verified, color: 'text-emerald-300' },
              { id: 'REJECTED', label: 'Rejected', count: stats.rejected, color: 'text-rose-300' },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onStatusFilterChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'btn-primary shadow-xs font-extrabold'
                      : 'btn-secondary opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className={isActive ? 'text-white' : tab.color || ''}>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    isActive ? 'bg-black/20 text-white' : 'bg-black/10 dark:bg-white/10'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Class Filter Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs opacity-60 font-semibold">Class:</span>
            {CLASSES.map((c) => (
              <button
                key={c}
                onClick={() => onClassFilterChange(c)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  classFilter === c
                    ? 'bg-indigo-500 text-white shadow-xs'
                    : 'bg-white/5 hover:bg-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                {c === 'ALL' ? 'All' : c}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* 4. Main List / Table Area */}
      {filteredRegistrations.length > 0 ? (
        viewMode === 'table' ? (
          /* Table View */
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/5 text-[11px] font-extrabold uppercase tracking-wider opacity-70">
                  <tr>
                    <th className="py-3.5 px-4">Student & Class</th>
                    <th className="py-3.5 px-4">WhatsApp Contact</th>
                    <th className="py-3.5 px-4">Payment Info</th>
                    <th className="py-3.5 px-4 text-center">Payment Proof</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Audit / Receipt</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRegistrations.map((item) => {
                    const isVer = item.status === 'VERIFIED';
                    const isRej = item.status === 'REJECTED';
                    const isPend = item.status === 'PENDING';

                    return (
                      <tr 
                        key={item.id} 
                        onClick={() => onInspectRegistration(item)}
                        className="hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        {/* Student & Class */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 font-extrabold flex items-center justify-center text-xs shrink-0 border border-indigo-500/30">
                              {item.fullName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-extrabold text-white text-xs group-hover:text-indigo-300 transition-colors">
                                {item.fullName}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  {item.className}
                                </span>
                                {item.email && (
                                  <span className="opacity-60 text-[10px] truncate max-w-[120px]">
                                    {item.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* WhatsApp Contact */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`https://wa.me/${item.contactNumber?.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="font-mono text-xs text-indigo-300 hover:underline flex items-center gap-1"
                              title="Chat on WhatsApp"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{item.contactNumber}</span>
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(item.contactNumber, item.id);
                              }}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 opacity-60 hover:opacity-100"
                              title="Copy Phone Number"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Payment Info */}
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 uppercase">
                                {item.paymentMode}
                              </span>
                              <span className="text-white font-mono">₹{item.amount || 450}</span>
                            </div>
                            <div className="text-[11px] opacity-60">
                              {item.paymentDate || 'No date'}
                            </div>
                          </div>
                        </td>

                        {/* Payment Proof */}
                        <td className="py-3 px-4 text-center">
                          {item.transactionSsUrl ? (
                            <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setLightboxMedia({
                                    url: item.transactionSsUrl,
                                    title: `${item.fullName} - Payment Proof`,
                                  });
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 font-bold text-[11px] cursor-pointer transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Preview</span>
                              </button>
                              <a
                                href={getDriveViewUrl(item.transactionSsUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-300 border border-white/10 hover:border-indigo-500/30 transition-colors"
                                title="Open Drive Link in New Tab"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ) : (
                            <span className="opacity-40 text-[11px]">No proof</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${
                            isVer
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isRej
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {isVer ? <CheckCircle2 className="w-3 h-3" /> : isRej ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{item.status}</span>
                          </span>
                        </td>

                        {/* Audit / Receipt */}
                        <td className="py-3 px-4">
                          {isVer ? (
                            <div className="space-y-0.5 text-[11px]">
                              <div className="font-mono text-emerald-400 font-bold">
                                {item.receiptNumber || 'Receipt Queued'}
                              </div>
                              <div className="opacity-60 text-[10px]">
                                By: {item.verifiedBy || 'Admin'}
                              </div>
                            </div>
                          ) : isRej ? (
                            <div className="text-[11px] text-rose-300 truncate max-w-[140px]" title={item.remarks}>
                              {item.remarks || 'Rejected'}
                            </div>
                          ) : (
                            <span className="opacity-50 text-[11px]">Awaiting verification</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {isPend && (
                              <button
                                onClick={(e) => handleQuickVerify(e, item)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-bold border border-emerald-500/40 cursor-pointer transition-colors"
                                title="Quick 1-Click Verify"
                              >
                                Verify
                              </button>
                            )}

                            <button
                              onClick={() => onInspectRegistration(item)}
                              className="px-2.5 py-1 rounded-lg btn-secondary text-[11px] font-bold hover:bg-white/10 cursor-pointer transition-colors"
                            >
                              Inspect
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards Grid View */
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            {filteredRegistrations.map((item) => {
              const isVer = item.status === 'VERIFIED';
              const isRej = item.status === 'REJECTED';
              const isPend = item.status === 'PENDING';

              return (
                <div
                  key={item.id}
                  onClick={() => onInspectRegistration(item)}
                  className="col-span-12 sm:col-span-6 lg:col-span-4 glass-card rounded-2xl p-5 border border-white/10 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Name, Class, Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 font-extrabold flex items-center justify-center text-xs shrink-0 border border-indigo-500/30">
                          {item.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {item.fullName}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                              Class {item.className}
                            </span>
                            <span className="text-[10px] opacity-60">
                              ₹{item.amount || 450} • {item.paymentMode}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        isVer
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isRej
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* WhatsApp Contact */}
                    <div className="flex items-center justify-between text-xs py-1 border-y border-white/5">
                      <span className="opacity-60 text-[11px]">WhatsApp:</span>
                      <a
                        href={`https://wa.me/91${item.contactNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-400 font-mono font-bold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>+91 {item.contactNumber}</span>
                      </a>
                    </div>

                    {/* Payment proof & date */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="opacity-60 text-[11px]">Date: {item.paymentDate || 'N/A'}</span>
                      {item.transactionSsUrl && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxMedia({
                                url: item.transactionSsUrl,
                                title: `${item.fullName} - Proof`,
                              });
                            }}
                            className="text-indigo-400 hover:text-indigo-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                          <a
                            href={getDriveViewUrl(item.transactionSsUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-indigo-300 hover:text-white transition-colors"
                            title="Open in Google Drive"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onInspectRegistration(item)}
                      className="flex-1 py-1.5 rounded-xl btn-secondary text-xs font-bold hover:bg-white/10"
                    >
                      Inspect Details
                    </button>
                    {isPend && (
                      <button
                        onClick={(e) => handleQuickVerify(e, item)}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
                      >
                        Verify
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="glass-card rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl btn-secondary flex items-center justify-center mx-auto text-indigo-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold">No membership registrations found</h3>
            <p className="text-sm opacity-70 max-w-sm mx-auto mt-1 font-medium">
              {registrations.length === 0
                ? 'No registrations imported yet. Click "Import Spreadsheet" to load responses from Downloads.'
                : 'No records match your active search or filters.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            {registrations.length === 0 ? (
              <button
                onClick={onOpenImportModal}
                className="px-4 py-2 rounded-lg text-sm font-bold btn-primary inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Import Spreadsheet Responses</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onSearchChange('');
                  onStatusFilterChange('ALL');
                  onClassFilterChange('ALL');
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium btn-secondary inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Media Lightbox Modal */}
      {lightboxMedia && (
        <MediaPreviewModal
          isOpen={Boolean(lightboxMedia)}
          mediaUrl={lightboxMedia.url}
          title={lightboxMedia.title}
          onClose={() => setLightboxMedia(null)}
        />
      )}

    </div>
  );
}

export default FeeVerificationView;
