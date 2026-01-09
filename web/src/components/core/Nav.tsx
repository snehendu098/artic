"use client";

import { IconMenu2, IconWallet, IconLogout } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

const Nav = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const pathname = usePathname();
  const { login, logout, authenticated, user } = usePrivy();

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
