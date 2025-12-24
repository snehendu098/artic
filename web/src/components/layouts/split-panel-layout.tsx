"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface SplitPanelLayoutProps {
  backUrl: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  sidePanel?: ReactNode;
  isPanelOpen: boolean;
}

const SplitPanelLayout = ({
  backUrl,
  title,
  subtitle,
  children,
  sidePanel,
  isPanelOpen,
}: SplitPanelLayoutProps) => {
  return (
    <div className="w-full h-full relative">
      <div className="flex items-start gap-4">
        <motion.div
          animate={{
            x: isPanelOpen ? 0 : "33.33%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-[60%] flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <Link href={backUrl}>
              <button className="p-1.5 bg-neutral-700 border border-neutral-600 hover:border-primary/50 transition-all duration-200 group">
                <ArrowLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
              </button>
            </Link>
            <div>
              <p className="text-xs text-white/50">{subtitle}</p>
              <p className="uppercase">{title}</p>
            </div>
          </div>

          <div className="w-full mt-4">{children}</div>
        </motion.div>

        <AnimatePresence>{sidePanel}</AnimatePresence>
      </div>
    </div>
  );
};

export default SplitPanelLayout;
