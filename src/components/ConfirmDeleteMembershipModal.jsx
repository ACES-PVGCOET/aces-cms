import { useState } from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

export function ConfirmDeleteMembershipModal({
  isOpen,
  onClose,
  registration,
  onConfirm,
  showToast,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !registration) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(registration.id);
      if (showToast) {
        showToast(
          `Membership record for ${registration.fullName || 'student'} deleted successfully.`,
          'success',
          'Record Deleted'
        );
      }
      onClose();
    } catch (err) {
      if (showToast) {
        showToast(err.message || 'Failed to delete membership record.', 'error', 'Delete Failed');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md glass-panel rounded-3xl overflow-hidden shadow-2xl border border-rose-500/30 flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-rose-500/20 bg-rose-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold shadow-md">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-black dark:text-white">
                Delete Membership Record
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                Irreversible destructive action
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-black dark:text-white">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div>
              <p className="font-bold">Are you sure you want to permanently delete this registration?</p>
              <p className="opacity-90 text-[11px] mt-1 font-medium">
                This will remove the student's verification records and digital ID card eligibility from the database.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-white/5">
              <span className="opacity-70 font-semibold">Student Name:</span>
              <span className="font-black text-black dark:text-white">{registration.fullName}</span>
            </div>
            {registration.email && (
              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-white/5">
                <span className="opacity-70 font-semibold">Email:</span>
                <span className="font-mono font-medium truncate max-w-[200px]">{registration.email}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-white/5">
              <span className="opacity-70 font-semibold">Class:</span>
              <span className="font-bold">Class {registration.className || 'SE'}</span>
            </div>
            {registration.receiptNumber && (
              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-white/5">
                <span className="opacity-70 font-semibold">Receipt Number:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{registration.receiptNumber}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-1">
              <span className="opacity-70 font-semibold">Verification Status:</span>
              <span className="font-black uppercase">{registration.status}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl btn-secondary text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-lg cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting Record...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Record</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteMembershipModal;
