"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface InfoPopupContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const InfoPopupContext = createContext<InfoPopupContextType | undefined>(
  undefined
);

const useInfoPopup = () => {
  const context = useContext(InfoPopupContext);
  if (!context) {
    throw new Error("InfoPopup components must be used within an InfoPopup");
  }
  return context;
};

interface InfoPopupProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const InfoPopup = ({ children, open, onOpenChange }: InfoPopupProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <InfoPopupContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </InfoPopupContext.Provider>
  );
};

interface InfoPopupTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const InfoPopupTrigger = ({
  children,
  asChild,
}: InfoPopupTriggerProps) => {
  const { setOpen } = useInfoPopup();

  if (asChild && typeof children === "object" && children !== null) {
    const child = children as React.ReactElement;
    return (
      <child.type
        {...child.props}
        onClick={(e: React.MouseEvent) => {
          child.props.onClick?.(e);
          setOpen(true);
        }}
      />
    );
  }

  return <div onClick={() => setOpen(true)}>{children}</div>;
};

interface InfoPopupContentProps {
  children: React.ReactNode;
  className?: string;
}

export const InfoPopupContent = ({
  children,
  className,
}: InfoPopupContentProps) => {
  const { open, setOpen } = useInfoPopup();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, setOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setOpen(false)}
          />

          {/* Popup */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-[55px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`relative w-full h-full bg-background overflow-hidden ${className || ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-6 top-6 z-10 p-2 rounded-sm opacity-70 hover:opacity-100 transition-opacity hover:bg-neutral-800"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>

              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
