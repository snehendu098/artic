import CoreLayout from "@/components/layouts/core-layout";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <CoreLayout>{children}</CoreLayout>;
};

export default layout;
