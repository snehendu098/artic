# Tool Integration Guide - Artic Protocol

This guide explains how to add new protocol tools to Artic Protocol's agent executor and web interface.

## Architecture Overview

Artic Protocol uses a modular tool system:
- **Metadata Layer**: Protocol and tool definitions (`constants/index.ts`)
- **Implementation Layer**: Tool creator functions (`tools/kit/{protocol}/index.ts`)
- **Registration Layer**: Tool registration (`helpers/getAllTools.ts`)
- **API Layer**: Protocol list endpoint (`/protocols/list`)
- **Web Layer**: UI consumption (`useProtocols` hook, components)

## Complete Integration Process

### Step 1: Add Protocol Metadata (Agent Executor)

**File**: `agent-executor/src/constants/index.ts`

Add entry to `PROTOCOL_METADATA` object:

```typescript
const PROTOCOL_METADATA: Record<string, ProtocolMetadata> = {
  protocol_name: {
    name: "Protocol Display Name",
    description: "Brief description of what the protocol does",
    tools: [
      {
        name: "protocol_tool_name",
        shortDesc: "Brief description for UI (5-10 words)",
        longDesc: "Detailed description for AI agent. Include protocol context and what the tool does.",
      },
      // ... more tools
    ],
  },
  // ... other protocols
};
```

**Naming Convention:**
- Protocol key: lowercase, single word (e.g., `pyth`, `lendle`)
- Tool name format: `{protocol}_{action}_{subject}` (e.g., `pyth_get_price`, `lendle_supply`)

**Example (Pyth Network):**
```typescript
pyth: {
  name: "Pyth Network",
  description: "Oracle protocol providing real-time price feeds for token pairs with confidence intervals",
  tools: [
    {
      name: "pyth_get_price",
      shortDesc: "Get current price for token pair/feed",
      longDesc: "Pyth Network is an oracle protocol providing price feeds. This tool retrieves current price for specific token pair or price feed ID with confidence interval and metadata.",
    },
    // ... 6 more tools
  ],
}
```

### Step 2: Implement Tool Creators

**File**: `agent-executor/src/tools/kit/{protocol}/index.ts`

Create tool factory functions using LangChain's `tool()`:

```typescript
import { tool } from "langchain";
import { ToolDependencies } from "../../../types";
import z from "zod";
import { getToolMetadata } from "../../../helpers/getToolMetadata";

export const createProtocolToolName = (deps: ToolDependencies) => {
  const meta = getToolMetadata("protocol_tool_name");
  return tool(
    async ({ param1, param2 }) => {
      const { mntAgentKit, eventLogger } = deps;

      // 1. Emit tool selection event
      await eventLogger.emit({
        type: "tools_selected",
        data: { tool: "protocol_tool_name", args: { param1, param2 } },
      });

      try {
        // 2. Execute tool logic (SDK call or custom implementation)
        const result = await mntAgentKit.protocolMethodName(param1, param2);

        // For transaction tools: wait for receipt
        // const receipt = await mntAgentKit.client.waitForTransactionReceipt({ hash: txHash });

        // 3. Emit success event
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "protocol_tool_name",
            result: `Human-readable success message`,
            // For TX tools: include txHash and blockNumber
            // txHash: receipt.transactionHash,
            // blockNumber: receipt.blockNumber.toString(),
          },
        });

        return result; // or receipt for TX tools
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";

        // 4. Emit error event
        await eventLogger.emit({
          type: "error",
          data: {
            tool: "protocol_tool_name",
            error: `Failed to execute: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        param1: z.string().describe("Description of param1"),
        param2: z.number().describe("Description of param2"),
      }),
    },
  );
};
```

**Key Patterns:**

**A. Transaction Tools** (write operations):
```typescript
// Example: Lendle supply
const txHash = await mntAgentKit.lendleSupply(tokenAddress, amount);
const receipt = await mntAgentKit.client.waitForTransactionReceipt({ hash: txHash });

await eventLogger.emit({
  type: "tool_result",
  data: {
    tool: "lendle_supply",
    result: `Supplied ${amount} tokens. TxHash: ${txHash}`,
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber.toString(),
  },
});

return receipt;
```

**B. Read-Only Tools** (queries):
```typescript
// Example: Pyth get price
const result = await mntAgentKit.pythGetPrice(identifier);

await eventLogger.emit({
  type: "tool_result",
  data: {
    tool: "pyth_get_price",
    result: `Fetched ${result.pair} price: ${result.formattedPrice}`,
    // NO txHash or blockNumber
  },
});

return result;
```

**C. No-Parameter Tools**:
```typescript
// Example: Pyth get supported feeds
schema: z.object({})  // Empty schema
```

### Step 3: Export Tools

**File**: `agent-executor/src/tools/kit/index.ts`

Add export statement:
```typescript
export * from "./protocol";
```

Or individual exports:
```typescript
export { createProtocolTool1, createProtocolTool2 } from "./protocol";
```

### Step 4: Register Tools in getAllTools

**File**: `agent-executor/src/helpers/getAllTools.ts`

Import tool creators:
```typescript
import {
  createProtocolTool1,
  createProtocolTool2,
  // ... other tools
} from "../tools";
```

Add to return array:
```typescript
export const getAllTools = (deps: ToolDependencies) => {
  return [
    // Protocol: description
    createProtocolTool1(deps),
    createProtocolTool2(deps),
    // ... other tools
  ];
};
```

### Step 5: Add Protocol Tokens (if applicable)

**Files**:
- `agent-executor/src/constants/index.ts`
- `web/src/lib/blockchain/tokens.ts`

Add token configs to `MAINNET_TOKENS` array:
```typescript
{
  address: "0x...",
  symbol: "TOKEN",
  name: "Token Name",
  decimals: 18,
}
```

### Step 6: Update Web Landing Page

**File**: `web/src/app/page.tsx`

Add protocol logo to protocols array:
```typescript
const protocols = [
  // ... existing protocols
  { name: "Protocol Name", logo: "/protocols/protocol.png" },
];
```

**File**: `web/public/protocols/`

Add logo image: `protocol.png` or `protocol.jpg`

### Step 7: Fix Protocol Logo Path (if multi-word name)

**File**: `web/src/lib/protocols.ts`

The helper extracts first word: `"Pyth Network"` → `"pyth.png"`

```typescript
export const getProtocolLogoPath = (protocol: string): string => {
  const normalized = protocol.toLowerCase().split(" ")[0];
  const extension = normalized === "lendle" ? "jpg" : "png";
  return `/protocols/${normalized}.${extension}`;
};
```

Ensure logo filename matches first word of protocol name.

## Complete File Checklist

When adding a new protocol with tools:

- [ ] `agent-executor/src/constants/index.ts` - Add PROTOCOL_METADATA entry
- [ ] `agent-executor/src/constants/index.ts` - Add tokens to MAINNET_TOKENS (if needed)
- [ ] `agent-executor/src/tools/kit/{protocol}/index.ts` - Implement tool creators
- [ ] `agent-executor/src/tools/kit/index.ts` - Export tools
- [ ] `agent-executor/src/helpers/getAllTools.ts` - Import and register tools
- [ ] `web/src/lib/blockchain/tokens.ts` - Add tokens (if needed)
- [ ] `web/src/app/page.tsx` - Add to protocols array
- [ ] `web/public/protocols/{protocol}.png` - Add logo image

## Data Flow

```
User creates strategy
    ↓
Selects tools from ToolsSelectionPanel
    ↓
Tools fetched from /protocols/list API
    ↓
API calls buildProtocolsList() → reads PROTOCOL_METADATA
    ↓
Strategy saved with tool names
    ↓
Agent executor loads strategy
    ↓
getAllTools(deps) registers all tool instances
    ↓
Agent invokes tools by name
    ↓
Tool executes → emits events → returns result
    ↓
EventLogger saves to actions table
```

## Common Patterns

### Tool Categories

**1. Transaction Tools** (Lendle, OKX swaps):
- Wait for transaction receipt
- Return receipt object
- Emit txHash + blockNumber

**2. Query Tools** (Pyth prices, Lendle positions):
- Return data directly
- No txHash/blockNumber
- Emit formatted result message

**3. Batch Tools** (Pyth multiple prices):
- Accept array parameter
- Return array result
- Summarize in event message

### Zod Schema Types

```typescript
// String parameter
z.string().describe("Description")

// Number parameter
z.number().describe("Amount in tokens")

// Array parameter
z.array(z.string()).describe("Array of addresses")

// Optional parameter
z.string().optional().describe("Optional recipient")

// No parameters
z.object({})
```

### Event Logging

**Always emit 3 event types:**

1. **tools_selected**: When tool is invoked
```typescript
await eventLogger.emit({
  type: "tools_selected",
  data: { tool: "tool_name", args: { ... } }
});
```

2. **tool_result**: On success
```typescript
await eventLogger.emit({
  type: "tool_result",
  data: {
    tool: "tool_name",
    result: "Human-readable message",
    txHash: "0x...", // TX tools only
    blockNumber: "12345", // TX tools only
  }
});
```

3. **error**: On failure
```typescript
await eventLogger.emit({
  type: "error",
  data: { tool: "tool_name", error: "Error message" }
});
```

## Example: Complete Pyth Integration

### Metadata
```typescript
pyth: {
  name: "Pyth Network",
  description: "Oracle protocol providing real-time price feeds",
  tools: [
    { name: "pyth_get_price", shortDesc: "Get price", longDesc: "..." },
    { name: "pyth_get_ema_price", shortDesc: "Get EMA", longDesc: "..." },
    // ... 5 more tools
  ],
}
```

### Implementation
```typescript
// pyth/index.ts
export const createPythGetPrice = (deps: ToolDependencies) => {
  const meta = getToolMetadata("pyth_get_price");
  return tool(
    async ({ identifier }) => {
      const { mntAgentKit, eventLogger } = deps;
      await eventLogger.emit({
        type: "tools_selected",
        data: { tool: "pyth_get_price", args: { identifier } }
      });

      try {
        const result = await mntAgentKit.pythGetPrice(identifier);
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "pyth_get_price",
            result: `Fetched ${result.pair}: ${result.formattedPrice}`
          }
        });
        return result;
      } catch (error) {
        await eventLogger.emit({
          type: "error",
          data: { tool: "pyth_get_price", error: error.message }
        });
        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        identifier: z.string().describe("Pair name or token address")
      })
    }
  );
};
```

### Registration
```typescript
// getAllTools.ts
import { createPythGetPrice, createPythGetEmaPrice, ... } from "../tools";

export const getAllTools = (deps: ToolDependencies) => {
  return [
    createPythGetPrice(deps),
    createPythGetEmaPrice(deps),
    // ... other tools
  ];
};
```

## Quick Reference for Future Sessions

**When you tell me to add a new protocol/tool:**

1. Ask for:
   - Protocol name and description
   - List of tools with descriptions
   - Tool parameters and return types
   - SDK method names (if using mantle-agent-kit-sdk)
   - Token addresses (if applicable)
   - Logo image location

2. I will:
   - Add metadata to `PROTOCOL_METADATA`
   - Implement tool creators following patterns
   - Export and register tools
   - Update token lists if needed
   - Add protocol to landing page
   - Verify logo path helper works

3. Files modified (in order):
   - `agent-executor/src/constants/index.ts`
   - `agent-executor/src/tools/kit/{protocol}/index.ts`
   - `agent-executor/src/tools/kit/index.ts`
   - `agent-executor/src/helpers/getAllTools.ts`
   - `web/src/lib/blockchain/tokens.ts` (if tokens)
   - `web/src/app/page.tsx`

## Testing Checklist

After adding a new protocol:

- [ ] Check `/protocols/list` API returns new protocol
- [ ] Verify tool count matches expected number
- [ ] Test protocol appears in strategy creation UI
- [ ] Confirm protocol logo displays correctly
- [ ] Verify tools can be selected/deselected
- [ ] Check agent can invoke tools (if SDK ready)
- [ ] Validate event logging works (tools_selected, tool_result, error)

## Common Issues & Solutions

**Issue**: Protocol logo not showing in UI
**Solution**: Check `getProtocolLogoPath` extracts correct filename from protocol name

**Issue**: Tool not appearing in strategy creation
**Solution**: Verify metadata name matches implementation and registration

**Issue**: TypeScript errors on tool parameters
**Solution**: Ensure Zod schema matches function signature

**Issue**: Events not logging
**Solution**: Check all 3 event types are emitted (tools_selected, tool_result, error)

**Issue**: Tool count mismatch in API
**Solution**: Verify all tools in metadata are implemented and registered

---

Last Updated: 2026-01-10
Example Protocols: Pyth Network (7 tools, read-only oracle), OpenOcean (3 tools, DEX aggregator)
