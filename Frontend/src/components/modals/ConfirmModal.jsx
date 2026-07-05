"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
  variant = "danger",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {" "}
      <DialogContent className="max-w-md">
        {" "}
        <DialogHeader>
          {" "}
          <div className="flex items-center gap-3 mb-1">
            {" "}
            {variant === "danger" && (
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                {" "}
                <AlertTriangle size={20} className="text-red-500" />{" "}
              </div>
            )}{" "}
            <DialogTitle>{title}</DialogTitle>{" "}
          </div>{" "}
          <DialogDescription className="text-sm text-on-surface-variant ">
            {" "}
            {description}{" "}
          </DialogDescription>{" "}
        </DialogHeader>{" "}
        <DialogFooter className="gap-2">
          {" "}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {" "}
            {cancelLabel}{" "}
          </Button>{" "}
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {" "}
            {isLoading ? "Processing..." : confirmLabel}{" "}
          </Button>{" "}
        </DialogFooter>{" "}
      </DialogContent>{" "}
    </Dialog>
  );
}
