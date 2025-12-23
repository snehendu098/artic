"use client";

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { motion } from "motion/react";
import { Dispatch, SetStateAction } from "react";
import { NAV_LINKS } from "@/constants";

const LogoSection = () => {
  const { open, animate } = useSidebar();

  return (
    <div className="flex items-center justify-start gap-2 group/sidebar py-2 shrink-0 h-[55px] px-4 border-b">
      <div className="shrink-0">
        <Image
          src="/logo.png"
          alt="ARTIC Logo"
          width={20}
          height={20}
          priority
        />
      </div>
      <motion.p
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
        }}
        transition={{ duration: 0.3 }}
        className="text-neutral-700 dark:text-neutral-200 text-base font-semibold group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block p-0! m-0!"
      >
        ARTIC
      </motion.p>
    </div>
  );
};

const SidebarNav = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between border-r gap-0 h-screen p-0 overflow-hidden">
        <div className="flex flex-col gap-0 w-full shrink-0">
          {/* Logo with Image */}
          <div className="shrink-0">
            <LogoSection />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1 py-4 shrink-0">
            {NAV_LINKS.map((link, idx) => (
              <SidebarLink key={idx} link={link} index={idx} />
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export default SidebarNav;
