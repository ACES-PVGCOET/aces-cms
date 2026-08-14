import { useState } from 'react';
import { Film } from 'lucide-react';
import { isVideoMedia } from '../utils/mediaUtils';

/**
 * MediaViewer Component
 * Handles rendering of both image formats (JPG, PNG, WebP, GIF, SVG)
 * and video formats (MP4, WebM, MOV, etc.) with responsive aspect ratios and error fallback.
 */
export function MediaViewer({
  src,
  alt = 'Media display',
  className = 'w-full h-full object-cover',
  fallback = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  showVideoBadge = false,
}) {
  const [hasError, setHasError] = useState(false);
  const currentSrc = hasError ? fallback : src || fallback;
  const isVideo = isVideoMedia(currentSrc);

  if (isVideo) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
        <video
          src={currentSrc}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          controls={controls}
          className={className}
          onError={() => setHasError(true)}
        />
        {showVideoBadge && !controls && (
          <div className="absolute top-2.5 right-2.5 z-10 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 border border-white/20">
            <Film className="w-3 h-3 text-purple-300" />
            <span>Video Motion</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

export default MediaViewer;
