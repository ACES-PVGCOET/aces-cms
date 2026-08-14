import { X, Bell } from 'lucide-react';
import { RECENT_ACTIVITIES } from '../data/mockData';

/**
 * NotificationDrawer Component
 * Multi-Theme dynamic notification drawer.
 */
export function NotificationDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="acrylic-dialog w-full max-w-sm rounded-2xl shadow-2xl p-5 flex flex-col justify-between h-full max-h-[85vh] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm leading-5 font-black">Notifications</h3>
                <span className="text-[10px] opacity-60 font-bold">Real-time CMS telemetry</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Activities List */}
          <div className="space-y-2 py-3 overflow-y-auto max-h-[60vh] pr-1">
            {RECENT_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl glass-panel-subtle space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold btn-secondary">
                    {act.badge}
                  </span>
                  <span className="text-[10px] opacity-60 font-medium">{act.time}</span>
                </div>
                <p className="text-xs leading-4 font-bold">{act.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] opacity-60 font-bold">All nodes active</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs leading-4 font-bold btn-secondary cursor-pointer"
          >
            Mark all read
          </button>
        </div>

      </div>
    </div>
  );
}

export default NotificationDrawer;
