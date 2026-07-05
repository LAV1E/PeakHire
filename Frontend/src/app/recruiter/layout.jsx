"use client";
import { Sidebar } from "@/components/common/Sidebar";
import { Navbar } from "@/components/common/Navbar";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export default function RecruiterLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["recruiter"]}>
      <div className="bg-background text-on-background font-body-md text-body-md h-screen w-full flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto bg-background p-md md:p-lg lg:p-xl w-full">
            <div className="max-w-container_max mx-auto h-full flex flex-col">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
