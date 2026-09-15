import { useState, useEffect, useMemo, useCallback } from 'react';
import { membershipApi } from '../services/api';
import { SAMPLE_FEE_REGISTRATIONS } from '../data/sampleSpreadsheets';

function normalizeRegistration(item) {
  const rawName = 
    item.full_name || 
    item.fullName || 
    item.name || 
    item.student_name || 
    item.studentName ||
    item['Full Name'] ||
    item['Name of Student'] ||
    item['Student Name'] ||
    item['Name'] ||
    '';

  const fallbackName = item.email 
    ? item.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'ACES Student';

  const finalName = (rawName && String(rawName).trim().length > 0) ? String(rawName).trim() : fallbackName;

  return {
    id: item.id || item._id || item.id_str || `reg-${Math.random().toString(36).substr(2, 9)}`,
    fullName: finalName,
    email: item.email || item.Email || item['Email Address'] || item['Email'] || '',
    className: item.class_name || item.className || item.class || item.Class || 'SE',
    contactNumber: String(item.contact_number || item.contactNumber || item.contact || item.phone || item.Phone || item['Contact Number'] || item['WhatsApp Number'] || item['Phone Number'] || item.whatsapp || ''),
    paymentMode: (item.payment_mode || item.paymentMode || item.mode || item['Payment Mode'] || 'UPI').toUpperCase(),
    paymentDate: item.payment_date || item.paymentDate || item.date || item['Payment Date'] || item.Timestamp || '',
    amount: Number(item.amount || item.Amount || item['Amount']) || 450,
    transactionSsUrl: item.transaction_ss_url || item.transactionSsUrl || item.screenshot_url || item.drive_link || item['Transaction Screenshot'] || item['Screenshot'] || item.screenshot || '',
    status: (item.status || item.Status || 'PENDING').toUpperCase(),
    verifiedBy: item.verified_by || item.verifiedBy || '',
    verifiedAt: item.verified_at || item.verifiedAt || null,
    receiptNumber: item.receipt_number || item.receiptNumber || item.receiptNo || '',
    receiptStatus: item.receipt_status || item.receiptStatus || 'NOT_SENT',
    remarks: item.remarks || item.Remarks || '',
    registrationTimestamp: item.registration_timestamp || item.timestamp || item.Timestamp || '',
    source: item.source || 'google_form_sheet',
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

export function useMembership() {
  const [registrations, setRegistrations] = useState(() => SAMPLE_FEE_REGISTRATIONS.map(normalizeRegistration));
  const [stats, setStats] = useState({
    total: SAMPLE_FEE_REGISTRATIONS.length,
    pending: SAMPLE_FEE_REGISTRATIONS.filter((r) => r.status === 'PENDING').length,
    verified: SAMPLE_FEE_REGISTRATIONS.filter((r) => r.status === 'VERIFIED').length,
    rejected: SAMPLE_FEE_REGISTRATIONS.filter((r) => r.status === 'REJECTED').length,
    byClass: {},
    byMode: {},
    totalCollected: SAMPLE_FEE_REGISTRATIONS.filter((r) => r.status === 'VERIFIED').reduce((s, r) => s + (Number(r.amount) || 450), 0),
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [paymentModeFilter, setPaymentModeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch registrations and stats from backend API
  const fetchRegistrations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await membershipApi.getAll({ limit: 500 });
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        setRegistrations(data.items.map(normalizeRegistration));
      } else {
        // Fallback to rich sample spreadsheet if API database has 0 records
        setRegistrations(SAMPLE_FEE_REGISTRATIONS.map(normalizeRegistration));
      }
      if (data && data.stats && data.stats.total > 0) {
        setStats(data.stats);
      }
    } catch (err) {
      console.warn('[Membership Hook] Error fetching registrations, using sample data:', err.message);
      setRegistrations(SAMPLE_FEE_REGISTRATIONS.map(normalizeRegistration));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Dedicated function to explicitly load / reset sample spreadsheet data
  const loadSampleSpreadsheet = useCallback(() => {
    const samples = SAMPLE_FEE_REGISTRATIONS.map(normalizeRegistration);
    setRegistrations(samples);
    return samples;
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Verify / Reject / Reset Fee
  const verifyRegistration = async (id, { status, remarks, receipt_number, amount }) => {
    const updated = await membershipApi.verify(id, {
      status,
      remarks,
      receipt_number,
      amount,
    });
    const normalized = normalizeRegistration(updated);
    setRegistrations((prev) => prev.map((r) => (r.id === id ? normalized : r)));

    // Refresh stats
    membershipApi.getStats().then(setStats).catch(() => {});
    return normalized;
  };

  // Add Single Registration
  const addRegistration = async (formData) => {
    const created = await membershipApi.create(formData);
    const normalized = normalizeRegistration(created);
    setRegistrations((prev) => [normalized, ...prev]);
    membershipApi.getStats().then(setStats).catch(() => {});
    return normalized;
  };

  // Update Registration Details
  const updateRegistration = async (id, updateData) => {
    const updated = await membershipApi.update(id, updateData);
    const normalized = normalizeRegistration(updated);
    setRegistrations((prev) => prev.map((r) => (r.id === id ? normalized : r)));
    return normalized;
  };

  // Delete Registration
  const deleteRegistration = async (id) => {
    await membershipApi.delete(id);
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    membershipApi.getStats().then(setStats).catch(() => {});
  };

  // Bulk Import
  const bulkImport = async (records) => {
    const result = await membershipApi.bulkImport(records);
    await fetchRegistrations();
    return result;
  };

  // Import from Local File
  const importLocalSheet = async (filePath) => {
    const result = await membershipApi.importLocalSheet(filePath);
    await fetchRegistrations();
    return result;
  };

  // Filtered & Sorted computed list
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((r) => {
        // Status filter
        if (statusFilter !== 'ALL' && r.status !== statusFilter) {
          return false;
        }
        // Class filter
        if (classFilter !== 'ALL') {
          if (classFilter === 'SE' && !['SE', 'SY'].includes(r.className)) {
            return false;
          }
          if (classFilter !== 'SE' && r.className !== classFilter) {
            return false;
          }
        }
        // Payment mode filter
        if (paymentModeFilter !== 'ALL' && r.paymentMode.toUpperCase() !== paymentModeFilter.toUpperCase()) {
          return false;
        }
        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = r.fullName.toLowerCase().includes(q);
          const matchesContact = r.contactNumber.includes(q);
          const matchesEmail = r.email.toLowerCase().includes(q);
          const matchesClass = r.className.toLowerCase().includes(q);
          const matchesReceipt = r.receiptNumber.toLowerCase().includes(q);
          if (!matchesName && !matchesContact && !matchesEmail && !matchesClass && !matchesReceipt) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'name-asc') {
          return a.fullName.localeCompare(b.fullName);
        }
        if (sortBy === 'name-desc') {
          return b.fullName.localeCompare(a.fullName);
        }
        // default: newest
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [registrations, statusFilter, classFilter, paymentModeFilter, searchQuery, sortBy]);

  // Quick stats computed from current registrations
  const computedStats = useMemo(() => {
    const total = registrations.length;
    const pending = registrations.filter((r) => r.status === 'PENDING').length;
    const verified = registrations.filter((r) => r.status === 'VERIFIED').length;
    const rejected = registrations.filter((r) => r.status === 'REJECTED').length;
    const totalCollected = registrations
      .filter((r) => r.status === 'VERIFIED')
      .reduce((sum, r) => sum + (Number(r.amount) || 500), 0);

    return {
      total: stats.total || total,
      pending: stats.pending !== undefined ? stats.pending : pending,
      verified: stats.verified !== undefined ? stats.verified : verified,
      rejected: stats.rejected !== undefined ? stats.rejected : rejected,
      totalCollected: stats.totalCollected || totalCollected,
    };
  }, [registrations, stats]);

  return {
    registrations,
    filteredRegistrations,
    stats: computedStats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    classFilter,
    setClassFilter,
    paymentModeFilter,
    setPaymentModeFilter,
    sortBy,
    setSortBy,
    isLoading,
    error,
    fetchRegistrations,
    loadSampleSpreadsheet,
    verifyRegistration,
    addRegistration,
    updateRegistration,
    deleteRegistration,
    bulkImport,
    importLocalSheet,
  };
}
