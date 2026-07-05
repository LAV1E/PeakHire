import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  icon,
  trend,
  className,
}) {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-between hover:shadow-sm hover:border-[#CBD5E1] transition-all duration-200 group",
        className,
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 bg-surface-container rounded text-secondary group-hover:bg-secondary-fixed transition-colors">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      
      <div>
        <div className="font-headline-lg text-headline-lg text-on-surface mb-2">
          {value}
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 font-helper-text text-helper-text",
              trend.isPositive ? "text-green-600" : trend.value === 0 ? "text-on-surface-variant" : "text-error"
            )}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              {trend.isPositive ? "trending_up" : trend.value === 0 ? "trending_flat" : "trending_down"}
            </span>
            <span>
              {trend.isPositive ? "+" : ""}{trend.value}% vs last month
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
