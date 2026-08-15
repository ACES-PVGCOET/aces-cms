import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Check, 
  Upload, 
  Trash2, 
  Link as LinkIcon, 
  Loader2,
  FolderPlus
} from 'lucide-react';
import { uploadToCloudinary } from '../services/api';

export function ShowcaseItemModal({
  isOpen,
  editingItem = null,
  initialCollection = '',
  existingCollections = [],
  onClose,
  onSubmit,
}) {
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    collection_name: '',
    type: 'image', // 'image' | 'video' | 'pdf'
    url: '',
    cover_image: '',
    description: '',
  });

  const [isCustomCollection, setIsCustomCollection] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        collection_name: editingItem.collection_name || initialCollection || '',
        type: editingItem.type || editingItem.media_type || 'image',
        url: editingItem.url || editingItem.media_url || '',
        cover_image: editingItem.cover_image || editingItem.coverImage || '',
        description: editingItem.description || editingItem.caption || '',
      });
      setIsCustomCollection(
        !existingCollections.some(
          (c) => c.collection_name.toLowerCase() === (editingItem.collection_name || '').toLowerCase()
        )
      );
    } else {
      const defaultCol = initialCollection || (existingCollections[0]?.collection_name || 'hackathon_26');
      setFormData({
        title: '',
        collection_name: defaultCol,
        type: 'image',
        url: '',
        cover_image: '',
        description: '',
      });
      setIsCustomCollection(false);
    }
    setErrors({});
  }, [editingItem, initialCollection, existingCollections, isOpen]);

  if (!isOpen) return null;

  // Primary file upload (Image, Video, or PDF)
  const handlePrimaryFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isVid = file.type.startsWith('video/');
    const isImg = file.type.startsWith('image/');

    if (!isPdf && !isVid && !isImg) {
      setErrors((prev) => ({ ...prev, url: 'Allowed file formats: Image, Video, or PDF document.' }));
      return;
    }

    if (file.size > 40 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, url: 'File size must be under 40MB.' }));
      return;
    }

    let detectedType = formData.type;
    let resourceType = 'image';
    if (isPdf) {
      detectedType = 'pdf';
      resourceType = 'raw';
    } else if (isVid) {
      detectedType = 'video';
      resourceType = 'video';
    } else if (isImg) {
      detectedType = 'image';
      resourceType = 'image';
    }

    try {
      setIsUploadingMedia(true);
      setErrors((prev) => ({ ...prev, url: '' }));
      const cdnUrl = await uploadToCloudinary(file, 'showcase', resourceType);
      setFormData((prev) => ({
        ...prev,
        url: cdnUrl,
        type: detectedType,
      }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, url: err.message || 'File upload failed' }));
    } fontFinally: {
      setIsUploadingMedia(false);
    }
  };

  // Cover image upload for PDFs or Videos
  const handleCoverFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, cover_image: 'Please select an image file for cover.' }));
      return;
    }

    try {
      setIsUploadingCover(true);
      setErrors((prev) => ({ ...prev, cover_image: '' }));
      const cdnUrl = await uploadToCloudinary(file, 'showcase_covers', 'image');
      setFormData((prev) => ({ ...prev, cover_image: cdnUrl }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, cover_image: err.message || 'Cover upload failed' }));
    } finally {
      setIsUploadingCover(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Media title is required';
    if (!formData.collection_name.trim()) errs.collection_name = 'Collection name is required';
    if (!formData.url.trim()) errs.url = 'Media URL or uploaded file is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      title: formData.title.trim(),
      collection_name: formData.collection_name.trim(),
      type: formData.type,
      media_type: formData.type,
      url: formData.url.trim(),
      media_url: formData.url.trim(),
      cover_image: formData.cover_image.trim() || formData.url.trim(),
      description: formData.description.trim(),
      caption: formData.description.trim(),
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="acrylic-dialog w-full max-w-lg rounded-2xl shadow-xl border border-rose-200/90 dark:border-slate-800 overflow-hidden relative my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-100 dark:border-slate-800 flex items-center justify-between bg-rose-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 dark:bg-indigo-950/80 dark:text-indigo-300 flex items-center justify-center font-bold">
              {formData.type === 'pdf' ? (
                <FileText className="w-4 h-4" />
              ) : formData.type === 'video' ? (
                <Video className="w-4 h-4" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950 dark:text-white">
                {editingItem ? 'Edit Showcase Media' : 'Add Showcase Media Item'}
              </h2>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Upload image, video, or PDF document into a collection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-rose-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          
          {/* Media Type Selector */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-rose-100/70 dark:bg-slate-800 border border-rose-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'image' })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                formData.type === 'image'
                  ? 'bg-white text-rose-800 shadow-xs dark:bg-indigo-600 dark:text-white font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'video' })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                formData.type === 'video'
                  ? 'bg-white text-rose-800 shadow-xs dark:bg-indigo-600 dark:text-white font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'pdf' })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                formData.type === 'pdf'
                  ? 'bg-white text-rose-800 shadow-xs dark:bg-indigo-600 dark:text-white font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Document</span>
            </button>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Item Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. HackNight 2026 Opening / Annual Magazine Vol 12"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 px-3 py-2 rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium ${
                errors.title ? 'border-rose-500 ring-1 ring-rose-400' : ''
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-600 font-bold">{errors.title}</p>}
          </div>

          {/* Collection Name */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Collection Name <span className="text-rose-600">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomCollection(!isCustomCollection)}
                className="text-[11px] font-bold text-rose-700 dark:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FolderPlus className="w-3 h-3" />
                <span>{isCustomCollection ? 'Select Existing Collection' : '+ New Collection'}</span>
              </button>
            </div>

            {isCustomCollection ? (
              <input
                type="text"
                placeholder="Enter new collection folder name (e.g. hackathon_26)"
                value={formData.collection_name}
                onChange={(e) => setFormData({ ...formData, collection_name: e.target.value })}
                className="w-full text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 px-3 py-2 rounded-xl text-slate-950 dark:text-white font-bold focus:outline-none focus:border-rose-500"
              />
            ) : (
              <select
                value={formData.collection_name}
                onChange={(e) => setFormData({ ...formData, collection_name: e.target.value })}
                className="w-full text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 px-3 py-2 rounded-xl text-slate-950 dark:text-white font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                {existingCollections.map((col) => (
                  <option key={col.collection_name} value={col.collection_name}>
                    {col.collection_name} ({col.total_items} items)
                  </option>
                ))}
                {!existingCollections.some((c) => c.collection_name === formData.collection_name) &&
                  formData.collection_name && (
                    <option value={formData.collection_name}>{formData.collection_name}</option>
                  )}
              </select>
            )}
            {errors.collection_name && (
              <p className="text-[11px] text-rose-600 font-bold">{errors.collection_name}</p>
            )}
          </div>

          {/* Primary File Upload / URL */}
          <div className="space-y-3 p-4 rounded-xl bg-rose-50/50 dark:bg-slate-900/60 border border-rose-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {formData.type === 'pdf'
                  ? 'PDF File / Document'
                  : formData.type === 'video'
                  ? 'Video File / MP4'
                  : 'Photo Image'}
              </label>
              <span className="text-[10px] font-bold text-rose-800 bg-rose-100 border border-rose-200 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded">
                Cloud Object Storage
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept={formData.type === 'pdf' ? '.pdf,application/pdf' : formData.type === 'video' ? 'video/*' : 'image/*'}
              onChange={handlePrimaryFileUpload}
              className="hidden"
            />

            {/* URL or Upload display */}
            {formData.url ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700">
                <div className="flex items-center gap-2 truncate pr-2">
                  {formData.type === 'pdf' ? (
                    <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                  ) : formData.type === 'video' ? (
                    <Video className="w-5 h-5 text-purple-600 shrink-0" />
                  ) : (
                    <img src={formData.url} alt="Thumbnail" className="w-8 h-8 rounded object-cover shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {formData.url}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, url: '' })}
                  className="p-1 rounded text-rose-600 hover:bg-rose-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            {/* Upload buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isUploadingMedia}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold btn-primary cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isUploadingMedia ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading File...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload {formData.type.toUpperCase()} File</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-100 hover:bg-rose-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-rose-200/80 cursor-pointer"
              >
                <LinkIcon className="w-3 h-3 text-slate-600" />
                <span>{showUrlInput ? 'Hide URL' : 'Paste Direct URL'}</span>
              </button>
            </div>

            {showUrlInput && (
              <input
                type="url"
                placeholder="https://... file URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 px-3 py-2 rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
              />
            )}
            {errors.url && <p className="text-[11px] text-rose-600 font-bold">{errors.url}</p>}
          </div>

          {/* Optional Cover Image (For PDF or Video) */}
          {(formData.type === 'pdf' || formData.type === 'video') && (
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Cover Image Thumbnail (Optional)
              </label>
              <input
                type="file"
                ref={coverInputRef}
                accept="image/*"
                onChange={handleCoverFileUpload}
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUploadingCover}
                  onClick={() => coverInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold btn-secondary cursor-pointer disabled:opacity-50"
                >
                  {isUploadingCover ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading Cover...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Cover Thumbnail</span>
                    </>
                  )}
                </button>
                <input
                  type="url"
                  placeholder="Or cover image URL..."
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  className="flex-1 text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
              {errors.cover_image && (
                <p className="text-[11px] text-rose-600 font-bold">{errors.cover_image}</p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Description / Details
            </label>
            <textarea
              rows={3}
              placeholder="Summary or details about this showcase item..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 px-3 py-2 rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-rose-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold btn-primary flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{editingItem ? 'Update Showcase Item' : 'Add to Collection'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default ShowcaseItemModal;
