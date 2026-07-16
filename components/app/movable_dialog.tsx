"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { twMerge } from "tailwind-merge";

type MovableDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  children?: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  isDirty?: boolean;
};

export default function MovableDialog({
  open,
  setOpen,
  header,
  className,
  title,
  children,
}: MovableDialogProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className={twMerge("p-0 border-0 shadow-none min-w-3xl ", className)}
      >
        <div className="fixed inset-0 pointer-events-none w-full">
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={false}
            className="bg-white translate-y-[-45%] rounded-xl shadow-xl w-full pointer-events-auto cursor-move"
            initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
          >
            <DialogHeader className="h-14 py-3 px-4  rounded-t-xl bg-primary">
              {header ? (
                header
              ) : (
                <DialogTitle className="text-primary-foreground">
                  {title}
                </DialogTitle>
              )}
            </DialogHeader>

            <div className="p-4">{children}</div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
