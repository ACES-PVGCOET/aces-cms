import { 
  X, 
  Edit3, 
  Mail, 
  Calendar, 
  Sparkles 
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon, GithubIcon } from './SocialIcons';

/**
 * MemberDetailModal Component
 * Multi-Theme dynamic member detail modal.
 */
export function MemberDetailModal({ member, isOpen, onClose, onEdit }) {
  if (!isOpen || !member) return null;

  const {
    name,
    role,
    email,
    team,
    avatar,
    socials = {},
    joinedDate,
    bio,
    skills = [],
  } = member;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-detail-title"
    >
      <div className="acrylic-dialog w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 relative btn-primary text-white">
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold bg-white/20 text-white">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ACES Guild Profile</span>
            </span>

            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Identity */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`}
                alt={name}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/90 shadow-md bg-black/20"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
                }}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-black/40" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="member-detail-title" className="text-xl leading-7 font-black text-white tracking-tight truncate max-w-full">
                  {name}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-white/25 text-white">
                  {team}
                </span>
              </div>
              <p className="text-xs leading-4 sm:text-sm sm:leading-5 text-white/90 font-bold">
                {role}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Bio Box */}
          <div className="p-4 rounded-xl glass-panel-subtle text-xs leading-4 sm:text-sm sm:leading-5 opacity-90 font-medium">
            {bio || 'ACES Engineering Club active contributor and technology enthusiast.'}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-4">
            <div className="p-3 rounded-xl glass-panel-subtle space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] opacity-60 font-bold uppercase tracking-wider">
                <Mail className="w-3 h-3 opacity-80" />
                <span>Email Contact</span>
              </div>
              <div className="font-extrabold truncate" title={email}>
                {email}
              </div>
            </div>

            <div className="p-3 rounded-xl glass-panel-subtle space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] opacity-60 font-bold uppercase tracking-wider">
                <Calendar className="w-3 h-3 opacity-80" />
                <span>Member Since</span>
              </div>
              <div className="font-extrabold">
                {joinedDate || '2024'}
              </div>
            </div>
          </div>

          {/* Technical Proficiencies */}
          {skills && skills.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold opacity-70 uppercase tracking-wider">
                Technical Proficiencies
              </span>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-secondary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links & Action Bar */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {socials.linkedin && (
                <a
                  href={socials.linkedin.startsWith('http') ? socials.linkedin : `https://linkedin.com/in/${socials.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg btn-secondary flex items-center justify-center hover:text-blue-500 transition-colors cursor-pointer"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram.startsWith('http') ? socials.instagram : `https://instagram.com/${socials.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg btn-secondary flex items-center justify-center hover:text-pink-500 transition-colors cursor-pointer"
                  title="Instagram Profile"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {socials.github && (
                <a
                  href={socials.github.startsWith('http') ? socials.github : `https://github.com/${socials.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg btn-secondary flex items-center justify-center hover:opacity-100 transition-colors cursor-pointer"
                  title="GitHub Profile"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <button
              onClick={() => {
                onClose();
                onEdit(member);
              }}
              className="px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-primary flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Member</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default MemberDetailModal;
