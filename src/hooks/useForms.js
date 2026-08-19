import { useState, useEffect, useMemo, useCallback } from 'react';
import { formsApi } from '../services/api';

function normalizeForm(f) {
  return {
    id: f.form_id || f.id || f._id,
    form_id: f.form_id || f.id || f._id,
    title: f.title || 'Untitled Form',
    description: f.description || '',
    is_active: f.is_active !== undefined ? Boolean(f.is_active) : true,
    question_count: f.question_count || (f.questions ? f.questions.length : 0),
    response_count: f.response_count || 0,
    created_at: f.created_at || f.createdAt || new Date().toISOString(),
    updated_at: f.updated_at || f.updatedAt || new Date().toISOString(),
    questions: f.questions || [],
  };
}

/**
 * useForms Hook
 * Comprehensive state management for Forms Engine (Google Forms-like engine).
 */
export function useForms() {
  const [forms, setForms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Inactive'
  const [activeForm, setActiveForm] = useState(null);
  const [activeFormResponses, setActiveFormResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResponsesLoading, setIsResponsesLoading] = useState(false);

  // Fetch all forms summary from API
  const fetchForms = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await formsApi.getAll();
      const rawList = data?.forms || (Array.isArray(data) ? data : []);
      setForms(rawList.map(normalizeForm));
    } catch (e) {
      console.info('[Forms Hook] API fetch error:', e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Fetch full form details (with questions) by ID
  const fetchFormById = useCallback(async (formId) => {
    try {
      setIsLoading(true);
      const data = await formsApi.getById(formId);
      const norm = normalizeForm(data);
      setActiveForm(norm);
      return norm;
    } catch (e) {
      console.error('[Forms Hook] Fetch form by ID failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all responses for a form
  const fetchFormResponses = useCallback(async (formId) => {
    try {
      setIsResponsesLoading(true);
      const data = await formsApi.getResponses(formId);
      const responsesList = data?.responses || [];
      setActiveFormResponses(responsesList);
      return responsesList;
    } catch (e) {
      console.error('[Forms Hook] Fetch responses failed:', e.message);
      setActiveFormResponses([]);
      throw e;
    } finally {
      setIsResponsesLoading(false);
    }
  }, []);

  // Filtered forms list
  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      // Status filter
      if (statusFilter === 'Active' && !form.is_active) return false;
      if (statusFilter === 'Inactive' && form.is_active) return false;

      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = form.title.toLowerCase().includes(q);
        const matchesDesc = (form.description || '').toLowerCase().includes(q);
        const matchesId = (form.form_id || '').toLowerCase().includes(q);

        return matchesTitle || matchesDesc || matchesId;
      }

      return true;
    });
  }, [forms, statusFilter, searchQuery]);

  // Form Stats summary
  const formStats = useMemo(() => {
    const totalForms = forms.length;
    const activeCount = forms.filter((f) => f.is_active).length;
    const inactiveCount = totalForms - activeCount;
    const totalResponses = forms.reduce((acc, f) => acc + (f.response_count || 0), 0);

    return {
      totalForms,
      activeCount,
      inactiveCount,
      totalResponses,
    };
  }, [forms]);

  // Create Form
  const createForm = async (formData) => {
    setIsLoading(true);
    try {
      const apiResult = await formsApi.create(formData);
      const createdNorm = normalizeForm(apiResult);
      setForms((prev) => [createdNorm, ...prev]);
      return createdNorm;
    } catch (e) {
      console.error('[Forms Hook] Create form failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Update Form
  const updateForm = async (formId, updateData) => {
    setIsLoading(true);
    try {
      const apiResult = await formsApi.update(formId, updateData);
      const updatedNorm = normalizeForm(apiResult);
      setForms((prev) => prev.map((f) => (f.id === formId ? updatedNorm : f)));
      if (activeForm && activeForm.id === formId) {
        setActiveForm(updatedNorm);
      }
      return updatedNorm;
    } catch (e) {
      console.error('[Forms Hook] Update form failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Form
  const deleteForm = async (formId) => {
    setIsLoading(true);
    try {
      await formsApi.delete(formId);
      setForms((prev) => prev.filter((f) => f.id !== formId));
      if (activeForm && activeForm.id === formId) {
        setActiveForm(null);
        setActiveFormResponses([]);
      }
    } catch (e) {
      console.error('[Forms Hook] Delete form failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Response to Form
  const submitResponse = async (formId, answers, email) => {
    try {
      const res = await formsApi.submitResponse(formId, answers, email);
      // Update response count locally if form exists in state
      setForms((prev) =>
        prev.map((f) => (f.id === formId ? { ...f, response_count: (f.response_count || 0) + 1 } : f))
      );
      return res;
    } catch (e) {
      console.error('[Forms Hook] Submit response failed:', e.message);
      throw e;
    }
  };

  // Check whether response exists for an email
  const checkResponseExists = async (formId, email) => {
    try {
      return await formsApi.checkResponseExists(formId, email);
    } catch (e) {
      console.error('[Forms Hook] Check response exists failed:', e.message);
      throw e;
    }
  };

  // Export Form Responses to CSV file
  const exportToCSV = (form, responses) => {
    if (!form || !Array.isArray(responses) || responses.length === 0) {
      alert('No responses available to export.');
      return;
    }

    const questions = form.questions || [];
    // Sort questions by serial
    const sortedQuestions = [...questions].sort((a, b) => (a.question_serial || 0) - (b.question_serial || 0));

    // Headers: Response ID, Submitted At, Submitter Name, Submitter Email, [Q1 Statement], [Q2 Statement], ...
    const headers = [
      'Response ID',
      'Submitted At',
      'Submitter Name',
      'Submitter Email',
      ...sortedQuestions.map((q) => `Q${q.question_serial}: ${q.question_statement.replace(/"/g, '""')}`),
    ];

    // Build rows
    const rows = responses.map((r) => {
      const submittedAt = r.submitted_at ? new Date(r.submitted_at).toLocaleString() : '';
      const submitterName = r.submitted_by?.name || (r.member_id ? 'Authenticated Member' : 'Form Filler');
      const submitterEmail = r.email || r.submitted_by?.email || '';

      const answersObj = r.answers || {};

      const questionAnswers = sortedQuestions.map((q) => {
        const serialKey = String(q.question_serial);
        const ans = answersObj[serialKey] || answersObj[q.question_serial] || [];
        const ansText = Array.isArray(ans) ? ans.join('; ') : String(ans);
        return `"${ansText.replace(/"/g, '""')}"`;
      });

      return [
        `"${r.response_id || r.id || ''}"`,
        `"${submittedAt}"`,
        `"${submitterName.replace(/"/g, '""')}"`,
        `"${submitterEmail.replace(/"/g, '""')}"`,
        ...questionAnswers,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.map((h) => `"${h}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = (form.title || 'Form').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute('download', `${safeTitle}_responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    forms,
    filteredForms,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    formStats,
    activeForm,
    setActiveForm,
    activeFormResponses,
    fetchForms,
    fetchFormById,
    fetchFormResponses,
    createForm,
    updateForm,
    deleteForm,
    submitResponse,
    checkResponseExists,
    exportToCSV,
    isLoading,
    isResponsesLoading,
  };
}

export default useForms;
