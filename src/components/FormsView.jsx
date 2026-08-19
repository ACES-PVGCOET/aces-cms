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
  Filter
} from 'lucide-react';
import { MediaPreviewModal } from './MediaPreviewModal';

export function FormsView({
  forms,
  filteredForms,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  formStats,
  activeForm,
  onSelectForm,
  onClearActiveForm,
  activeFormResponses,
  onFetchResponses,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenSubmitModal,
  onDeleteForm,
  onExportCSV,
  onFetchById,
  isLoading,
  isResponsesLoading,
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

  return (
    <div className="space-y-6">
      
      {/* 1. SECTION TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-inner shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight">Forms Engine</h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Google Forms Dynamic Engine
              </span>
            </div>
            <p className="text-xs opacity-75 mt-0.5">
              Build custom form schemas, preview, submit responses & analyze CSV exports
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
          <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-center shrink-0">
            <div className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Total Forms</div>
            <div className="text-sm font-extrabold text-indigo-400">{formStats.totalForms}</div>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-center shrink-0">
            <div className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Active</div>
            <div className="text-sm font-extrabold text-emerald-400">{formStats.activeCount}</div>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-center shrink-0">
            <div className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Total Responses</div>
            <div className="text-sm font-extrabold text-amber-400">{formStats.totalResponses}</div>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE FORM DASHBOARD VIEW vs ALL FORMS LIST VIEW */}
      {activeForm ? (
        
        /* --- FORM DASHBOARD VIEW --- */
        <div className="space-y-6">
          
          {/* Dashboard Header Bar */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={onClearActiveForm}
                className="flex items-center gap-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity cursor-pointer self-start"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Forms</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleCopy(`${window.location.origin}/?form_id=${activeForm.id}`, 'share_link')}
                  className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'share_link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'share_link' ? 'Copied Link!' : 'Copy Share Link'}</span>
                </button>

                <button
                  onClick={() => onOpenSubmitModal(activeForm)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview & Test Submit</span>
                </button>

                <button
                  onClick={() => onOpenEditModal(activeForm)}
                  className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Form</span>
                </button>

                <button
                  onClick={() => onDeleteForm(activeForm.id, activeForm.title)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Form Info */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold">{activeForm.title}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${activeForm.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {activeForm.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs opacity-75 mt-1">{activeForm.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
                <span className="opacity-60 text-[10px] uppercase font-sans font-bold">Form ID:</span>
                <span className="font-bold text-indigo-300">{activeForm.id}</span>
                <button
                  onClick={() => handleCopy(activeForm.id, 'form_id_dash')}
                  className="p-1 hover:bg-white/10 rounded cursor-pointer"
                >
                  {copiedId === 'form_id_dash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
                </button>
              </div>
            </div>

            {/* Tab Navigation Controls */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'questions' ? 'btn-primary shadow-sm' : 'hover:bg-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>Questions ({activeForm.questions ? activeForm.questions.length : 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('responses')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'responses' ? 'btn-primary shadow-sm' : 'hover:bg-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Responses & Analytics ({activeFormResponses.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: QUESTIONS STRUCTURE */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold opacity-90">Form Question Schema</h3>
                <span className="text-xs opacity-60">Total {activeForm.questions ? activeForm.questions.length : 0} configured fields</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(activeForm.questions || []).map((q) => (
                  <div key={q.question_id || q.question_serial} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                          {q.question_serial}
                        </span>
                        <h4 className="text-sm font-bold">
                          {q.question_statement}
                          {q.is_required && <span className="text-red-400 font-bold ml-1">*</span>}
                        </h4>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white/10 opacity-90 uppercase tracking-wider">
                        {q.question_type}
                      </span>
                    </div>

                    {/* Policy metadata preview */}
                    <div className="text-xs opacity-80 pl-10">
                      {q.question_type === 'textual' && (
                        <p>Textual answer input (Max character length: {q.textual_policy?.max_len || 500})</p>
                      )}

                      {q.question_type === 'multiple_choice' && (
                        <div className="space-y-1">
                          <p className="font-semibold text-[11px] opacity-70">
                            Choice Type: {q.multiple_choice_policy?.type || 'Single'}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {(q.multiple_choice_policy?.options || []).map((opt, oIdx) => (
                              <span key={oIdx} className="px-2.5 py-1 rounded-lg bg-black/20 border border-white/10 text-xs">
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {q.question_type === 'file' && (
                        <p>
                          File Upload (Allowed types: {(q.file_policy?.supported_types || []).join(', ') || 'Any'}, Max size: {q.file_policy?.max_size_mb || 5}MB)
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RESPONSES & ANALYTICS */}
          {activeTab === 'responses' && (
            <div className="space-y-6">
              
              {/* Top Controls: Export CSV */}
              <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-white/10">
                <div>
                  <h3 className="text-sm font-bold">Submitted Responses</h3>
                  <p className="text-xs opacity-75">View, analyze, and export response dataset</p>
                </div>

                <button
                  onClick={() => onExportCSV(activeForm, activeFormResponses)}
                  disabled={activeFormResponses.length === 0}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export to CSV</span>
                </button>
              </div>

              {/* Analytics Breakdown Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold opacity-75 uppercase tracking-wider">Answer Distribution & Analytics</h4>
                
                {analyticsData.length === 0 ? (
                  <div className="glass-panel p-8 rounded-2xl text-center text-xs opacity-70">
                    No responses have been submitted to this form yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analyticsData.map((item, idx) => (
                      <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-bold text-indigo-300">
                            Q{item.question.question_serial}. {item.question.question_statement}
                          </span>
                          <span className="text-[10px] opacity-60 font-semibold uppercase">{item.type}</span>
                        </div>

                        {item.type === 'mc' ? (
                          <div className="space-y-2">
                            {Object.entries(item.counts).map(([option, count]) => {
                              const pct = item.totalResps > 0 ? Math.round((count / item.totalResps) * 100) : 0;

                              return (
                                <div key={option} className="space-y-1">
                                  <div className="flex justify-between text-xs font-medium">
                                    <span className="truncate pr-2">{option}</span>
                                    <span className="font-bold shrink-0">{count} ({pct}%)</span>
                                  </div>
                                  <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
                                    <div
                                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-xs">
                            <span className="text-[10px] font-bold opacity-60 uppercase">Recent Sample Responses:</span>
                            {item.sampleAnswers.length > 0 ? (
                              item.sampleAnswers.map((ans, aIdx) => {
                                const isUrl = typeof ans === 'string' && (ans.startsWith('http://') || ans.startsWith('https://'));
                                if (isUrl || item.type === 'file' || item.type === 'media') {
                                  return (
                                    <div key={aIdx} className="py-1">
                                      <button
                                        type="button"
                                        onClick={() => setPreviewMediaUrl(ans)}
                                        className="px-2.5 py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 border border-indigo-500/30 transition-all cursor-pointer"
                                      >
                                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                                        <span>View Media Preview</span>
                                      </button>
                                    </div>
                                  );
                                }
                                return (
                                  <div key={aIdx} className="p-2 rounded-lg bg-black/20 border border-white/5 font-mono text-[11px] truncate">
                                    {ans}
                                  </div>
                                );
                              })
                            ) : (
                              <p className="opacity-50 text-[11px]">No text responses submitted.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Response Table */}
              <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold">Response Records Table</span>
                  <span className="text-xs opacity-75">{activeFormResponses.length} total entries</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 opacity-80 text-[11px] uppercase tracking-wider font-bold">
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
                    <tbody className="divide-y divide-white/5">
                      {isResponsesLoading ? (
                        <tr>
                          <td colSpan={3 + (activeForm.questions?.length || 0)} className="p-8 text-center text-xs opacity-70">
                            Loading form responses...
                          </td>
                        </tr>
                      ) : activeFormResponses.length === 0 ? (
                        <tr>
                          <td colSpan={3 + (activeForm.questions?.length || 0)} className="p-8 text-center text-xs opacity-70">
                            No responses recorded yet.
                          </td>
                        </tr>
                      ) : (
                        activeFormResponses.map((r) => (
                          <tr key={r.response_id || r.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-mono text-[11px] text-indigo-300 font-bold">
                              {String(r.response_id || r.id).slice(-8)}
                            </td>
                            <td className="p-3 opacity-80 whitespace-nowrap">
                              {r.submitted_at ? new Date(r.submitted_at).toLocaleString() : 'N/A'}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {r.email ? (
                                <div>
                                  <div className="font-bold text-indigo-300">{r.email}</div>
                                  {r.submitted_by?.name && (
                                    <div className="text-[10px] opacity-60">{r.submitted_by.name}</div>
                                  )}
                                </div>
                              ) : r.submitted_by ? (
                                <div>
                                  <div className="font-bold">{r.submitted_by.name}</div>
                                  <div className="text-[10px] opacity-60">{r.submitted_by.email}</div>
                                </div>
                              ) : (
                                <span className="opacity-60 italic">Anonymous</span>
                              )}
                            </td>

                              {(activeForm.questions || []).map((q) => {
                              const serialKey = String(q.question_serial);
                              const ans = r.answers?.[serialKey] || r.answers?.[q.question_serial] || [];
                              const ansArray = Array.isArray(ans) ? ans : ans ? [ans] : [];
                              const ansStr = Array.isArray(ans) ? ans.join('; ') : String(ans || '');
                              const isMediaQuestion = q.question_type === 'file' || q.question_type === 'media';
                              
                              const mediaUrls = ansArray.filter(
                                (item) => typeof item === 'string' && (item.startsWith('http://') || item.startsWith('https://'))
                              );

                              return (
                                <td key={q.question_serial} className="p-3 max-w-xs">
                                  {isMediaQuestion || mediaUrls.length > 0 ? (
                                    mediaUrls.length > 0 ? (
                                      <div className="flex flex-wrap gap-1.5 items-center">
                                        {mediaUrls.map((url, uIdx) => (
                                          <button
                                            key={uIdx}
                                            type="button"
                                            onClick={() => setPreviewMediaUrl(url)}
                                            className="px-2.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 border border-indigo-500/30 transition-all cursor-pointer shadow-xs"
                                            title={`Preview attachment: ${url}`}
                                          >
                                            <Eye className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                            <span>{mediaUrls.length > 1 ? `Preview #${uIdx + 1}` : 'View Preview'}</span>
                                          </button>
                                        ))}
                                      </div>
                                    ) : ansStr ? (
                                      <span title={ansStr} className="truncate block">{ansStr}</span>
                                    ) : (
                                      <span className="opacity-40 italic">—</span>
                                    )
                                  ) : ansStr ? (
                                    <span title={ansStr} className="truncate block">{ansStr}</span>
                                  ) : (
                                    <span className="opacity-40 italic">—</span>
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
        <div className="space-y-6">
          
          {/* Search, Filter & Lookup Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search forms by title or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-medium"
              />
            </div>

            {/* Status Filter */}
            <div className="lg:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-bold cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Statuses</option>
                <option value="Active" className="bg-slate-900 text-white">Active Only</option>
                <option value="Inactive" className="bg-slate-900 text-white">Inactive Only</option>
              </select>
            </div>

            {/* Direct Form ID Lookup */}
            <form onSubmit={handleLookupSubmit} className="lg:col-span-4 flex items-center gap-2">
              <input
                type="text"
                value={lookupIdInput}
                onChange={(e) => setLookupIdInput(e.target.value)}
                placeholder="Lookup Form by ID (e.g. 66b64f...)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-mono"
              />
              <button
                type="submit"
                className="btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
              >
                Lookup
              </button>
            </form>

            {/* Create Form Action */}
            <div className="lg:col-span-2 flex justify-end">
              <button
                onClick={onOpenCreateModal}
                className="w-full btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Form</span>
              </button>
            </div>

          </div>

          {lookupError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {lookupError}
            </div>
          )}

          {/* Forms Cards Grid */}
          {isLoading ? (
            <div className="p-12 text-center text-xs opacity-70 glass-panel rounded-3xl">
              <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
              <span>Fetching forms directory...</span>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl space-y-3">
              <HelpCircle className="w-10 h-10 opacity-40 mx-auto" />
              <h3 className="text-sm font-bold opacity-90">No Forms Found</h3>
              <p className="text-xs opacity-70 max-w-sm mx-auto">
                No custom forms match your current search or filter. Create a new custom form to get started.
              </p>
              <button
                onClick={onOpenCreateModal}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-1.5 mt-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Custom Form</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-4">
                    {/* Top Row: Title & Active Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        onClick={() => onSelectForm(form.id)}
                        className="text-base font-bold tracking-tight group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-1"
                      >
                        {form.title}
                      </h3>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${form.is_active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                        {form.is_active ? 'Active' : 'Closed'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs opacity-75 line-clamp-2 leading-relaxed min-h-[36px]">
                      {form.description || 'No description provided.'}
                    </p>

                    {/* Badges: Questions & Responses */}
                    <div className="flex items-center gap-2 text-[11px] font-bold">
                      <span className="px-2.5 py-1 rounded-lg bg-black/20 border border-white/10 opacity-80">
                        {form.question_count} Questions
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                        {form.response_count} Responses
                      </span>
                    </div>

                    {/* Form ID Box */}
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="opacity-60 text-[10px] font-sans font-bold">ID:</span>
                      <span className="font-bold text-indigo-300 truncate px-2">{form.id}</span>
                      <button
                        onClick={() => handleCopy(form.id, form.id)}
                        title="Copy Form ID"
                        className="p-1 hover:bg-white/10 rounded shrink-0 cursor-pointer"
                      >
                        {copiedId === form.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
                      </button>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-white/10 mt-6 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectForm(form.id)}
                      className="btn-primary px-3 py-1.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Open Dashboard
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenSubmitModal(form)}
                        title="Preview & Test Submit"
                        className="p-2 rounded-xl hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-indigo-300" />
                      </button>

                      <button
                        onClick={() => onOpenEditModal(form)}
                        title="Edit Form Schema"
                        className="p-2 rounded-xl hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteForm(form.id, form.title)}
                        title="Delete Form"
                        className="p-2 rounded-xl hover:bg-rose-500/20 text-rose-400 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
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
