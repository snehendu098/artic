"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createStrategy,
  fetchDelegationWallets,
  type DelegationWallet,
} from "@/lib/actions";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CreateStrategyPage() {
  const router = useRouter();
  const { user } = usePrivy();

  // Form state
  const [name, setName] = useState("");
  const [strategyContent, setStrategyContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [activateNow, setActivateNow] = useState(false);
  const [selectedDelegation, setSelectedDelegation] = useState<string>("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delegations, setDelegations] = useState<DelegationWallet[]>([]);
  const [delegationsLoading, setDelegationsLoading] = useState(false);

  const userWallet = user?.wallet?.address || "";

  // Fetch delegation wallets when component mounts
  useEffect(() => {
    if (!userWallet) return;

    const fetchDelegations = async () => {
      setDelegationsLoading(true);
      try {
        const data = await fetchDelegationWallets(userWallet);
        setDelegations(data);
      } catch (err) {
        console.error("Failed to fetch delegations:", err);
      } finally {
        setDelegationsLoading(false);
      }
    };

    fetchDelegations();
  }, [userWallet]);

  // Validation
  const isFormValid = () => {
    if (!name.trim()) return false;
    if (!strategyContent.trim()) return false;
    if (activateNow && !selectedDelegation) return false;
    return true;
  };

  // Handle Create & Activate
  const handleCreateAndActivate = async () => {
    if (!userWallet) {
      setError("Wallet not connected");
      return;
    }

    if (!isFormValid()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createStrategy(
        name,
        strategyContent,
        userWallet,
        isPublic,
        true,
        selectedDelegation,
      );

      if (result.success) {
        // Success - redirect to dashboard
        router.push("/");
      } else {
        setError(result.error || "Failed to create strategy");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle Create & Save
  const handleCreateAndSave = async () => {
    if (!userWallet) {
      setError("Wallet not connected");
      return;
    }

    if (!name.trim() || !strategyContent.trim()) {
      setError("Please fill in strategy name and content");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createStrategy(
        name,
        strategyContent,
        userWallet,
        isPublic,
        false,
      );

      if (result.success) {
        // Success - redirect to dashboard
        router.push("/");
      } else {
        setError(result.error || "Failed to create strategy");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <div className=" border-neutral-800/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-xl font-semibold text-white">Create Strategy</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Strategy Details Section */}
          <div className="space-y-4 p-6 bg-neutral-900 border border-neutral-800 rounded-md">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Strategy Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Conservative Growth Strategy"
                disabled={loading}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent disabled:opacity-50 transition-all"
              />
              <p className="text-xs text-neutral-400 mt-1">
                Give your strategy a clear, descriptive name
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Strategy Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={strategyContent}
                onChange={(e) => setStrategyContent(e.target.value)}
                placeholder={`Write your strategy in English with conditions and actions:

- if mantle drops below 10%
  - swap 20% of the usd to mantle
- if the aave is giving more than 4% apy
  - invest 40% of my assets to aave`}
                disabled={loading}
                rows={14}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent disabled:opacity-50 resize-none transition-all whitespace-pre-wrap"
              />
              <p className="text-xs text-neutral-400 mt-2">
                Use bullet points with conditions (if...) and actions (then
                do...). Write in simple English describing what should happen
                under different market conditions.
              </p>
            </div>
          </div>

          {/* Configuration Section */}
          <div className="space-y-4 p-6 bg-neutral-900 border border-neutral-800 rounded-md">
            <h3 className="text-sm font-semibold text-white">Configuration</h3>

            {/* Marketplace Toggle */}
            <div className="flex items-center justify-between pt-2 pb-3 border-b border-neutral-800">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Available in Marketplace
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Allow other users to subscribe to this strategy
                </p>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={loading}
                className="ml-4"
              />
            </div>

            {/* Activate Now Toggle */}
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Activate Now</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Immediately activate this strategy on a delegation wallet
                </p>
              </div>
              <Switch
                checked={activateNow}
                onCheckedChange={setActivateNow}
                disabled={loading}
                className="ml-4"
              />
            </div>
          </div>

          {/* Conditional Delegation Wallet Section */}
          {activateNow && (
            <div className="space-y-4 p-6 bg-neutral-900 border border-neutral-800 rounded-md">
              <label className="block text-sm font-semibold text-white mb-1">
                Select Delegation Wallet <span className="text-red-400">*</span>
              </label>
              <p className="text-xs text-neutral-400 mb-3">
                Choose which delegation wallet to activate this strategy on
              </p>
              <Select
                value={selectedDelegation}
                onValueChange={setSelectedDelegation}
                disabled={loading || delegationsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      delegationsLoading
                        ? "Loading wallets..."
                        : "Select a wallet..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {delegations.map((delegation) => (
                    <SelectItem key={delegation.id} value={delegation.id}>
                      {delegation.delegationWalletAddress}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {delegations.length === 0 && !delegationsLoading && (
                <p className="text-xs text-yellow-600 mt-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                  No delegation wallets found. Create one first.
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <Button
              onClick={() => router.back()}
              variant="outline"
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>

            {activateNow ? (
              <Button
                onClick={handleCreateAndActivate}
                disabled={loading || !isFormValid()}
                className="px-6 gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Create & Activate
              </Button>
            ) : (
              <Button
                onClick={handleCreateAndSave}
                disabled={loading || !name.trim() || !strategyContent.trim()}
                className="px-6 gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Create & Save
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
