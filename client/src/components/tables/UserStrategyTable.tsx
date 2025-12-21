"use client";

import { useRouter } from "next/navigation";
import { Eye, PlusIcon } from "lucide-react";
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
  const router = useRouter();

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
    <div className="w-full border border-white/10 bg-card gradient-card-subtle rounded-lg overflow-hidden">
      <div className="w-full flex items-center justify-between px-4 py-3 border-b border-white/10">
        <p className="font-semibold">Your Strategies</p>
        <Button
          size="sm"
          className="border"
          variant={"outline"}
          onClick={() => router.push("/create")}
        >
          <PlusIcon size={18} />
        </Button>
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
        <Table className="text-foreground/70">
          <TableHeader>
            <TableRow className="px-4 border-white/10 hover:bg-white/5">
              <TableHead className="text-foreground/70">
                Strategy Name
              </TableHead>
              <TableHead className="text-foreground/70 text-center">
                Subscribers
              </TableHead>
              <TableHead className="text-foreground/70 text-center">
                Active
              </TableHead>
              <TableHead className="text-foreground/70 text-center">
                Public
              </TableHead>
              <TableHead className="w-16 text-right text-foreground/70 pr-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((strategy, index) => (
              <TableRow key={strategy.strategyId} className="px-4 cursor-pointer hover:bg-white/5">
                <TableCell
                  className="text-sm font-semibold cursor-pointer"
                  onClick={() => router.push(`/strategy/${strategy.strategyId}`)}
                >
                  {strategy.name}
                </TableCell>
                <TableCell className="text-sm text-center">
                  {strategy.subscriberCount}
                </TableCell>
                <TableCell className="text-sm text-center">
                  <div className="flex justify-center">
                    <div
                      className={`w-3 h-3 rounded-full animate-pulse ${
                        strategy.isActiveForUser ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-center">
                  <div className="flex justify-center">
                    <div
                      className={`w-3 h-3 rounded-full animate-pulse ${
                        strategy.isPublic ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right pr-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    title="View Strategy"
                    onClick={() => router.push(`/strategy/${strategy.strategyId}`)}
                  >
                    <Eye size={16} />
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
