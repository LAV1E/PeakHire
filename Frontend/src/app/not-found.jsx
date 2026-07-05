"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-4">
      {" "}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {" "}
        <div className="text-8xl font-black text-blue-600 dark:text-blue-400 mb-4">404</div>{" "}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          {" "}
          Page not found{" "}
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          {" "}
          Oops! The page you're looking for doesn't exist or has been
          moved.{" "}
        </p>{" "}
        <Link href="/login">
          {" "}
          <Button className="bg-blue-600 dark:bg-blue-500 transition-colors duration-200 ease-out hover:bg-slate-900 gap-2">
            {" "}
            <Home size={16} /> Back to Home{" "}
          </Button>{" "}
        </Link>{" "}
      </motion.div>{" "}
    </div>
  );
}
