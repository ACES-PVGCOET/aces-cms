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
  Send,
  Loader2
} from 'lucide-react';
import StatCard from './StatCard';
import MediaPreviewModal from './MediaPreviewModal';
import ConfirmVerifyModal from './ConfirmVerifyModal';

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
  onLoadSampleData,
  onOpenAddModal,
  onOpenImportModal,
  onInspectRegistration,
  onVerifyRegistration,
  showToast,
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [copiedId, setCopiedId] = useState(null);
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const [confirmItem, setConfirmItem] = useState(null);
  const [processingVerifyId, setProcessingVerifyId] = useState(null);

  const handleLoadSample = () => {
    if (onLoadSampleData) {
      onLoadSampleData();
      if (showToast) {
        showToast('Sample membership spreadsheet data loaded successfully!', 'success', 'Sample Data Loaded');
      }
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInitiateVerify = (e, item) => {
    e.stopPropagation();
    setConfirmItem(item);
  };

  const handleExecuteVerify = async (id, payload) => {
    try {
      setProcessingVerifyId(id);
      await onVerifyRegistration(id, payload);
    } finally {
      setProcessingVerifyId(null);
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      if (showToast) showToast('No registration data available to export.', 'info', 'Export CSV');
      return;
    }

    const headers = [
      'Registration ID',
      'Student Full Name',
      'Class',
      'Email Address',
      'WhatsApp Number',
      'Payment Mode',
      'Amount (INR)',
      'Status',
      'Receipt Number',
      'Receipt Status',
      'Verified By',
      'Verification Remarks',
      'Payment Date',
      'Submitted Timestamp',
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.id || ''}"`,
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      `"${r.className || ''}"`,
      `"${r.email || ''}"`,
      `"${r.contactNumber || ''}"`,
      `"${r.paymentMode || ''}"`,
      r.amount || 450,
      `"${r.status || 'PENDING'}"`,
      `"${r.receiptNumber || ''}"`,
      `"${r.receiptStatus || ''}"`,
      `"${(r.verifiedBy || '').replace(/"/g, '""')}"`,
      `"${(r.remarks || '').replace(/"/g, '""')}"`,
      `"${r.paymentDate || ''}"`,
      `"${r.registrationTimestamp || ''}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
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
    <div className="space-y-6 animate-in fade-in duration-300 text-black dark:text-white">
      
      {/* 1. Header & Primary CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-black btn-primary shadow-xs">
              Fee Auditing &amp; Verification
            </span>
            <span className="text-xs leading-4 font-black btn-secondary px-2.5 py-0.5 rounded-md text-black dark:text-white">
              {filteredRegistrations.length} of {registrations.length} records
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-black tracking-tight mt-1 text-black dark:text-white">
            Membership Fee Hub
          </h1>
          <p className="text-sm leading-5 text-black dark:text-white opacity-80 font-semibold">
            Verify student fee transactions, inspect UPI payment receipts, and authorize ACES memberships.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={handleLoadSample}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-black btn-secondary border border-sky-500/40 text-black dark:text-sky-300 hover:bg-sky-500/20 cursor-pointer transition-all"
            title="Load Pre-populated Sample Spreadsheet Data to Check Contrast"
          >
            <FileSpreadsheet className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Load Sample Spreadsheet</span>
          </button>

          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-black btn-secondary border border-emerald-500/40 text-black dark:text-emerald-300 hover:bg-emerald-500/20 cursor-pointer transition-all"
            title="Import from Excel Spreadsheet in Downloads"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Import Spreadsheet</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-black btn-secondary text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-all"
            title="Export filtered records to CSV"
          >
            <Download className="w-4 h-4 opacity-90 text-black dark:text-white" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-black btn-primary shadow-md bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Member</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-12 gap-4 sm:gap-6 text-black dark:text-white">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Total Registrations"
            value={stats.total}
            description="Submitted membership responses"
            icon={<Users className="w-5 h-5 text-black dark:text-white" />}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Pending Verification"
            value={stats.pending}
            description="Payments awaiting review"
            icon={<Clock className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Verified Members"
            value={stats.verified}
            description="Fees confirmed &amp; receipts queued"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Total Fees Collected"
            value={`₹${stats.totalCollected.toLocaleString()}`}
            description="Verified association fund"
            icon={<CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          />
        </div>
      </div>

      {/* 3. Search, Filters & Controls Toolbar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        
        {/* Top search & selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black dark:text-white opacity-70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by student name, WhatsApp number, class, receipt ID..."
              className="w-full pl-9 pr-8 py-2 text-sm glass-input rounded-lg placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none transition-all font-bold text-black dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-black dark:text-white opacity-80 hover:opacity-100 cursor-pointer font-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort & View Mode Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Sort Selector */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg btn-secondary text-sm font-black text-black dark:text-white">
              <ArrowUpDown className="w-4 h-4 opacity-90" />
              <label htmlFor="fee-sort" className="text-xs font-black text-black dark:text-white">Sort:</label>
              <select
                id="fee-sort"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-sm font-black text-black dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="newest" className="text-black bg-white">Newest First</option>
                <option value="oldest" className="text-black bg-white">Oldest First</option>
                <option value="name-asc" className="text-black bg-white">Name (A-Z)</option>
                <option value="name-desc" className="text-black bg-white">Name (Z-A)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-lg btn-secondary">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                  viewMode === 'table' ? 'bg-black/30 dark:bg-white/10 text-white' : 'text-black dark:text-white opacity-70 hover:opacity-100'
                }`}
                title="Dense Table View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                  viewMode === 'cards' ? 'bg-black/30 dark:bg-white/10 text-white' : 'text-black dark:text-white opacity-70 hover:opacity-100'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg btn-secondary hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>

        {/* Status Tabs & Class Pills */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full">
            {[
              { id: 'ALL', label: 'All Registrations', count: stats.total },
              { id: 'PENDING', label: 'Pending Verification', count: stats.pending },
              { id: 'VERIFIED', label: 'Verified', count: stats.verified },
              { id: 'REJECTED', label: 'Rejected', count: stats.rejected },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onStatusFilterChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'btn-primary shadow-xs font-black text-white'
                      : 'btn-secondary text-black dark:text-white opacity-90 hover:opacity-100'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-black dark:text-white'}>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-black rounded ${
                    isActive ? 'bg-black/20 text-white' : 'bg-black/10 dark:bg-white/10 text-black dark:text-white'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Class Filter Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-black text-black dark:text-white opacity-80">Class:</span>
            {CLASSES.map((c) => (
              <button
                key={c}
                onClick={() => onClassFilterChange(c)}
                className={`px-2.5 py-1 rounded-md text-xs font-black transition-all cursor-pointer ${
                  classFilter === c
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white'
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
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[11px] font-black uppercase tracking-wider text-black dark:text-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 text-black dark:text-slate-200">Student &amp; Class</th>
                    <th className="py-3.5 px-4 text-black dark:text-slate-200">WhatsApp Contact</th>
                    <th className="py-3.5 px-4 text-black dark:text-slate-200">Payment Info</th>
                    <th className="py-3.5 px-4 text-center text-black dark:text-slate-200">Payment Proof</th>
                    <th className="py-3.5 px-4 text-black dark:text-slate-200">Status</th>
                    <th className="py-3.5 px-4 text-black dark:text-slate-200">Audit / Receipt</th>
                    <th className="py-3.5 px-4 text-right text-black dark:text-slate-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredRegistrations.map((item) => {
                    const isVer = item.status === 'VERIFIED';
                    const isRej = item.status === 'REJECTED';
                    const isPend = item.status === 'PENDING';
                    const studentDisplayName = item.fullName || item.name || (item.email ? item.email.split('@')[0].replace(/[._-]/g, ' ') : 'ACES Student');

                    return (
                      <tr 
                        key={item.id} 
                        onClick={() => onInspectRegistration(item)}
                        className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        {/* Student & Class */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-black dark:text-indigo-200 font-black flex items-center justify-center text-xs shrink-0 border border-indigo-500/30">
                              {(studentDisplayName || 'ST').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-black text-black dark:text-white text-xs group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                                {studentDisplayName}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-indigo-500/20 text-black dark:text-indigo-200 border border-indigo-500/30">
                                  {item.className || 'SE'}
                                </span>
                                {item.email && (
                                  <span className="text-black dark:text-slate-300 text-[10px] truncate max-w-[140px] font-semibold opacity-80">
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
                              className="font-mono text-xs text-black dark:text-indigo-300 hover:underline flex items-center gap-1 font-black"
                              title="Chat on WhatsApp"
                            >
                              <Phone className="w-3 h-3 text-black dark:text-indigo-300" />
                              <span>{item.contactNumber || 'N/A'}</span>
                            </a>
                            {item.contactNumber && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(item.contactNumber, item.id);
                                }}
                                className="p-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 opacity-80 hover:opacity-100"
                                title="Copy Phone Number"
                              >
                                {copiedId === item.id ? (
                                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-black dark:text-white" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Payment Info */}
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-black">
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-black dark:text-white uppercase font-black">
                                {item.paymentMode || 'UPI'}
                              </span>
                              <span className="text-black dark:text-white font-mono font-black">₹{item.amount || 450}</span>
                            </div>
                            <div className="text-[11px] text-black dark:text-slate-300 font-semibold opacity-80">
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
                                    title: `${studentDisplayName} - Payment Proof`,
                                  });
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-black dark:text-white hover:bg-indigo-500/30 border border-indigo-500/30 font-black text-[11px] cursor-pointer transition-colors"
                              >
                                <Eye className="w-3 h-3 text-black dark:text-white" />
                                <span>Preview</span>
                              </button>
                              <a
                                href={getDriveViewUrl(item.transactionSsUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 transition-colors"
                                title="Open Drive Link in New Tab"
                              >
                                <ExternalLink className="w-3 h-3 text-black dark:text-white" />
                              </a>
                            </div>
                          ) : (
                            <span className="text-black dark:text-white opacity-60 text-[11px] font-semibold">No proof</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black ${
                            isVer
                              ? 'bg-emerald-500/20 text-black dark:text-white border border-emerald-500/40'
                              : isRej
                              ? 'bg-rose-500/20 text-black dark:text-white border border-rose-500/30'
                              : 'bg-amber-500/20 text-black dark:text-white border border-amber-500/30'
                          }`}>
                            {isVer ? <CheckCircle2 className="w-3 h-3 text-black dark:text-white" /> : isRej ? <XCircle className="w-3 h-3 text-black dark:text-white" /> : <Clock className="w-3 h-3 text-black dark:text-white" />}
                            <span>{item.status}</span>
                          </span>
                        </td>

                        {/* Audit / Receipt */}
                        <td className="py-3 px-4">
                          {isVer ? (
                            <div className="space-y-0.5 text-[11px]">
                              <div className="font-mono text-black dark:text-white font-black">
                                {item.receiptNumber || 'Receipt Queued'}
                              </div>
                              <div className="text-black dark:text-slate-300 text-[10px] font-semibold opacity-80">
                                By: {item.verifiedBy || 'Admin'}
                              </div>
                            </div>
                          ) : isRej ? (
                            <div className="text-[11px] text-black dark:text-white font-black truncate max-w-[140px]" title={item.remarks}>
                              {item.remarks || 'Rejected'}
                            </div>
                          ) : (
                            <span className="text-black dark:text-slate-400 text-[11px] font-semibold opacity-70">Awaiting verification</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {isPend && (
                              <button
                                disabled={processingVerifyId === item.id}
                                onClick={(e) => handleInitiateVerify(e, item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-black dark:text-white hover:text-white text-[11px] font-black border border-emerald-500/40 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Verify Fee"
                              >
                                {processingVerifyId === item.id ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Verifying...</span>
                                  </>
                                ) : (
                                  <span>Verify</span>
                                )}
                              </button>
                            )}

                            <button
                              onClick={() => onInspectRegistration(item)}
                              className="px-2.5 py-1 rounded-lg btn-secondary text-[11px] font-black text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
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
              const studentDisplayName = item.fullName || item.name || (item.email ? item.email.split('@')[0].replace(/[._-]/g, ' ') : 'ACES Student');

              return (
                <div
                  key={item.id}
                  onClick={() => onInspectRegistration(item)}
                  className="col-span-12 sm:col-span-6 lg:col-span-4 glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/10 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Name, Class, Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-black dark:text-indigo-200 font-black flex items-center justify-center text-xs shrink-0 border border-indigo-500/30">
                          {(studentDisplayName || 'ST').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-black text-sm text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {studentDisplayName}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-black dark:text-indigo-200">
                              Class {item.className || 'SE'}
                            </span>
                            <span className="text-[10px] text-black dark:text-slate-300 font-black opacity-80">
                              ₹{item.amount || 450} • {item.paymentMode || 'UPI'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        isVer
                          ? 'bg-emerald-500/20 text-black dark:text-white border border-emerald-500/40'
                          : isRej
                          ? 'bg-rose-500/20 text-black dark:text-white border border-rose-500/30'
                          : 'bg-amber-500/20 text-black dark:text-white border border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* WhatsApp Contact */}
                    <div className="flex items-center justify-between text-xs py-1 border-y border-slate-100 dark:border-white/5">
                      <span className="text-black dark:text-slate-400 text-[11px] font-black opacity-80">WhatsApp:</span>
                      <a
                        href={`https://wa.me/91${item.contactNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-black dark:text-emerald-400 font-mono font-black hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-black dark:text-emerald-400" />
                        <span>+91 {item.contactNumber}</span>
                      </a>
                    </div>

                    {/* Payment proof & date */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-black dark:text-slate-300 text-[11px] font-semibold opacity-80">Date: {item.paymentDate || 'N/A'}</span>
                      {item.transactionSsUrl && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxMedia({
                                url: item.transactionSsUrl,
                                title: `${studentDisplayName} - Proof`,
                              });
                            }}
                            className="bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/30 text-black dark:text-white hover:bg-indigo-500/30 font-black text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3 h-3 text-black dark:text-white" />
                            <span>Preview</span>
                          </button>
                          <a
                            href={getDriveViewUrl(item.transactionSsUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors"
                            title="Open in Google Drive"
                          >
                            <ExternalLink className="w-3 h-3 text-black dark:text-white" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onInspectRegistration(item)}
                      className="flex-1 py-1.5 rounded-xl btn-secondary text-xs font-black text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      Inspect Details
                    </button>
                    {isPend && (
                      <button
                        disabled={processingVerifyId === item.id}
                        onClick={(e) => handleInitiateVerify(e, item)}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {processingVerifyId === item.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <span>Verify</span>
                        )}
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
        <div className="glass-card rounded-2xl p-12 text-center space-y-4 text-black dark:text-white">
          <div className="w-12 h-12 rounded-xl btn-secondary flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-black dark:text-white">No membership registrations found</h3>
            <p className="text-sm opacity-80 max-w-sm mx-auto mt-1 font-semibold text-black dark:text-white">
              {registrations.length === 0
                ? 'No registrations imported yet. Click "Import Spreadsheet" to load responses from Downloads.'
                : 'No records match your active search or filters.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            {registrations.length === 0 ? (
              <button
                onClick={onOpenImportModal}
                className="px-4 py-2 rounded-lg text-sm font-black btn-primary inline-flex items-center gap-2 cursor-pointer shadow-lg text-white"
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
                className="px-4 py-2 rounded-lg text-sm font-black btn-secondary text-black dark:text-white inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Customized Confirmation Prompt Modal */}
      {confirmItem && (
        <ConfirmVerifyModal
          isOpen={Boolean(confirmItem)}
          onClose={() => setConfirmItem(null)}
          registration={confirmItem}
          onConfirm={handleExecuteVerify}
          onOpenMediaLightbox={(url, title) => setLightboxMedia({ url, title })}
          showToast={showToast}
        />
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
