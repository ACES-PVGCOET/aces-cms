/**
 * StatCard Component
 * Metric card adhering strictly to theme tokens and 4px/8px Baseline Grid.
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
      className="w-full h-full glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden transition-all duration-300 group flex flex-col justify-between"
      role="region"
      aria-label={`${title} stat card`}
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <span className="text-xs leading-4 font-bold uppercase tracking-wider opacity-70 font-sans">
          {title}
        </span>
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 btn-secondary shadow-xs"
          >
            {icon}
          </div>
        )}
      </div>

      {/* Numeric Value */}
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-3xl leading-9 sm:text-4xl sm:leading-10 font-extrabold tracking-tight font-sans">
          {value}
        </span>
      </div>

      {/* Description */}
      {!hideDescription && description && (
        <p className="mt-2 text-xs leading-4 font-semibold opacity-70 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;
