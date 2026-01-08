interface TokenConfig {
  address: string;
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

interface ToolMetadata {
  name: string;
  shortDesc: string;
  longDesc: string;
}

interface ProtocolMetadata {
  name: string;
  description: string;
  tools: ToolMetadata[];
}

const PROTOCOL_METADATA: Record<string, ProtocolMetadata> = {
  pyth: {
    name: "Pyth Network",
    description: "Oracle protocol providing real-time price feeds for token pairs with confidence intervals",
    tools: [
      {
        name: "pyth_get_price",
        shortDesc: "Get current price for token pair/feed",
        longDesc: "Pyth Network is an oracle protocol providing price feeds. This tool retrieves current price for specific token pair or price feed ID with confidence interval and metadata.",
      },
      {
        name: "pyth_get_ema_price",
        shortDesc: "Get exponential moving average price",
        longDesc: "Pyth Network is an oracle protocol providing price feeds. This tool retrieves EMA price for token pair with confidence data.",
      },
      {
        name: "pyth_get_token_price",
        shortDesc: "Get price data for token address",
        longDesc: "Pyth Network is an oracle protocol providing price feeds. This tool retrieves price data for token by contract address with USD valuation.",
      },
      {
        name: "pyth_get_multiple_prices",
        shortDesc: "Get prices for multiple identifiers",
        longDesc: "Pyth Network is an oracle protocol providing price feeds. This tool retrieves price data for multiple token pairs/feeds in single call.",
      },
      {
        name: "pyth_get_supported_feeds",
        shortDesc: "List all supported price feeds",
        longDesc: "Pyth Network is an oracle protocol providing price feeds. This tool returns mapping of all available price feed identifiers and pair names.",
      },
      {
        name: "pyth_get_supported_tokens",
        shortDesc: "List all supported token addresses",
        longDesc: "Pyth Network is an oracle protocol providing price feeds. This tool returns mapping of token contract addresses to Pyth feed information.",
      },
      {
        name: "pyth_feed_exists",
        shortDesc: "Check if price feed exists",
        longDesc: "Pyth Network is an oracle protocol providing price feeds. This tool checks whether specific price feed identifier or token address is supported.",
      },
    ],
  },
  lendle: {
    name: "Lendle",
    description: "Lending protocol on Mantle for supplying collateral, borrowing assets, earning yield",
    tools: [
      {
        name: "lendle_supply",
        shortDesc: "Supply tokens to earn yield",
        longDesc: "lendle is a lending protocol on the mantle blockchain network, this tool will be used to supply or deposit tokens to the Lendle lending protocol to earn yield",
      },
      {
        name: "lendle_withdraw",
        shortDesc: "Withdraw supplied tokens",
        longDesc: "lendle is a lending protocol on the mantle blockchain network, this tool will be used to withdraw previously supplied tokens from the Lendle lending protocol",
      },
      {
        name: "lendle_borrow",
        shortDesc: "Borrow tokens against collateral",
        longDesc: "lendle is a lending protocol on the mantle blockchain network, this tool will be used to borrow tokens from the Lendle lending protocol using your supplied collateral",
      },
      {
        name: "lendle_repay",
        shortDesc: "Repay borrowed tokens",
        longDesc: "lendle is a lending protocol on the mantle blockchain network, this tool will be used to repay borrowed tokens to the Lendle lending protocol",
      },
      {
        name: "lendle_get_user_account_data",
        shortDesc: "Get account data (collateral, debt, health)",
        longDesc: "lendle is a lending protocol on the mantle blockchain network, this tool will be used to get user account data including total collateral, total debt, available borrows, liquidation threshold, LTV and health factor",
      },
      {
        name: "lendle_get_positions",
        shortDesc: "Get all lending positions",
        longDesc: "lendle is a lending protocol on the mantle blockchain network, this tool will be used to get all lending positions for a user including supplied and borrowed assets with total values",
      },
    ],
  },
  okx: {
    name: "OKX",
    description: "DEX aggregator on Mantle providing optimal swap quotes and execution across pools",
    tools: [
      {
        name: "okx_get_swap_quote",
        shortDesc: "Get optimal swap quote",
        longDesc: "OKX is a DEX aggregator on the mantle blockchain network which fetches swaps with the best quote available among different pools. This tool gets the optimal swap quote for exchanging tokens.",
      },
      {
        name: "okx_execute_swap",
        shortDesc: "Execute token swap",
        longDesc: "OKX is a DEX aggregator on the mantle blockchain network which fetches swaps with the best quote available among different pools. This tool executes a token swap with optimal routing.",
      },
    ],
  },
  meth: {
    name: "mETH",
    description: "Liquid staking protocol on Mantle for staking ETH and earning staking yield",
    tools: [
      {
        name: "meth_get_token_address",
        shortDesc: "Get mETH token address",
        longDesc: "mETH is a liquid staking protocol on the mantle blockchain network. This tool returns the mETH token contract address.",
      },
      {
        name: "meth_get_position",
        shortDesc: "Get mETH position balances",
        longDesc: "mETH is a liquid staking protocol on the mantle blockchain network. This tool returns the user's mETH position including mETH, WETH, and WMNT balances.",
      },
      {
        name: "meth_swap_to_meth",
        shortDesc: "Swap WETH to mETH to earn yield",
        longDesc: "mETH is a liquid staking protocol on the mantle blockchain network. This tool swaps WETH to mETH via DEX to earn staking yield.",
      },
      {
        name: "meth_swap_from_meth",
        shortDesc: "Swap mETH back to WETH",
        longDesc: "mETH is a liquid staking protocol on the mantle blockchain network. This tool swaps mETH back to WETH via DEX.",
      },
    ],
  },
  oneinch: {
    name: "1inch",
    description: "DEX aggregator providing optimal swap routes and quotes across multiple DeFi protocols",
    tools: [
      {
        name: "oneinch_get_quote",
        shortDesc: "Get swap quote for token pair",
        longDesc: "1inch is a DEX aggregator that finds optimal swap routes across multiple DEXs. This tool retrieves a swap quote for the specified token pair and amount, showing the best route and expected output amount.",
      },
      {
        name: "oneinch_swap",
        shortDesc: "Execute token swap on 1inch",
        longDesc: "Execute a token swap on 1inch protocol with optional slippage protection (default 0.5%). Aggregates liquidity across multiple DEXs to find the best execution route.",
      },
    ],
  },
};

export { PROTOCOL_METADATA, TokenConfig };
export { MAINNET_TOKENS, TESTNET_TOKENS };
