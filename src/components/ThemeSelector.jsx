import { Moon, Sun } from 'lucide-react';

/**
 * ThemeSelector Component
 * Multi-Theme switcher for Sky-White (Light) and Deep Midnight (Dark).
 */
export function ThemeSelector({ currentTheme = 'sky-white', onSelectTheme }) {
  const isDark = currentTheme === 'deep-midnight';

  const handleToggle = () => {
    onSelectTheme(isDark ? 'sky-white' : 'deep-midnight');
  };

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={handleToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl btn-secondary transition-all duration-200 active:scale-95 cursor-pointer shadow-xs text-xs font-bold"
      title={isDark ? 'Switch to Sky Light Theme' : 'Switch to Deep Midnight Dark Theme'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      )}
    </button>
  );
}

export default ThemeSelector;
