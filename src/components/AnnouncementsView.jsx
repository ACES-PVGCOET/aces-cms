import { useState } from 'react';
import { 
  Megaphone, 
  Send, 
  Radio, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Check
} from 'lucide-react';

/**
 * AnnouncementsView Component
 * Multi-Theme dynamic notice board strictly adhering to semantic design tokens.
 */
export function AnnouncementsView({ 
  announcements = [], 
  onBroadcast, 
  onDeleteAnnouncement 
}) {
  const [draftTopic, setDraftTopic] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleBroadcastSim = (e) => {
    e.preventDefault();
    if (!draftTopic.trim() || !draftDescription.trim()) return;

    if (onBroadcast) {
      onBroadcast(draftTopic.trim(), draftDescription.trim());
    }

    setDraftTopic('');
    setDraftDescription('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  const handleDelete = (id, topic) => {
    if (window.confirm(`Are you sure you want to retract announcement: "${topic}"?`)) {
      if (onDeleteAnnouncement) {
        onDeleteAnnouncement(id);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-black dark:text-white">
      
      {/* 1. Header & Quick Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-black btn-primary shadow-xs text-white">
              Broadcast Suite
            </span>
            <span className="text-xs leading-4 font-black btn-secondary px-2.5 py-0.5 rounded-md text-black dark:text-white">
              {announcements.length} Notices Active
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-black tracking-tight mt-1 text-black dark:text-white">
            <span className="classic-dotted-heading">Announcements</span>
          </h1>
          <p className="text-sm leading-5 text-black dark:text-white opacity-80 font-semibold">
            Broadcast notices, alerts, and official campus communications to members.
          </p>
        </div>
      </div>

      {/* 2. Broadcast Feature Overview */}
      <div className="relative overflow-hidden rounded-2xl p-6 glass-panel shadow-sm space-y-4 text-black dark:text-white">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="w-10 h-10 rounded-xl btn-secondary flex items-center justify-center shadow-xs text-black dark:text-white">
            <Megaphone className="w-5 h-5 text-sky-600 dark:text-indigo-400" />
          </div>

          <h2 className="text-xl leading-7 sm:text-2xl sm:leading-8 font-black text-black dark:text-white">
            Campus Broadcast Engine &amp; Marketing Outreach
          </h2>

          <p className="text-sm leading-5 text-black dark:text-white opacity-80 font-semibold">
            Dispatch official notices and topic updates directly aligned with the backend REST API schema.
          </p>

          {/* Module Milestones */}
          <div className="grid grid-cols-12 gap-4 pt-2 text-black dark:text-white">
            <div className="col-span-12 sm:col-span-4 p-4 rounded-xl glass-panel-subtle space-y-1">
              <div className="text-xs leading-4 font-black text-black dark:text-white">Topic &amp; Description</div>
              <p className="text-xs leading-4 text-black dark:text-white opacity-80 font-medium">Strict validation matching Announcement API model.</p>
            </div>

            <div className="col-span-12 sm:col-span-4 p-4 rounded-xl glass-panel-subtle space-y-1">
              <div className="text-xs leading-4 font-black text-black dark:text-white">Author Attribution</div>
              <p className="text-xs leading-4 text-black dark:text-white opacity-80 font-medium">Automatic user association via created_by reference.</p>
            </div>

            <div className="col-span-12 sm:col-span-4 p-4 rounded-xl glass-panel-subtle space-y-1">
              <div className="text-xs leading-4 font-black text-black dark:text-white">Notice Deletion</div>
              <p className="text-xs leading-4 text-black dark:text-white opacity-80 font-medium">Full lifecycle deletion via REST API endpoint.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Broadcast Composer & Feed (12-Col Grid) */}
      <div className="grid grid-cols-12 gap-6 text-black dark:text-white">
        
        {/* Left 6 Cols: Composer Card */}
        <div className="col-span-12 lg:col-span-6">
          <div className="glass-card rounded-2xl p-6 shadow-sm space-y-4 text-black dark:text-white">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--panel-border)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-indigo-400" />
                <h3 className="text-sm leading-5 font-black text-black dark:text-white">New Announcement Notice</h3>
              </div>
            </div>

            <form onSubmit={handleBroadcastSim} className="space-y-4 text-black dark:text-white">
              <div className="space-y-1">
                <label className="text-xs leading-4 font-black opacity-80 text-black dark:text-white">
                  Topic / Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ACES HackNight registrations open!"
                  value={draftTopic}
                  onChange={(e) => setDraftTopic(e.target.value)}
                  className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-200 font-bold text-black dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs leading-4 font-black opacity-80 text-black dark:text-white">
                  Description / Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Write the full details of this announcement..."
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-200 font-bold text-black dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl text-sm leading-5 font-black btn-primary text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-95 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Announcement</span>
              </button>

              {broadcastSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-black dark:text-emerald-300 border border-emerald-500/40 text-xs leading-4 font-black flex items-center gap-2 animate-in fade-in justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Announcement published successfully!</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right 6 Cols: Broadcast Outbox Feed */}
        <div className="col-span-12 lg:col-span-6 text-black dark:text-white">
          <div className="glass-card rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between h-full text-black dark:text-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--panel-border)]">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-sky-600 dark:text-indigo-400" />
                  <h3 className="text-sm leading-5 font-black text-black dark:text-white">Recent Broadcast Feed</h3>
                </div>
                <span className="text-xs leading-4 opacity-80 font-black text-black dark:text-white">
                  Live Feed ({announcements.length})
                </span>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 text-black dark:text-white">
                {announcements.length > 0 ? (
                  announcements.map((item) => {
                    const itemTopic = item.topic || 'ACES Announcement';
                    const itemDesc = item.description || '';
                    const createdDate = item.created_at
                      ? new Date(item.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recent';

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl glass-panel-subtle hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative group text-black dark:text-white"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-xs leading-4 font-black truncate text-black dark:text-white">
                              {itemTopic}
                            </h4>
                          </div>

                          {/* Delete Action Button */}
                          <button
                            onClick={() => handleDelete(item.id, itemTopic)}
                            className="p-1.5 rounded-lg opacity-80 hover:opacity-100 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer text-black dark:text-white"
                            title="Delete Announcement"
                            aria-label={`Delete announcement: ${itemTopic}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs leading-4 text-black dark:text-white opacity-80 mt-1 font-medium line-clamp-3">
                          {itemDesc}
                        </p>

                        <div className="mt-2 text-[11px] leading-4 text-black dark:text-white opacity-80 font-bold flex items-center justify-between">
                          <span>Date: {createdDate}</span>
                          <span className="text-black dark:text-emerald-400 flex items-center gap-1 text-[10px] font-black">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Active
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-black dark:text-white opacity-80 text-xs font-bold">
                    No active announcements found. Create one using the composer.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AnnouncementsView;
