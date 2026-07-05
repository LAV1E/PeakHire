"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { queryClient } from "./queryClient";
import { ThemeProvider } from "@/components/common/ThemeProvider";
export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {" "}
      <ThemeProvider>
        {" "}
        {children}{" "}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{ duration: 4000 }}
        />{" "}
      </ThemeProvider>{" "}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}{" "}
    </QueryClientProvider>
  );
}
