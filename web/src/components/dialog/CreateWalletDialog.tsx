"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface CreateWalletDialogProps {
  mode?: "text" | "icon";
  className?: string;
}

export default function CreateWalletDialog({
  mode = "text",
  className,
}: CreateWalletDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "text" ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`px-3 py-1.5 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 text-xs text-white/70 hover:text-primary ${className || ""}`}
          >
            Create Wallet
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`p-1.5 bg-neutral-700 border border-neutral-600 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] transition-all duration-300 ease-out group ${className || ""}`}
            aria-label="Create Wallet"
          >
            <Plus className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
          </motion.button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Wallet</DialogTitle>
          <DialogDescription>
            Set up a new wallet for your delegation and strategy management.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70 block mb-1.5">
              Wallet Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 focus:border-primary/50 outline-none text-sm transition-colors"
              placeholder="e.g., Main Trading Wallet"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm bg-neutral-800 border transition-colors"
          >
            Cancel
          </button>
          <button className="px-4 py-2 text-sm text-primary border border-primary  transition-colors">
            Create Wallet
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
