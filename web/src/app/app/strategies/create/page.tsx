"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Wallet, Globe, Save, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import CardLayout from "@/components/layouts/card-layout";
import { useWallets } from "@/hooks/useWallets";
import { createStrategy } from "@/actions/strategy.actions";
import { Button } from "@/components/ui/button";

type ActionMode = "draft" | "activate" | "list" | null;

const CreateStrategyPage = () => {
  const router = useRouter();
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data: wallets, isLoading: walletsLoading } = useWallets(walletAddress);

  const [name, setName] = useState("");
  const [strategyCode, setStrategyCode] = useState("");
  const [actionMode, setActionMode] = useState<ActionMode>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [alsoActivate, setAlsoActivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue =
        strategyCode.substring(0, start) + "  " + strategyCode.substring(end);
      setStrategyCode(newValue);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleSubmit = async () => {
    if (!walletAddress || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await createStrategy(walletAddress, {
        name,
        strategyCode,
        protocols: [],
        status: actionMode === "draft" ? "draft" : "active",
        isPublic: actionMode === "list",
        priceMnt: actionMode === "list" && price ? price : null,
        delegationWalletId:
          actionMode === "activate" || alsoActivate ? selectedWalletId : null,
      });

      if (result.success) {
        router.push("/app/strategies");
      } else {
        console.error("Failed to create strategy:", result.message);
      }
    } catch (error) {
      console.error("Failed to create strategy:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = name.trim() && strategyCode.trim();

  return (
    <div className="w-full h-full">
      <div className="w-full max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/app/strategies">
            <button className="p-1.5 bg-neutral-700 border border-neutral-600 hover:border-primary/50 transition-all duration-200 group">
              <ArrowLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
            </button>
          </Link>
          <div>
            <p className="text-xs text-white/50">// new strategy</p>
            <p className="uppercase">Create Strategy</p>
          </div>
        </div>

        {/* Name Input */}
        <CardLayout>
          <div className="space-y-2">
            <label className="text-xs text-white/50 uppercase">
              Strategy Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ETH Yield Maximizer"
              className="w-full bg-neutral-800 border border-neutral-700 focus:border-primary/50 outline-none px-4 py-3 text-sm placeholder:text-white/30 transition-colors"
            />
          </div>
        </CardLayout>

        {/* Strategy Code Editor */}
        <CardLayout>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/50 uppercase">
                Strategy Steps
              </label>
              <p className="text-xs text-white/40">
                Use &quot;-&quot; for steps, indent for sub-steps
              </p>
            </div>
            <div className="bg-neutral-800 border border-neutral-700 focus-within:border-primary/50 transition-colors">
              <div className="p-3 border-b border-neutral-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                <span className="text-xs text-white/30 ml-2">strategy.md</span>
              </div>
              <textarea
                value={strategyCode}
                onChange={(e) => setStrategyCode(e.target.value)}
                onKeyDown={handleCodeKeyDown}
                placeholder={`- Monitor ETH price every 4 hours
- When ETH drops 5% from 24h high
  - Check available USDC balance
  - Execute swap: 25% of USDC to ETH
- When ETH rises 10% from entry
  - Sell 50% of position
  - Move profits to yield protocol`}
                rows={12}
                className="w-full bg-transparent outline-none px-4 py-3 text-sm placeholder:text-white/30 font-mono resize-none"
              />
            </div>
            <div className="flex items-start gap-2 text-xs text-white/40">
              <span className="px-1.5 py-0.5 bg-neutral-700 text-white/60">
                tip
              </span>
              <span>
                Write your strategy as a series of steps. Use &quot;-&quot; for
                main steps and indent with spaces for sub-steps.
              </span>
            </div>
          </div>
        </CardLayout>

        {/* Action Selection */}
        <CardLayout>
          <div className="space-y-4">
            <label className="text-xs text-white/50 uppercase">
              What do you want to do?
            </label>
            <div className="grid grid-cols-3 gap-3">
              <ActionOption
                icon={<Save className="w-5 h-5" />}
                title="Save as Draft"
                description="Save and activate later"
                selected={actionMode === "draft"}
                onClick={() => setActionMode("draft")}
              />
              <ActionOption
                icon={<Zap className="w-5 h-5" />}
                title="Activate Now"
                description="Start running on a wallet"
                selected={actionMode === "activate"}
                onClick={() => setActionMode("activate")}
              />
              <ActionOption
                icon={<Globe className="w-5 h-5" />}
                title="List on Market"
                description="Sell to other users"
                selected={actionMode === "list"}
                onClick={() => setActionMode("list")}
              />
            </div>

            {/* Activate Options */}
            <AnimatePresence>
              {actionMode === "activate" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-neutral-700 space-y-3">
                    <label className="text-xs text-white/50 uppercase">
                      Select Delegation Wallet
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {walletsLoading ? (
                        <div className="col-span-2 flex items-center justify-center py-4">
                          <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                        </div>
                      ) : wallets.length === 0 ? (
                        <div className="col-span-2 text-center py-4 text-xs text-white/50">
                          No delegation wallets found
                        </div>
                      ) : (
                        wallets.map((wallet) => (
                          <WalletOption
                            key={wallet.id}
                            wallet={wallet}
                            selected={selectedWalletId === wallet.id}
                            onClick={() => setSelectedWalletId(wallet.id)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List Options */}
            <AnimatePresence>
              {actionMode === "list" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-neutral-700 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-white/50 uppercase">
                        Price (MNT)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full bg-neutral-800 border border-neutral-700 focus:border-primary/50 outline-none px-4 py-3 text-sm placeholder:text-white/30 transition-colors pr-16"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/50">
                          MNT
                        </span>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-5 h-5 border flex items-center justify-center transition-all ${
                          alsoActivate
                            ? "bg-primary border-primary"
                            : "border-neutral-600 group-hover:border-primary/50"
                        }`}
                        onClick={() => setAlsoActivate(!alsoActivate)}
                      >
                        {alsoActivate && (
                          <svg
                            className="w-3 h-3 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                        Also activate for myself
                      </span>
                    </label>

                    {alsoActivate && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                      >
                        <label className="text-xs text-white/50 uppercase">
                          Select Delegation Wallet
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {walletsLoading ? (
                            <div className="col-span-2 flex items-center justify-center py-4">
                              <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                            </div>
                          ) : wallets.length === 0 ? (
                            <div className="col-span-2 text-center py-4 text-xs text-white/50">
                              No delegation wallets found
                            </div>
                          ) : (
                            wallets.map((wallet) => (
                              <WalletOption
                                key={wallet.id}
                                wallet={wallet}
                                selected={selectedWalletId === wallet.id}
                                onClick={() => setSelectedWalletId(wallet.id)}
                              />
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardLayout>

        {/* Submit */}
        <div className="flex justify-end gap-3 pb-8">
          <Link href="/app/strategies">
            <Button variant="outline" className="px-6">
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || !actionMode || isSubmitting}
            className="px-6"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {actionMode === "draft" && "Save Draft"}
                {actionMode === "activate" && "Create & Activate"}
                {actionMode === "list" && "Create & List"}
                {!actionMode && "Select an Action"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ActionOption = ({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`p-4 border text-left transition-all duration-200 ${
      selected
        ? "bg-primary/10 border-primary"
        : "bg-neutral-800 border-neutral-700 hover:border-primary/50"
    }`}
  >
    <div
      className={`mb-2 ${selected ? "text-primary" : "text-white/50"} transition-colors`}
    >
      {icon}
    </div>
    <p className={`text-sm font-medium ${selected ? "text-primary" : ""}`}>
      {title}
    </p>
    <p className="text-xs text-white/40 mt-0.5">{description}</p>
  </motion.button>
);

const WalletOption = ({
  wallet,
  selected,
  onClick,
}: {
  wallet: { id: string; name: string; address: string };
  selected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    className={`p-3 border text-left transition-all duration-200 ${
      selected
        ? "bg-primary/10 border-primary"
        : "bg-neutral-800 border-neutral-700 hover:border-primary/50"
    }`}
  >
    <div className="flex items-center gap-2">
      <div
        className={`p-1.5 ${selected ? "bg-primary/20" : "bg-neutral-700"} transition-colors`}
      >
        <Wallet
          className={`w-3 h-3 ${selected ? "text-primary" : "text-white/50"}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-medium truncate ${selected ? "text-primary" : ""}`}
        >
          {wallet.name}
        </p>
        <p className="text-xs text-white/40 truncate">
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </p>
      </div>
    </div>
  </motion.button>
);

export default CreateStrategyPage;
