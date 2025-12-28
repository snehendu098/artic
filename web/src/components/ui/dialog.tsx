"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
};

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dialog = ({ children, open, onOpenChange }: DialogProps) => {
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
    <DialogContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DialogTrigger = ({ children, asChild }: DialogTriggerProps) => {
  const { setOpen } = useDialog();

  if (asChild && typeof children === "object" && children !== null) {
    const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
    const childProps = child.props as Record<string, unknown>;
    return (
      <child.type
        {...childProps}
        onClick={(e: React.MouseEvent) => {
          child.props.onClick?.(e);
          setOpen(true);
        }}
      />
    );
  }

  return <div onClick={() => setOpen(true)}>{children}</div>;
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogContent = ({ children, className }: DialogContentProps) => {
  const { open, setOpen } = useDialog();
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`relative w-full max-w-lg bg-neutral-900 border border-neutral-800 p-6 shadow-xl ${className || ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
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

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogHeader = ({ children, className }: DialogHeaderProps) => {
  return (
    <div className={`flex flex-col space-y-1.5 mb-4 ${className || ""}`}>
      {children}
    </div>
  );
};

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogTitle = ({ children, className }: DialogTitleProps) => {
  return (
    <h2 className={`text-lg font-semibold text-white ${className || ""}`}>
      {children}
    </h2>
  );
};

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogDescription = ({
  children,
  className,
}: DialogDescriptionProps) => {
  return (
    <p className={`text-sm text-white/50 ${className || ""}`}>{children}</p>
  );
};

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogFooter = ({ children, className }: DialogFooterProps) => {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 ${className || ""}`}
    >
      {children}
    </div>
  );
};
