import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  BookOpen, 
  Check, 
  Upload, 
  Trash2, 
  Link as LinkIcon, 
  FileText, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { uploadToCloudinary } from '../services/api';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
];

/**
 * MagazineModal Component
 * Multi-Theme dynamic modal for magazine uploads and metadata editing.
 */
export function MagazineModal({ isOpen, initialMagazine, onClose, onSubmit }) {
  const isEditing = Boolean(initialMagazine);
  const coverInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    edition: 'Volume 12, Issue 1',
    academicYear: '2026-27',
    coverImage: '',
    publishedDate: '',
    editor: 'Ananya Deshmukh (Editorial Lead)',
    pageCount: 64,
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    featured: false,
    description: '',
    tags: 'GenAI, Tech, Annual',
  });

  const [showCoverUrlInput, setShowCoverUrlInput] = useState(false);
  const [showPdfUrlInput, setShowPdfUrlInput] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialMagazine) {
      setFormData({
        title: initialMagazine.title || '',
        edition: initialMagazine.edition || 'Volume 12, Issue 1',
        academicYear: initialMagazine.academicYear || '2026-27',
        coverImage: initialMagazine.coverImage || '',
        publishedDate: initialMagazine.publishedDate || '',
        editor: initialMagazine.editor || '',
        pageCount: initialMagazine.pageCount || 50,
        pdfUrl: initialMagazine.pdfUrl || '',
        featured: Boolean(initialMagazine.featured),
        description: initialMagazine.description || '',
        tags: Array.isArray(initialMagazine.tags) ? initialMagazine.tags.join(', ') : '',
      });
      setPdfFileName(initialMagazine.pdfUrl ? 'Existing Document.pdf' : '');
    } else {
      setFormData({
        title: '',
        edition: 'Volume 13, Issue 1',
        academicYear: '2026-27',
        coverImage: PRESET_COVERS[0],
        publishedDate: new Date().toISOString().split('T')[0],
        editor: 'Ananya Deshmukh (Editorial Lead)',
        pageCount: 64,
        pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
        featured: false,
        description: 'Comprehensive annual technical publication highlighting breakthroughs in generative AI, system architecture, and campus projects.',
        tags: 'GenAI, Tech, Annual',
      });
      setPdfFileName('ACES-ByteCraft-2026-27.pdf');
    }
    setErrors({});
    setShowCoverUrlInput(false);
    setShowPdfUrlInput(false);
    setIsUploadingCover(false);
    setIsUploadingPdf(false);
  }, [initialMagazine, isOpen]);

  if (!isOpen) return null;

  const handleCoverFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, coverImage: 'Cover image must be under 20MB' }));
      return;
    }

    try {
      setIsUploadingCover(true);
      setErrors((prev) => ({ ...prev, coverImage: '' }));
      const cdnUrl = await uploadToCloudinary(file, 'magazines', 'image');
      setFormData((prev) => ({ ...prev, coverImage: cdnUrl }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, coverImage: err.message || 'Failed to upload cover image to Cloudinary' }));
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handlePdfFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrors((prev) => ({ ...prev, pdfUrl: 'Only .pdf files are supported' }));
      return;
    }

    if (file.size > 40 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, pdfUrl: 'PDF file must be under 40MB' }));
      return;
    }

    setPdfFileName(file.name);
    try {
      setIsUploadingPdf(true);
      setErrors((prev) => ({ ...prev, pdfUrl: '' }));
      const cdnUrl = await uploadToCloudinary(file, 'magazines', 'raw');
      setFormData((prev) => ({ ...prev, pdfUrl: cdnUrl }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, pdfUrl: err.message || 'Failed to upload PDF file to Cloudinary' }));
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Magazine title is required';
    if (!formData.edition.trim()) errs.edition = 'Volume/Edition is required';
    if (!formData.publishedDate) errs.publishedDate = 'Publication date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      pageCount: Number(formData.pageCount) || 50,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['ACES', formData.academicYear],
    };

    onSubmit(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="acrylic-dialog w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between glass-panel-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base leading-6 font-extrabold">
                {isEditing ? 'Update Publication Details' : 'Upload New Magazine Edition'}
              </h2>
              <p className="text-xs leading-4 opacity-70 font-medium">
                {isEditing ? 'Modify volume details and digital assets' : 'Publish a new edition to the ACES digital archive'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Title */}
          <div className="space-y-1">
            <label className="block text-xs leading-4 font-bold opacity-80">
              Magazine Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ACES ByteCraft Vol 12: The GenAI Frontier"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                errors.title ? 'border-rose-500 ring-1 ring-rose-500' : ''
              }`}
            />
            {errors.title && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.title}</p>}
          </div>

          {/* Edition Volume & Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Volume / Edition <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Volume 12, Issue 1"
                value={formData.edition}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                  errors.edition ? 'border-rose-500 ring-1 ring-rose-500' : ''
                }`}
              />
              {errors.edition && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.edition}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Academic Year <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg font-bold focus:outline-none cursor-pointer"
              >
                <option value="2026-27">2026-27 (Current Term)</option>
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
              </select>
            </div>
          </div>

          {/* Editor & Release Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Chief Editor / Credit
              </label>
              <input
                type="text"
                placeholder="Ananya Deshmukh (Editorial Lead)"
                value={formData.editor}
                onChange={(e) => setFormData({ ...formData, editor: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Release Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.publishedDate}
                onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg focus:outline-none font-medium ${
                  errors.publishedDate ? 'border-rose-500 ring-1 ring-rose-500' : ''
                }`}
              />
              {errors.publishedDate && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.publishedDate}</p>}
            </div>
          </div>

          {/* Cover Art */}
          <div className="space-y-3 p-4 rounded-xl glass-panel-subtle">
            <div className="flex items-center justify-between">
              <label className="block text-xs leading-4 font-bold uppercase tracking-wider opacity-80">
                Front Cover Art
              </label>
              <span className="text-[10px] font-bold btn-secondary px-2 py-0.5 rounded flex items-center gap-1">
                <ImageIcon className="w-2.5 h-2.5" />
                <span>Image File</span>
              </span>
            </div>

            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              onChange={handleCoverFileChange}
              className="hidden"
              id="magazine-cover-upload"
            />

            <div className="flex items-center gap-4">
              <div className="relative w-14 h-18 rounded-xl overflow-hidden border border-white/20 bg-black/40 shrink-0 group">
                <img
                  src={formData.coverImage || PRESET_COVERS[0]}
                  alt="Magazine cover preview"
                  className="w-full h-full object-cover"
                />
                {formData.coverImage && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: '' })}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 cursor-pointer"
                    title="Remove cover"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isUploadingCover}
                    onClick={() => coverInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs leading-4 font-bold btn-secondary cursor-pointer disabled:opacity-50"
                  >
                    {isUploadingCover ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        <span>Uploading Cover...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Cover</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCoverUrlInput(!showCoverUrlInput)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs leading-4 font-bold btn-secondary cursor-pointer"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>{showCoverUrlInput ? 'Hide URL' : 'Or URL'}</span>
                  </button>
                </div>

                <p className="text-[11px] leading-4 opacity-60 font-medium">
                  Select image file (.jpg, .png, .webp). Max 15MB.
                </p>
              </div>
            </div>

            {showCoverUrlInput && (
              <div className="pt-1">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg focus:outline-none font-medium"
                />
              </div>
            )}

            {errors.coverImage && (
              <p className="text-xs leading-4 text-rose-500 font-bold">{errors.coverImage}</p>
            )}

            {/* Presets */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-bold opacity-60">Presets:</span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {PRESET_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: preset })}
                    className={`w-9 h-11 rounded-lg overflow-hidden border shrink-0 transition-transform hover:scale-105 cursor-pointer ${
                      formData.coverImage === preset ? 'ring-2 ring-indigo-500 border-transparent' : 'border-white/20'
                    }`}
                  >
                    <img src={preset} alt={`preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PDF Document Upload */}
          <div className="space-y-3 p-4 rounded-xl glass-panel-subtle">
            <div className="flex items-center justify-between">
              <label className="block text-xs leading-4 font-bold uppercase tracking-wider opacity-80">
                Digital PDF Document
              </label>
              <span className="text-[10px] font-bold btn-secondary px-2 py-0.5 rounded flex items-center gap-1">
                <FileText className="w-2.5 h-2.5" />
                <span>PDF Document</span>
              </span>
            </div>

            <input
              type="file"
              ref={pdfInputRef}
              accept="application/pdf,.pdf"
              onChange={handlePdfFileChange}
              className="hidden"
              id="magazine-pdf-upload"
            />

            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isUploadingPdf}
                  onClick={() => pdfInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs leading-4 font-bold btn-secondary cursor-pointer disabled:opacity-50"
                >
                  {isUploadingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      <span>Uploading PDF...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload PDF File</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPdfUrlInput(!showPdfUrlInput)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs leading-4 font-bold btn-secondary cursor-pointer"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>{showPdfUrlInput ? 'Hide URL' : 'Or URL'}</span>
                </button>
              </div>

              {pdfFileName && (
                <span className="text-[11px] font-bold bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30 truncate max-w-[200px]">
                  📄 {pdfFileName}
                </span>
              )}
            </div>

            {showPdfUrlInput && (
              <div className="pt-1">
                <input
                  type="url"
                  placeholder="https://raw.githubusercontent.com/.../document.pdf"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                  className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>
            )}

            {errors.pdfUrl && (
              <p className="text-xs leading-4 text-rose-500 font-bold">{errors.pdfUrl}</p>
            )}
          </div>

          {/* Page Count & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Page Count
              </label>
              <input
                type="number"
                min="1"
                value={formData.pageCount}
                onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg focus:outline-none font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Topic Tags
              </label>
              <input
                type="text"
                placeholder="GenAI, Code, Annual"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Abstract */}
          <div className="space-y-1">
            <label className="block text-xs leading-4 font-bold opacity-80">
              Edition Abstract
            </label>
            <textarea
              rows={2}
              placeholder="Highlight articles, club spotlights, technology milestones..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-primary flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Edition'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default MagazineModal;
