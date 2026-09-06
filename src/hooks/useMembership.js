import { useState, useEffect, useMemo, useCallback } from 'react';
import { membershipApi } from '../services/api';

function normalizeRegistration(item) {
  return {
    id: item.id || item._id,
    fullName: item.full_name || '',
    email: item.email || '',
    className: item.class_name || 'SE',
    contactNumber: item.contact_number || '',
    paymentMode: item.payment_mode || 'UPI',
    paymentDate: item.payment_date || '',
    amount: Number(item.amount) || 450,
    transactionSsUrl: item.transaction_ss_url || '',
    status: item.status || 'PENDING',
    verifiedBy: item.verified_by || '',
    verifiedAt: item.verified_at || null,
    receiptNumber: item.receipt_number || '',
    receiptStatus: item.receipt_status || 'NOT_SENT',
    remarks: item.remarks || '',
    registrationTimestamp: item.registration_timestamp || '',
    source: item.source || 'google_form_sheet',
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

export function useMembership() {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    byClass: {},
    byMode: {},
    totalCollected: 0,
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
      if (data && Array.isArray(data.items)) {
        setRegistrations(data.items.map(normalizeRegistration));
      }
      if (data && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.warn('[Membership Hook] Error fetching registrations:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
    verifyRegistration,
    addRegistration,
    updateRegistration,
    deleteRegistration,
    bulkImport,
    importLocalSheet,
  };
}
