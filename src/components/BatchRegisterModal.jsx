import { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  HelpCircle, 
  X, 
  Loader2, 
  ArrowRight,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

const SAMPLE_GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';

export function BatchRegisterModal({ isOpen, onClose, onBulkRegister, onStartOnboarding }) {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Results payload state
  const [results, setResults] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [headerCopied, setHeaderCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSheetUrl('');
      setError('');
      setIsSubmitting(false);
      setResults(null);
      setCopiedIndex(null);
      setCopiedAll(false);
      setShowInstructions(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sheetUrl.trim()) {
      setError('Please provide a Google Sheet URL.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const res = await onBulkRegister(sheetUrl.trim());
      setResults(res);
    } catch (err) {
      setError(err.message || 'Failed to process Google Sheet batch registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSheetUrl(text);
      }
    } catch (_err) {
      // Clipboard permissions ignored
    }
  };

  const handleUseSampleUrl = () => {
    setSheetUrl(SAMPLE_GOOGLE_SHEET_URL);
  };

  const handleCopySingleLink = (index, url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAllLinks = () => {
    if (!results || !results.successful) return;
    const lines = results.successful
      .filter((m) => m.onboardingUrl)
      .map((m) => `${m.email}: ${m.onboardingUrl}`)
      .join('\n');
    
    if (lines) {
      navigator.clipboard.writeText(lines);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    }
  };

  const handleCopyHeaderTemplate = () => {
    const csvHeader = 'name,email,team,position\nJohn Doe,john.doe@aces.org,Web Team,Member';
    navigator.clipboard.writeText(csvHeader);
    setHeaderCopied(true);
    setTimeout(() => setHeaderCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl acrylic-dialog rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20">
        
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/40 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white">Batch Member Registration</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Google Sheet CSV
              </span>
            </div>
            <p className="text-xs opacity-70 font-medium mt-0.5">
              Import multiple guild members simultaneously directly from a Google Sheet.
            </p>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5 custom-scrollbar">

          {!results ? (
            /* Input Phase */
            <div className="space-y-5">
              
              {/* Instructions Accordion / Card */}
              <div className="rounded-2xl glass-panel-subtle p-4 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <Info className="w-4 h-4 text-indigo-400" />
                    <span>Google Sheet Formatting Requirements</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showInstructions ? 'Hide Details' : 'View Guide'}</span>
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs space-y-2 opacity-90 leading-relaxed font-medium">
                  <p>
                    Ensure your Google Sheet contains a header row with the following column headers:
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] border border-emerald-500/30">
                      email *
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] border border-emerald-500/30">
                      team *
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] border border-emerald-500/30">
                      position *
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-[11px] border border-white/10">
                      name (optional)
                    </span>
                  </div>
                </div>

                {showInstructions && (
                  <div className="pt-3 border-t border-white/10 space-y-3 text-xs opacity-80 animate-in fade-in duration-200">
                    <div>
                      <h4 className="font-bold text-white mb-1">Supported Teams:</h4>
                      <p className="text-[11px]">Web Team, Design Team, Events Team, Public Relations, Technical Lead, Executive</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Supported Positions:</h4>
                      <p className="text-[11px]">Member, Core Member, Senior Member, Co-Lead, Team Lead, Administrator</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">How to publish/share your Google Sheet:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                        <li>Make the sheet viewable to anyone with the link, OR</li>
                        <li>Go to <strong className="text-white">File &gt; Share &gt; Publish to Web</strong>, select <strong className="text-white">Comma-separated values (.csv)</strong> and click Publish.</li>
                      </ol>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyHeaderTemplate}
                      className="px-3 py-1.5 rounded-xl btn-secondary text-[11px] font-bold flex items-center gap-1.5 cursor-pointer mt-2"
                    >
                      {headerCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied CSV Format!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Sample CSV Header</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google Sheet URL Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Google Sheet URL</span>
                      <span className="text-rose-400">*</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleUseSampleUrl}
                      className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Insert Demo Sheet URL</span>
                    </button>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="url"
                      required
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit..."
                      className="w-full pl-4 pr-24 py-3 rounded-2xl glass-input text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="absolute right-2 px-3 py-1.5 rounded-xl btn-secondary text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Paste</span>
                    </button>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Google Sheet...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Import &amp; Register Batch</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          ) : (
            /* Results Phase */
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              
              {/* Results Top Stat Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl glass-panel-subtle border border-white/10 text-center">
                  <span className="text-xs opacity-70 font-semibold block">Total Processed</span>
                  <span className="text-2xl font-black text-white">{results.total}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <span className="text-xs text-emerald-400 font-semibold block flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Successful</span>
                  </span>
                  <span className="text-2xl font-black text-emerald-400">{results.successfulCount}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
                  <span className="text-xs text-rose-400 font-semibold block flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Failed / Skipped</span>
                  </span>
                  <span className="text-2xl font-black text-rose-400">{results.failedCount}</span>
                </div>
              </div>

              {/* Successful Members Table */}
              {results.successful && results.successful.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Successfully Registered ({results.successful.length})</span>
                    </h4>

                    <button
                      onClick={handleCopyAllLinks}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedAll ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>All Links Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy All Onboarding Links</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="rounded-2xl glass-panel-subtle overflow-hidden border border-white/10 max-h-60 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black/30 text-slate-300 font-bold sticky top-0 backdrop-blur-md">
                        <tr>
                          <th className="p-3">Member Details</th>
                          <th className="p-3">Guild &amp; Position</th>
                          <th className="p-3 text-right">Onboarding Activation Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {results.successful.map((member, idx) => (
                          <tr key={member.id || idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-white">{member.name || 'Member'}</div>
                              <div className="text-[11px] opacity-70 font-mono">{member.email}</div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold text-[11px] mr-1">
                                {member.team}
                              </span>
                              <span className="text-[11px] opacity-80">{member.position}</span>
                            </td>
                            <td className="p-3 text-right">
                              {member.onboardingUrl ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleCopySingleLink(idx, member.onboardingUrl)}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    {copiedIndex === idx ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-300" />
                                        <span>Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy Link</span>
                                      </>
                                    )}
                                  </button>
                                  {onStartOnboarding && (
                                    <button
                                      onClick={() => {
                                        onClose();
                                        onStartOnboarding(member.onboarding_token);
                                      }}
                                      className="p-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 transition-colors"
                                      title="Test Activation Now"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[11px] opacity-50 font-italic">No token</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Failed Rows Table */}
              {results.failed && results.failed.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Failed / Skipped Rows ({results.failed.length})</span>
                  </h4>

                  <div className="rounded-2xl glass-panel-subtle overflow-hidden border border-rose-500/30 max-h-48 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-rose-950/40 text-rose-300 font-bold sticky top-0 backdrop-blur-md">
                        <tr>
                          <th className="p-3 w-16">Row #</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Failure Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-500/10">
                        {results.failed.map((fail, idx) => (
                          <tr key={idx} className="hover:bg-rose-500/5 transition-colors">
                            <td className="p-3 font-mono font-bold text-rose-300">
                              Row {fail.row}
                            </td>
                            <td className="p-3 font-mono text-[11px]">
                              {fail.email || <span className="opacity-50 font-italic">Missing</span>}
                            </td>
                            <td className="p-3 text-rose-300 font-medium text-[11px]">
                              {fail.reason}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setResults(null);
                    setSheetUrl('');
                  }}
                  className="px-4 py-2 rounded-xl btn-secondary text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Import Another Sheet</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold cursor-pointer"
                >
                  Done &amp; Return to Directory
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default BatchRegisterModal;
