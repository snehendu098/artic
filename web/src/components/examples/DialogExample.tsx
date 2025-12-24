"use client";

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

export default function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 text-xs text-white/70 hover:text-primary"
        >
          Open Dialog
        </motion.button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Strategy</DialogTitle>
          <DialogDescription>
            Set up your automated trading strategy. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        {/* Your custom content goes here */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70">Strategy Name</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 focus:border-primary/50 outline-none text-sm"
              placeholder="Enter strategy name"
            />
          </div>
          <div>
            <label className="text-sm text-white/70">Description</label>
            <textarea
              className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 focus:border-primary/50 outline-none text-sm resize-none"
              placeholder="Describe your strategy"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Dialog>
            <DialogTrigger asChild>
              <button className="px-4 py-2 text-sm bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-colors">
                Cancel
              </button>
            </DialogTrigger>
          </Dialog>
          <button className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 transition-colors">
            Create Strategy
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
