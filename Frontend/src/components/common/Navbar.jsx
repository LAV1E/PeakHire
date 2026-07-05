"use client";
import { useUIStore } from "@/store/uiStore";
import { NotificationBell } from "./NotificationBell";
import { AvatarWithFallback } from "./AvatarWithFallback";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

export function Navbar() {
  const { toggleSidebar, theme, toggleTheme } = useUIStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const logoutStore = useAuthStore((state) => state.logout);

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logoutStore();
      router.push(ROUTES.HOME);
      toast.success("Logged out successfully");
    },
    onError: () => {
      logoutStore();
      router.push(ROUTES.HOME);
    }
  });

  const getProfileLink = () => {
    if (user?.role === "candidate") return ROUTES.CANDIDATE_PROFILE;
    if (user?.role === "recruiter") return ROUTES.RECRUITER_DASHBOARD;
    if (user?.role === "admin") return ROUTES.ADMIN_DASHBOARD;
    return "/";
  };
  
  return (
    <header className="bg-surface dark:bg-surface-dim docked full-width top-0 sticky z-40 border-b border-outline-variant flex justify-between items-center w-full px-lg h-16 max-w-container_max mx-auto">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger (Visible only on mobile) */}
        <button 
          className="md:hidden text-on-surface hover:text-secondary transition-colors"
          onClick={toggleSidebar}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="font-headline-sm text-headline-sm font-bold text-primary hidden md:block">
          PeakHire ATS
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex items-center bg-surface-container-low border border-outline-variant rounded px-3 py-1.5 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant mr-2" style={{ fontSize: "18px" }}>search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant/70 w-64 p-0 outline-none" 
            placeholder="Search candidates, jobs..." 
            type="text"
          />
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="text-on-surface-variant hover:text-secondary transition-colors scale-95 active:scale-100 transition-transform relative"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined">
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
          </button>
          
          {/* Notifications */}
          <NotificationBell />
          
          {/* Help */}
          <button 
            className="text-on-surface-variant hover:text-secondary transition-colors scale-95 active:scale-100 transition-transform hidden sm:block"
            onClick={() => toast.info("Support center coming soon")}
          >
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <button 
            className="font-label-sm text-label-sm text-on-surface-variant font-medium hover:text-secondary transition-colors hidden sm:block"
            onClick={() => toast.info("Support center coming soon")}
          >
            Support
          </button>
          
          {/* User Avatar Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer scale-95 active:scale-100 transition-transform outline-none">
                  <AvatarWithFallback
                    src={user.avatar?.url}
                    name={user.name}
                    size="sm"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col space-y-1">
                    <span className="font-medium text-on-surface leading-none">{user.name}</span>
                    <span className="text-xs text-on-surface-variant leading-none capitalize mt-1">
                      {user.role === 'admin' ? 'Admin' : user.role === 'recruiter' ? 'Recruiter' : user.experience?.[0]?.role || 'Frontend Developer'}
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer font-label-md text-label-md" 
                  onClick={() => router.push(getProfileLink())}
                >
                  <span className="material-symbols-outlined mr-2 text-[18px]">person</span>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logoutMutation.mutate()}
                  className="text-error focus:text-error cursor-pointer font-label-md text-label-md"
                >
                  <span className="material-symbols-outlined mr-2 text-[18px]">logout</span>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
