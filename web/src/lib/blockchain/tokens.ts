import type { Address } from "viem";
import { mantle, mantleSepoliaTestnet } from "viem/chains";

export interface TokenConfig {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
}

// Mainnet tokens (Chain ID: 5000)
const MAINNET_TOKENS: TokenConfig[] = [
  {
    address: "0x09Bc4E0D10C81b3a3766c49F0f98a8aaa7adA8D2",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
  {
    address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
  },
  {
    address: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
    symbol: "WMNT",
    name: "Wrapped Mantle",
    decimals: 18,
  },
  {
    address: "0xcDA86A272531e8640cD7F1a92c01839911B90bb0",
    symbol: "mETH",
    name: "Mantle Staked Ether",
    decimals: 18,
  },
  {
    address: "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
  },
  {
    address: "0x25356aeca4210eF7553140edb9b8026089E49396",
    symbol: "LEND",
    name: "Lendle Protocol Token",
    decimals: 18,
  },
  {
    address: "0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
  },
  {
    address: "0xc96de26018a54d51c097160568752c4e3bd6c364",
    symbol: "FBTC",
    name: "Fractal Bitcoin",
    decimals: 8,
  },
  {
    address: "0xf83bcc06D6A4A5682adeCA11CF9500f67bFe61AE",
    symbol: "PENDLE",
    name: "Pendle",
    decimals: 18,
  },
];

// Testnet tokens (Chain ID: 5003)
const TESTNET_TOKENS: TokenConfig[] = [
  {
    address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
  {
    address: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
    symbol: "WMNT",
    name: "Wrapped Mantle",
    decimals: 18,
  },
];

// Token list by chain
const TOKENS_BY_CHAIN: Record<number, TokenConfig[]> = {
  [mantle.id]: MAINNET_TOKENS,
  [mantleSepoliaTestnet.id]: TESTNET_TOKENS,
};

export function getTokensByChain(chainId: number): TokenConfig[] {
  return TOKENS_BY_CHAIN[chainId] ?? [];
}
