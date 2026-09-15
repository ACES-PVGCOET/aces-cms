import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

export function ConfirmVerifyModal({
  isOpen,
  onClose,
  registration,
  onConfirm,
  showToast,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (registration) {
      setIsProcessing(false);
      setErrorMsg(null);
    }
  }, [registration, isOpen]);

  if (!isOpen || !registration) return null;

  const handleVerify = async () => {
    if (isProcessing) return;
    setErrorMsg(null);
    try {
      setIsProcessing(true);
      await onConfirm(registration.id, {
        status: 'VERIFIED',
        remarks: registration.remarks || '',
        amount: registration.amount || 450,
      });
      if (showToast) {
        showToast(
          `Fee for ${registration.fullName} verified successfully!`,
          'success',
          'Fee Verified'
        );
      }
      onClose();
    } catch (err) {
      const msg = err.message || 'Failed to verify member fee.';
      setErrorMsg(msg);
      if (showToast) {
        showToast(msg, 'error', 'Verification Failed');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (!isProcessing) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col my-auto transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated In-Process Top Bar */}
        {isProcessing && (
          <div className="h-1 w-full bg-emerald-950/40 overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400 animate-pulse w-full" />
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Verify Member Fee?
              </h3>
              <p className="text-xs opacity-70 mt-0.5">
                {registration.fullName} • Class {registration.className}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-5 py-3 space-y-3.5 text-xs">
          {/* Main confirmation text */}
          <p className="opacity-85 text-xs leading-relaxed">
            Are you sure you want to verify the fee payment of{' '}
            <strong className="text-emerald-400 font-bold">
              ₹{registration.amount || 450}
            </strong>{' '}
            for <strong className="text-white font-bold">{registration.fullName}</strong>?
          </p>

          {/* What will happen next */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
              What will happen next:
            </span>
            <ul className="space-y-1.5 text-[11px] opacity-80 list-disc pl-4 leading-relaxed">
              <li>Status will be marked as <span className="text-verified-black font-semibold">VERIFIED</span>.</li>
              <li>An official ACES receipt number will be generated.</li>
              <li>Receipt confirmation email will be dispatched to the student.</li>
            </ul>
          </div>

          {/* Error Message */}
          {errorMsg && !isProcessing && (
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center gap-2 text-rose-700 dark:text-white text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-white" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* In-Process message */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-emerald-400 text-xs py-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying and generating receipt...</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 px-5 border-t border-white/10 bg-white/5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl btn-secondary text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleVerify}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmVerifyModal;
