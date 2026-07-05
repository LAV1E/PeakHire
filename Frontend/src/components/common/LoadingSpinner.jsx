import { cn } from "@/lib/utils";

export function LoadingSpinner({ className, size = "md", text }) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div 
        className={cn(
          "rounded-full border-solid border-primary border-t-transparent animate-spin",
          sizeClasses[size]
        )} 
      />
      {text && (
        <p className="font-label-md text-label-md text-on-surface-variant animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
