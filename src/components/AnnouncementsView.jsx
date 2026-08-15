import { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Radio,
  Trash2,
  Check
} from 'lucide-react';

/**
 * AnnouncementsView Component
 * Multi-Theme dynamic notice broadcast engine and feed.
 * Adheres strictly to 4px/8px Baseline Grid & Vertical Rhythm and 12-column CSS Grid.
 */
export function AnnouncementsView({ announcements = [], onBroadcast, onDeleteAnnouncement }) {
  const [draftTopic, setDraftTopic] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleBroadcastSim = (e) => {
    e.preventDefault();
    if (!draftTopic.trim() || !draftDescription.trim()) return;

    if (onBroadcast) {
      onBroadcast({
        topic: draftTopic.trim(),
        description: draftDescription.trim(),
      });
    }

    setDraftTopic('');
    setDraftDescription('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  const handleDelete = (id, topic) => {
    if (onDeleteAnnouncement) {
      onDeleteAnnouncement(id, topic);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-primary shadow-xs">
              Broadcast Suite
            </span>
            <span className="text-xs leading-4 font-bold btn-secondary px-2.5 py-0.5 rounded-md">
              {announcements.length} Notices Active
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-extrabold tracking-tight mt-1">
            Announcements
          </h1>
          <p className="text-sm leading-5 opacity-70 font-medium">
            Broadcast notices, alerts, and official campus communications to members.
          </p>
        </div>
      </div>

      {/* 2. Broadcast Feature Overview (12-Col Grid) */}
      <div className="relative overflow-hidden rounded-2xl p-6 glass-panel shadow-sm space-y-4">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="w-10 h-10 rounded-xl btn-secondary flex items-center justify-center">
            <Megaphone className="w-5 h-5 opacity-80" />
          </div>

          <h2 className="text-xl leading-7 sm:text-2xl sm:leading-8 font-extrabold">
            Campus Broadcast Engine & Automated Feeds
          </h2>

          <p className="text-sm leading-5 opacity-80 font-medium">
            Dispatch official notices and topic updates directly aligned with the backend REST API schema.
          </p>

          {/* Module Milestones */}
          <div className="grid grid-cols-12 gap-4 pt-2">
            <div className="col-span-12 sm:col-span-4 p-4 rounded-xl glass-panel-subtle space-y-1">
              <div className="text-xs leading-4 font-extrabold">Topic & Description</div>
              <p className="text-xs leading-4 opacity-70 font-medium">Strict validation matching Announcement API model.</p>
            </div>

            <div className="col-span-12 sm:col-span-4 p-4 rounded-xl glass-panel-subtle space-y-1">
              <div className="text-xs leading-4 font-extrabold">Author Attribution</div>
              <p className="text-xs leading-4 opacity-70 font-medium">Automatic user association via created_by reference.</p>
            </div>

            <div className="col-span-12 sm:col-span-4 p-4 rounded-xl glass-panel-subtle space-y-1">
              <div className="text-xs leading-4 font-extrabold">Notice Deletion</div>
              <p className="text-xs leading-4 opacity-70 font-medium">Full lifecycle deletion via REST API endpoint.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Broadcast Composer & Feed (12-Col Grid) */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Composer Card */}
        <div className="col-span-12 lg:col-span-6">
          <div className="glass-card rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 opacity-80" />
                <h3 className="text-sm leading-5 font-bold">New Announcement Notice</h3>
              </div>
            </div>

            <form onSubmit={handleBroadcastSim} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs leading-4 font-bold opacity-80">
                  Topic / Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ACES HackNight registrations open!"
                  value={draftTopic}
                  onChange={(e) => setDraftTopic(e.target.value)}
                  className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none transition-all duration-300 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs leading-4 font-bold opacity-80">
                  Description / Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Write the full details of this announcement..."
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none transition-all duration-300 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg text-sm leading-5 font-medium btn-primary flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Announcement</span>
              </button>

              {broadcastSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs leading-4 font-bold flex items-center gap-2 animate-in fade-in justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Announcement published successfully!</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right 6 Cols: Broadcast Outbox Feed */}
        <div className="col-span-12 lg:col-span-6">
          <div className="glass-card rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 opacity-80" />
                  <h3 className="text-sm leading-5 font-bold">Recent Broadcast Feed</h3>
                </div>
                <span className="text-xs leading-4 opacity-70 font-semibold">
                  Live Feed ({announcements.length})
                </span>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
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
                        className="p-3.5 rounded-xl glass-panel-subtle hover:bg-white/5 transition-colors relative group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-xs leading-4 font-extrabold truncate">
                              {itemTopic}
                            </h4>
                          </div>

                          {/* Delete Action Button */}
                          <button
                            onClick={() => handleDelete(item.id, itemTopic)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                            title="Delete Announcement"
                            aria-label={`Delete announcement: ${itemTopic}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs leading-4 opacity-80 mt-1 font-medium line-clamp-3">
                          {itemDesc}
                        </p>

                        <div className="mt-2 text-[11px] leading-4 opacity-60 font-semibold flex items-center justify-between">
                          <span>Date: {createdDate}</span>
                          <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center opacity-60 text-xs font-medium">
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

