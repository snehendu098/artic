# Project Overview

- Name: Artic Protocol

- This is an app which is to be deployed on the mantle blockchain which allows traders to create strategies and execute strategies autonomously using ai agents
- Experienced users can create their own strategies using simple english language and then the agent layer will run an make sure that the strategies run autonomously
- Users can also sell their strategies in the marketplace of Artic Protocol
- Other users can buy a strategy from the marketplace and then subscribe to a strategy with an associated delegation wallet to which will run that strategy for that particular wallet

# Parts

This application contains these parts:

- `db-layer`
- `web`
- `agent-executor`

## DB Layer

This is the db interaction layer which will act as the data layer of the application

## Web

This is the primary interface for the users where they can create, update, sell and subscribe to strategies

## Agent Executor

This is the execution layer which will allow autonomous execution of strategies for a particular wallet

# User Stories

## User Story 1

- As a user, I want to be able to login to the application with privy

## User Story 2 (When authenticated)

- I should be able to create a new associated wallet (AW) for my account

## User Story 3 (When authenticated)

- I should be able to create new strategies and do either of these things:
  1. I should be able to make it active by associating the strategy with an AW for my account which will create a subscription for that strategy for me for that associated wallet
  2. I should just be able to save the strategy and activate it later i.e create a subscription for that strategy with one of my AW
  3. I should be able to subscribe to that strategy and make it public for the marketplace for other people to access it at a price
  4. I should be able to just create that strategy and make it public for the marketplace for other people to access it at a price

## User Story 4

- I should be able to browse through the marketplace and buy other people's strategies and activate a subscription for it instantly if I want to or just buy it and activate it later

## User Story 5

- I should be able to pause active stategies

# Notes

- Activating a strategy means creating a subscription for that strategy with an AW for an account
- Active strategies are those strategies which have an subscription for that strategy with the `isActive` field set to `true`
- Pausing an active strategy is basically setting the `isActive` field of the subscription associated to that strategy to `false`

---

# Tech Stack

## DB Layer
- Runtime: Cloudflare Workers (Hono)
- DB: PostgreSQL + Neon serverless
- ORM: Drizzle 0.45.1
- Pkg mgr: Bun
- Blockchain: viem 2.43.2

## Web
- Next.js 16.1.0 (App Router)
- React 19.2.3
- Tailwind CSS v4
- Auth: Privy
- Animations: framer-motion
- Icons: Tabler, Lucide

---

# Database Schema

## users
- id (uuid pk), wallet (text unique), username (text?), createdAt

## delegationWallets
- id (uuid pk), userId (fk→users), name, address (unique), encryptedPrivateKey, createdAt

## strategies
- id (uuid pk), creatorId (fk→users), name, strategyCode
- isPublic (bool), priceMnt (decimal 18,18), subscriberCount (int)
- protocols (jsonb string[]), status ("draft"|"active"|"paused")
- createdAt, updatedAt
- Unique: (creatorId, name)

## strategyPurchases
- id (uuid pk), strategyId (fk), buyerId (fk→users)
- priceMnt, txHash (unique), blockNumber?, purchasedAt

## subscriptions
- id (uuid pk), strategyId (fk), userId (fk), delegationWalletId (fk)
- isActive (bool), subscribedAt, pausedAt?

## walletActions
- id (uuid pk), subscriptionId? (fk), delegationWalletId (fk)
- actionType ("execution"|"deposit"|"withdrawal"|"subscription"|"strategy_created")
- description, note?, status ("pending"|"completed"|"failed"), createdAt

## creatorEarnings
- id (uuid pk), creatorId (fk→users), purchaseId (fk)
- amountMnt, claimed (bool), claimTxHash?, createdAt

---

# API Routes (db-layer)

```
POST   /users
GET    /users/:wallet
POST   /delegations
GET    /delegations/:wallet
POST   /strategies
GET    /strategies              (marketplace)
GET    /strategies/mine/:wallet
GET    /strategies/:id
PATCH  /strategies/:id
POST   /purchases
GET    /purchases/:wallet
POST   /subscriptions
GET    /subscriptions/:wallet
PATCH  /subscriptions/:id/pause
PATCH  /subscriptions/:id/activate
GET    /subscribers/:wallet
POST   /actions
GET    /actions/:wallet
GET    /earnings/:wallet
PATCH  /earnings/:id/claim
GET    /bot/active-subscriptions
```

---

# Web Structure

```
web/src/
├── app/
│   ├── layout.tsx, page.tsx
│   └── app/
│       ├── layout.tsx (CoreLayout)
│       ├── dashboard/ (page, assets, wallets, strategies, subscriptions, subscribers, actions)
│       └── strategies/ (page, [id]/page)
├── components/
│   ├── ui/ (button, dialog, sidebar, scroll-area, info-popup)
│   ├── home/cards/ (7 dashboard cards)
│   ├── core/ (Nav, Sidebar)
│   ├── layouts/ (CardLayout, CoreLayout, SplitPanelLayout)
│   ├── strategies/ (StrategyRow, StrategyDetailsPanel, cards/)
│   ├── subscriptions/, subscribers/, wallets/, assets/, actions/
│   └── dialog/ (5 dialogs)
├── constants/ (links, data)
└── types/
```

---

# Styling Conventions

## Colors (Dark Theme)
- bg: `neutral-900`, `neutral-800`
- border: `neutral-700`
- hover: `border-primary/50`, `bg-neutral-750`
- text: `white` → `white/70` → `white/50` → `white/40`

## Spacing
- card: `p-6`
- list: `space-y-2`
- section: `space-y-4` or `space-y-6`
- grid: `gap-4`

## Layout
- max-width: `max-w-7xl`
- typography: `text-xs`, `text-sm`, `uppercase` for titles

## Animations
- spring: `stiffness: 300, damping: 30`
- stagger: `delay: index * 0.05`

---

# Component Patterns

## Feature Pattern
Each feature has: `{Feature}Row` + `{Feature}DetailsPanel`

## Dashboard Cards
7 cards in home/cards/ - OverviewCard, StrategiesCard, SubscriptionsCard, etc.

## Layouts
- `CardLayout`: wrapper with `p-6 bg-neutral-900`
- `CoreLayout`: Sidebar + Nav + Content
- `SplitPanelLayout`: animated list-detail (60%/40%)

---

# Business Logic

- Create strategy → auto-subscribe creator if status="active"
- Create purchase → auto-generate 95% creator earnings
- Pause subscription → decrement subscriberCount
- Create subscription → increment subscriberCount
