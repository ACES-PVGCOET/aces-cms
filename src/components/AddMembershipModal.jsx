import { useState, useRef } from 'react';
import { 
  UserPlus, 
  X, 
  UploadCloud, 
  Loader2, 
  CreditCard, 
  Phone, 
  Calendar, 
  FileText,
  Sparkles
} from 'lucide-react';
import { uploadToCloudinary } from '../services/api';

const CLASSES = ['SE', 'TE', 'BE'];
const PAYMENT_MODES = ['UPI', 'Cash', 'Other'];

export function AddMembershipModal({ isOpen, onClose, onAddMember, showToast }) {
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('SE');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [paymentDate, setPaymentDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('en-GB');
  });
  const [amount, setAmount] = useState(450);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [remarks, setRemarks] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Selected image must be under 10MB.');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      const cdnUrl = await uploadToCloudinary(file, 'membership_receipts', 'image');
      setScreenshotUrl(cdnUrl);
    } catch (err) {
      setError(err.message || 'Failed to upload screenshot to Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Student full name is required.');
      return;
    }
    if (!contactNumber.trim()) {
      setError('Contact / WhatsApp number is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onAddMember({
        full_name: fullName.trim(),
        class_name: className,
        contact_number: contactNumber.trim(),
        email: email.trim(),
        payment_mode: paymentMode,
        payment_date: paymentDate.trim(),
        amount: Number(amount) || 450,
        transaction_ss_url: screenshotUrl.trim(),
        remarks: remarks.trim(),
        source: 'manual_cms',
      });

      if (showToast) {
        showToast(`Registered member ${fullName} successfully.`, 'success', 'Member Registered');
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                Register Student Member
              </h3>
              <p className="text-xs opacity-75 font-medium mt-0.5">
                Add membership registration & fee payment record
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold opacity-80">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Prathamesh Mete"
              className="w-full px-3 py-2 text-sm glass-input rounded-xl focus:outline-none font-medium placeholder-slate-400"
            />
          </div>

          {/* Class & Contact Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold opacity-80">Class *</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2 text-sm glass-input rounded-xl focus:outline-none font-bold cursor-pointer"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold opacity-80 flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>WhatsApp Contact *</span>
              </label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2 text-sm glass-input rounded-xl focus:outline-none font-mono font-medium placeholder-slate-400"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold opacity-80">Email Address (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@college.edu"
              className="w-full px-3 py-2 text-sm glass-input rounded-xl focus:outline-none font-medium placeholder-slate-400"
            />
          </div>

          {/* Payment Mode, Date & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold opacity-80 flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-purple-400" />
                <span>Payment Mode</span>
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 text-sm glass-input rounded-xl focus:outline-none font-bold cursor-pointer"
              >
                {PAYMENT_MODES.map((mode) => (
                  <option key={mode} value={mode} className="bg-slate-900 text-white">
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold opacity-80 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-400" />
                <span>Date</span>
              </label>
              <input
                type="text"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                placeholder="e.g. 14/08/2026"
                className="w-full px-3 py-2 text-sm glass-input rounded-xl focus:outline-none font-medium placeholder-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold opacity-80">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm glass-input rounded-xl focus:outline-none font-bold text-right"
              />
            </div>
          </div>

          {/* Screenshot Proof URL or File Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold opacity-80 flex items-center justify-between">
              <span>Transaction Screenshot / Receipt Proof</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-indigo-400 hover:text-indigo-300 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Uploading...' : 'Upload Image File'}</span>
              </button>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <input
              type="text"
              value={screenshotUrl}
              onChange={(e) => setScreenshotUrl(e.target.value)}
              placeholder="Paste Google Drive link or image URL (or click Upload above)..."
              className="w-full px-3 py-2 text-xs glass-input rounded-xl focus:outline-none font-mono placeholder-slate-400"
            />
            {screenshotUrl && (
              <p className="text-[11px] text-emerald-400 font-medium">
                Proof link attached: {screenshotUrl.slice(0, 50)}...
              </p>
            )}
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold opacity-80">Remarks / Notes</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional notes..."
              className="w-full px-3 py-2 text-xs glass-input rounded-xl focus:outline-none resize-none font-medium placeholder-slate-400"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl btn-secondary text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold btn-primary text-white shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Registration</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AddMembershipModal;
