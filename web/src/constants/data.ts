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

  wallets.forEach((wallet) => {
    wallet.assets.forEach((asset) => {
      const existing = assetMap.get(asset.symbol);

      if (existing) {
        existing.valueUSD += asset.valueUSD;
        existing.wallets.push({
          address: wallet.address,
          amount: asset.value.toString(),
        });
      } else {
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

  return Array.from(assetMap.values());
};

export const dummyAssets: Asset[] = aggregateAssets(dummyWallets);

// Dummy Strategies Data (User's Created Strategies)
export const dummyStrategies: Strategy[] = [
  {
    id: "1",
    name: "ETH Yield Maximizer",
    subscriberCount: 24,
    status: "active",
    createdAt: "2024-11-15",
    protocols: ["Lido", "Rocket Pool", "Aave"],
  },
  {
    id: "2",
    name: "Stable Coin Arbitrage",
    subscriberCount: 18,
    status: "active",
    createdAt: "2024-10-28",
    protocols: ["Curve", "Balancer", "Uniswap"],
  },
  {
    id: "3",
    name: "Blue Chip NFT Floor Sweeper",
    subscriberCount: 12,
    status: "paused",
    createdAt: "2024-09-10",
    protocols: ["OpenSea", "Blur"],
  },
  {
    id: "4",
    name: "Multi-Chain Liquidity Provider",
    subscriberCount: 28,
    status: "active",
    createdAt: "2024-11-20",
    protocols: ["PancakeSwap", "SushiSwap", "Trader Joe"],
  },
  {
    id: "5",
    name: "Smart DCA Strategy",
    subscriberCount: 22,
    status: "active",
    createdAt: "2024-10-05",
    protocols: ["1inch", "Paraswap"],
  },
];

// Dummy Subscriptions Data (Strategies User is Subscribed To)
export const dummySubscriptions: Subscription[] = [
  {
    id: "1",
    strategyId: "1",
    strategyName: "ETH Yield Maximizer",
    strategyCreator: "You",
    delegationWalletId: "1",
    delegationWalletName: "Main Delegation Wallet",
    delegationWalletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    isActive: true,
    subscribedAt: "2024-11-20",
  },
  {
    id: "2",
    strategyId: "2",
    strategyName: "Stable Coin Arbitrage",
    strategyCreator: "You",
    delegationWalletId: "2",
    delegationWalletName: "DeFi Strategy Wallet",
    delegationWalletAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    isActive: true,
    subscribedAt: "2024-10-28",
  },
  {
    id: "3",
    strategyId: "4",
    strategyName: "Multi-Chain Liquidity Provider",
    strategyCreator: "You",
    delegationWalletId: "3",
    delegationWalletName: "Yield Optimizer Wallet",
    delegationWalletAddress: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    isActive: true,
    subscribedAt: "2024-11-21",
  },
  {
    id: "4",
    strategyId: "5",
    strategyName: "Smart DCA Strategy",
    strategyCreator: "You",
    delegationWalletId: "4",
    delegationWalletName: "Trading Wallet",
    delegationWalletAddress: "0x5F3f5311fB1D3b32891C3f8d8F3C8F8A1234567",
    isActive: true,
    subscribedAt: "2024-10-10",
  },
  {
    id: "5",
    strategyId: "ext-1",
    strategyName: "DeFi Blue Chip Portfolio",
    strategyCreator: "@cryptowhale",
    delegationWalletId: "5",
    delegationWalletName: "Long Term Holdings",
    delegationWalletAddress: "0x9D8E7F6A5B4C3D2E1F0A9B8C7D6E5F4A3B2C1D0",
    isActive: true,
    subscribedAt: "2024-11-01",
  },
  {
    id: "6",
    strategyId: "ext-2",
    strategyName: "Layer 2 Yield Optimizer",
    strategyCreator: "@l2master",
    delegationWalletId: "1",
    delegationWalletName: "Main Delegation Wallet",
    delegationWalletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    isActive: false,
    subscribedAt: "2024-10-15",
  },
];

// Dummy Subscribers Data (People Who Purchased User's Strategies)
export const dummySubscribers: Subscriber[] = [
  {
    id: "1",
    username: "@defi_trader_pro",
    wallet: "0x1234567890abcdef1234567890abcdef12345678",
    strategyId: "1",
    strategyName: "ETH Yield Maximizer",
    purchasedAt: "2024-12-10",
  },
  {
    id: "2",
    username: "@yield_hunter_99",
    wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
    strategyId: "1",
    strategyName: "ETH Yield Maximizer",
    purchasedAt: "2024-12-08",
  },
  {
    id: "3",
    username: "@crypto_investor",
    wallet: "0x567890abcdef1234567890abcdef123456789012",
    strategyId: "2",
    strategyName: "Stable Coin Arbitrage",
    purchasedAt: "2024-12-05",
  },
  {
    id: "4",
    username: "@safe_yield_seeker",
    wallet: "0x890abcdef1234567890abcdef12345678901234",
    strategyId: "2",
    strategyName: "Stable Coin Arbitrage",
    purchasedAt: "2024-12-01",
  },
];

// Dummy Actions/Activity Data
export const dummyActions: Action[] = [
  {
    id: "1",
    type: "execution",
    description: "ETH Yield Maximizer executed swap on Uniswap",
    note: "Swapped 2.5 ETH for USDC",
    timestamp: "2024-12-23T14:30:00Z",
    status: "completed",
    strategyName: "ETH Yield Maximizer",
    delegationWalletName: "Main Delegation Wallet",
  },
  {
    id: "2",
    type: "subscription",
    description: "@defi_trader_pro subscribed to ETH Yield Maximizer",
    timestamp: "2024-12-23T12:15:00Z",
    status: "completed",
    strategyName: "ETH Yield Maximizer",
  },
  {
    id: "3",
    type: "execution",
    description: "Staked 1.2 ETH on Rocket Pool",
    note: "Auto-compounding enabled",
    timestamp: "2024-12-23T10:45:00Z",
    status: "completed",
    strategyName: "ETH Yield Maximizer",
    delegationWalletName: "Main Delegation Wallet",
  },
  {
    id: "4",
    type: "deposit",
    description: "Deposited 1.5 ETH to Main Delegation Wallet",
    timestamp: "2024-12-22T18:20:00Z",
    status: "completed",
    delegationWalletName: "Main Delegation Wallet",
  },
  {
    id: "5",
    type: "execution",
    description: "Provided liquidity to USDC/USDT pool on Curve",
    note: "Added 2500 USDC",
    timestamp: "2024-12-22T16:00:00Z",
    status: "completed",
    strategyName: "Stable Coin Arbitrage",
    delegationWalletName: "Main Delegation Wallet",
  },
  {
    id: "6",
    type: "withdrawal",
    description: "Withdrew 0.8 ETH from DeFi Strategy Wallet",
    timestamp: "2024-12-22T09:30:00Z",
    status: "completed",
    delegationWalletName: "DeFi Strategy Wallet",
  },
  {
    id: "7",
    type: "execution",
    description: "Stable Coin Arbitrage rebalanced portfolio",
    timestamp: "2024-12-22T08:10:00Z",
    status: "completed",
    strategyName: "Stable Coin Arbitrage",
    delegationWalletName: "DeFi Strategy Wallet",
  },
  {
    id: "8",
    type: "execution",
    description: "Swapped 1000 USDC for ARB on Balancer",
    timestamp: "2024-12-21T22:45:00Z",
    status: "completed",
    strategyName: "Stable Coin Arbitrage",
    delegationWalletName: "DeFi Strategy Wallet",
  },
  {
    id: "9",
    type: "execution",
    description: "Added liquidity to OP pool",
    note: "800 OP tokens",
    timestamp: "2024-12-21T19:30:00Z",
    status: "completed",
    strategyName: "Multi-Chain Liquidity Provider",
    delegationWalletName: "Yield Optimizer Wallet",
  },
  {
    id: "10",
    type: "deposit",
    description: "Deposited 2000 USDC to Yield Optimizer Wallet",
    timestamp: "2024-12-21T15:20:00Z",
    status: "completed",
    delegationWalletName: "Yield Optimizer Wallet",
  },
  {
    id: "11",
    type: "execution",
    description: "Multi-Chain Liquidity Provider executed cross-chain swap",
    note: "0.5 ETH bridged to Arbitrum",
    timestamp: "2024-12-21T12:00:00Z",
    status: "completed",
    strategyName: "Multi-Chain Liquidity Provider",
    delegationWalletName: "Yield Optimizer Wallet",
  },
  {
    id: "12",
    type: "execution",
    description: "Smart DCA purchased 0.2 ETH on 1inch",
    timestamp: "2024-12-20T18:45:00Z",
    status: "completed",
    strategyName: "Smart DCA Strategy",
    delegationWalletName: "Trading Wallet",
  },
  {
    id: "13",
    type: "deposit",
    description: "Deposited 500 MATIC to Trading Wallet",
    timestamp: "2024-12-20T14:30:00Z",
    status: "completed",
    delegationWalletName: "Trading Wallet",
  },
  {
    id: "14",
    type: "execution",
    description: "Automated buy order filled at target price",
    note: "1.1 ETH purchased",
    timestamp: "2024-12-20T10:15:00Z",
    status: "completed",
    strategyName: "Smart DCA Strategy",
    delegationWalletName: "Trading Wallet",
  },
  {
    id: "15",
    type: "strategy_created",
    description: "Created new strategy: Multi-Chain Liquidity Provider",
    timestamp: "2024-12-20T09:00:00Z",
    status: "completed",
  },
  {
    id: "16",
    type: "execution",
    description: "Delegated voting power for BNB governance",
    timestamp: "2024-12-19T16:20:00Z",
    status: "completed",
    delegationWalletName: "Long Term Holdings",
  },
  {
    id: "17",
    type: "subscription",
    description: "Subscribed to Layer 2 Yield Optimizer by @l2master",
    timestamp: "2024-12-19T15:45:00Z",
    status: "completed",
  },
  {
    id: "18",
    type: "execution",
    description: "Claimed 0.15 ETH rewards from Lido",
    timestamp: "2024-12-19T11:30:00Z",
    status: "completed",
    strategyName: "ETH Yield Maximizer",
    delegationWalletName: "Main Delegation Wallet",
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
