import React from "react";

const CardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full p-6 bg-neutral-900 hover:border-primary transition duration-500 space-y-4 border">
      {children}
    </div>
  );
};

export default CardLayout;
