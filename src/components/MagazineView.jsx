import { 
  BookOpen, 
  Upload, 
  Search, 
  Calendar, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  Sparkles, 
  User 
} from 'lucide-react';
import StatCard from './StatCard';
import { ACADEMIC_YEARS } from '../data/mockData';

/**
 * MagazineView Component
 * Multi-Theme magazine archive adhering strictly to semantic design tokens.
 */
export function MagazineView({
  magazines = [],
  filteredMagazines = [],
  selectedYear,
  onSelectYear,
  searchQuery,
  onSearchChange,
  magazineStats = {},
  onOpenUploadModal,
  onOpenEditModal,
  onOpenPdfViewer,
  onDeleteMagazine,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-black dark:text-white">
      
      {/* 1. Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-black btn-primary shadow-xs text-white">
              Editorial Publications
            </span>
            <span className="text-xs leading-4 font-black btn-secondary px-2.5 py-0.5 rounded-md text-black dark:text-white">
              {filteredMagazines.length} editions archived
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-black tracking-tight mt-1 text-black dark:text-white">
            <span className="classic-dotted-heading">Magazine Archive</span>
          </h1>
          <p className="text-sm leading-5 text-black dark:text-white opacity-80 font-semibold">
            Manage, curate, and distribute the club's annual technical publications across all academic terms.
          </p>
        </div>

        {/* Primary CTA Button */}
        <button
          id="magazine-upload-btn"
          onClick={onOpenUploadModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm leading-5 font-black btn-primary self-start sm:self-auto shrink-0 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm text-white"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Edition</span>
        </button>
      </div>

      {/* 2. 3 Statistics Cards (12-Col Grid) */}
      <div className="grid grid-cols-12 gap-6 text-black dark:text-white">
        <div className="col-span-12 md:col-span-4">
          <StatCard
            title="Total Publications"
            value={magazineStats.totalEditions || filteredMagazines.length}
            description="Archived annual editions and technical journals"
            icon={<BookOpen className="w-5 h-5 text-sky-600 dark:text-indigo-400" />}
            hideDescription={false}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <StatCard
            title="Current Cycle Editions"
            value={magazineStats.currentYearCount || 1}
            description="Featured volume for 2026-27 academic term"
            icon={<Sparkles className="w-5 h-5 text-sky-600 dark:text-amber-400" />}
            hideDescription={false}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <StatCard
            title="Community Engagement"
            value={magazineStats.totalEngagements || '1.2k+'}
            description="Global reads & PDF document downloads"
            icon={<Download className="w-5 h-5 text-emerald-500" />}
            hideDescription={false}
          />
        </div>
      </div>

      {/* 3. Search & Academic Year Tabs Toolbar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 text-black dark:text-white">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Magazine Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black dark:text-white opacity-70" />
            <input
              id="magazine-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by magazine title, editor, volume, topic #tag..."
              className="w-full pl-9 pr-8 py-2 text-sm leading-5 glass-input rounded-xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-200 font-bold text-black dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs leading-4 text-black dark:text-white opacity-80 hover:opacity-100 cursor-pointer font-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Academic Year Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-black dark:text-white">
            {ACADEMIC_YEARS.map((year) => {
              const isActive = selectedYear === year;
              const count =
                year === 'All Years'
                  ? magazines.length
                  : magazines.filter((m) => m.academicYear === year).length;

              return (
                <button
                  key={year}
                  id={`year-tab-${year.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onSelectYear(year)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs leading-4 font-black transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? 'btn-primary shadow-xs font-black text-white'
                      : 'btn-secondary text-black dark:text-white opacity-80 hover:opacity-100'
                  }`}
                >
                  <span>{year}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-black rounded ${
                      isActive 
                        ? 'bg-black/20 text-white' 
                        : 'bg-black/10 dark:bg-white/10 text-black dark:text-white'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 4. Magazines 12-Column Grid */}
      {filteredMagazines.length > 0 ? (
        <div className="grid grid-cols-12 gap-6 text-black dark:text-white">
          {filteredMagazines.map((mag) => (
            <div key={mag.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
              <div
                className="glass-card glass-card-hover rounded-2xl overflow-hidden relative transition-all duration-300 group flex flex-col justify-between h-full text-black dark:text-white"
                role="article"
                aria-label={`Magazine: ${mag.title}`}
              >
                {/* Cover Banner */}
                <div className="relative h-52 overflow-hidden bg-black/40">
                  <img
                    src={mag.coverImage}
                    alt={mag.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-black btn-primary shadow-sm text-white">
                      {mag.academicYear}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-black btn-secondary text-black dark:text-white">
                      Vol {mag.volume}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-[10px] font-black opacity-80 uppercase tracking-wider">
                      {mag.edition}
                    </div>
                    <h3 className="text-base leading-6 font-black truncate mt-0.5">
                      {mag.title}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-black dark:text-white">
                  <div className="space-y-3">
                    <p className="text-xs leading-4 sm:text-sm sm:leading-5 text-black dark:text-white opacity-80 line-clamp-2 font-semibold">
                      {mag.description}
                    </p>

                    <div className="space-y-1 text-xs leading-4 font-semibold glass-panel-subtle p-3 rounded-xl text-black dark:text-white border border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 opacity-80 shrink-0" />
                        <span className="truncate">Editor: <strong className="font-black text-black dark:text-white">{mag.editor}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 opacity-80 shrink-0" />
                        <span className="font-medium opacity-80 text-black dark:text-white">Released {mag.publishedDate}</span>
                      </div>
                    </div>

                    {mag.tags && mag.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {mag.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-black btn-secondary text-black dark:text-white"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-200 dark:border-[var(--panel-border)] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenPdfViewer(mag)}
                      className="flex-1 py-1.5 px-3 rounded-xl text-xs leading-4 font-black btn-primary text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 active:scale-95 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>

                    <button
                      onClick={() => onOpenEditModal(mag)}
                      className="p-2 rounded-xl btn-secondary text-black dark:text-white transition-colors cursor-pointer active:scale-95"
                      title="Edit Magazine Details"
                      aria-label="Edit magazine"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteMagazine(mag.id, mag.title)}
                      className="p-2 rounded-xl btn-secondary text-black dark:text-white hover:text-rose-500 transition-colors cursor-pointer active:scale-95"
                      title="Delete Publication"
                      aria-label="Delete magazine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-2xl p-12 text-center space-y-4 text-black dark:text-white">
          <div className="w-12 h-12 rounded-xl btn-secondary flex items-center justify-center mx-auto text-black dark:text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base leading-6 font-black text-black dark:text-white">No publications matched criteria</h3>
            <p className="text-sm leading-5 opacity-80 max-w-sm mx-auto mt-1 font-semibold text-black dark:text-white">
              Try adjusting your academic term filter or search keyword to locate archived editions.
            </p>
          </div>
          <button
            onClick={() => {
              onSearchChange('');
              onSelectYear('All Years');
            }}
            className="px-4 py-2 rounded-xl text-sm leading-5 font-black btn-secondary text-black dark:text-white inline-flex items-center gap-2 cursor-pointer transition-all duration-200"
          >
            <span>Reset Magazine Filters</span>
          </button>
        </div>
      )}

    </div>
  );
}

export default MagazineView;
