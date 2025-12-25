"use client";

import { IconMenu2, IconWallet, IconLogout, IconChevronDown } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState, useRef, useEffect } from "react";
import { mantle, mantleSepoliaTestnet } from "viem/chains";
import { motion, AnimatePresence } from "framer-motion";

const SUPPORTED_CHAINS = [
  { chain: mantle, name: "Mantle", color: "#000" },
  { chain: mantleSepoliaTestnet, name: "Sepolia", color: "#6366f1" },
] as const;

const Nav = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const pathname = usePathname();
  const { login, logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [localChainId, setLocalChainId] = useState<number>(mantleSepoliaTestnet.id);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeWallet = wallets.find((w) => w.address === user?.wallet?.address);
  const currentNetwork = SUPPORTED_CHAINS.find((n) => n.chain.id === localChainId) || SUPPORTED_CHAINS[1];

  // Sync initial chainId from wallet
  useEffect(() => {
    if (activeWallet?.chainId) {
      setLocalChainId(parseInt(activeWallet.chainId.split(":")[1]));
    }
  }, [activeWallet?.chainId]);

  // Listen to provider chainChanged event
  useEffect(() => {
    if (!activeWallet) return;

    let provider: any;
    let handleChainChanged: (chainIdHex: string) => void;

    (async () => {
      provider = await activeWallet.getEthereumProvider();
      handleChainChanged = (chainIdHex: string) => {
        setLocalChainId(parseInt(chainIdHex, 16));
      };
      provider.on("chainChanged", handleChainChanged);
    })();

    return () => {
      if (provider && handleChainChanged) {
        provider.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [activeWallet]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNetworkOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNetworkSwitch = async (chainId: number) => {
    if (!activeWallet || localChainId === chainId) {
      setIsNetworkOpen(false);
      return;
    }
    setIsSwitching(true);
    try {
      await activeWallet.switchChain(chainId);
      // Optimistic update - event listener will also fire
      setLocalChainId(chainId);
    } catch (err) {
      console.error("Failed to switch network:", err);
    } finally {
      setIsSwitching(false);
      setIsNetworkOpen(false);
    }
  };

  // Get the current section name from pathname
  const getSectionName = () => {
    if (pathname.startsWith('/app/strategies')) return 'strategies';
    if (pathname.startsWith('/app/dashboard')) return 'dashboard';
    if (pathname.startsWith('/app/marketplace')) return 'marketplace';
    return 'dashboard';
  };

  // Truncate wallet address
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const walletAddress = user?.wallet?.address;

  return (
    <div className="w-full flex items-center justify-between border-b h-[55px] bg-background px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1 bg-neutral-800 hover:bg-primary/60 border transition-colors duration-300"
          aria-label="Toggle sidebar"
        >
          <IconMenu2 className="w-5 h-5 text-white/60 hover:text-white transition-colors duration-300" />
        </button>
        <div className="text-muted-foreground">
          // <span className="text-white text-sm uppercase">{getSectionName()}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {authenticated && walletAddress ? (
          <div className="flex items-center gap-2">
            {/* Network Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsNetworkOpen(!isNetworkOpen)}
                disabled={isSwitching}
                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-colors duration-200 text-sm"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentNetwork.chain.id === mantle.id ? "#22c55e" : "#6366f1" }}
                />
                <span className="text-white/70">
                  {isSwitching ? "Switching..." : currentNetwork.name}
                </span>
                <IconChevronDown
                  className={`w-3 h-3 text-white/50 transition-transform duration-200 ${isNetworkOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isNetworkOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1 w-40 bg-neutral-800 border border-neutral-700 z-50"
                  >
                    {SUPPORTED_CHAINS.map((network) => (
                      <button
                        key={network.chain.id}
                        onClick={() => handleNetworkSwitch(network.chain.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-150 ${
                          localChainId === network.chain.id
                            ? "bg-neutral-700 text-white"
                            : "text-white/70 hover:bg-neutral-700/50 hover:text-white"
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: network.chain.id === mantle.id ? "#22c55e" : "#6366f1" }}
                        />
                        {network.name}
                        {localChainId === network.chain.id && (
                          <span className="ml-auto text-xs text-white/40">•</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wallet Address */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-sm">
              <IconWallet className="w-4 h-4 text-primary" />
              <span className="text-white/70 font-mono">{truncateAddress(walletAddress)}</span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 bg-neutral-800 hover:bg-red-500/20 border border-neutral-700 hover:border-red-500/50 transition-colors duration-300"
              aria-label="Disconnect wallet"
            >
              <IconLogout className="w-4 h-4 text-white/60 hover:text-red-400" />
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-primary/20 border border-neutral-700 hover:border-primary/50 transition-colors duration-300 text-sm"
          >
            <IconWallet className="w-4 h-4 text-primary" />
            <span className="text-white/70">Connect Wallet</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Nav;
