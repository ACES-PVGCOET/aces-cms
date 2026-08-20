import { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Download, 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  ChevronLeft, 
  Eye, 
  Play, 
  Layers, 
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import StatCard from './StatCard';
import MediaViewer from './MediaViewer';

/**
 * ShowcaseView Component
 * Renders the Media Showcase section with folder-based collections, drill-down item view,
 * media item filtering (Images, Videos, PDFs), collection renaming, and PDF downloads.
 */
export function ShowcaseView({
  collections = [],
  filteredCollections = [],
  activeCollection,
  onSelectCollection,
  currentCollectionObject,
  activeCollectionItems = [],
  searchQuery,
  onSearchChange,
  mediaTypeFilter,
  onMediaTypeFilterChange,
  showcaseStats,
  onOpenAddModal,
  onOpenEditModal,
  onOpenRenameModal,
  onOpenPdfModal,
  onDeleteItem,
}) {
  const [selectedMediaPreview, setSelectedMediaPreview] = useState(null);

  const handleDownloadPdf = async (e, item) => {
    e.stopPropagation();
    const pdfUrl = item.url || item.media_url || item.pdfUrl;
    if (!pdfUrl) return;

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanTitle = (item.title || 'document').replace(/[^a-z0-9_-]/gi, '_');
      link.download = `${cleanTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (_err) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `${item.title || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold btn-primary shadow-xs">
              Media Showcase
            </span>
            <span className="text-xs font-bold btn-secondary px-2.5 py-0.5 rounded-md">
              {showcaseStats.totalCollections} Collections • {showcaseStats.totalItems} Assets
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            {activeCollection ? `Collection: ${activeCollection}` : 'Media Showcase'}
          </h1>
          <p className="text-sm opacity-70 font-medium">
            {activeCollection
              ? `Browse, manage, and download visual media and PDF publications in '${activeCollection}'.`
              : 'Explore all media collections organized into interactive folders (images, videos, PDF publications).'}
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          {activeCollection && (
            <button
              onClick={() => onSelectCollection(null)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold btn-secondary cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Folders</span>
            </button>
          )}

          <button
            id="showcase-add-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold btn-primary transition-all duration-300 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Media Item</span>
          </button>
        </div>
      </div>

      {/* 2. Top Statistics Summary Cards */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Media Collections"
            value={showcaseStats.totalCollections}
            description="Organized showcase folders"
            icon={<Folder className="w-5 h-5" />}
            hideDescription={false}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Photography Captures"
            value={showcaseStats.totalPhotos}
            description="High-resolution image assets"
            icon={<ImageIcon className="w-5 h-5" />}
            hideDescription={false}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Video Motion Reels"
            value={showcaseStats.totalVideos}
            description="Clips, trailers & aftermovies"
            icon={<Video className="w-5 h-5" />}
            hideDescription={false}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="PDF Publications"
            value={showcaseStats.totalPdfs}
            description="Annual journals & rulebooks"
            icon={<FileText className="w-5 h-5" />}
            hideDescription={false}
          />
        </div>
      </div>

      {/* 3. Search & Control Toolbar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
            <input
              id="showcase-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                activeCollection
                  ? `Search items inside '${activeCollection}'...`
                  : 'Search collections by folder name, title, or tags...'
              }
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm glass-input rounded-xl placeholder-slate-400 focus:outline-none transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100 cursor-pointer font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* If inside collection, show Type Filter Tabs (All / Photos / Videos / PDFs) */}
          {activeCollection && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/10 dark:bg-white/10 shrink-0 overflow-x-auto no-scrollbar">
              <button
                onClick={() => onMediaTypeFilterChange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mediaTypeFilter === 'all'
                    ? 'btn-primary shadow-xs font-extrabold'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                All ({currentCollectionObject?.total_items || 0})
              </button>
              <button
                onClick={() => onMediaTypeFilterChange('image')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mediaTypeFilter === 'image'
                    ? 'btn-primary shadow-xs font-extrabold'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos ({currentCollectionObject?.photos_count || 0})</span>
              </button>
              <button
                onClick={() => onMediaTypeFilterChange('video')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mediaTypeFilter === 'video'
                    ? 'btn-primary shadow-xs font-extrabold'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Videos ({currentCollectionObject?.videos_count || 0})</span>
              </button>
              <button
                onClick={() => onMediaTypeFilterChange('pdf')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mediaTypeFilter === 'pdf'
                    ? 'btn-primary shadow-xs font-extrabold'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDFs ({currentCollectionObject?.pdfs_count || 0})</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      {!activeCollection ? (
        /* ================= OVERVIEW MODE: COLLECTIONS FOLDER GRID ================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-rose-600 dark:text-indigo-400" />
              <span>Media Collections ({filteredCollections.length})</span>
            </h2>
            <span className="text-xs font-medium opacity-70">
              Click any folder to view items or use the rename option
            </span>
          </div>

          {filteredCollections.length > 0 ? (
            <div className="grid grid-cols-12 gap-5">
              {filteredCollections.map((col) => (
                <div key={col.collection_name} className="col-span-12 sm:col-span-6 lg:col-span-4">
                  <div
                    onClick={() => onSelectCollection(col.collection_name)}
                    className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10 cursor-pointer group transition-all duration-300 relative flex flex-col justify-between h-full shadow-sm"
                  >
                    {/* Folder Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-rose-200 dark:border-indigo-800/40">
                          <Folder className="w-6 h-6 fill-current opacity-80" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-black truncate max-w-[160px] group-hover:text-rose-600 dark:group-hover:text-indigo-400 transition-colors">
                              {col.collection_name}
                            </h3>

                            {/* Small Option to Rename Collection near Folder Name */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenRenameModal(col.collection_name);
                              }}
                              className="p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-opacity cursor-pointer"
                              title="Change collection name"
                              aria-label={`Rename collection ${col.collection_name}`}
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                            </button>
                          </div>

                          <p className="text-xs font-semibold opacity-60 mt-0.5">
                            {col.total_items || col.items?.length || 0} total media items
                          </p>
                        </div>
                      </div>

                      <span className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>

                    {/* Folder Preview Media Strip */}
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] font-bold">
                        {col.photos_count > 0 && (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-slate-800 dark:text-indigo-300 border border-rose-200 dark:border-slate-700">
                            {col.photos_count} Photos
                          </span>
                        )}
                        {col.videos_count > 0 && (
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            {col.videos_count} Videos
                          </span>
                        )}
                        {col.pdfs_count > 0 && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {col.pdfs_count} PDFs
                          </span>
                        )}
                      </div>

                      {/* Cover preview or thumbnails */}
                      <div className="h-28 rounded-xl overflow-hidden bg-black/40 relative border border-white/10">
                        {col.cover_image || col.items?.[0]?.cover_image || col.items?.[0]?.url ? (
                          <img
                            src={col.cover_image || col.items?.[0]?.cover_image || col.items?.[0]?.url}
                            alt={col.collection_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs opacity-50 font-bold">
                            Folder empty
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[11px] font-extrabold text-white flex items-center gap-1">
                            <span>Open Folder</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl btn-secondary flex items-center justify-center mx-auto">
                <Folder className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold">No collections found</h3>
                <p className="text-sm opacity-70 max-w-sm mx-auto mt-1 font-medium">
                  Try adjusting search query or upload a new media item to create a collection folder.
                </p>
              </div>
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2 rounded-xl text-xs font-bold btn-primary inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Collection</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ================= DRILL-DOWN MODE: ITEMS INSIDE SELECTED COLLECTION ================= */
        <div className="space-y-4">
          
          {/* Breadcrumb & Collection Rename Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel-subtle border border-white/10">
            <div className="flex items-center gap-2 text-xs font-extrabold">
              <button
                onClick={() => onSelectCollection(null)}
                className="opacity-70 hover:opacity-100 flex items-center gap-1 cursor-pointer"
              >
                <span>Collections</span>
              </button>
              <span className="opacity-40">/</span>
              <span className="text-rose-600 dark:text-indigo-400 flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4" />
                <span>{activeCollection}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenRenameModal(activeCollection)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold btn-secondary cursor-pointer"
                title="Change collection folder name"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Rename Folder</span>
              </button>

              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold btn-primary cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item to '{activeCollection}'</span>
              </button>
            </div>
          </div>

          {/* Collection Items Grid */}
          {activeCollectionItems.length > 0 ? (
            <div className="grid grid-cols-12 gap-5">
              {activeCollectionItems.map((item) => {
                const itemType = item.type || item.media_type || 'image';
                const isPdf = itemType === 'pdf';
                const isVideo = itemType === 'video';

                return (
                  <div key={item.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
                    <div
                      className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between h-full group relative shadow-sm"
                      role="article"
                    >
                      {/* Media Card Top Thumbnail View */}
                      <div className="relative h-52 overflow-hidden bg-slate-950">
                        {isPdf ? (
                          item.cover_image ? (
                            <img
                              src={item.cover_image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-950/80 to-slate-900 text-rose-300 p-4 text-center">
                              <FileText className="w-12 h-12 mb-2 opacity-80" />
                              <span className="text-xs font-bold line-clamp-2">{item.title}</span>
                            </div>
                          )
                        ) : (
                          <img
                            src={item.cover_image || item.url || item.media_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

                        {/* Type Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              isPdf
                                ? 'bg-emerald-600 text-white'
                                : isVideo
                                ? 'bg-purple-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {itemType}
                          </span>
                        </div>

                        {/* Media Action Center Overlay */}
                        {isVideo && (
                          <div
                            onClick={() => setSelectedMediaPreview(item)}
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-full bg-white/95 text-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 ml-0.5 fill-current" />
                            </div>
                          </div>
                        )}

                        {/* Bottom Overlay Title */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="text-sm font-black truncate leading-tight">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Card Content & Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <p className="text-xs font-medium opacity-80 line-clamp-2 leading-relaxed">
                          {item.description || item.caption || 'No description provided.'}
                        </p>

                        {/* Actions Toolbar */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                          {isPdf ? (
                            <div className="flex items-center gap-1.5 flex-1">
                              {/* Dedicated Download PDF Button */}
                              <button
                                onClick={(e) => handleDownloadPdf(e, item)}
                                className="flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold btn-primary flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                title="Download PDF Document"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download PDF</span>
                              </button>

                              {/* View PDF Modal Button */}
                              <button
                                onClick={() => onOpenPdfModal(item)}
                                className="p-1.5 rounded-xl btn-secondary text-slate-700 dark:text-slate-300 cursor-pointer"
                                title="Preview PDF"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedMediaPreview(item)}
                              className="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold btn-secondary flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {isVideo ? <Play className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                              <span>View Asset</span>
                            </button>
                          )}

                          {/* Edit Item */}
                          <button
                            onClick={() => onOpenEditModal(item)}
                            className="p-1.5 rounded-xl btn-secondary transition-colors cursor-pointer"
                            title="Edit Media Item"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1.5 rounded-xl btn-secondary hover:text-rose-500 transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl btn-secondary flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold">No items matched criteria</h3>
                <p className="text-sm opacity-70 max-w-sm mx-auto mt-1 font-medium">
                  Try adjusting search keyword or reset the media type filter.
                </p>
              </div>
              <button
                onClick={() => {
                  onSearchChange('');
                  onMediaTypeFilterChange('all');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold btn-secondary cursor-pointer inline-flex items-center gap-2"
              >
                <span>Reset Filters</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* 5. General Media Asset Viewer Modal (for Images & Videos) */}
      {selectedMediaPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedMediaPreview(null)}
        >
          <div
            className="acrylic-dialog w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900 flex items-center justify-between text-white border-b border-white/10">
              <h3 className="text-sm font-extrabold truncate pr-4">
                {selectedMediaPreview.title}
              </h3>
              <button
                onClick={() => setSelectedMediaPreview(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[75vh] overflow-hidden">
              <MediaViewer
                src={selectedMediaPreview.url || selectedMediaPreview.media_url}
                alt={selectedMediaPreview.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
                showVideoBadge={true}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ShowcaseView;
