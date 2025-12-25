import { cn } from "@/lib/utils";
import React from "react";
import { ClassNameValue } from "tailwind-merge";
import { MagicCard } from "../ui/magic-card";

const CoreCardLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: ClassNameValue;
}) => {
  return (
    <div
      className={cn(
        className,
        "gradient-card-subtle p-4 rounded-lg border bg-card",
      )}
    >
      {children}
    </div>
  );
};

export default CoreCardLayout;
