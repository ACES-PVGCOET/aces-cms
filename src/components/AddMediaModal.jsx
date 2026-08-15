import { useState, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Check, 
  Upload, 
  Trash2, 
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { uploadToCloudinary } from '../services/api';
import { GALLERY_CATEGORIES } from '../hooks/useGallery';
import MediaViewer from './MediaViewer';

const AVAILABLE_CATS = GALLERY_CATEGORIES.filter((c) => c !== 'All Media');

const PRESET_THUMBNAILS = [
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
];

/**
 * AddMediaModal Component
 * Classic Modern modal in Sunset Rose Theme with high-contrast text.
 */
export function AddMediaModal({ isOpen, onClose, onSubmit }) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'image',
    category: 'Hackathons',
    src: '',
    videoUrl: '',
    duration: '1:15',
    author: 'ACES Media Guild',
    tags: 'Hackathon, SpeedCoding, ACES',
    description: '',
  });

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImg = file.type.startsWith('image/');
      const isVid = file.type.startsWith('video/');

      if (!isImg && !isVid) {
        setErrors((prev) => ({
          ...prev,
          src: 'Please select an image or video file.',
        }));
        return;
      }

      if (file.size > 25 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          src: 'File size must be under 25MB.',
        }));
        return;
      }

      const detectedType = isVid ? 'video' : 'image';
      try {
        setIsUploading(true);
        setErrors((prev) => ({ ...prev, src: '' }));
        const cdnUrl = await uploadToCloudinary(file, 'gallery', detectedType);
        setFormData((prev) => ({
          ...prev,
          src: cdnUrl,
          videoUrl: isVid ? cdnUrl : '',
          type: detectedType,
        }));
      } catch (err) {
        setErrors((prev) => ({ ...prev, src: err.message || 'Failed to upload media to Cloudinary' }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Media title is required';
    if (!formData.src.trim()) errs.src = 'Please select or upload a media file / URL';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      title: formData.title.trim(),
      author: formData.author.trim() || 'ACES Media Team',
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : ['ACES'],
      likes: 0,
      views: 1,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    onSubmit(payload);
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
              {formData.type === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950 dark:text-white">
                Add to ACES Gallery
              </h2>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Publish photography or event video motion reels
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Media Type Selector */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-rose-100/70 dark:bg-slate-800 border border-rose-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'image' })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                formData.type === 'image' ? 'bg-white text-rose-800 shadow-xs dark:bg-indigo-600 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'video' })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                formData.type === 'video' ? 'bg-white text-rose-800 shadow-xs dark:bg-indigo-600 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Motion Reel</span>
            </button>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Media Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. HackNight 2026 Opening Ceremony"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 px-3 py-2 rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium ${
                errors.title ? 'border-rose-500 ring-1 ring-rose-400' : ''
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-600 font-bold">{errors.title}</p>}
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Gallery Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 px-3 py-2 rounded-xl text-slate-950 dark:text-white font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                {AVAILABLE_CATS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Credit / Author
              </label>
              <input
                type="text"
                placeholder="Tanmay Kulkarni (Media)"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 px-3 py-2 rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
              />
            </div>
          </div>

          {/* Direct File Upload & Media Preview */}
          <div className="space-y-3 p-4 rounded-xl bg-rose-50/50 dark:bg-slate-900/60 border border-rose-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {formData.type === 'video' ? 'Video File / Poster' : 'Photo Image'}
              </label>
              <span className="text-[10px] font-bold text-rose-800 bg-rose-100 border border-rose-200 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded">
                Upload or URL
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*, video/*"
              onChange={handleMediaUpload}
              className="hidden"
            />

            {/* Preview */}
            <div className="relative rounded-xl overflow-hidden border border-rose-200 dark:border-slate-700 bg-slate-950 aspect-video max-h-36 w-full flex items-center justify-center group">
              <MediaViewer
                src={formData.src}
                alt="Media preview"
                className="w-full h-full object-cover"
                showVideoBadge={true}
              />
              {formData.src && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, src: '', videoUrl: '' })}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors z-20 cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Upload Toolbar */}
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold btn-secondary cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600 dark:text-indigo-400" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-100 hover:bg-rose-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-rose-200/80 cursor-pointer"
                >
                  <LinkIcon className="w-3 h-3 text-slate-600" />
                  <span>{showUrlInput ? 'Hide URL' : 'Or URL'}</span>
                </button>
              </div>

              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Max 25MB
              </span>
            </div>

            {showUrlInput && (
              <div className="pt-1">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://.../video.mp4"
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value, videoUrl: e.target.value })}
                  className="w-full text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 px-3 py-2 rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
            )}

            {errors.src && (
              <p className="text-[11px] text-rose-600 font-bold">{errors.src}</p>
            )}

            {/* Presets */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-rose-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Presets:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {PRESET_THUMBNAILS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, src: preset })}
                    className="w-10 h-7 rounded-lg overflow-hidden border border-rose-200 dark:border-slate-700 shrink-0 hover:scale-105 transition-transform cursor-pointer"
                  >
                    <img src={preset} alt={`preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Description / Caption
            </label>
            <textarea
              rows={2}
              placeholder="Behind the scenes notes or highlight description..."
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
              className="px-4 py-2 rounded-xl text-xs font-bold btn-primary flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Add Media to Gallery</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AddMediaModal;
