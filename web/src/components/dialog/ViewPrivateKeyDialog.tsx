"use client";

import { useState, useRef, useCallback } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Loader2, Copy, Check } from "lucide-react";
import { revealPrivateKey } from "@/actions/delegation.actions";

interface ViewPrivateKeyDialogProps {
  delegationId: string;
  walletName: string;
  className?: string;
}

type DialogState = "idle" | "holding" | "signing" | "revealed";

const HOLD_DURATION = 2000;

export default function ViewPrivateKeyDialog({
  delegationId,
  walletName,
  className,
}: ViewPrivateKeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<DialogState>("idle");
  const [progress, setProgress] = useState(0);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = usePrivy();
  const { wallets } = useWallets();

  const clearTimers = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const handleReveal = useCallback(async () => {
    const walletAddress = user?.wallet?.address;
    if (!walletAddress) {
      setError("No wallet connected");
      setState("idle");
      return;
    }

    const connectedWallet = wallets.find((w) => w.address === walletAddress);
    if (!connectedWallet) {
      setError("Wallet not found");
      setState("idle");
      return;
    }

    setState("signing");
    setError(null);

    try {
      const message = `View private key for delegation ${delegationId}`;
      const signature = await connectedWallet.sign(message);

      const result = await revealPrivateKey(walletAddress, delegationId, signature);

      if (!result.success || !result.privateKey) {
        setError(result.message);
        setState("idle");
        return;
      }

      setPrivateKey(result.privateKey);
      setState("revealed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reveal key");
      setState("idle");
    }
  }, [user, wallets, delegationId]);

  const handleHoldStart = useCallback(() => {
    if (state !== "idle") return;

    setState("holding");
    setProgress(0);

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(newProgress);
    }, 16);

    holdTimerRef.current = setTimeout(() => {
      clearTimers();
      setProgress(100);
      handleReveal();
    }, HOLD_DURATION);
  }, [state, clearTimers, handleReveal]);

  const handleHoldEnd = useCallback(() => {
    if (state !== "holding") return;
    clearTimers();
    setState("idle");
    setProgress(0);
  }, [state, clearTimers]);

  const handleCopy = () => {
    if (!privateKey) return;
    navigator.clipboard.writeText(privateKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      clearTimers();
      setState("idle");
      setProgress(0);
      setPrivateKey(null);
      setError(null);
      setCopied(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`p-1.5 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 ${className || ""}`}
          aria-label="View Private Key"
          onClick={(e) => e.stopPropagation()}
        >
          <Key className="w-3.5 h-3.5 text-white/50 hover:text-primary transition-colors" />
        </motion.button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Private Key</DialogTitle>
          <DialogDescription>
            {walletName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <AnimatePresence mode="wait">
            {state !== "revealed" ? (
              <motion.div
                key="hold-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <motion.button
                    onMouseDown={handleHoldStart}
                    onMouseUp={handleHoldEnd}
                    onMouseLeave={handleHoldEnd}
                    onTouchStart={handleHoldStart}
                    onTouchEnd={handleHoldEnd}
                    disabled={state === "signing"}
                    className="w-full py-4 bg-neutral-800 border border-neutral-700 text-sm text-white/70 relative overflow-hidden disabled:opacity-50 select-none"
                  >
                    <motion.div
                      className="absolute inset-0 bg-primary/20"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: progress / 100 }}
                      style={{ transformOrigin: "left" }}
                      transition={{ duration: 0.05 }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {state === "signing" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Signing...
                        </>
                      ) : state === "holding" ? (
                        `${Math.floor(progress)}%`
                      ) : (
                        "Press and Hold to Reveal"
                      )}
                    </span>
                  </motion.button>
                </div>

                {error && (
                  <p className="text-xs text-red-400 text-center">{error}</p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="revealed-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="p-4 bg-neutral-800 border border-neutral-700 font-mono text-xs break-all text-white/70">
                  {privateKey}
                </div>
                <button
                  onClick={handleCopy}
                  className="w-full py-2 bg-neutral-800 border border-neutral-700 hover:border-primary/50 text-sm text-white/70 hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Private Key
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
