"use client";

import { useState } from "react";
import { PlusIcon, InfoIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import CreateDelegationDialog from "../dialogs/CreateDelegationDialog";
import type { DelegationWallet } from "@/lib/actions";

interface DelegationWalletTableProps {
  data: DelegationWallet[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const DelegationWalletTable = ({
  data,
  loading = false,
  error = null,
  onRefresh,
}: DelegationWalletTableProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const formatWallet = (address: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (error) {
    return (
      <div className="w-full border bg-card rounded border-red-500/30">
        <div className="w-full flex items-center justify-between px-4 p-2">
          <p className="font-semibold">Delegation Wallets</p>
        </div>
        <div className="px-4 py-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-white/10 bg-card gradient-content rounded-lg overflow-hidden">
      <div className="w-full flex items-center justify-between px-4 py-3 border-b border-white/10">
        <p className="font-semibold">Delegation Wallets</p>
        <Button
          size="sm"
          className="border"
          variant={"outline"}
          onClick={() => setDialogOpen(true)}
        >
          <PlusIcon size={18} />
        </Button>
      </div>

      {loading ? (
        <div className="px-4 py-6">
          <p className="text-muted-foreground text-sm">Loading wallets...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="px-4 py-6">
          <p className="text-muted-foreground text-sm">
            No delegation wallets yet. Create one to get started.
          </p>
        </div>
      ) : (
        <Table className="text-foreground/70">
          <TableHeader>
            <TableRow className="px-4 border-white/10 hover:bg-white/5">
              <TableHead className="w-12 text-foreground/70 pl-4">No.</TableHead>
              <TableHead className="text-foreground/70">Wallet</TableHead>
              <TableHead className="text-foreground/70">Created</TableHead>

              <TableHead className="w-16 text-right text-foreground/70 pr-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((wallet, index) => (
              <TableRow key={wallet.id} className="px-4">
                <TableCell className="font-medium text-sm pl-4">
                  {index + 1}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {formatWallet(wallet.delegationWalletAddress)}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(wallet.createdAt)}
                </TableCell>
                <TableCell className="text-right pr-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    title="View wallet details"
                  >
                    <InfoIcon size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CreateDelegationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          onRefresh?.();
        }}
      />
    </div>
  );
};

export default DelegationWalletTable;
