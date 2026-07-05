import Image from "next/image";
import { getInitials, getAvatarColor } from "@/utils/avatarFallback";
import { cn } from "@/lib/utils";
const SIZE_MAP = {
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-14 h-14", text: "text-lg" },
  xl: { container: "w-20 h-20", text: "text-2xl" },
};
export function AvatarWithFallback({ src, name, size = "md", className }) {
  const { container, text } = SIZE_MAP[size];
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);
  if (src) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden flex-shrink-0",
          container,
          className,
        )}
      >
        {" "}
        <Image src={src} alt={name} fill className="object-cover" />{" "}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-on-primary",
        container,
        colorClass,
        className,
      )}
    >
      {" "}
      <span className={text}>{initials}</span>{" "}
    </div>
  );
}
