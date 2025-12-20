"use client";

import { InfoIcon, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { StrategyInfo } from "@/lib/actions";

interface UserStrategyTableProps {
  data: StrategyInfo[];
  loading?: boolean;
  error?: string | null;
}

const UserStrategyTable = ({
  data,
  loading = false,
  error = null,
}: UserStrategyTableProps) => {
  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-medium">
          <CheckCircle2 size={14} />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-500/20 text-gray-400 text-xs font-medium">
        Inactive
      </span>
    );
  };

  const getCreatorBadge = (isCreator: boolean) => {
    if (isCreator) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-medium">
          Creator
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-medium">
        Subscribed
      </span>
    );
  };

  if (error) {
    return (
      <div className="w-full border bg-card rounded border-red-500/30">
        <div className="w-full flex items-center justify-between px-4 p-2">
          <p className="font-semibold">Your Strategies</p>
        </div>
        <div className="px-4 py-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border bg-neutral-900 rounded-md">
      <div className="w-full flex items-center justify-between px-4 py-3 border-b">
        <p className="font-semibold">Your Strategies</p>
      </div>

      {loading ? (
        <div className="px-4 py-6">
          <p className="text-muted-foreground text-sm">Loading strategies...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="px-4 py-6">
          <p className="text-muted-foreground text-sm">
            No strategies yet. Create or subscribe to strategies to get started.
          </p>
        </div>
      ) : (
        <Table className="text-white/50">
          <TableHeader>
            <TableRow className="px-4">
              <TableHead className="w-12 text-white/60 pl-4">No.</TableHead>
              <TableHead className="text-white/60">Strategy ID</TableHead>
              <TableHead className="text-white/60 text-center">Subscribers</TableHead>
              <TableHead className="text-white/60 text-center">Status</TableHead>
              <TableHead className="text-white/60 text-center">Type</TableHead>
              <TableHead className="w-16 text-right text-white/60 pr-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((strategy, index) => (
              <TableRow key={strategy.strategyId} className="px-4">
                <TableCell className="font-medium text-sm pl-4">
                  {index + 1}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {strategy.strategyId.slice(0, 8)}...{strategy.strategyId.slice(-4)}
                </TableCell>
                <TableCell className="text-sm text-center">
                  {strategy.subscriberCount}
                </TableCell>
                <TableCell className="text-sm text-center">
                  {getStatusBadge(strategy.isActiveForUser)}
                </TableCell>
                <TableCell className="text-sm text-center">
                  {getCreatorBadge(strategy.isCreator)}
                </TableCell>
                <TableCell className="text-right pr-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    title="View strategy details"
                  >
                    <InfoIcon size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UserStrategyTable;
