"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Globe,
  Wallet,
  Loader2,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import CardLayout from "@/components/layouts/card-layout";
import { Button } from "@/components/ui/button";
import CreateWalletDialog from "@/components/dialog/CreateWalletDialog";
import type { Strategy } from "@/types";

interface StrategyActionsPanelProps {
  strategy: Strategy;
  isCreator: boolean;
  wallets: Array<{ id: string; name: string; address: string }>;
  onActivate: (walletId: string) => Promise<void>;
  onPublish: (price?: string) => Promise<void>;
  onWalletCreated?: () => void;
  hasSubscription?: boolean;
}

const StrategyActionsPanel = ({
  strategy,
  isCreator,
  wallets,
  onActivate,
  onPublish,
  onWalletCreated,
  hasSubscription,
}: StrategyActionsPanelProps) => {
  const [expandedSection, setExpandedSection] = useState<
    "activate" | "publish" | null
  >("activate");
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDraft = strategy.status === "draft";
  const isPublic = strategy.isPublic;

  const handleActivate = async () => {
    if (!selectedWalletId || isSubmitting) return;
    setIsSubmitting(true);
    await onActivate(selectedWalletId);
    setIsSubmitting(false);
    setExpandedSection(null);
  };

  const handlePublish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await onPublish(price || undefined);
    setIsSubmitting(false);
    setExpandedSection(null);
  };

  const toggleSection = (section: "activate" | "publish") => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <CardLayout>
      <div className="space-y-3">
        <p className="text-xs text-white/50 uppercase">Actions</p>

        {/* Activate Section */}
        {!hasSubscription && (
          <div className="border border-neutral-700">
            <button
              onClick={() => toggleSection("activate")}
              className="w-full p-3 flex items-center justify-between hover:bg-neutral-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm">Activate Strategy</span>
              </div>
              {expandedSection === "activate" ? (
                <ChevronUp className="w-4 h-4 text-white/50" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/50" />
              )}
            </button>

            <AnimatePresence>
              {expandedSection === "activate" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 border-t border-neutral-700 space-y-3">
                    <p className="text-xs text-white/50">
                      Select a delegation wallet
                    </p>
                    {wallets.length === 0 ? (
                      <div className="space-y-3">
                        <p className="text-xs text-white/40">
                          You need a delegation wallet to activate this strategy
                        </p>
                        <CreateWalletDialog
                          mode="text"
                          onSuccess={onWalletCreated}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {wallets.map((wallet) => (
                          <WalletOption
                            key={wallet.id}
                            wallet={wallet}
                            selected={selectedWalletId === wallet.id}
                            onClick={() => setSelectedWalletId(wallet.id)}
                          />
                        ))}
                      </div>
                    )}
                    {wallets.length > 0 && (
                      <Button
                        onClick={handleActivate}
                        disabled={!selectedWalletId || isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Activate"
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Publish Section - Only for creators who haven't published yet */}
        {isCreator && !isPublic && (
          <div className="border border-neutral-700">
            <button
              onClick={() => toggleSection("publish")}
              className="w-full p-3 flex items-center justify-between hover:bg-neutral-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm">Make Public</span>
              </div>
              {expandedSection === "publish" ? (
                <ChevronUp className="w-4 h-4 text-white/50" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/50" />
              )}
            </button>

            <AnimatePresence>
              {expandedSection === "publish" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 pt-0 border-t border-neutral-700 space-y-3">
                    <div className="space-y-2">
                      <p className="text-xs text-white/50">Price (optional)</p>
                      <div className="relative">
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full bg-neutral-800 border border-neutral-700 focus:border-primary/50 outline-none px-3 py-2 text-sm placeholder:text-white/30 transition-colors pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50">
                          MNT
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={handlePublish}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Publish"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </CardLayout>
  );
};

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

export default StrategyActionsPanel;
