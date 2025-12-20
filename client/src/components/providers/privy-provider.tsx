"use client";

import { PrivyProvider as PrivyProviderComponent } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { mantleSepoliaTestnet, mantle } from "viem/chains";

export function PrivyProvider({ children }: { children: ReactNode }) {
  return (
    <PrivyProviderComponent
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#BE502C",
        },
        supportedChains: [mantle, mantleSepoliaTestnet],
        defaultChain: mantleSepoliaTestnet,
      }}
    >
      {children}
    </PrivyProviderComponent>
  );
}
