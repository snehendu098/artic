"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { mantle } from "viem/chains";

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
        appearance: {
          theme: "dark",
        },
        supportedChains: [mantle],
        defaultChain: mantle,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
