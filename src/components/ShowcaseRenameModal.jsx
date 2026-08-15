import { useState, useEffect } from 'react';
import { X, Edit3, Check } from 'lucide-react';

export function ShowcaseRenameModal({ isOpen, collectionName, onClose, onSubmit }) {
  const [newCollectionName, setNewCollectionName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (collectionName) {
      setNewCollectionName(collectionName);
      setError('');
    }
  }, [collectionName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      setError('Collection name cannot be empty');
      return;
    }
    onSubmit(collectionName, newCollectionName.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="acrylic-dialog w-full max-w-md rounded-2xl shadow-xl border border-rose-200/90 dark:border-slate-800 overflow-hidden relative animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-100 dark:border-slate-800 flex items-center justify-between bg-rose-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 dark:bg-indigo-950/80 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950 dark:text-white">
                Rename Collection
              </h2>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Update collection name across all media items
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-rose-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Current Collection Name
            </label>
            <div className="text-xs font-bold text-rose-700 dark:text-indigo-300 px-3 py-2 rounded-xl bg-rose-50/80 dark:bg-slate-900 border border-rose-200/80 dark:border-slate-700">
              {collectionName}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              New Collection Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => {
                setNewCollectionName(e.target.value);
                setError('');
              }}
              placeholder="e.g. hackathon_26"
              className="w-full text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 px-3 py-2 rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-bold"
              autoFocus
            />
            {error && <p className="text-[11px] text-rose-600 font-bold">{error}</p>}
          </div>

          <div className="pt-3 border-t border-rose-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold btn-primary flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Save New Name</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShowcaseRenameModal;
