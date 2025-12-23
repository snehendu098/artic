// Dummy data for the dashboard
import type {
  Wallet,
  Strategy,
  Subscription,
  Subscriber,
  Asset,
  Action,
  OverviewStats,
} from "@/types";

// Dummy Wallets Data with nested assets
export const dummyWallets: Wallet[] = [
  {
    id: "1",
    name: "Main Delegation Wallet",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    balance: 2.5,
    balanceUSD: 13225.0,
    assets: [
      {
        id: "eth-1",
        symbol: "ETH",
        name: "Ethereum",
        value: 2.5,
        valueUSD: 6250.0,
        change24h: 2.5,
      },
      {
        id: "usdt-1",
        symbol: "USDT",
        name: "Tether",
        value: 5600,
        valueUSD: 5600.0,
        change24h: 0.0,
      },
      {
        id: "usdc-1",
        symbol: "USDC",
        name: "USD Coin",
        value: 1375,
        valueUSD: 1375.0,
        change24h: 0.1,
      },
    ],
  },
  {
    id: "2",
    name: "DeFi Strategy Wallet",
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    balance: 1.8,
    balanceUSD: 13500.0,
    assets: [
      {
        id: "eth-2",
        symbol: "ETH",
        name: "Ethereum",
        value: 1.8,
        valueUSD: 4500.0,
        change24h: 2.5,
      },
      {
        id: "usdc-2",
        symbol: "USDC",
        name: "USD Coin",
        value: 6500,
        valueUSD: 6500.0,
        change24h: 0.1,
      },
      {
        id: "arb-2",
        symbol: "ARB",
        name: "Arbitrum",
        value: 1250,
        valueUSD: 2500.0,
        change24h: -1.2,
      },
    ],
  },
  {
    id: "3",
    name: "Yield Optimizer Wallet",
    address: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    balance: 1.0,
    balanceUSD: 4900.0,
    assets: [
      {
        id: "eth-3",
        symbol: "ETH",
        name: "Ethereum",
        value: 1.0,
        valueUSD: 2500.0,
        change24h: 2.5,
      },
      {
        id: "op-3",
        symbol: "OP",
        name: "Optimism",
        value: 800,
        valueUSD: 2400.0,
        change24h: 3.8,
      },
    ],
  },
  {
    id: "4",
    name: "Trading Wallet",
    address: "0x5F3f5311fB1D3b32891C3f8d8F3C8F8A1234567",
    balance: 3.2,
    balanceUSD: 9800.0,
    assets: [
      {
        id: "eth-4",
        symbol: "ETH",
        name: "Ethereum",
        value: 1.5,
        valueUSD: 3750.0,
        change24h: 2.5,
      },
      {
        id: "matic-4",
        symbol: "MATIC",
        name: "Polygon",
        value: 5000,
        valueUSD: 4500.0,
        change24h: 1.8,
      },
      {
        id: "link-4",
        symbol: "LINK",
        name: "Chainlink",
        value: 100,
        valueUSD: 1550.0,
        change24h: -0.5,
      },
    ],
  },
  {
    id: "5",
    name: "Long Term Holdings",
    address: "0x9D8E7F6A5B4C3D2E1F0A9B8C7D6E5F4A3B2C1D0",
    balance: 2.8,
    balanceUSD: 11200.0,
    assets: [
      {
        id: "eth-5",
        symbol: "ETH",
        name: "Ethereum",
        value: 2.0,
        valueUSD: 5000.0,
        change24h: 2.5,
      },
      {
        id: "bnb-5",
        symbol: "BNB",
        name: "BNB",
        value: 15,
        valueUSD: 4800.0,
        change24h: 2.1,
      },
      {
        id: "sol-5",
        symbol: "SOL",
        name: "Solana",
        value: 20,
        valueUSD: 1400.0,
        change24h: 4.2,
      },
    ],
  },
];

// Helper function to aggregate assets from all wallets
export const aggregateAssets = (wallets: Wallet[]): Asset[] => {
  const assetMap = new Map<
    string,
    {
      id: string;
      symbol: string;
      name: string;
      valueUSD: number;
      wallets: { address: string; amount: string }[];
      change24h: number;
    }
  >();

  // Iterate through all wallets and their assets
  wallets.forEach((wallet) => {
    wallet.assets.forEach((asset) => {
      const existing = assetMap.get(asset.symbol);

      if (existing) {
        // Add this wallet's amount to existing asset
        existing.valueUSD += asset.valueUSD;
        existing.wallets.push({
          address: wallet.address,
          amount: asset.value.toString(),
        });
      } else {
        // Create new asset entry
        assetMap.set(asset.symbol, {
          id: asset.symbol.toLowerCase(),
          symbol: asset.symbol,
          name: asset.name,
          valueUSD: asset.valueUSD,
          wallets: [
            {
              address: wallet.address,
              amount: asset.value.toString(),
            },
          ],
          change24h: asset.change24h,
        });
      }
    });
  });

  // Convert map to array
  return Array.from(assetMap.values());
};

// Aggregated Assets Data (dynamically generated from wallets)
export const dummyAssets: Asset[] = aggregateAssets(dummyWallets);

// Dummy Strategies Data (User's Created Strategies)
export const dummyStrategies: Strategy[] = [
  {
    id: "1",
    name: "ETH Yield Maximizer",
    description:
      "Automated ETH staking across multiple protocols for optimal yields",
    apy: 8.5,
    tvl: 125000,
    subscriberCount: 24,
    monthlyRevenue: 450,
    status: "active",
    createdAt: "2024-11-15",
    protocols: ["Lido", "Rocket Pool", "Aave"],
  },
  {
    id: "2",
    name: "Stable Coin Arbitrage",
    description: "Low-risk arbitrage strategy across stablecoin pools",
    apy: 12.3,
    tvl: 89000,
    subscriberCount: 18,
    monthlyRevenue: 320,
    status: "active",
    createdAt: "2024-10-28",
    protocols: ["Curve", "Balancer", "Uniswap"],
  },
  {
    id: "3",
    name: "Blue Chip NFT Floor Sweeper",
    description: "Automated floor price monitoring and acquisition strategy",
    apy: 15.7,
    tvl: 56000,
    subscriberCount: 12,
    monthlyRevenue: 180,
    status: "paused",
    createdAt: "2024-09-10",
    protocols: ["OpenSea", "Blur"],
  },
  {
    id: "4",
    name: "Multi-Chain Liquidity Provider",
    description: "Provide liquidity across multiple chains for optimal returns",
    apy: 18.5,
    tvl: 95000,
    subscriberCount: 28,
    monthlyRevenue: 520,
    status: "active",
    createdAt: "2024-11-20",
    protocols: ["PancakeSwap", "SushiSwap", "Trader Joe"],
  },
  {
    id: "5",
    name: "Smart DCA Strategy",
    description: "Automated dollar-cost averaging with market timing",
    apy: 14.2,
    tvl: 72000,
    subscriberCount: 22,
    monthlyRevenue: 380,
    status: "active",
    createdAt: "2024-10-05",
    protocols: ["1inch", "Paraswap"],
  },
];

// Dummy Subscriptions Data (Strategies User is Subscribed To)
export const dummySubscriptions: Subscription[] = [
  {
    id: "1",
    strategyName: "DeFi Blue Chip Portfolio",
    strategyCreator: "@cryptowhale",
    amountInvested: 5000,
    currentValue: 5420,
    apy: 9.2,
    subscribedAt: "2024-11-01",
    walletId: "1",
  },
  {
    id: "2",
    strategyName: "Layer 2 Yield Optimizer",
    strategyCreator: "@l2master",
    amountInvested: 3000,
    currentValue: 3180,
    apy: 11.5,
    subscribedAt: "2024-10-15",
    walletId: "2",
  },
  {
    id: "3",
    strategyName: "Automated Liquidity Management",
    strategyCreator: "@defi_genius",
    amountInvested: 7500,
    currentValue: 8100,
    apy: 13.8,
    subscribedAt: "2024-11-10",
    walletId: "1",
  },
  {
    id: "4",
    strategyName: "Stable Yield Farming",
    strategyCreator: "@yield_master",
    amountInvested: 4200,
    currentValue: 4450,
    apy: 8.5,
    subscribedAt: "2024-10-25",
    walletId: "3",
  },
];

// Dummy Subscribers Data (People Subscribing to User's Strategies)
export const dummySubscribers: Subscriber[] = [
  {
    id: "1",
    username: "@defi_trader_pro",
    strategyId: "1",
    strategyName: "ETH Yield Maximizer",
    amountInvested: 8500,
    subscribedAt: "2024-12-10",
  },
  {
    id: "2",
    username: "@yield_hunter_99",
    strategyId: "1",
    strategyName: "ETH Yield Maximizer",
    amountInvested: 12000,
    subscribedAt: "2024-12-08",
  },
  {
    id: "3",
    username: "@crypto_investor",
    strategyId: "2",
    strategyName: "Stable Coin Arbitrage",
    amountInvested: 5000,
    subscribedAt: "2024-12-05",
  },
  {
    id: "4",
    username: "@safe_yield_seeker",
    strategyId: "2",
    strategyName: "Stable Coin Arbitrage",
    amountInvested: 3500,
    subscribedAt: "2024-12-01",
  },
];

// Dummy Actions/Activity Data
export const dummyActions: Action[] = [
  {
    id: "1",
    type: "execution",
    description: "ETH Yield Maximizer executed swap on Uniswap",
    amount: 2.5,
    timestamp: "2024-12-22T14:30:00Z",
    status: "completed",
  },
  {
    id: "2",
    type: "subscription",
    description: "@defi_trader_pro subscribed to ETH Yield Maximizer",
    amount: 8500,
    timestamp: "2024-12-22T12:15:00Z",
    status: "completed",
  },
  {
    id: "3",
    type: "execution",
    description: "Stable Coin Arbitrage rebalanced portfolio",
    timestamp: "2024-12-22T10:45:00Z",
    status: "completed",
  },
  {
    id: "4",
    type: "deposit",
    description: "Deposited 1.5 ETH to Main Delegation Wallet",
    amount: 1.5,
    timestamp: "2024-12-21T18:20:00Z",
    status: "completed",
  },
  {
    id: "5",
    type: "strategy_created",
    description: "Created new strategy: Blue Chip NFT Floor Sweeper",
    timestamp: "2024-12-20T16:00:00Z",
    status: "completed",
  },
  {
    id: "6",
    type: "withdrawal",
    description: "Withdrew 0.8 ETH from DeFi Strategy Wallet",
    amount: 0.8,
    timestamp: "2024-12-20T09:30:00Z",
    status: "completed",
  },
  {
    id: "7",
    type: "execution",
    description: "ETH Yield Maximizer staked ETH on Lido",
    amount: 3.2,
    timestamp: "2024-12-19T22:10:00Z",
    status: "completed",
  },
  {
    id: "8",
    type: "subscription",
    description: "Subscribed to Layer 2 Yield Optimizer by @l2master",
    amount: 3000,
    timestamp: "2024-12-19T15:45:00Z",
    status: "completed",
  },
];

// Overview Statistics
export const dummyOverviewStats: OverviewStats = {
  totalAmountUSD: 31625.0,
  totalAmountChange: 5.2,
  totalStrategies: 3,
  strategiesChange: 2,
  totalWallets: 3,
  walletsChange: 1,
  totalSubscribers: 54,
  subscribersChange: 8,
};
