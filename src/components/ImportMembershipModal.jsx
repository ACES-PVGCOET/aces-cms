import { useState } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Download,
  Sparkles,
  Info
} from 'lucide-react';

export function ImportMembershipModal({
  isOpen,
  onClose,
  onImportLocal,
  onBulkImport,
  showToast,
}) {
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [customPath, setCustomPath] = useState('');

  if (!isOpen) return null;

  const handleImportLocalSheet = async () => {
    if (!customPath.trim()) {
      setError('Please provide the path to the spreadsheet file.');
      return;
    }
    try {
      setIsImporting(true);
      setError('');
      setResult(null);
      const res = await onImportLocal(customPath.trim());
      setResult(res);
      if (showToast) {
        showToast(
          `Imported ${res.importedCount || 0} members from Excel sheet. (${res.skippedCount || 0} skipped/duplicates).`,
          'success',
          'Import Complete'
        );
      }
    } catch (err) {
      setError(err.message || 'Failed to import records from spreadsheet.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                Import Membership Registrations
              </h3>
              <p className="text-xs opacity-75 font-medium mt-0.5">
                Bulk import from Excel responses spreadsheet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Server File Import Option */}
          <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-emerald-500/5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 mb-2 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3" />
                  <span>Excel Spreadsheet Parser</span>
                </span>
                <h4 className="text-sm font-extrabold text-white">
                  ACES Membership Registration Responses (.xlsx)
                </h4>
                <p className="text-xs opacity-75 mt-1 font-medium">
                  Directly parses student responses containing Full Name, Class (SE/TE/BE), WhatsApp contact, payment date, and transaction screenshot proof.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold opacity-70">Spreadsheet File Path on Server:</label>
              <input
                type="text"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="e.g. ./data/membership_responses.xlsx or /path/to/responses.xlsx"
                className="w-full px-3 py-2 text-xs font-mono glass-input rounded-xl focus:outline-none placeholder-slate-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleImportLocalSheet}
                disabled={isImporting || !customPath.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer transition-all duration-200 disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Parsing &amp; Importing Records...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Import Records from Path</span>
                  </>
                )}
              </button>

              {onLoadSampleData && (
                <button
                  type="button"
                  onClick={() => {
                    onLoadSampleData();
                    if (showToast) {
                      showToast('Loaded sample membership spreadsheet with 8 student records.', 'success', 'Sample Sheet Loaded');
                    }
                    onClose();
                  }}
                  className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-black text-black dark:text-white flex items-center justify-center gap-1.5 cursor-pointer border border-sky-500/40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  <span>Load Sample Demo Sheet</span>
                </button>
              )}
            </div>
          </div>

          {/* Success Summary Result */}
          {result && (
            <div className="glass-card rounded-2xl p-4 border border-emerald-500/30 bg-emerald-500/10 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Import Summary</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="glass-panel p-2 rounded-xl">
                  <div className="text-lg font-black text-white">{result.totalSubmitted || 0}</div>
                  <div className="opacity-70 text-[10px]">Total Read</div>
                </div>
                <div className="glass-panel p-2 rounded-xl">
                  <div className="text-lg font-black text-emerald-400">{result.importedCount || 0}</div>
                  <div className="opacity-70 text-[10px]">Imported New</div>
                </div>
                <div className="glass-panel p-2 rounded-xl">
                  <div className="text-lg font-black text-amber-400">{result.skippedCount || 0}</div>
                  <div className="opacity-70 text-[10px]">Skipped / Duplicates</div>
                </div>
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2 opacity-80">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300">
              <Info className="w-3.5 h-3.5" />
              <span>Import Information</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] opacity-90 pl-1">
              <li>Duplicate detection uses Student Name and WhatsApp Contact Number to prevent duplicates upon re-importing.</li>
              <li>Classes will be normalized automatically (SE/SY → SE, TE → TE, BE → BE).</li>
              <li>Google Drive screenshot links are converted automatically into direct viewer thumbnails.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl btn-secondary text-xs font-bold cursor-pointer"
          >
            {result ? 'Done' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ImportMembershipModal;
