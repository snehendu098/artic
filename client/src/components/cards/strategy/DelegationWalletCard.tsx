import { Wallet, AlertCircle, Copy } from "lucide-react";
import { useState } from "react";

interface DelegationWalletCardProps {
  wallet: string | null;
  isActive: boolean;
}

export default function DelegationWalletCard({
  wallet,
  isActive,
}: DelegationWalletCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-lg border border-white/10 bg-card gradient-card-subtle backdrop-blur-sm p-6 h-full flex flex-col justify-between" >
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-white/60" />
          <p className="text-white/60 text-sm font-medium">Delegation Wallet</p>
        </div>

        {isActive && wallet ? (
          <>
            <div className="bg-white/5 rounded border border-white/5 p-3 mb-4">
              <p className="text-white/90 text-xs font-mono break-all">
                {wallet}
              </p>
            </div>
            <p className="text-green-400/80 text-xs mb-4">Connected & Active</p>
          </>
        ) : isActive && !wallet ? (
          <div className="flex items-start gap-2 text-yellow-500/90 text-xs mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>No delegation wallet found</span>
          </div>
        ) : (
          <p className="text-white/40 text-sm mb-4">
            Subscribe to the strategy to see delegation wallet
          </p>
        )}
      </div>

      {isActive && wallet && (
        <button
          onClick={copyToClipboard}
          className="w-full mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 py-3 px-4 rounded border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors text-white/80 hover:text-white text-sm font-medium"
        >
          <Copy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy private key"}
        </button>
      )}
    </div>
  );
}
