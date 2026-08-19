import { useState } from 'react';
import { X, ExternalLink, Download, FileText, Film, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { isVideoMedia } from '../utils/mediaUtils';

/**
 * MediaPreviewModal Component
 * Interactive Lightbox modal to preview form response media files (images, videos, documents).
 */
export function MediaPreviewModal({ isOpen, onClose, mediaUrl, title = 'Media Preview' }) {
  const [copied, setCopied] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  if (!isOpen || !mediaUrl) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mediaUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVideo = isVideoMedia(mediaUrl);
  const ext = (mediaUrl.split('.').pop() || '').split('?')[0].toLowerCase();
  const isImage = !isVideo && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'].includes(ext) || mediaUrl.includes('image/upload');
  const isPdf = ext === 'pdf';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              {isVideo ? (
                <Film className="w-5 h-5" />
              ) : isImage ? (
                <ImageIcon className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white line-clamp-1">{title}</h3>
              <p className="text-xs opacity-75">Form Response Attachment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              title="Copy Media URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 opacity-80" />}
              <span className="hidden sm:inline">{copied ? 'Copied Link' : 'Copy Link'}</span>
            </button>

            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              title="Open Original in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open Original</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Preview Container */}
        <div className="flex-1 bg-slate-950/90 p-4 sm:p-6 flex items-center justify-center min-h-[350px] overflow-auto relative">
          {hasLoadError ? (
            <div className="text-center p-8 space-y-3 max-w-sm">
              <FileText className="w-12 h-12 text-indigo-400 opacity-60 mx-auto" />
              <h4 className="text-sm font-bold text-white">Preview unavailable</h4>
              <p className="text-xs opacity-70">
                This media file format could not be rendered directly inside the preview lightbox.
              </p>
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold mt-2"
              >
                <Download className="w-4 h-4" />
                <span>Download / Open File Directly</span>
              </a>
            </div>
          ) : isVideo ? (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="max-h-[65vh] w-auto max-w-full rounded-2xl shadow-lg border border-white/10"
              onError={() => setHasLoadError(true)}
            />
          ) : isPdf ? (
            <iframe
              src={mediaUrl}
              title={title}
              className="w-full h-[65vh] rounded-2xl border border-white/10 bg-white"
              onError={() => setHasLoadError(true)}
            />
          ) : isImage ? (
            <img
              src={mediaUrl}
              alt={title}
              className="max-h-[65vh] w-auto max-w-full object-contain rounded-2xl shadow-lg border border-white/10"
              onError={() => setHasLoadError(true)}
            />
          ) : (
            <div className="text-center p-8 space-y-4 max-w-md">
              <FileText className="w-16 h-16 text-indigo-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Attachment File</h4>
              <p className="text-xs opacity-75 font-mono break-all bg-black/40 p-3 rounded-xl border border-white/10">
                {mediaUrl}
              </p>
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Attachment</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between text-xs opacity-75">
          <span className="font-mono text-[11px] truncate max-w-md">{mediaUrl}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl btn-secondary text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default MediaPreviewModal;
