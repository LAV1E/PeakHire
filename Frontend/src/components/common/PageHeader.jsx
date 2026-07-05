import { cn } from "@/lib/utils";
export function PageHeader({ title, description, action, className }) {
  return (
    <div className={cn("flex items-start justify-between mb-6", className)}>
      {" "}
      <div>
        {" "}
        <h1 className="text-2xl font-bold text-on-surface "> {title} </h1>{" "}
        {description && (
          <p className="mt-1 text-sm text-on-surface-variant "> {description} </p>
        )}{" "}
      </div>{" "}
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}{" "}
    </div>
  );
}
