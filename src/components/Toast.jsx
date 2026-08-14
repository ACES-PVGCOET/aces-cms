import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Component
 * Multi-Theme dynamic feedback toast.
 */
export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'success', message, title } = toast;

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400" />,
    info: <Info className="w-4 h-4 text-indigo-400" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div
        className="flex items-start gap-3 p-4 rounded-2xl glass-panel shadow-2xl max-w-sm"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 btn-secondary">
          {iconMap[type] || iconMap.info}
        </div>
        <div className="flex-1 pt-0.5">
          {title && <div className="text-xs leading-4 font-extrabold">{title}</div>}
          <div className="text-xs leading-4 opacity-80 font-medium mt-0.5">{message}</div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 cursor-pointer"
          aria-label="Dismiss toast"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default Toast;
