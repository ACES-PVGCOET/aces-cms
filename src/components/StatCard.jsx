/**
 * StatCard Component
 * Metric card adhering strictly to Sky-Blue and White light theme tokens.
 * Pure white card container, solid black text, soft shadow, hover translate-y-1.
 */
export function StatCard({
  title,
  value,
  description,
  icon,
  hideDescription = false,
}) {
  return (
    <div
      className="w-full h-full glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden transition-all duration-300 group flex flex-col justify-between shadow-xs text-black dark:text-white"
      role="region"
      aria-label={`${title} stat card`}
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <span className="text-xs leading-4 font-black uppercase tracking-wider text-black dark:text-white opacity-80 font-sans">
          {title}
        </span>
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 btn-secondary shadow-xs text-black dark:text-white"
          >
            {icon}
          </div>
        )}
      </div>

      {/* Numeric Value */}
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-3xl leading-9 sm:text-4xl sm:leading-10 font-black tracking-tight font-sans text-black dark:text-white">
          {value}
        </span>
      </div>

      {/* Description */}
      {!hideDescription && description && (
        <p className="mt-2 text-xs leading-4 font-bold text-black dark:text-white opacity-80 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;
