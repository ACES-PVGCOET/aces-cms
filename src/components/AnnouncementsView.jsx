import { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Lock, 
  Radio 
} from 'lucide-react';

/**
 * AnnouncementsView Component
 * Multi-Theme dynamic broadcast simulator and feed.
 * Adheres strictly to 4px/8px Baseline Grid & Vertical Rhythm and 12-column CSS Grid.
 */
export function AnnouncementsView({ announcements = [], onBroadcast }) {
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSummary, setDraftSummary] = useState('');
  const [draftCategory, setDraftCategory] = useState('General');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleBroadcastSim = (e) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;

    if (onBroadcast) {
      onBroadcast({
        title: draftTitle,
        category: draftCategory,
        summary: draftSummary || 'Marketing announcement update.',
        targetAudience: 'All Members',
      });
    }

    setDraftTitle('');
    setDraftSummary('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header & Roadmap Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-primary shadow-xs">
              Broadcast Suite
            </span>
            <span className="text-xs leading-4 font-bold btn-secondary px-2.5 py-0.5 rounded-md">
              Feature Sprint v2.6
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-extrabold tracking-tight mt-1">
            Announcements
          </h1>
          <p className="text-sm leading-5 opacity-70 font-medium">
            Placeholder section – functionality coming soon
          </p>
        </div>

        {/* Lock Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg btn-secondary self-start sm:self-auto">
          <Lock className="w-4 h-4 text-amber-500" />
          <span className="text-xs leading-4 font-bold">Under Active Sprint</span>
        </div>
      </div>

      {/* 2. Roadmap Hero Preview (12-Col Grid) */}
      <div className="relative overflow-hidden rounded-2xl p-6 glass-panel shadow-sm space-y-4">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="w-10 h-10 rounded-xl btn-secondary flex items-center justify-center">
            <Megaphone className="w-5 h-5 opacity-80" />
          </div>

          <h2 className="text-xl leading-7 sm:text-2xl sm:leading-8 font-extrabold">
            Marketing Automation & Campus Feed Engine
          </h2>

          <p className="text-sm leading-5 opacity-80 font-medium">
            The marketing guild is currently engineering automated broadcasts across Instagram stories, Discord webhooks, WhatsApp community channels, and campus digital displays.
          </p>

          {/* Module Roadmap Milestones in 12-Col Grid */}
          <div className="grid grid-cols-12 gap-4 pt-2">
            <div className="col-span-12 sm:col-span-4 p-4 rounded-xl glass-panel-subtle space-y-1">
              <div className="text-[10px] leading-4 font-bold text-rose-400 uppercase tracking-wider">Phase 1 • Q3</div>
              <div className="text-xs leading-4 font-extrabold">Discord Webhooks</div>
              <p className="text-xs leading-4 opacity-70 font-medium">Live sync to 1,200+ campus engineers.</p>
            </div>

            <div className="col-span-12 sm:col-span-4 p-4 rounded-xl glass-panel-subtle space-y-1">
              <div className="text-[10px] leading-4 font-bold text-cyan-400 uppercase tracking-wider">Phase 2 • Q4</div>
              <div className="text-xs leading-4 font-extrabold">Newsletter Engine</div>
              <p className="text-xs leading-4 opacity-70 font-medium">Rich HTML digests with RSVP tokens.</p>
            </div>

            <div className="col-span-12 sm:col-span-4 p-4 rounded-xl glass-panel-subtle space-y-1">
              <div className="text-[10px] leading-4 font-bold text-amber-400 uppercase tracking-wider">Phase 3 • Q1</div>
              <div className="text-xs leading-4 font-extrabold">Push Notifications</div>
              <p className="text-xs leading-4 opacity-70 font-medium">Real-time mobile companion push.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Simulator: Interactive Broadcast Composer & Feed (12-Col Grid) */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Composer Card */}
        <div className="col-span-12 lg:col-span-6">
          <div className="glass-card rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 opacity-80" />
                <h3 className="text-sm leading-5 font-bold">Broadcast Simulator</h3>
              </div>
              <span className="text-xs leading-4 font-bold btn-secondary px-2 py-0.5 rounded-md">
                Preview Mode
              </span>
            </div>

            <form onSubmit={handleBroadcastSim} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs leading-4 font-bold opacity-80">
                  Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ACES HackNight registrations open!"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none transition-all duration-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs leading-4 font-bold opacity-80">Category</label>
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value)}
                    className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Event">Event Alert</option>
                    <option value="Technical">Technical Notice</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs leading-4 font-bold opacity-80">Audience</label>
                  <input
                    type="text"
                    disabled
                    value="All Members (Public)"
                    className="w-full text-sm leading-5 glass-panel-subtle px-3 py-2 rounded-lg opacity-60 cursor-not-allowed font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs leading-4 font-bold opacity-80">Summary / Brief</label>
                <textarea
                  rows={3}
                  placeholder="Write a brief announcement summary..."
                  value={draftSummary}
                  onChange={(e) => setDraftSummary(e.target.value)}
                  className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none transition-all duration-300 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg text-sm leading-5 font-medium btn-primary flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Simulate Cloud Broadcast</span>
              </button>

              {broadcastSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs leading-4 font-bold flex items-center gap-2 animate-in fade-in justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Simulated announcement queued to public feeds!</span>
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
                  Simulated Channel
                </span>
              </div>

              <div className="space-y-2">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl glass-panel-subtle hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs leading-4 font-extrabold truncate">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold btn-secondary shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs leading-4 opacity-80 mt-1 font-medium">
                      {item.summary}
                    </p>
                    <div className="mt-2 text-[11px] leading-4 opacity-60 font-semibold">
                      {item.date} • Sent by {item.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs leading-4 opacity-70">
              <span>Automated Sync: <strong className="font-bold">Enabled</strong></span>
              <span>Target: <strong className="font-bold">Campus Cluster</strong></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AnnouncementsView;
