import { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Eye, 
  Edit3, 
  Trash2, 
  Download, 
  BarChart3, 
  ArrowLeft, 
  ListOrdered, 
  Clock, 
  UserCheck, 
  Sparkles, 
  HelpCircle,
  FileCheck,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { MediaPreviewModal } from './MediaPreviewModal';

export function FormsView({
  forms = [],
  filteredForms = [],
  searchQuery = '',
  onSearchChange = () => {},
  statusFilter = 'All',
  onStatusFilterChange = () => {},
  formStats = { totalForms: 0, activeCount: 0, totalResponses: 0 },
  activeForm = null,
  onSelectForm = () => {},
  onClearActiveForm = () => {},
  activeFormResponses = [],
  onFetchResponses = () => {},
  onOpenCreateModal = () => {},
  onOpenEditModal = () => {},
  onOpenSubmitModal = () => {},
  onDeleteForm = () => {},
  onExportCSV = () => {},
  onFetchById = () => {},
  onLoadSampleForms = () => {},
  isLoading = false,
  isResponsesLoading = false,
}) {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'responses'
  const [lookupIdInput, setLookupIdInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [previewMediaUrl, setPreviewMediaUrl] = useState(null);

  // Fetch responses when opening form dashboard or switching to responses tab
  useEffect(() => {
    if (activeForm && activeForm.id) {
      onFetchResponses(activeForm.id).catch(() => {});
    }
  }, [activeForm, onFetchResponses]);

  // Copy Form ID helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Direct Lookup by Form ID handler
  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    setLookupError('');
    const tid = lookupIdInput.trim();
    if (!tid) return;

    try {
      await onFetchById(tid);
      setLookupIdInput('');
    } catch (err) {
      setLookupError('Form ID not found. Check ID format.');
    }
  };

  // Compute Multiple Choice Analytics for Responses Tab
  const analyticsData = useMemo(() => {
    if (!activeForm || !Array.isArray(activeForm.questions) || !Array.isArray(activeFormResponses)) {
      return [];
    }

    return activeForm.questions.map((q) => {
      const serialKey = String(q.question_serial);
      const totalResps = activeFormResponses.length;

      if (q.question_type === 'multiple_choice') {
        const counts = {};
        const options = q.multiple_choice_policy?.options || [];
        options.forEach((opt) => (counts[opt] = 0));

        activeFormResponses.forEach((r) => {
          const ansArr = r.answers?.[serialKey] || r.answers?.[q.question_serial] || [];
          if (Array.isArray(ansArr)) {
            ansArr.forEach((ans) => {
              if (counts[ans] !== undefined) counts[ans]++;
              else counts[ans] = (counts[ans] || 0) + 1;
            });
          }
        });

        return {
          question: q,
          type: 'mc',
          totalResps,
          counts,
        };
      } else {
        // Textual or file sample answers
        const sampleAnswers = activeFormResponses
          .map((r) => r.answers?.[serialKey] || r.answers?.[q.question_serial])
          .filter(Boolean)
          .map((ans) => (Array.isArray(ans) ? ans.join(', ') : String(ans)))
          .slice(0, 5);

        return {
          question: q,
          type: q.question_type,
          totalResps,
          sampleAnswers,
        };
      }
    });
  }, [activeForm, activeFormResponses]);

  const totalFormsCount = formStats?.totalForms ?? forms?.length ?? 0;
  const activeFormsCount = formStats?.activeCount ?? (forms ? forms.filter((f) => f.is_active).length : 0);
  const totalResponsesCount = formStats?.totalResponses ?? (forms ? forms.reduce((acc, f) => acc + (f.response_count || 0), 0) : 0);

  return (
    <div className="space-y-6 text-black dark:text-white">
      
      {/* 1. SECTION TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl text-black dark:text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-inner shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-black dark:text-white">Forms Engine</h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/20 text-black dark:text-indigo-300 border border-indigo-500/30">
                Google Forms Dynamic Engine
              </span>
            </div>
            <p className="text-xs text-black dark:text-white opacity-80 font-semibold mt-0.5">
              Build custom form schemas, preview, submit responses &amp; analyze CSV exports
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0 text-black dark:text-white">
          <div className="px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shrink-0">
            <div className="text-[10px] font-black uppercase tracking-wider text-black dark:text-white opacity-80">Total Forms</div>
            <div className="text-sm font-black text-black dark:text-indigo-400">{totalFormsCount}</div>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shrink-0">
            <div className="text-[10px] font-black uppercase tracking-wider text-black dark:text-white opacity-80">Active</div>
            <div className="text-sm font-black text-black dark:text-emerald-400">{activeFormsCount}</div>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shrink-0">
            <div className="text-[10px] font-black uppercase tracking-wider text-black dark:text-white opacity-80">Total Responses</div>
            <div className="text-sm font-black text-black dark:text-amber-400">{totalResponsesCount}</div>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE FORM DASHBOARD VIEW vs ALL FORMS LIST VIEW */}
      {activeForm ? (
        
        /* --- FORM DASHBOARD VIEW --- */
        <div className="space-y-6 text-black dark:text-white">
          
          {/* Dashboard Header Bar */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 text-black dark:text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={onClearActiveForm}
                className="flex items-center gap-2 text-xs font-black text-black dark:text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer self-start"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Forms</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleCopy(`${window.location.origin}/?form_id=${activeForm.id}`, 'share_link')}
                  className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-black text-black dark:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'share_link' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'share_link' ? 'Copied Link!' : 'Copy Share Link'}</span>
                </button>

                <button
                  onClick={() => onOpenSubmitModal(activeForm)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview &amp; Test Submit</span>
                </button>

                <button
                  onClick={() => onOpenEditModal(activeForm)}
                  className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-black text-black dark:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Form</span>
                </button>

                <button
                  onClick={() => onDeleteForm(activeForm.id, activeForm.title)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-black dark:text-rose-300 hover:bg-rose-500/30 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Form Info */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-black dark:text-white">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-black text-black dark:text-white">{activeForm.title}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${activeForm.is_active ? 'bg-emerald-500/20 text-black dark:text-emerald-300' : 'bg-rose-500/20 text-black dark:text-rose-300'}`}>
                    {activeForm.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-black dark:text-white opacity-80 font-medium mt-1">{activeForm.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono bg-black/5 dark:bg-black/20 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 self-start sm:self-auto text-black dark:text-white">
                <span className="opacity-80 text-[10px] uppercase font-sans font-black">Form ID:</span>
                <span className="font-black text-black dark:text-indigo-300">{activeForm.id}</span>
                <button
                  onClick={() => handleCopy(activeForm.id, 'form_id_dash')}
                  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded cursor-pointer text-black dark:text-white"
                >
                  {copiedId === 'form_id_dash' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-80" />}
                </button>
              </div>
            </div>

            {/* Tab Navigation Controls */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/10 text-black dark:text-white">
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'questions' ? 'btn-primary shadow-sm text-white' : 'btn-secondary text-black dark:text-white opacity-80 hover:opacity-100'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>Questions ({activeForm.questions ? activeForm.questions.length : 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('responses')}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'responses' ? 'btn-primary shadow-sm text-white' : 'btn-secondary text-black dark:text-white opacity-80 hover:opacity-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Responses &amp; Analytics ({activeFormResponses.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: QUESTIONS STRUCTURE */}
          {activeTab === 'questions' && (
            <div className="space-y-4 text-black dark:text-white">
              <div className="flex items-center justify-between text-black dark:text-white">
                <h3 className="text-sm font-black text-black dark:text-white">Form Question Schema</h3>
                <span className="text-xs text-black dark:text-white opacity-80 font-bold">Total {activeForm.questions ? activeForm.questions.length : 0} configured fields</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(activeForm.questions || []).map((q) => (
                  <div key={q.question_id || q.question_serial} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 text-black dark:text-white">
                    <div className="flex items-center justify-between text-black dark:text-white">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-black dark:text-indigo-300 flex items-center justify-center font-black text-xs">
                          {q.question_serial}
                        </span>
                        <h4 className="text-sm font-black text-black dark:text-white">
                          {q.question_statement}
                          {q.is_required && <span className="text-rose-600 dark:text-red-400 font-black ml-1">*</span>}
                        </h4>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-black/10 dark:bg-white/10 text-black dark:text-white uppercase tracking-wider">
                        {q.question_type}
                      </span>
                    </div>

                    {/* Policy metadata preview */}
                    <div className="text-xs text-black dark:text-white opacity-90 pl-10 font-medium">
                      {q.question_type === 'textual' && (
                        <p>Textual answer input (Max character length: {q.textual_policy?.max_len || 500})</p>
                      )}

                      {q.question_type === 'multiple_choice' && (
                        <div className="space-y-1 text-black dark:text-white">
                          <p className="font-black text-[11px] opacity-80 text-black dark:text-white">
                            Choice Type: {q.multiple_choice_policy?.type || 'Single'}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {(q.multiple_choice_policy?.options || []).map((opt, oIdx) => (
                              <span key={oIdx} className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-xs font-black text-black dark:text-white">
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {q.question_type === 'file' && (
                        <p className="text-black dark:text-white font-medium">
                          File Upload (Allowed types: {(q.file_policy?.supported_types || []).join(', ') || 'Any'}, Max size: {q.file_policy?.max_size_mb || 5}MB)
                        </p>
                      )}

                      {q.question_type === 'payment_acceptance' && (
                        <div className="space-y-2 text-black dark:text-white">
                          <p className="font-black text-emerald-600 dark:text-emerald-400 font-mono">
                            Fee Amount: ₹{q.payment_policy?.amount || 0}
                          </p>
                          <div className="flex flex-wrap gap-4 pt-1">
                            {q.payment_policy?.primary_qr_url && (
                              <div className="flex items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-black dark:text-white">
                                <img
                                  src={q.payment_policy.primary_qr_url}
                                  alt="Primary QR"
                                  className="w-12 h-12 object-contain bg-white rounded p-0.5"
                                />
                                <div>
                                  <span className="text-[10px] font-black text-black dark:text-emerald-300 block">Primary QR</span>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewMediaUrl(q.payment_policy.primary_qr_url)}
                                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-black"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>Preview</span>
                                  </button>
                                </div>
                              </div>
                            )}
                            {q.payment_policy?.fallback_qr_url && (
                              <div className="flex items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-black dark:text-white">
                                <img
                                  src={q.payment_policy.fallback_qr_url}
                                  alt="Fallback QR"
                                  className="w-12 h-12 object-contain bg-white rounded p-0.5"
                                />
                                <div>
                                  <span className="text-[10px] font-black text-black dark:text-amber-300 block">Fallback QR</span>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewMediaUrl(q.payment_policy.fallback_qr_url)}
                                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-black"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>Preview</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RESPONSES & ANALYTICS */}
          {activeTab === 'responses' && (
            <div className="space-y-6 text-black dark:text-white">
              
              {/* Top Controls: Export CSV */}
              <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-black dark:text-white">
                <div>
                  <h3 className="text-sm font-black text-black dark:text-white">Submitted Responses</h3>
                  <p className="text-xs opacity-80 text-black dark:text-white font-medium">View, analyze, and export response dataset</p>
                </div>

                <button
                  onClick={() => onExportCSV(activeForm, activeFormResponses)}
                  disabled={activeFormResponses.length === 0}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer text-white"
                >
                  <Download className="w-4 h-4" />
                  <span>Export to CSV</span>
                </button>
              </div>

              {/* Analytics Breakdown Section */}
              <div className="space-y-4 text-black dark:text-white">
                <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-white opacity-80">Answer Distribution &amp; Analytics</h4>
                
                {analyticsData.length === 0 ? (
                  <div className="glass-panel p-8 rounded-2xl text-center text-xs opacity-80 font-bold text-black dark:text-white">
                    No responses have been submitted to this form yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analyticsData.map((item, idx) => (
                      <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 text-black dark:text-white">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                          <span className="text-xs font-black text-black dark:text-indigo-300">
                            Q{item.question.question_serial}. {item.question.question_statement}
                          </span>
                          <span className="text-[10px] font-black uppercase text-black dark:text-white opacity-80">{item.type}</span>
                        </div>

                        {item.type === 'mc' ? (
                          <div className="space-y-2 text-black dark:text-white">
                            {Object.entries(item.counts).map(([option, count]) => {
                              const pct = item.totalResps > 0 ? Math.round((count / item.totalResps) * 100) : 0;

                              return (
                                <div key={option} className="space-y-1">
                                  <div className="flex justify-between text-xs font-black text-black dark:text-white">
                                    <span className="truncate pr-2">{option}</span>
                                    <span className="font-black shrink-0">{count} ({pct}%)</span>
                                  </div>
                                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-black/30 overflow-hidden">
                                    <div
                                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-xs text-black dark:text-white">
                            <span className="text-[10px] font-black uppercase text-black dark:text-white opacity-80">Recent Sample Responses:</span>
                            {item.sampleAnswers.length > 0 ? (
                              item.sampleAnswers.map((ans, aIdx) => {
                                const isUrl = typeof ans === 'string' && (ans.startsWith('http://') || ans.startsWith('https://'));
                                if (isUrl || item.type === 'file' || item.type === 'media') {
                                  return (
                                    <div key={aIdx} className="py-1">
                                      <button
                                        type="button"
                                        onClick={() => setPreviewMediaUrl(ans)}
                                        className="px-2.5 py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-black dark:text-indigo-300 text-xs font-black flex items-center gap-1.5 border border-indigo-500/30 transition-all cursor-pointer"
                                      >
                                        <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        <span>View Media Preview</span>
                                      </button>
                                    </div>
                                  );
                                }
                                return (
                                  <div key={aIdx} className="p-2 rounded-lg bg-black/5 dark:bg-black/20 border border-slate-200 dark:border-white/5 font-mono text-[11px] truncate text-black dark:text-white font-bold">
                                    {ans}
                                  </div>
                                );
                              })
                            ) : (
                              <p className="opacity-70 text-[11px] font-semibold text-black dark:text-white">No text responses submitted.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Response Table */}
              <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden text-black dark:text-white">
                <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between text-black dark:text-white">
                  <span className="text-xs font-black text-black dark:text-white">Response Records Table</span>
                  <span className="text-xs opacity-80 font-black text-black dark:text-white">{activeFormResponses.length} total entries</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-black dark:text-slate-200 text-[11px] uppercase tracking-wider font-black">
                        <th className="p-3">Response ID</th>
                        <th className="p-3">Submitted At</th>
                        <th className="p-3">Filler Email</th>
                        {(activeForm.questions || []).map((q) => (
                          <th key={q.question_serial} className="p-3 max-w-xs truncate">
                            Q{q.question_serial}: {q.question_statement}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-black dark:text-white">
                      {isResponsesLoading ? (
                        <tr>
                          <td colSpan={3 + (activeForm.questions?.length || 0)} className="p-8 text-center text-xs opacity-80 font-bold text-black dark:text-white">
                            Loading form responses...
                          </td>
                        </tr>
                      ) : activeFormResponses.length === 0 ? (
                        <tr>
                          <td colSpan={3 + (activeForm.questions?.length || 0)} className="p-8 text-center text-xs opacity-80 font-bold text-black dark:text-white">
                            No responses recorded yet.
                          </td>
                        </tr>
                      ) : (
                        activeFormResponses.map((r) => (
                          <tr key={r.response_id || r.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-black dark:text-white">
                            <td className="p-3 font-mono text-[11px] text-black dark:text-indigo-300 font-black">
                              {String(r.response_id || r.id).slice(-8)}
                            </td>
                            <td className="p-3 opacity-90 whitespace-nowrap font-semibold text-black dark:text-white">
                              {r.submitted_at ? new Date(r.submitted_at).toLocaleString() : 'N/A'}
                            </td>
                            <td className="p-3 whitespace-nowrap text-black dark:text-white">
                              {r.email ? (
                                <div>
                                  <div className="font-black text-black dark:text-indigo-300">{r.email}</div>
                                  {r.submitted_by?.name && (
                                    <div className="text-[10px] opacity-80 font-bold text-black dark:text-white">{r.submitted_by.name}</div>
                                  )}
                                </div>
                              ) : r.submitted_by ? (
                                <div>
                                  <div className="font-black text-black dark:text-white">{r.submitted_by.name}</div>
                                  <div className="text-[10px] opacity-80 font-bold text-black dark:text-white">{r.submitted_by.email}</div>
                                </div>
                              ) : (
                                <span className="opacity-70 italic font-bold text-black dark:text-white">Anonymous</span>
                              )}
                            </td>

                              {(activeForm.questions || []).map((q) => {
                              const serialKey = String(q.question_serial);
                              const ans = r.answers?.[serialKey] || r.answers?.[q.question_serial] || [];
                              const ansArray = Array.isArray(ans) ? ans : ans ? [ans] : [];
                              const ansStr = Array.isArray(ans) ? ans.join('; ') : String(ans || '');
                              const isMediaQuestion = q.question_type === 'file' || q.question_type === 'media' || q.question_type === 'payment_acceptance';
                              
                              const mediaUrls = ansArray.filter(
                                (item) => typeof item === 'string' && (item.startsWith('http://') || item.startsWith('https://'))
                              );

                              return (
                                <td key={q.question_serial} className="p-3 max-w-xs text-black dark:text-white">
                                  {isMediaQuestion || mediaUrls.length > 0 ? (
                                    mediaUrls.length > 0 ? (
                                      <div className="flex flex-wrap gap-1.5 items-center">
                                        {mediaUrls.map((url, uIdx) => (
                                          <button
                                            key={uIdx}
                                            type="button"
                                            onClick={() => setPreviewMediaUrl(url)}
                                            className="px-2.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-black dark:text-indigo-300 text-xs font-black flex items-center gap-1.5 border border-indigo-500/30 transition-all cursor-pointer shadow-xs"
                                            title={`Preview attachment: ${url}`}
                                          >
                                            <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                            <span>
                                              {q.question_type === 'payment_acceptance'
                                                ? (mediaUrls.length > 1 ? `Screenshot #${uIdx + 1}` : 'View Screenshot')
                                                : (mediaUrls.length > 1 ? `Preview #${uIdx + 1}` : 'View Preview')}
                                            </span>
                                          </button>
                                        ))}
                                      </div>
                                    ) : ansStr ? (
                                      <span title={ansStr} className="truncate block font-bold text-black dark:text-white">{ansStr}</span>
                                    ) : (
                                      <span className="opacity-60 italic text-black dark:text-white font-bold">—</span>
                                    )
                                  ) : ansStr ? (
                                    <span title={ansStr} className="truncate block font-bold text-black dark:text-white">{ansStr}</span>
                                  ) : (
                                    <span className="opacity-60 italic text-black dark:text-white font-bold">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

      ) : (

        /* --- ALL FORMS LIST VIEW --- */
        <div className="space-y-6 text-black dark:text-white">
          
          {/* Search, Filter & Lookup Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-black dark:text-white">
            
            {/* Search Input */}
            <div className="lg:col-span-3 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black dark:text-white opacity-70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search forms by title or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-black text-black dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>

            {/* Status Filter */}
            <div className="lg:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-black text-black dark:text-white cursor-pointer"
              >
                <option value="All" className="bg-white dark:bg-slate-900 text-black dark:text-white">All Statuses</option>
                <option value="Active" className="bg-white dark:bg-slate-900 text-black dark:text-white">Active Only</option>
                <option value="Inactive" className="bg-white dark:bg-slate-900 text-black dark:text-white">Inactive Only</option>
              </select>
            </div>

            {/* Direct Form ID Lookup */}
            <form onSubmit={handleLookupSubmit} className="lg:col-span-3 flex items-center gap-2">
              <input
                type="text"
                value={lookupIdInput}
                onChange={(e) => setLookupIdInput(e.target.value)}
                placeholder="Lookup Form ID..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-mono font-black text-black dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
              <button
                type="submit"
                className="btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-black text-black dark:text-white shrink-0 cursor-pointer"
              >
                Lookup
              </button>
            </form>

            {/* Load Sample & Create Form Actions */}
            <div className="lg:col-span-4 flex items-center gap-2 justify-end">
              {onLoadSampleForms && (
                <button
                  onClick={onLoadSampleForms}
                  className="flex-1 btn-secondary border border-sky-500/40 text-black dark:text-sky-300 hover:bg-sky-500/20 px-3 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Load Sample Registration Forms & Spreadsheet Responses"
                >
                  <FileSpreadsheet className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>Load Sample Form Data</span>
                </button>
              )}

              <button
                onClick={onOpenCreateModal}
                className="btn-primary px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg cursor-pointer text-white shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Form</span>
              </button>
            </div>

          </div>

          {lookupError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-rose-700 dark:text-red-400 text-xs font-black">
              {lookupError}
            </div>
          )}

          {/* Forms Cards Grid */}
          {isLoading ? (
            <div className="p-12 text-center text-xs opacity-80 glass-panel rounded-3xl text-black dark:text-white font-bold">
              <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
              <span>Fetching forms directory...</span>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl space-y-3 text-black dark:text-white">
              <HelpCircle className="w-10 h-10 opacity-50 mx-auto text-black dark:text-white" />
              <h3 className="text-sm font-black text-black dark:text-white">No Forms Found</h3>
              <p className="text-xs opacity-80 max-w-sm mx-auto font-bold text-black dark:text-white">
                No custom forms match your current search or filter. Create a new custom form to get started.
              </p>
              <button
                onClick={onOpenCreateModal}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-black shadow-md inline-flex items-center gap-1.5 mt-2 cursor-pointer text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Create Custom Form</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black dark:text-white">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg text-black dark:text-white"
                >
                  <div className="space-y-4">
                    {/* Top Row: Title & Active Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        onClick={() => onSelectForm(form.id)}
                        className="text-base font-black tracking-tight text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-1"
                      >
                        {form.title}
                      </h3>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${form.is_active ? 'bg-emerald-500/20 text-black dark:text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-black dark:text-rose-300 border border-rose-500/30'}`}>
                        {form.is_active ? 'Active' : 'Closed'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-black dark:text-white opacity-80 font-medium line-clamp-2 leading-relaxed min-h-[36px]">
                      {form.description || 'No description provided.'}
                    </p>

                    {/* Badges: Questions & Responses */}
                    <div className="flex items-center gap-2 text-[11px] font-black text-black dark:text-white">
                      <span className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-black dark:text-white">
                        {form.question_count} Questions
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-black dark:text-indigo-300 font-black">
                        {form.response_count} Responses
                      </span>
                    </div>

                    {/* Form ID Box */}
                    <div className="p-2.5 rounded-xl bg-black/5 dark:bg-black/30 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-black dark:text-white">
                      <span className="opacity-80 text-[10px] font-sans font-black">ID:</span>
                      <span className="font-black text-black dark:text-indigo-300 truncate px-2">{form.id}</span>
                      <button
                        onClick={() => handleCopy(form.id, form.id)}
                        title="Copy Form ID"
                        className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded shrink-0 cursor-pointer text-black dark:text-white"
                      >
                        {copiedId === form.id ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-80" />}
                      </button>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 mt-6 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectForm(form.id)}
                      className="btn-primary px-3 py-1.5 rounded-xl text-xs font-black shadow-md cursor-pointer text-white"
                    >
                      Open Dashboard
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenSubmitModal(form)}
                        title="Preview & Test Submit"
                        className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white opacity-80 hover:opacity-100 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-black dark:text-indigo-300" />
                      </button>

                      <button
                        onClick={() => onOpenEditModal(form)}
                        title="Edit Form Schema"
                        className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white opacity-80 hover:opacity-100 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteForm(form.id, form.title)}
                        title="Delete Form"
                        className="p-2 rounded-xl hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 opacity-80 hover:opacity-100 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      )}

      {/* Media Preview Lightbox Modal */}
      <MediaPreviewModal
        isOpen={Boolean(previewMediaUrl)}
        onClose={() => setPreviewMediaUrl(null)}
        mediaUrl={previewMediaUrl}
        title="Form Response Media Preview"
      />

    </div>
  );
}

export default FormsView;

