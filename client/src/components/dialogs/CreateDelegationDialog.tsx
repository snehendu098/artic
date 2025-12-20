"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createDelegationWallet } from "@/lib/actions";
import { X, CheckCircle2, AlertCircle, Loader2, Lock } from "lucide-react";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

interface CreateDelegationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type DialogState = "confirm" | "loading" | "success" | "error";

export default function CreateDelegationDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateDelegationDialogProps) {
  const { user } = usePrivy();
  const [state, setState] = useState<DialogState>("confirm");
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!user?.wallet?.address) {
      setError("Wallet not connected");
      setState("error");
      return;
    }

    if (!user?.wallet) {
      setError("No embedded or connected wallet found");
      setState("error");
      return;
    }

    setState("loading");
    setError(null);

    try {
      // Sign a message to prove ownership
      const message = `Create delegation wallet for ${user.wallet.address}`;
      console.log("📝 Signing message:", message);
      console.log("🔑 User wallet:", user.wallet);

      let signature;
      try {
        console.log("🔐 Signing with main wallet (MetaMask)...");

        // Get the window.ethereum provider
        if (!window.ethereum) {
          throw new Error("MetaMask wallet not found");
        }

        // Create a wallet client from the injected provider
        const client = createWalletClient({
          chain: mainnet,
          transport: custom(window.ethereum),
        });

        // Get the connected account
        const accounts = await client.getAddresses();
        if (!accounts || accounts.length === 0) {
          throw new Error("No wallet account found");
        }

        // Sign the message with the main wallet
        const signatureResult = await client.signMessage({
          account: accounts[0],
          message,
        });

        signature = signatureResult;
        console.log("✅ Signature result:", signature.substring(0, 20) + "...");
      } catch (signError) {
        console.error("❌ Error from wallet signing:", signError);
        console.error("❌ Error details:", {
          name: signError instanceof Error ? signError.name : "Unknown",
          message: signError instanceof Error ? signError.message : "Unknown error",
        });
        throw signError;
      }

      if (!signature) {
        throw new Error("Failed to get signature from wallet");
      }

      console.log("🔐 Signature extracted:", signature.substring(0, 20) + "...");

      // Create the delegation wallet with the signature
      console.log("🚀 Creating delegation wallet...");
      const response = await createDelegationWallet(
        user.wallet.address,
        signature,
      );

      console.log("📦 Creation response:", response);

      if (response.success) {
        setState("success");
        // Auto close after 2 seconds
        setTimeout(() => {
          handleClose();
          onSuccess();
        }, 2000);
      } else {
        setError(response.error || "Failed to create delegation wallet");
        setState("error");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create delegation wallet";
      console.error("❌ Error:", errorMessage);
      setError(errorMessage);
      setState("error");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setState("confirm");
      setError(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] bg-neutral-900 border-neutral-800 p-0 overflow-hidden rounded-2xl">
        <DialogTitle className="sr-only">Create Delegation Wallet</DialogTitle>
        {/* Confirm State */}
        {state === "confirm" && (
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-primary/30"></div>
                <Lock className="text-primary" size={36} />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white">
                Create Delegation Wallet
              </h2>
              <p className="text-neutral-400">
                Sign a message to prove ownership of your wallet and create a
                new delegation wallet.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 rounded-lg border-neutral-700 text-neutral-300 hover:bg-neutral-900"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold"
              >
                Confirm & Sign
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {state === "loading" && (
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-primary/30"></div>
                <Loader2 className="text-primary animate-spin" size={40} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-white">
                Signing Message
              </p>
              <p className="text-sm text-neutral-400">
                Please confirm the signature in your wallet
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {state === "success" && (
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-primary"></div>
                <CheckCircle2 className="text-primary" size={48} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">All done!</p>
              <p className="text-sm text-neutral-400">
                Your delegation wallet has been created successfully
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold"
            >
              Close
            </Button>
          </div>
        )}

        {/* Error State */}
        {state === "error" && (
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-red-600/50"></div>
                <AlertCircle className="text-red-600" size={48} />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-lg font-semibold text-white">
                Something went wrong
              </p>
              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 rounded-lg border-neutral-700 text-neutral-300 hover:bg-neutral-900"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setState("confirm")}
                className="flex-1 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
