import { 
  X, 
  Sparkles, 
  Filter, 
  Activity, 
  Database, 
  Plus, 
  CalendarPlus, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { TEAMS_LIST } from '../data/mockData';

/**
 * PropertiesPanel Component
 * Collapsible right-side inspector and telemetry panel for multi-panel dashboard architecture.
 * Strictly adheres to standard Tailwind CSS 4.3 utilities and 4px/8px baseline grid.
 */
export function PropertiesPanel({
  isOpen = true,
  onClose,
  currentView = 'dashboard',
  selectedTeam = 'All Teams',
  onSelectTeam,
  statusFilter = 'All Statuses',
  onStatusFilterChange,
  counts = {},
  onOpenAddMember,
  onOpenCreateEvent,
  onSyncWebsite,
  isSyncing = false,
  onExportData,
}) {
  if (!isOpen) return null;

  const quickTeams = TEAMS_LIST.slice(0, 6);

  return (
    <aside
      className="properties-panel w-72 flex-shrink-0 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto flex flex-col justify-between select-none animate-in slide-in-from-right duration-300 z-20"
      aria-label="Properties and Inspection Panel"
    >
      <div className="space-y-6">
        
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs leading-4 font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Inspector
              </h3>
              <p className="text-xs leading-4 text-slate-500 font-medium">
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)} Context
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
            title="Collapse Inspector"
            aria-label="Close Properties Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. View-Specific Filters & Quick Selectors */}
        {(currentView === 'members' || currentView === 'dashboard') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs leading-4 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Guild Presets</span>
              </span>
              <span className="text-xs leading-4 text-slate-500 font-semibold">
                {counts.members || 0} Total
              </span>
            </div>

            <div className="space-y-1">
              {quickTeams.map((teamName) => {
                const isSelected = selectedTeam === teamName;
                return (
                  <button
                    key={teamName}
                    onClick={() => onSelectTeam && onSelectTeam(teamName)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs leading-4 font-medium transition-all duration-200 cursor-pointer text-left ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <span className="truncate">{teamName}</span>
                    <ChevronRight className={`w-3 h-3 transition-transform ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'events' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs leading-4 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-indigo-500" />
                <span>Status Scope</span>
              </span>
              <span className="text-xs leading-4 text-slate-500 font-semibold">
                {counts.events || 0} Active
              </span>
            </div>

            <div className="space-y-1">
              {['All Statuses', 'Scheduled', 'Live', 'Completed', 'Draft'].map((status) => {
                const isSelected = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => onStatusFilterChange && onStatusFilterChange(status)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs leading-4 font-medium transition-all duration-200 cursor-pointer text-left ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <span>{status}</span>
                    <ChevronRight className={`w-3 h-3 transition-transform ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Quick Action Primitives */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <span className="text-xs leading-4 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
            Command Center
          </span>

          <div className="space-y-2">
            <button
              onClick={onOpenAddMember}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs leading-4 font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Enroll Member</span>
            </button>

            <button
              onClick={onOpenCreateEvent}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs leading-4 font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all duration-200 cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Schedule Session</span>
            </button>

            <button
              onClick={onSyncWebsite}
              disabled={isSyncing}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs leading-4 font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Public CDN'}</span>
              </div>
              <Sparkles className="w-3 h-3 text-indigo-200" />
            </button>

            <button
              onClick={onExportData}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs leading-4 font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all duration-200 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export JSON Backup</span>
            </button>
          </div>
        </div>

        {/* 3. Real-time Node Telemetry */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <span className="text-xs leading-4 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
            System Telemetry
          </span>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs leading-4">
              <span className="text-slate-400 font-medium">Cluster Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Healthy</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs leading-4">
              <span className="text-slate-400 font-medium">Active Database</span>
              <span className="font-semibold text-slate-300">ACES CDN v2</span>
            </div>

            <div className="flex items-center justify-between text-xs leading-4">
              <span className="text-slate-400 font-medium">Cache Latency</span>
              <span className="font-mono text-indigo-400 font-bold">14ms</span>
            </div>
          </div>
        </div>

      </div>

      {/* Panel Footer Security Badge */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs leading-4 text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Root Verified</span>
        </span>
        <span className="text-slate-600 font-mono">2026-27</span>
      </div>
    </aside>
  );
}

export default PropertiesPanel;
