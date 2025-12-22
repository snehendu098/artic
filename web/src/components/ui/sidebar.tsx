"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden md:flex md:flex-col bg-sidebar w-[300px] shrink-0",
          className,
        )}
        animate={{
          width: animate ? (open ? "300px" : "60px") : "300px",
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full",
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className,
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  index = 0,
  className,
  ...props
}: {
  link: Links;
  index?: number;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Check if the link is active based on the current pathname
  const isActive = pathname.startsWith(link.href);

  return (
    <motion.a
      href={link.href}
      className={cn(
        "flex items-center transition-all duration-300",
        open ? "justify-start gap-2 py-2 px-4 mx-4" : "justify-center py-2",
        "text-white/60 hover:bg-neutral-800/50",
        "border-l-2 border-l-transparent",
        isActive &&
          "bg-neutral-800/50 border-l-[var(--primary)] text-[var(--primary)]",
        isHovered && !isActive && "border-l-white text-white",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Index number - only show when sidebar is open */}
      <motion.span
        animate={{
          width: animate ? (open ? 24 : 0) : 24,
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        className={cn(
          "font-mono text-xs text-center overflow-hidden flex-shrink-0 transition-colors duration-300",
          isActive && "text-[var(--primary)]",
          isHovered && !isActive && "text-white",
          !isActive && !isHovered && "text-gray-500",
        )}
      >
        {String(index).padStart(2, "0")}
      </motion.span>

      {/* Icon */}
      <div
        className={cn(
          "transition-colors duration-300 flex-shrink-0",
          isActive && "text-[var(--primary)]",
          isHovered && !isActive && "text-white",
          !isActive && !isHovered && "text-white/60",
        )}
      >
        {link.icon}
      </div>

      {/* Label */}
      <motion.div
        animate={{
          maxWidth: animate ? (open ? 500 : 0) : 500,
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        className="overflow-hidden"
      >
        <span className="font-mono uppercase text-sm whitespace-nowrap !p-0 !m-0">
          {link.label}
        </span>
      </motion.div>
    </motion.a>
  );
};
