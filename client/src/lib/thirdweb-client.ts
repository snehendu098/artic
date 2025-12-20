"use client";

import { createThirdwebClient, defineChain, getContract } from "thirdweb";

console.log(process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID);

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// export const contract = getContract({
//   client,
//   chain: defineChain(39),
//   address: "0x9Fe9004AecD7eE38342EfAfA3feBaF3AE3eDE0A6",
// });
