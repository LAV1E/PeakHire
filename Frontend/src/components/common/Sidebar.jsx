"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { motion, AnimatePresence } from "framer-motion";

const candidateLinks = [
  { href: ROUTES.CANDIDATE_DASHBOARD, label: "Dashboard", icon: "dashboard" },
  { href: ROUTES.CANDIDATE_JOBS, label: "Browse Jobs", icon: "work" },
  { href: ROUTES.CANDIDATE_SAVED_JOBS, label: "Saved Jobs", icon: "bookmark" },
  { href: ROUTES.CANDIDATE_APPLICATIONS, label: "Applications", icon: "description" },
  { href: ROUTES.CANDIDATE_INTERVIEWS, label: "Interviews", icon: "event" },
  { href: ROUTES.CANDIDATE_OFFERS, label: "Offers", icon: "featured_seasonal_and_gifts" },
  { href: ROUTES.CANDIDATE_PROFILE, label: "Profile", icon: "person" },
  { href: ROUTES.CANDIDATE_RESUME, label: "Resume", icon: "contact_page" },
  { href: ROUTES.CANDIDATE_NOTIFICATIONS, label: "Notifications", icon: "notifications" },
];

const recruiterLinks = [
  { href: ROUTES.RECRUITER_DASHBOARD, label: "Dashboard", icon: "dashboard" },
  { href: ROUTES.RECRUITER_COMPANY, label: "Company", icon: "domain" },
  { href: ROUTES.RECRUITER_JOBS, label: "Jobs", icon: "work" },
  { href: ROUTES.RECRUITER_APPLICATIONS, label: "Applications", icon: "description" },
  { href: ROUTES.RECRUITER_INTERVIEWS, label: "Interviews", icon: "event" },
  { href: ROUTES.RECRUITER_OFFERS, label: "Offers", icon: "featured_seasonal_and_gifts" },
  { href: ROUTES.RECRUITER_NOTIFICATIONS, label: "Notifications", icon: "notifications" },
];

const adminLinks = [
  { href: ROUTES.ADMIN_DASHBOARD, label: "Dashboard", icon: "dashboard" },
  { href: ROUTES.ADMIN_VERIFICATION, label: "Verification", icon: "verified" },
  { href: ROUTES.ADMIN_USERS, label: "Users", icon: "group" },
  { href: ROUTES.ADMIN_COMPANIES, label: "Companies", icon: "domain" },
  { href: ROUTES.ADMIN_NOTIFICATIONS, label: "Notifications", icon: "notifications" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  
  const role = user?.role ?? "candidate";
  const links =
    role === "admin"
      ? adminLinks
      : role === "recruiter"
        ? recruiterLinks
        : candidateLinks;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 64 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "bg-primary-container h-screen flex-col sticky left-0 top-0 border-r border-outline-variant z-50",
          sidebarOpen ? "flex fixed md:sticky" : "hidden md:flex"
        )}
      >
        {/* Header */}
        <div className={cn("px-6 py-6 flex items-center gap-3 overflow-hidden", !sidebarOpen && "px-2 justify-center")}>
          <div className="w-8 h-8 rounded shrink-0 bg-secondary flex items-center justify-center text-on-secondary font-bold">
            P
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap"
              >
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-primary">
                  PeakHire
                </h2>
                <p className="font-helper-text text-helper-text text-on-primary-container">
                  Recruitment ATS
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 mt-4 overflow-y-auto overflow-x-hidden">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-all rounded-r duration-200 ease-out",
                  isActive
                    ? "bg-secondary-container text-on-secondary-container border-l-4 border-secondary hover:bg-secondary-container/80"
                    : "text-on-primary-container opacity-70 hover:opacity-100 border-l-4 border-transparent hover:bg-secondary-container/20 hover:text-on-primary",
                  !sidebarOpen && "px-2 justify-center rounded border-l-0 border-b-2"
                )}
                title={!sidebarOpen ? link.label : undefined}
              >
                <span 
                  className="material-symbols-outlined shrink-0"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {link.icon}
                </span>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-label-md text-label-md whitespace-nowrap overflow-hidden"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* CTA & Footer */}
        <div className="p-4 mt-auto shrink-0 flex flex-col overflow-hidden">
          {role === "recruiter" && (
            <AnimatePresence>
              {sidebarOpen && (
                <motion.button
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onClick={() => router.push(ROUTES.RECRUITER_JOBS_CREATE)}
                  className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-4 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span> Post New Job
                </motion.button>
              )}
            </AnimatePresence>
          )}

          <button
            onClick={toggleSidebar}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-on-primary-container opacity-70 hover:opacity-100 transition-all",
              !sidebarOpen && "px-2 justify-center"
            )}
            title={sidebarOpen ? "Collapse" : "Expand"}
          >
            <span className="material-symbols-outlined shrink-0">
              {sidebarOpen ? "menu_open" : "menu"}
            </span>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-label-md text-label-md whitespace-nowrap overflow-hidden"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-error opacity-70 hover:opacity-100 transition-all hover:bg-error/10 rounded mt-1",
              !sidebarOpen && "px-2 justify-center"
            )}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <span className="material-symbols-outlined shrink-0">logout</span>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-label-md text-label-md whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
