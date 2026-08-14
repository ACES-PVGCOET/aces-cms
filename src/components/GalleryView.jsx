import { useRef } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Play, 
  Heart, 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2,
  Rows3,
  Columns3,
  Film
} from 'lucide-react';
import StatCard from './StatCard';
import { GALLERY_CATEGORIES } from '../hooks/useGallery';

/**
 * GalleryView Component
 * Classic Modern media gallery in Sunset Rose Theme with high-contrast text.
 */
export function GalleryView({
  mediaItems = [],
  filteredMedia = [],
  selectedCategory,
  onSelectCategory,
  mediaTypeFilter,
  onMediaTypeFilterChange,
  searchQuery,
  onSearchChange,
  scrollOrientation,
  onToggleScrollOrientation,
  onOpenMediaDetail,
  onToggleLike,
  likedMap = {},
  onOpenAddMedia,
}) {
  const horizontalScrollRef = useRef(null);

  // Smooth scroll helper for horizontal reel
  const scrollHorizontal = (direction) => {
    if (horizontalScrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      horizontalScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Compute stats
  const totalPhotos = mediaItems.filter((m) => m.type === 'image').length;
  const totalVideos = mediaItems.filter((m) => m.type === 'video').length;
  const totalLikes = mediaItems.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800/60">
              Visual Archives
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-rose-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-rose-200/80 dark:border-slate-700">
              {filteredMedia.length} assets displayed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-black text-slate-950 dark:text-white tracking-tight mt-1.5">
            Media Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
            Experience high-res photography, aftermovies, workshop keynotes, and guild moments.
          </p>
        </div>

        {/* Upload Button */}
        <button
          id="gallery-add-btn"
          onClick={onOpenAddMedia}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold btn-primary self-start sm:self-auto shrink-0 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* 2. 3 Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Visuals"
          value={`${mediaItems.length} Captures`}
          description={`${totalPhotos} Photos & ${totalVideos} Video Reels`}
          icon={<ImageIcon className="w-5 h-5" />}
          accentColor="rose"
          hideDescription={false}
        />

        <StatCard
          title="Cinema & Video Reels"
          value={`${totalVideos} Streams`}
          description="High-definition event trailers & recaps"
          icon={<Film className="w-5 h-5" />}
          accentColor="purple"
          hideDescription={false}
        />

        <StatCard
          title="Community Appreciation"
          value={`${totalLikes} Hearts`}
          description="Student & guild member engagements"
          icon={<Heart className="w-5 h-5" />}
          accentColor="rose"
          hideDescription={false}
        />
      </div>

      {/* 3. Controls, Search, Scroll Mode & Category Tabs */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-rose-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search visual captures by title, author, or #tag..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-rose-50/50 dark:bg-slate-900/80 rounded-xl text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 border border-rose-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-colors font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Media Type & Orientation Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Type Selector (All / Photos / Videos) */}
            <div className="flex items-center p-0.5 rounded-xl bg-rose-100/70 dark:bg-slate-800 border border-rose-200 dark:border-slate-700">
              <button
                onClick={() => onMediaTypeFilterChange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  mediaTypeFilter === 'all' ? 'bg-white text-rose-800 font-extrabold shadow-xs dark:bg-indigo-600 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onMediaTypeFilterChange('image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  mediaTypeFilter === 'image' ? 'bg-white text-rose-800 font-extrabold shadow-xs dark:bg-indigo-600 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Photos</span>
              </button>
              <button
                onClick={() => onMediaTypeFilterChange('video')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  mediaTypeFilter === 'video' ? 'bg-white text-rose-800 font-extrabold shadow-xs dark:bg-indigo-600 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>Videos</span>
              </button>
            </div>

            {/* Scroll Orientation Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-rose-100/70 dark:bg-slate-800 border border-rose-200 dark:border-slate-700">
              <button
                onClick={() => onToggleScrollOrientation('horizontal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  scrollOrientation === 'horizontal' ? 'bg-white text-rose-800 font-extrabold shadow-xs dark:bg-indigo-600 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Horizontal</span>
              </button>
              <button
                onClick={() => onToggleScrollOrientation('vertical')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  scrollOrientation === 'vertical' ? 'bg-white text-rose-800 font-extrabold shadow-xs dark:bg-indigo-600 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
                }`}
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span>Vertical</span>
              </button>
            </div>

          </div>

        </div>

        {/* Category Tabs */}
        <div className="pt-2 border-t border-rose-100 dark:border-slate-800 overflow-x-auto pb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-max">
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 text-white font-extrabold shadow-xs dark:bg-indigo-600 dark:text-white'
                      : 'bg-rose-50/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-rose-100/70 dark:hover:bg-slate-800 border border-rose-200/80 dark:border-slate-700/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Horizontal scroll arrows */}
          {scrollOrientation === 'horizontal' && (
            <div className="hidden sm:flex items-center gap-1 shrink-0 pl-2">
              <button
                onClick={() => scrollHorizontal('left')}
                className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer border border-rose-200/80"
                title="Scroll Left"
                aria-label="Scroll reel left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollHorizontal('right')}
                className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer border border-rose-200/80"
                title="Scroll Right"
                aria-label="Scroll reel right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 4. Interactive Media Display */}
      {filteredMedia.length > 0 ? (
        scrollOrientation === 'horizontal' ? (
          /* Horizontal Reel */
          <div className="relative">
            <div
              ref={horizontalScrollRef}
              className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="w-[300px] sm:w-[360px] shrink-0 snap-start glass-card rounded-2xl overflow-hidden border border-rose-200/80 dark:border-slate-800 hover:-translate-y-1 hover:shadow-md transition-all duration-200 group flex flex-col justify-between shadow-sm"
                >
                  {/* Media Visual */}
                  <div
                    onClick={() => onOpenMediaDetail(item)}
                    className="relative h-52 overflow-hidden bg-slate-950 cursor-pointer"
                  >
                    <img
                      src={item.thumbnail || item.src}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white shadow-xs">
                        {item.category}
                      </span>
                      {item.type === 'video' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white border border-slate-700 flex items-center gap-1">
                          <Film className="w-3 h-3" />
                          <span>{item.duration || '0:45'}</span>
                        </span>
                      )}
                    </div>

                    {/* Video Center Play Button */}
                    {item.type === 'video' ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/95 text-rose-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 ml-0.5 fill-current" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1 rounded-lg bg-black/60 text-white">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}

                    {/* Bottom Title */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <div className="text-[10px] text-rose-300 font-bold">{item.date}</div>
                      <h3 className="text-sm font-black truncate leading-tight mt-0.5">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white dark:bg-slate-900">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-rose-100 dark:border-slate-800">
                      <span className="truncate max-w-[180px]">By <strong className="text-slate-950 dark:text-white font-bold">{item.author}</strong></span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(item.id);
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          likedMap[item.id]
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-rose-50/60 hover:bg-rose-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-rose-200/60'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedMap[item.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>{item.likes}</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Vertical Wall Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl overflow-hidden border border-rose-200/80 dark:border-slate-800 hover:-translate-y-1 hover:shadow-md transition-all duration-200 group flex flex-col justify-between shadow-sm"
              >
                {/* Visual */}
                <div
                  onClick={() => onOpenMediaDetail(item)}
                  className="relative h-52 overflow-hidden bg-slate-950 cursor-pointer"
                >
                  <img
                    src={item.thumbnail || item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white shadow-xs">
                      {item.category}
                    </span>
                    {item.type === 'video' && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white border border-slate-700 flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        <span>{item.duration || '0:45'}</span>
                      </span>
                    )}
                  </div>

                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/95 text-rose-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <div className="text-[10px] text-rose-300 font-bold">{item.date}</div>
                    <h3 className="text-sm font-black truncate leading-tight mt-0.5">{item.title}</h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white dark:bg-slate-900">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-rose-100 dark:border-slate-800">
                    <span className="truncate max-w-[180px]">By <strong className="text-slate-950 dark:text-white font-bold">{item.author}</strong></span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(item.id);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        likedMap[item.id]
                          ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-rose-50/60 hover:bg-rose-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-rose-200/60'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedMap[item.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{item.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="glass-card rounded-2xl p-12 text-center border border-rose-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-slate-800 text-rose-700 dark:text-indigo-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-slate-700">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-950 dark:text-white">No media assets found</h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Try adjusting category filters, clearing search terms, or upload a new photo / video clip.
            </p>
          </div>
          <button
            onClick={() => {
              onSearchChange('');
              onSelectCategory('All Media');
              onMediaTypeFilterChange('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold btn-secondary inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Reset Gallery Filters</span>
          </button>
        </div>
      )}

    </div>
  );
}

export default GalleryView;
