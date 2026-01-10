"use client";

import {
  getLinkByUrl,
  getLinkIndexByUrl,
  generateTitleFromUrl,
} from "@/constants";
import { motion } from "framer-motion";
import CreateWalletDialog from "@/components/dialog/CreateWalletDialog";
import Link from "next/link";

interface HeaderProps {
  url: string;
  name?: string;
  description?: string;
  number?: number;
  indexEnabled?: boolean;
  showActions?: boolean;
  onWalletCreated?: () => void;
}

const Header = ({
  url,
  name,
  description,
  number,
  indexEnabled = true,
  showActions = false,
  onWalletCreated,
}: HeaderProps) => {
  const linkConfig = getLinkByUrl(url);
  const linkIndex = getLinkIndexByUrl(url);

  const displayName =
    name ?? linkConfig?.name ?? linkConfig?.label ?? generateTitleFromUrl(url);
  const displayDescription = description ?? linkConfig?.description;
  const displayNumber = number ?? (linkIndex !== -1 ? linkIndex : undefined);
  const showIndex = indexEnabled && (linkConfig?.indexEnabled ?? true);

  return (
    <div className="w-full flex justify-between items-center">
      <div>
        <div className="flex items-center space-x-2">
          {showIndex && displayNumber !== undefined && (
            <p className="px-2 bg-neutral-800">
              {displayNumber.toString().padStart(2, "0")}
            </p>
          )}

          <p className="text-lg">{displayName}</p>
        </div>
        {displayDescription && (
          <p className="text-sm text-muted-foreground">{displayDescription}</p>
        )}
      </div>
      {showActions && (
        <div className="flex items-center gap-2">
          <Link href="/app/strategies/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 text-xs text-white/70 hover:text-primary"
            >
              Create Strategy
            </motion.button>
          </Link>

          <CreateWalletDialog mode="text" onSuccess={onWalletCreated} />
        </div>
      )}
    </div>
  );
};

export default Header;
