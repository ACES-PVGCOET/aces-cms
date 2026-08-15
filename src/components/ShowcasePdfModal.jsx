import { useState } from 'react';
import { X, Download, FileText, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

export function ShowcasePdfModal({ isOpen, item, onClose }) {
  const [useGoogleDocsViewer, setUseGoogleDocsViewer] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !item) return null;

  const pdfUrl = item.url || item.media_url || item.pdfUrl;

  const handleDownload = async () => {
    if (!pdfUrl) return;

    try {
      setIsDownloading(true);
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanTitle = (item.title || 'document').replace(/[^a-z0-9_-]/gi, '_');
      link.download = `${cleanTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (_err) {
      // Fallback for CORS or direct link download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `${item.title || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  const iframeSrc = useGoogleDocsViewer
    ? `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`
    : pdfUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="acrylic-dialog w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl border border-rose-200/90 dark:border-slate-800 flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-rose-100 dark:border-slate-800 flex items-center justify-between bg-rose-50/80 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-indigo-950 dark:text-indigo-300">
                  PDF Publication
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {item.collection_name}
                </span>
              </div>
              <h2 className="text-base font-black text-slate-950 dark:text-white truncate max-w-md mt-0.5">
                {item.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewer Engine Toggle */}
            <button
              onClick={() => setUseGoogleDocsViewer(!useGoogleDocsViewer)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold btn-secondary cursor-pointer"
              title="Switch PDF Viewer Engine"
            >
              <RefreshCw className="w-3 h-3 text-slate-500" />
              <span>{useGoogleDocsViewer ? 'Direct View Mode' : 'Google Docs Embed Mode'}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold btn-primary shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>

            {/* External Link */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl btn-secondary text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Open raw PDF in new browser tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-rose-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Area */}
        <div className="flex-1 bg-slate-900 relative flex flex-col justify-between overflow-hidden">
          {pdfUrl ? (
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              title={item.title}
              className="w-full h-full border-none bg-slate-900"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 font-medium text-sm space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-500" />
              <p>PDF Document URL is missing or invalid.</p>
            </div>
          )}

          {/* Bottom Fallback Bar */}
          <div className="px-4 py-2 bg-slate-950/90 text-slate-300 border-t border-slate-800 flex items-center justify-between text-xs shrink-0 font-medium">
            <span className="truncate pr-2 opacity-80">
              Having trouble viewing? Switch viewer engines or download directly.
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setUseGoogleDocsViewer(!useGoogleDocsViewer)}
                className="text-rose-400 hover:underline font-bold cursor-pointer"
              >
                {useGoogleDocsViewer ? 'Use Native PDF Engine' : 'Use Google Docs Viewer'}
              </button>
              <span className="opacity-40">•</span>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline font-bold cursor-pointer flex items-center gap-1"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ShowcasePdfModal;
