"use client";

import GridInfoCard, {
  GridInfoCardProps,
} from "@/components/cards/GridInfoCard";
import CreateDelegationDialog from "@/components/dialogs/CreateDelegationDialog";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import {
  fetchDelegationWallets,
  fetchStrategies,
  fetchStrategiesForUser,
  type DelegationWallet,
  type Strategy,
  type StrategyInfo,
} from "@/lib/actions";
import DelegationWalletTable from "@/components/tables/DelegationWalletTable";
import UserStrategyTable from "@/components/tables/UserStrategyTable";

export default function Home() {
  const { user, ready } = usePrivy();

  // Delegation wallets state
  const [delegations, setDelegations] = useState<DelegationWallet[]>([]);
  const [delegationsLoading, setDelegationsLoading] = useState(false);
  const [delegationsError, setDelegationsError] = useState<string | null>(null);

  // Strategies state
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [strategiesLoading, setStrategiesLoading] = useState(false);
  const [strategiesError, setStrategiesError] = useState<string | null>(null);

  // User strategies state
  const [userStrategies, setUserStrategies] = useState<StrategyInfo[]>([]);
  const [userStrategiesLoading, setUserStrategiesLoading] = useState(false);
  const [userStrategiesError, setUserStrategiesError] = useState<string | null>(
    null,
  );

  // Dialog state
  const [createDelegationOpen, setCreateDelegationOpen] = useState(false);

  const userWallet = user?.wallet?.address || "";

  useEffect(() => {
    if (!userWallet) {
      setDelegations([]);
      setStrategies([]);
      return;
    }

    const fetchData = async () => {
      setDelegationsLoading(true);
      setDelegationsError(null);
      try {
        const delegationData = await fetchDelegationWallets(userWallet);
        setDelegations(delegationData);
      } catch (error) {
        setDelegationsError(
          error instanceof Error
            ? error.message
            : "Failed to fetch delegations",
        );
      } finally {
        setDelegationsLoading(false);
      }

      setStrategiesLoading(true);
      setStrategiesError(null);
      try {
        const strategyData = await fetchStrategies(userWallet);
        setStrategies(strategyData);
      } catch (error) {
        setStrategiesError(
          error instanceof Error ? error.message : "Failed to fetch strategies",
        );
      } finally {
        setStrategiesLoading(false);
      }

      setUserStrategiesLoading(true);
      setUserStrategiesError(null);
      try {
        const userStrategyData = await fetchStrategiesForUser(userWallet);
        setUserStrategies(userStrategyData);
      } catch (error) {
        setUserStrategiesError(
          error instanceof Error
            ? error.message
            : "Failed to fetch user strategies",
        );
      } finally {
        setUserStrategiesLoading(false);
      }
    };

    fetchData();
  }, [userWallet]);

  const gridInfo: GridInfoCardProps[] = [
    {
      title: "Delegation Accounts",
      value: String(delegations.length),
      imageNum: 1,
    },
    { title: "Strategies", value: String(strategies.length), imageNum: 2 },
    { title: "Projected APY", value: "5%", imageNum: 3 },
  ];

  const handleDelegationCreated = async () => {
    // Refetch delegations after successful creation
    if (userWallet) {
      setDelegationsLoading(true);
      setDelegationsError(null);
      try {
        const delegationData = await fetchDelegationWallets(userWallet);
        setDelegations(delegationData);
      } catch (error) {
        setDelegationsError(
          error instanceof Error
            ? error.message
            : "Failed to fetch delegations",
        );
      } finally {
        setDelegationsLoading(false);
      }
    }
  };

  if (!ready) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="w-full my-8">
        <p className="text-xl font-semibold">Dashboard</p>
      </div>

      {/* Wallet Connection Status */}
      {!userWallet && (
        <div className="w-full mb-8 p-4 border bg-card rounded border-yellow-500/30">
          <p className="text-sm text-yellow-600">
            Connect your wallet using the button in the navbar to view your
            delegation accounts and strategies.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      {userWallet && (
        <>
          <div className="grid grid-cols-3 gap-6">
            {gridInfo.map((item, index) => (
              <GridInfoCard
                key={index}
                title={item.title}
                value={item.value}
                imageNum={item.imageNum}
              />
            ))}
          </div>

          {/* Tables Section */}
          <div className="mt-8 grid grid-cols-7 gap-6">
            <div className="col-span-4 space-y-6">
              {/* User Strategies Table */}
              <UserStrategyTable
                data={userStrategies}
                loading={userStrategiesLoading}
                error={userStrategiesError}
              />

              {/* Delegations Table */}
              <DelegationWalletTable
                data={delegations}
                loading={delegationsLoading}
                error={delegationsError}
                onRefresh={handleDelegationCreated}
              />
            </div>

            {/* Right sidebar - placeholder for future content */}
            <div className="col-span-3"></div>
          </div>
        </>
      )}

      <CreateDelegationDialog
        open={createDelegationOpen}
        onOpenChange={setCreateDelegationOpen}
        onSuccess={handleDelegationCreated}
      />
    </div>
  );
}
