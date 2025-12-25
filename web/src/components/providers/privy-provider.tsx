"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { mantle, mantleSepoliaTestnet } from "viem/chains";

export default function PrivyProviderMain({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        supportedChains: [mantleSepoliaTestnet, mantle],
        defaultChain: mantleSepoliaTestnet,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
