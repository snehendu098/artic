# Artic Protocol

**Autonomous AI-Powered Trading Strategies on Mantle**

> Live on Mantle Mainnet

Artic Protocol enables traders to create, share, and execute trading strategies autonomously using AI agents. Write strategies in plain English, and let our agent layer handle execution on your behalf.

---

## Overview

- **Create Strategies**: Define trading strategies using natural language
- **Autonomous Execution**: AI agents interpret and execute strategies on-chain
- **Strategy Marketplace**: Buy and sell strategies from other traders
- **Delegation Wallets**: Secure wallet delegation for autonomous trading
- **Real-time Monitoring**: Track executions, actions, and earnings

---

## Architecture

```
┌─────────────────────┐
│     Web (Next.js)   │  User interface & dashboard
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  DB Layer (Hono)    │  API & data persistence
│  Cloudflare Workers │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Agent Executor     │  Strategy execution engine
│  LangGraph + Groq   │  Durable Objects for long-running tasks
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Mantle Blockchain  │  On-chain transactions
│  Smart Contracts    │
└─────────────────────┘
```

---

## Tech Stack

### Web
- Next.js 16.1.0 (App Router)
- React 19.2.3
- Tailwind CSS v4
- Privy Authentication
- Framer Motion
- viem 2.43.3

### DB Layer
- Cloudflare Workers + Hono
- PostgreSQL (Neon Serverless)
- Drizzle ORM 0.45.1
- Hyperdrive for DB connections

### Agent Executor
- Cloudflare Workers + Durable Objects
- LangChain + LangGraph
- Groq LLM
- Mantle Agent Kit SDK

### Smart Contract
- Solidity ^0.8.20
- OpenZeppelin Contracts
- Deployed via Thirdweb

---

## Features

### Strategy Creation
Write trading strategies in plain English. The AI agent interprets your intent and executes appropriate on-chain actions.

```
"Swap 10% of my MNT to USDC when MNT price drops below $0.50"
```

### Delegation Wallets
Create dedicated wallets for strategy execution. Fund them separately and maintain full control while enabling autonomous trading.

### Marketplace
- List strategies for sale with MNT pricing
- 95% earnings go to creators
- 5% protocol fee
- Subscriber count tracking

### Execution Monitoring
Track every action:
- Tool selections
- On-chain transactions
- Execution status
- Transaction hashes

---

## Smart Contract

**ArticMarketplace** - Handles on-chain purchases and subscriptions

| Function | Description |
|----------|-------------|
| `listStrategy` | List strategy for sale |
| `purchaseStrategy` | Purchase a strategy |
| `subscribe` | Subscribe to a strategy |
| `pauseSubscription` | Pause active subscription |
| `withdrawEarnings` | Claim creator earnings |

**Contract Address**: `0x18452c228e66BEaD6990Be6E2387cEE3dE441dCA`

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | User accounts (wallet-based) |
| `delegationWallets` | Autonomous trading wallets |
| `strategies` | Trading strategy definitions |
| `subscriptions` | Active strategy subscriptions |
| `strategyPurchases` | Purchase records |
| `walletActions` | Execution history |
| `creatorEarnings` | Earnings tracking |

---

## API Endpoints

### Users
```
POST   /users              Create user
GET    /users/:wallet      Get user
```

### Delegation Wallets
```
POST   /delegations                  Create wallet
GET    /delegations/:wallet          List wallets
POST   /delegations/:id/reveal-key   Reveal private key
```

### Strategies
```
POST   /strategies              Create strategy
GET    /strategies              Marketplace list
GET    /strategies/mine/:wallet My strategies
GET    /strategies/:id          Strategy details
PATCH  /strategies/:id          Update strategy
PATCH  /strategies/:id/publish  Publish to marketplace
```

### Subscriptions
```
POST   /subscriptions              Subscribe
GET    /subscriptions/:wallet      My subscriptions
PATCH  /subscriptions/:id/pause    Pause
PATCH  /subscriptions/:id/activate Activate
```

### Actions & Earnings
```
POST   /actions           Log action
GET    /actions/:wallet   Action history
GET    /earnings/:wallet  Creator earnings
PATCH  /earnings/:id/claim  Claim earnings
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- Bun
- Cloudflare account (Workers)
- Neon PostgreSQL database

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/artic-protocol.git
cd artic-protocol

# Install dependencies
cd web && bun install
cd ../db-layer && bun install
cd ../agent-executor && bun install
```

### Environment Variables

**DB Layer** (`db-layer/.dev.vars`)
```
DATABASE_URL=postgres://...
```

**Agent Executor** (`.env`)
```
GROQ_API_KEY=your_groq_api_key
CONTRACT_ADDRESS=0x18452c228e66BEaD6990Be6E2387cEE3dE441dCA
```

**Web** (`web/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

### Development

```bash
# Terminal 1: DB Layer
cd db-layer && bun run dev

# Terminal 2: Agent Executor
cd agent-executor && bun run dev

# Terminal 3: Web
cd web && bun run dev
```

### Deployment

```bash
# DB Layer
cd db-layer && bun run deploy

# Agent Executor
cd agent-executor && bun run deploy

# Web (Vercel)
cd web && vercel deploy

# Smart Contract
cd contract && npx thirdweb@latest deploy
```

---

## Supported Protocols

The agent executor integrates with various DeFi protocols on Mantle:

- **OpenOcean** - DEX aggregation & swaps
- **Lendle** - Lending & borrowing
- **mETH** - Liquid staking
- **Native** - MNT transfers & wrapping

---

## Project Structure

```
mvp/
├── web/                    # Next.js frontend
│   ├── src/app/           # App router pages
│   ├── src/components/    # UI components
│   ├── src/actions/       # Server actions
│   └── src/hooks/         # React hooks
├── db-layer/              # API layer
│   ├── src/controllers/   # Route handlers
│   ├── src/db/           # Drizzle schema
│   └── wrangler.jsonc    # Worker config
├── agent-executor/        # Execution engine
│   ├── src/agent/        # AI agent logic
│   ├── src/durable-objects/
│   └── wrangler.jsonc
└── contract/             # Smart contracts
    └── contracts/Contract.sol
```

---

## Security

- Delegation wallet private keys are encrypted at rest
- API key authentication for sensitive endpoints
- Reentrancy protection on smart contract
- Protocol fee management with owner-only access

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

---

## License

MIT

---

## Links

- [Mantle Network](https://mantle.xyz)
- [Privy Authentication](https://privy.io)
- [LangGraph](https://langchain-ai.github.io/langgraph)
- [Cloudflare Workers](https://workers.cloudflare.com)
