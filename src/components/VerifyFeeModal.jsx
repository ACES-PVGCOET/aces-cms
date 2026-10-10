import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Receipt, 
  Send, 
  AlertCircle, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  Phone, 
  Loader2 
} from 'lucide-react';
import ConfirmVerifyModal from './ConfirmVerifyModal';

function getDriveFileId(url) {
  if (!url) return '';
  const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : '';
}

function getDriveViewUrl(url) {
  const fileId = getDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }
  return url;
}

function getDrivePreviewUrl(url) {
  const fileId = getDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
}

export function VerifyFeeModal({
  isOpen,
  onClose,
  registration,
  onVerify,
  onOpenMediaLightbox,
  showToast,
}) {
  const [remarks, setRemarks] = useState('');
  const [customAmount, setCustomAmount] = useState(450);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedContact, setCopiedContact] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);

  useEffect(() => {
    if (registration) {
      setRemarks(registration.remarks || '');
      setCustomAmount(registration.amount || 450);
      setImageError(false);
      setShowConfirmPrompt(false);
    }
  }, [registration]);

  if (!isOpen || !registration) return null;

  const handleCopyContact = () => {
    navigator.clipboard.writeText(registration.contactNumber);
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2000);
  };

  const handleAction = async (targetStatus, overridePayload = null) => {
    const finalRemarks = overridePayload && overridePayload.remarks !== undefined ? overridePayload.remarks : remarks.trim();
    const finalAmount = overridePayload && overridePayload.amount !== undefined ? overridePayload.amount : customAmount;

    if (targetStatus === 'REJECTED' && !finalRemarks) {
      if (showToast) showToast('Please provide a reason/remark for rejection.', 'error', 'Remark Required');
      return;
    }

    try {
      setIsSubmitting(true);
      await onVerify(registration.id, {
        status: targetStatus,
        remarks: finalRemarks,
        amount: finalAmount,
      });
      if (showToast) {
        showToast(
          `Registration for ${registration.fullName} marked as ${targetStatus}.`,
          targetStatus === 'VERIFIED' ? 'success' : 'info',
          `Fee ${targetStatus}`
        );
      }
      onClose();
    } catch (err) {
      if (showToast) {
        showToast(err.message || 'Failed to update verification status.', 'error', 'Action Failed');
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const driveFileId = getDriveFileId(registration.transactionSsUrl);
  const isDriveUrl = Boolean(driveFileId || (registration.transactionSsUrl && registration.transactionSsUrl.includes('drive.google.com')));
  const driveViewUrl = getDriveViewUrl(registration.transactionSsUrl);
  const drivePreviewUrl = getDrivePreviewUrl(registration.transactionSsUrl);
  const isVerified = registration.status === 'VERIFIED';
  const isRejected = registration.status === 'REJECTED';
  const isPending = registration.status === 'PENDING';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col my-auto max-h-[92vh]">
        {/* Animated In-Process Top Bar */}
        {isSubmitting && (
          <div className="h-1.5 w-full bg-emerald-950 overflow-hidden relative shrink-0">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400 animate-pulse w-full" />
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-md ${
              isVerified 
                ? 'bg-emerald-500/20 text-verified-black border border-emerald-500/40'
                : isRejected
                ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/40'
                : 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/40'
            }`}>
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                  {registration.fullName}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold btn-secondary">
                  Class: {registration.className}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                  isVerified
                    ? 'bg-emerald-500/20 text-verified-black border border-emerald-500/30'
                    : isRejected
                    ? 'bg-rose-500/20 text-rose-700 dark:text-white border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-700 dark:text-white border border-amber-500/30'
                }`}>
                  {registration.status}
                </span>
              </div>
              <p className="text-xs opacity-75 font-medium mt-0.5">
                ACES Membership 2026-27 Registration Review
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

        {/* Modal Body - 2 Columns */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Details & Verification Controls */}
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Student & Payment Profile</span>
                </h4>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="opacity-70 text-xs font-semibold">Full Name:</span>
                    <span className="font-bold">{registration.fullName}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="opacity-70 text-xs font-semibold">Class:</span>
                    <span className="font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs">
                      {registration.className}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="opacity-70 text-xs font-semibold">WhatsApp Contact:</span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/91${registration.contactNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 font-mono font-bold hover:underline inline-flex items-center gap-1 text-xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>+91 {registration.contactNumber}</span>
                      </a>
                      <button
                        onClick={handleCopyContact}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-xs opacity-70 hover:opacity-100"
                        title="Copy contact number"
                      >
                        {copiedContact ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {registration.email && (
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="opacity-70 text-xs font-semibold">Email:</span>
                      <span className="font-medium text-xs truncate max-w-[200px]">{registration.email}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="opacity-70 text-xs font-semibold">Payment Mode:</span>
                    <span className="font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs uppercase">
                      {registration.paymentMode}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="opacity-70 text-xs font-semibold">Payment Date:</span>
                    <span className="font-medium text-xs">{registration.paymentDate || 'Not specified'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="opacity-70 text-xs font-semibold">Fee Amount:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs opacity-60">₹</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(Number(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-xs font-bold glass-input rounded text-right focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Info if already verified/rejected */}
              {(isVerified || isRejected) && (
                <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold opacity-80">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Audit Log</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    {registration.verifiedBy && (
                      <p><span className="opacity-60">Audited By:</span> <strong>{registration.verifiedBy}</strong></p>
                    )}
                    {registration.verifiedAt && (
                      <p><span className="opacity-60">Audit Timestamp:</span> {new Date(registration.verifiedAt).toLocaleString()}</p>
                    )}
                    {registration.receiptNumber && (
                      <p><span className="opacity-60">Receipt Number:</span> <strong className="font-mono text-emerald-400">{registration.receiptNumber}</strong></p>
                    )}
                  </div>
                </div>
              )}

              {/* Remarks / Rejection Reason Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold opacity-80 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 opacity-70" />
                  <span>Auditor Remarks / Rejection Note</span>
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional audit notes or reason for rejection (required if rejecting)..."
                  className="w-full px-3 py-2 text-xs glass-input rounded-xl focus:outline-none resize-none font-medium placeholder-slate-400"
                />
              </div>

              {/* Receipt Sending Placeholder (User scope: receipt & email by others) */}
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                    <Send className="w-3.5 h-3.5" />
                    <span>Receipt Dispatch Integration</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                    {isVerified ? 'Ready for Mailer' : 'Awaiting Verification'}
                  </span>
                </div>
                <p className="text-[11px] opacity-75 leading-relaxed">
                  Automated PDF receipt generation & email dispatch is handled by the mailer worker once payment is marked verified.
                </p>
              </div>
            </div>

            {/* Column 2: Screenshot Proof Inspection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Transaction Screenshot / Receipt Proof</span>
                </h4>
                {registration.transactionSsUrl && (
                  <a
                    href={driveViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open Drive File</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="glass-card rounded-2xl p-2 border border-white/10 flex flex-col items-center justify-center min-h-[320px] bg-black/40 overflow-hidden relative group">
                {registration.transactionSsUrl ? (
                  isDriveUrl ? (
                    <div className="w-full flex flex-col items-center justify-center space-y-2">
                      <iframe
                        src={drivePreviewUrl}
                        title={`${registration.fullName} Payment Proof`}
                        className="w-full h-[320px] rounded-xl border border-white/10 bg-slate-900"
                        allow="autoplay"
                      />
                      <div className="flex items-center justify-between w-full px-1 pt-1">
                        <button
                          type="button"
                          onClick={() => onOpenMediaLightbox && onOpenMediaLightbox(registration.transactionSsUrl, `${registration.fullName} - Payment Proof`)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-bold text-indigo-300 border border-white/10 cursor-pointer flex items-center gap-1"
                        >
                          <span>Enlarge Lightbox</span>
                        </button>
                        <a
                          href={driveViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open in Google Drive</span>
                        </a>
                      </div>
                    </div>
                  ) : imageError ? (
                    <div className="text-center p-6 space-y-3">
                      <FileText className="w-12 h-12 text-indigo-400 mx-auto opacity-70" />
                      <p className="text-xs font-bold">Screenshot preview unavailable</p>
                      <a
                        href={registration.transactionSsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Proof in New Tab</span>
                      </a>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={registration.transactionSsUrl}
                        alt="UPI Transaction Screenshot"
                        className="max-h-[350px] w-auto object-contain rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-[1.02] cursor-pointer"
                        onError={() => setImageError(true)}
                        onClick={() => onOpenMediaLightbox && onOpenMediaLightbox(registration.transactionSsUrl, `${registration.fullName} - Payment Proof`)}
                      />
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => onOpenMediaLightbox && onOpenMediaLightbox(registration.transactionSsUrl, `${registration.fullName} - Payment Proof`)}
                          className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-[11px] font-bold text-white border border-white/20 hover:bg-black/90 cursor-pointer"
                        >
                          Enlarge Lightbox
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center p-8 space-y-2 opacity-60">
                    <AlertCircle className="w-10 h-10 mx-auto" />
                    <p className="text-xs font-semibold">No payment screenshot attached</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isPending && (
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('PENDING')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold btn-secondary text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 cursor-pointer transition-colors"
              >
                Reset to Pending
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 rounded-xl btn-secondary text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              disabled={isSubmitting}
              onClick={() => handleAction('REJECTED')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Payment</span>
            </button>

            <button
              disabled={isSubmitting}
              onClick={() => setShowConfirmPrompt(true)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Approve</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Customized Confirmation Prompt Modal */}
      {showConfirmPrompt && (
        <ConfirmVerifyModal
          isOpen={showConfirmPrompt}
          onClose={() => setShowConfirmPrompt(false)}
          registration={{
            ...registration,
            amount: customAmount,
            remarks: remarks,
          }}
          onConfirm={async (id, payload) => {
            await handleAction('VERIFIED', payload);
            setShowConfirmPrompt(false);
          }}
          onOpenMediaLightbox={onOpenMediaLightbox}
          showToast={showToast}
        />
      )}
    </div>
  );
}

export default VerifyFeeModal;
