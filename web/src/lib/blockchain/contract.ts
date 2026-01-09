import { keccak256, toBytes } from "viem";

// Deployed on Mantle Sepolia Testnet
export const ARTIC_MARKETPLACE_ADDRESS =
  "0x18452c228e66BEaD6990Be6E2387cEE3dE441dCA" as const;

// Convert UUID string to bytes32 for contract calls
export function uuidToBytes32(uuid: string): `0x${string}` {
  return keccak256(toBytes(uuid));
}

export const ARTIC_MARKETPLACE_ABI = [
  {
    inputs: [{ internalType: "address", name: "_treasury", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "AlreadyPurchased", type: "error" },
  { inputs: [], name: "AlreadySubscribed", type: "error" },
  { inputs: [], name: "InsufficientPayment", type: "error" },
  { inputs: [], name: "InvalidFee", type: "error" },
  { inputs: [], name: "InvalidPrice", type: "error" },
  { inputs: [], name: "InvalidTreasury", type: "error" },
  { inputs: [], name: "NewWalletAlreadySubscribed", type: "error" },
  { inputs: [], name: "NoBalanceToWithdraw", type: "error" },
  { inputs: [], name: "NotPurchased", type: "error" },
  { inputs: [], name: "NotStrategyCreator", type: "error" },
  { inputs: [], name: "NotSubscribed", type: "error" },
  { inputs: [], name: "NotSubscriptionOwner", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  { inputs: [], name: "StrategyAlreadyListed", type: "error" },
  { inputs: [], name: "StrategyNotListed", type: "error" },
  { inputs: [], name: "SubscriptionAlreadyActive", type: "error" },
  { inputs: [], name: "SubscriptionAlreadyPaused", type: "error" },
  { inputs: [], name: "TransferFailed", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "CreatorWithdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newFeeBps",
        type: "uint256",
      },
    ],
    name: "ProtocolFeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "strategyId",
        type: "bytes32",
      },
    ],
    name: "StrategyDelisted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "strategyId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "priceMnt",
        type: "uint256",
      },
    ],
    name: "StrategyListed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "strategyId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "priceMnt",
        type: "uint256",
      },
      { indexed: false, internalType: "uint256", name: "fee", type: "uint256" },
    ],
    name: "StrategyPurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "strategyId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "StrategyUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "strategyId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "delegationWallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Subscribed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "strategyId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "delegationWallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "SubscriptionActivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "strategyId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "delegationWallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "SubscriptionPaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "strategyId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "oldWallet",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newWallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "SubscriptionWalletUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newTreasury",
        type: "address",
      },
    ],
    name: "TreasuryUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "treasury",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TreasuryWithdraw",
    type: "event",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "strategyId", type: "bytes32" },
      { internalType: "address", name: "delegationWallet", type: "address" },
    ],
    name: "activateSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "creatorBalances",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "strategyId", type: "bytes32" }],
    name: "delistStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "strategyId", type: "bytes32" }],
    name: "getListing",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "priceMnt", type: "uint256" },
      { internalType: "bool", name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "strategyId", type: "bytes32" }],
    name: "getSubscriberCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "strategyId", type: "bytes32" },
      { internalType: "address", name: "delegationWallet", type: "address" },
    ],
    name: "getSubscription",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "bool", name: "isActive", type: "bool" },
      { internalType: "uint64", name: "subscribedAt", type: "uint64" },
      { internalType: "uint64", name: "pausedAt", type: "uint64" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "strategyId", type: "bytes32" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    name: "getUserSubscriptions",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "strategyId", type: "bytes32" },
      { internalType: "address", name: "buyer", type: "address" },
    ],
    name: "hasPurchased",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "strategyId", type: "bytes32" },
      { internalType: "address", name: "delegationWallet", type: "address" },
    ],
    name: "isSubscribed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "strategyId", type: "bytes32" },
      { internalType: "uint256", name: "priceMnt", type: "uint256" },
    ],
    name: "listStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "listings",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "priceMnt", type: "uint256" },
      { internalType: "bool", name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "strategyId", type: "bytes32" },
      { internalType: "address", name: "delegationWallet", type: "address" },
    ],
    name: "pauseSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFeeBps",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFees",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "strategyId", type: "bytes32" }],
    name: "purchaseStrategy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "purchases",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newFeeBps", type: "uint256" }],
    name: "setProtocolFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newTreasury", type: "address" }],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "strategyId", type: "bytes32" },
      { internalType: "address", name: "delegationWallet", type: "address" },
    ],
    name: "subscribe",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "subscriberCounts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "subscriptions",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "delegationWallet", type: "address" },
      { internalType: "bool", name: "isActive", type: "bool" },
      { internalType: "uint64", name: "subscribedAt", type: "uint64" },
      { internalType: "uint64", name: "pausedAt", type: "uint64" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "strategyId", type: "bytes32" },
      { internalType: "uint256", name: "newPrice", type: "uint256" },
    ],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "strategyId", type: "bytes32" },
      { internalType: "address", name: "oldWallet", type: "address" },
      { internalType: "address", name: "newWallet", type: "address" },
    ],
    name: "updateSubscriptionWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "userSubscriptionWallets",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawEarnings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawProtocolFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
