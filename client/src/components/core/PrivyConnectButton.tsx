"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Copy, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createPublicClient, http, formatEther } from "viem";
import { mantleSepoliaTestnet, mantle } from "viem/chains";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MANTLE_SEPOLIA = mantleSepoliaTestnet;
const MANTLE_MAINNET = mantle;

const chainConfig: Record<number, { name: string; rpcUrl: string }> = {
  [MANTLE_SEPOLIA.id]: {
    name: "Mantle Sepolia",
    rpcUrl: "https://rpc.sepolia.mantle.xyz",
  },
  [MANTLE_MAINNET.id]: {
    name: "Mantle Mainnet",
    rpcUrl: "https://rpc.mantle.xyz",
  },
};

export function PrivyConnectButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const address = user?.wallet?.address as `0x${string}` | undefined;
  const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  // Fetch balance and chain info
  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      try {
        setIsLoadingBalance(true);

        // Check if window.ethereum exists for chain detection
        if (typeof window !== "undefined" && window.ethereum) {
          // Get current chain
          const chainIdHex = await window.ethereum.request({
            method: "eth_chainId",
          });
          const currentChainId = parseInt(chainIdHex, 16);
          setChainId(currentChainId);

          // Fetch balance from the current chain
          const client = createPublicClient({
            chain: undefined,
            transport: http(chainConfig[currentChainId]?.rpcUrl),
          });

          const balanceWei = await client.getBalance({ address });
          const balanceFormatted = formatEther(balanceWei);
          const balanceRounded = parseFloat(balanceFormatted).toFixed(4);
          setBalance(balanceRounded);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchData();

    // Listen for chain change events
    if (typeof window !== "undefined" && window.ethereum) {
      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
      };

      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [address, chainId]);

  const handleCopyAddress = async (addr: string) => {
    await navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) {
      console.error("window.ethereum is not available");
      return;
    }

    try {
      const chainIdHex = `0x${targetChainId.toString(16)}`;
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
      // Refresh balance after successful network switch
      setChainId(targetChainId);
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, try adding it
        const chain = targetChainId === MANTLE_MAINNET.id ? MANTLE_MAINNET : MANTLE_SEPOLIA;
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chain.id.toString(16)}`,
                chainName: chain.name,
                rpcUrls: [chain.rpcUrls.default.http[0]],
                nativeCurrency: chain.nativeCurrency,
                blockExplorerUrls: [chain.blockExplorers?.default.url || ""],
              },
            ],
          });
          setChainId(targetChainId);
        } catch (addError) {
          console.error("Error adding chain:", addError);
        }
      } else {
        console.error("Error switching network:", error);
      }
    }
  };

  if (!ready) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (authenticated && address) {
    const currentChainName =
      chainId && chainConfig[chainId]
        ? chainConfig[chainId].name
        : "Unknown Network";
    const isMantle = Object.keys(chainConfig).includes(String(chainId));

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-4 py-2 text-primary border bg-card font-medium hover:opacity-80 transition-opacity">
            {displayAddress}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          {/* Wallet Address Section */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Wallet Address
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleCopyAddress(address)}
              className="text-xs flex items-center justify-between gap-2"
            >
              <span>{displayAddress}</span>
              <Copy className="h-3 w-3" />
            </DropdownMenuItem>
            {copied && (
              <div className="text-xs text-center text-green-600 py-1">
                Copied!
              </div>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Network Section */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Network
            </DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs font-normal">
              {isLoadingBalance ? "Loading..." : currentChainName}
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          {/* Balance Section */}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Balance
            </DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs font-normal">
              {isLoadingBalance ? "Loading..." : `${balance || "0.0000"} MNT`}
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          {/* Chain Switching Section */}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Switch Network
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => switchNetwork(MANTLE_SEPOLIA.id)}
              className="text-xs flex items-center justify-between gap-2"
            >
              <span>Mantle Sepolia</span>
              {chainId === MANTLE_SEPOLIA.id && (
                <div className="h-2 w-2 rounded-full bg-green-500" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => switchNetwork(MANTLE_MAINNET.id)}
              className="text-xs flex items-center justify-between gap-2"
            >
              <span>Mantle Mainnet</span>
              {chainId === MANTLE_MAINNET.id && (
                <div className="h-2 w-2 rounded-full bg-green-500" />
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={logout}
          >
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <button
      onClick={login}
      className="px-4 py-2 text-primary border bg-card font-medium hover:opacity-80 transition-opacity"
    >
      Connect Wallet
    </button>
  );
}
