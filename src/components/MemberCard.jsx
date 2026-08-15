import { 
  Mail, 
  Edit3, 
  Trash2, 
  Eye
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon, GithubIcon } from './SocialIcons';

/**
 * MemberCard Component
 * Multi-Theme dynamic member directory card.
 * Adheres strictly to 4px/8px Baseline Grid & Vertical Rhythm.
 */
export function MemberCard({ member, onView, onEdit, onDelete }) {
  const name = member.name || 'Unnamed Member';
  const position = member.position || member.role || 'Member';
  const email = member.email || '';
  const team = member.team || 'Web Team';
  const status = member.status || 'ACTIVE';
  const photoUrl = member.profile_photo_url || member.avatar;
  const socialLinks = member.social_links || member.socials || {};

  return (
    <div
      className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group flex flex-col justify-between h-full"
      role="article"
      aria-label={`Member card for ${name}`}
    >
      {/* Main Info */}
      <div className="space-y-4">
        
        {/* Header: Photo, Name, Team & Status Pill */}
        <div className="flex items-start gap-3">
          {/* Photo */}
          <div className="relative shrink-0">
            <img
              src={photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`}
              alt={name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
              }}
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-black/40 ${
                status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold btn-secondary truncate max-w-full">
                {team}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                  status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {status}
              </span>
            </div>

            <h3 
              className="text-sm leading-5 font-extrabold truncate group-hover:opacity-90 transition-opacity" 
              title={name}
            >
              {name}
            </h3>

            <p 
              className="text-xs leading-4 font-semibold opacity-70 truncate mt-0.5" 
              title={position}
            >
              {position}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-xs leading-4 opacity-90 glass-panel-subtle px-3 py-2 rounded-lg truncate">
          <Mail className="w-3.5 h-3.5 opacity-70 shrink-0" />
          <a
            href={`mailto:${email}`}
            className="truncate hover:underline font-bold"
            title={email}
          >
            {email}
          </a>
        </div>

      </div>

      {/* Footer: Socials and Action Buttons */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
        
        {/* Social Icons */}
        <div className="flex items-center gap-1">
          {socialLinks.instagram ? (
            <a
              href={socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://instagram.com/${socialLinks.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg btn-secondary flex items-center justify-center hover:text-pink-500 transition-colors cursor-pointer"
              title="Instagram Profile"
              aria-label={`${name}'s Instagram`}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="w-7 h-7 rounded-lg flex items-center justify-center opacity-30 cursor-not-allowed">
              <InstagramIcon className="w-3.5 h-3.5" />
            </span>
          )}

          {socialLinks.linkedin ? (
            <a
              href={socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : `https://linkedin.com/in/${socialLinks.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg btn-secondary flex items-center justify-center hover:text-blue-500 transition-colors cursor-pointer"
              title="LinkedIn Profile"
              aria-label={`${name}'s LinkedIn`}
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="w-7 h-7 rounded-lg flex items-center justify-center opacity-30 cursor-not-allowed">
              <LinkedinIcon className="w-3.5 h-3.5" />
            </span>
          )}

          {socialLinks.github && (
            <a
              href={socialLinks.github.startsWith('http') ? socialLinks.github : `https://github.com/${socialLinks.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg btn-secondary flex items-center justify-center hover:opacity-100 transition-colors cursor-pointer"
              title="GitHub Profile"
              aria-label={`${name}'s GitHub`}
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(member)}
            className="p-1.5 rounded-lg btn-secondary transition-colors cursor-pointer"
            title="View Details"
            aria-label="View member details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onEdit(member)}
            className="p-1.5 rounded-lg btn-secondary transition-colors cursor-pointer"
            title="Edit Member"
            aria-label="Edit member"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(member.id, name)}
            className="p-1.5 rounded-lg btn-secondary hover:text-rose-500 transition-colors cursor-pointer"
            title="Delete Member"
            aria-label="Delete member"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}

export default MemberCard;
