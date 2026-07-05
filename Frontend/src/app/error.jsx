"use client";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-4">
      {" "}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {" "}
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          {" "}
          <AlertTriangle size={40} className="text-red-500" />{" "}
        </div>{" "}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          {" "}
          Something went wrong{" "}
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          {" "}
          {error.message ||
            "An unexpected error occurred. Please try again."}{" "}
        </p>{" "}
        <Button
          onClick={reset}
          className="bg-blue-600 dark:bg-blue-500 transition-colors duration-200 ease-out hover:bg-slate-900 gap-2"
        >
          {" "}
          <RefreshCw size={16} /> Try Again{" "}
        </Button>{" "}
      </motion.div>{" "}
    </div>
  );
}
