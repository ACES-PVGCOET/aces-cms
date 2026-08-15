import { Moon, Sparkles } from 'lucide-react';

/**
 * ThemeSelector Component
 * Multi-Theme switcher for Deep Midnight and Pastel Aurora.
 */
export function ThemeSelector({ currentTheme = 'deep-midnight', onSelectTheme }) {
  const themes = [
    {
      id: 'deep-midnight',
      label: 'Deep Midnight',
      shortLabel: 'Midnight',
      icon: Moon,
      indicatorColor: '#6366f1',
    },
    {
      id: 'pastel-aurora',
      label: 'Pastel Aurora',
      shortLabel: 'Aurora',
      icon: Sparkles,
      indicatorColor: '#ec4899',
    },
  ];

  return (
    <div
      className="flex items-center p-1 rounded-xl glass-panel-subtle shadow-sm border border-slate-700/50 dark:border-slate-800"
      role="group"
      aria-label="Select Application Theme"
    >
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = currentTheme === t.id;

        return (
          <button
            key={t.id}
            type="button"
            id={`theme-btn-${t.id}`}
            onClick={() => onSelectTheme(t.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'btn-primary shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title={`Switch to ${t.label}`}
            aria-pressed={isActive}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeSelector;
