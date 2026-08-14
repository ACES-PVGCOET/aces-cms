import { 
  X, 
  Download, 
  ExternalLink, 
  BookOpen, 
  FileText 
} from 'lucide-react';

/**
 * MagazinePdfModal Component
 * Multi-Theme dynamic PDF viewer modal.
 */
export function MagazinePdfModal({ magazine, isOpen, onClose, onDownload }) {
  if (!isOpen || !magazine) return null;

  const {
    id,
    title,
    edition,
    academicYear,
    coverImage,
    publishedDate,
    editor,
    pageCount,
    downloadsCount = 0,
    readsCount = 0,
    pdfUrl,
    description,
    tags = [],
  } = magazine;

  const handleDownload = () => {
    if (onDownload) onDownload(id);
    window.open(pdfUrl || 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf', '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="acrylic-dialog w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[85vh]">
        
        {/* Left: Cover */}
        <div className="md:w-5/12 bg-black/40 relative flex items-center justify-center overflow-hidden min-h-[260px] md:min-h-[460px]">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-primary shadow-sm">
              {academicYear}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-secondary">
              {pageCount} Pages
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="text-xs leading-4 opacity-80 font-bold uppercase tracking-wider">
              {edition}
            </div>
            <h2 className="text-lg leading-7 font-black mt-1">
              {title}
            </h2>
          </div>
        </div>

        {/* Right: Content & Actions */}
        <div className="md:w-7/12 p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
          
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs leading-4 font-extrabold">Official ACES Publication</span>
                  <p className="text-[10px] opacity-60 font-bold">{academicYear} Academic Cycle</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-lg leading-7 font-black">
                {title}
              </h3>
              <p className="text-xs leading-4 sm:text-sm sm:leading-5 opacity-80 mt-1 font-medium">
                {description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs leading-4 glass-panel-subtle p-3 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-[10px] opacity-60 font-bold uppercase block">Chief Editor</span>
                <span className="font-extrabold truncate block">{editor}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] opacity-60 font-bold uppercase block">Release Date</span>
                <span className="font-extrabold block">{publishedDate}</span>
              </div>
              <div className="space-y-0.5 pt-2 border-t border-white/10">
                <span className="text-[10px] opacity-60 font-bold uppercase block">Total Readers</span>
                <span className="font-extrabold block">{readsCount.toLocaleString()} Reads</span>
              </div>
              <div className="space-y-0.5 pt-2 border-t border-white/10">
                <span className="text-[10px] opacity-60 font-bold uppercase block">Downloads</span>
                <span className="font-extrabold block">{downloadsCount.toLocaleString()} Downloads</span>
              </div>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold opacity-70 uppercase tracking-wider block">
                  Edition Topics
                </span>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded text-[10px] font-bold btn-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Embedded PDF Info */}
            <div className="p-3 rounded-xl glass-panel-subtle space-y-1 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs leading-4 font-bold">{title}.pdf</div>
                  <div className="text-[10px] opacity-60 font-medium">Digital Archive Vector PDF</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold btn-secondary">
                CDN Cached
              </span>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-2 px-4 rounded-lg text-sm leading-5 font-medium btn-primary flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download & Open PDF</span>
            </button>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg btn-secondary transition-colors cursor-pointer"
              title="Open document in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

export default MagazinePdfModal;
