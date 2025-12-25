"use client";

import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
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
import { Plus, Loader2 } from "lucide-react";
import { createDelegationWallet } from "@/actions/delegation.actions";

interface CreateWalletDialogProps {
  mode?: "text" | "icon";
  className?: string;
  onSuccess?: () => void;
}

export default function CreateWalletDialog({
  mode = "text",
  className,
  onSuccess,
}: CreateWalletDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = usePrivy();
  const { wallets } = useWallets();

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Wallet name is required");
      return;
    }

    const walletAddress = user?.wallet?.address;
    if (!walletAddress) {
      setError("No wallet connected");
      return;
    }

    const connectedWallet = wallets.find((w) => w.address === walletAddress);
    if (!connectedWallet) {
      setError("Wallet not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const message = `Create delegation wallet for ${walletAddress}`;
      const signature = await connectedWallet.sign(message);

      const result = await createDelegationWallet(
        walletAddress,
        signature,
        name.trim(),
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      setOpen(false);
      setName("");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setName("");
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {mode === "text" ? (
          <motion.button
            whileHover={{ scale: 1 }}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 focus:border-primary/50 outline-none text-sm transition-colors"
              placeholder="e.g., Main Trading Wallet"
              disabled={loading}
            />
            {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => setOpen(false)}
            disabled={loading}
            className="px-4 py-2 text-sm bg-neutral-800 border transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm text-primary border border-primary transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Wallet
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
