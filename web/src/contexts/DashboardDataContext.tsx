"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { getDelegationWallets, getUserStrategies, getUserSubscriptions, getSubscribers, getWalletActions } from "@/actions/dashboard.actions";
import { getUserPurchases, type Purchase } from "@/actions/marketplace.actions";
import { aggregateBalancesToAssets } from "@/lib/blockchain";
import type { DelegationWallet, Strategy, Subscription, Subscriber, Action, Asset } from "@/types";

interface DashboardData {
  wallets: DelegationWallet[];
  strategies: Strategy[];
  subscriptions: Subscription[];
  subscribers: Subscriber[];
  actions: Action[];
  purchases: Purchase[];
  assets: Asset[];
}

interface LoadingState {
  wallets: boolean;
  strategies: boolean;
  subscriptions: boolean;
  subscribers: boolean;
  actions: boolean;
  purchases: boolean;
  assets: boolean;
}

interface DashboardContextValue {
  data: DashboardData;
  isInitialLoading: boolean;
  loading: LoadingState;
  refetch: {
    wallets: () => Promise<DelegationWallet[] | undefined>;
    strategies: () => Promise<void>;
    subscriptions: () => Promise<void>;
    subscribers: () => Promise<void>;
    actions: () => Promise<void>;
    purchases: () => Promise<void>;
    assets: (walletAddresses: string[]) => Promise<void>;
    all: () => Promise<void>;
  };
  refetchGroup: {
    wallets: () => Promise<void>;
    strategies: () => Promise<void>;
    subscriptions: () => Promise<void>;
    assets: () => Promise<void>;
  };
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboardData() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardData must be used within DashboardDataProvider");
  }
  return context;
}

interface DashboardDataProviderProps {
  children: ReactNode;
  walletAddress: string | undefined;
  chainId: number;
}

export function DashboardDataProvider({ children, walletAddress, chainId }: DashboardDataProviderProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const walletsRef = useRef<DelegationWallet[]>([]);
  const [data, setData] = useState<DashboardData>({
    wallets: [],
    strategies: [],
    subscriptions: [],
    subscribers: [],
    actions: [],
    purchases: [],
    assets: [],
  });
  const [loading, setLoading] = useState<LoadingState>({
    wallets: false,
    strategies: false,
    subscriptions: false,
    subscribers: false,
    actions: false,
    purchases: false,
    assets: false,
  });

  const fetchWallets = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(prev => ({ ...prev, wallets: true }));
    try {
      const result = await getDelegationWallets(walletAddress);
      walletsRef.current = result;
      setData(prev => ({ ...prev, wallets: result }));
      return result;
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, wallets: false }));
    }
  }, [walletAddress]);

  const fetchStrategies = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(prev => ({ ...prev, strategies: true }));
    try {
      const result = await getUserStrategies(walletAddress);
      setData(prev => ({ ...prev, strategies: result }));
    } catch (error) {
      console.error("Failed to fetch strategies:", error);
    } finally {
      setLoading(prev => ({ ...prev, strategies: false }));
    }
  }, [walletAddress]);

  const fetchSubscriptions = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(prev => ({ ...prev, subscriptions: true }));
    try {
      const result = await getUserSubscriptions(walletAddress);
      setData(prev => ({ ...prev, subscriptions: result }));
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoading(prev => ({ ...prev, subscriptions: false }));
    }
  }, [walletAddress]);

  const fetchSubscribers = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(prev => ({ ...prev, subscribers: true }));
    try {
      const result = await getSubscribers(walletAddress);
      setData(prev => ({ ...prev, subscribers: result }));
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
    } finally {
      setLoading(prev => ({ ...prev, subscribers: false }));
    }
  }, [walletAddress]);

  const fetchActions = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(prev => ({ ...prev, actions: true }));
    try {
      const result = await getWalletActions(walletAddress, 10);
      setData(prev => ({ ...prev, actions: result }));
    } catch (error) {
      console.error("Failed to fetch actions:", error);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  }, [walletAddress]);

  const fetchPurchases = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(prev => ({ ...prev, purchases: true }));
    try {
      const result = await getUserPurchases(walletAddress);
      setData(prev => ({ ...prev, purchases: result }));
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    } finally {
      setLoading(prev => ({ ...prev, purchases: false }));
    }
  }, [walletAddress]);

  const fetchAssets = useCallback(async (walletAddresses: string[]) => {
    if (walletAddresses.length === 0) {
      setData(prev => ({ ...prev, assets: [] }));
      return;
    }
    setLoading(prev => ({ ...prev, assets: true }));
    try {
      const result = await aggregateBalancesToAssets(walletAddresses, chainId);
      setData(prev => ({ ...prev, assets: result }));
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setLoading(prev => ({ ...prev, assets: false }));
    }
  }, [chainId]);

  const fetchAll = useCallback(async () => {
    if (!walletAddress) {
      setIsInitialLoading(false);
      return;
    }

    try {
      // Fetch wallets first since assets depend on them
      const wallets = await fetchWallets();

      // Fetch everything else in parallel
      await Promise.all([
        fetchStrategies(),
        fetchSubscriptions(),
        fetchSubscribers(),
        fetchActions(),
        fetchPurchases(),
        wallets && wallets.length > 0
          ? fetchAssets(wallets.map(w => w.address))
          : Promise.resolve(),
      ]);
    } finally {
      setIsInitialLoading(false);
    }
  }, [walletAddress, fetchWallets, fetchStrategies, fetchSubscriptions, fetchSubscribers, fetchActions, fetchPurchases, fetchAssets]);

  // Initial fetch
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Group refetch functions - update related cards together
  const refetchGroup = useMemo(() => ({
    wallets: async () => {
      const wallets = await fetchWallets();
      if (wallets && wallets.length > 0) {
        await fetchAssets(wallets.map(w => w.address));
      }
    },
    strategies: async () => {
      await Promise.all([fetchStrategies(), fetchPurchases()]);
    },
    subscriptions: async () => {
      await fetchSubscriptions();
    },
    assets: async () => {
      await fetchAssets(walletsRef.current.map(w => w.address));
    },
  }), [fetchWallets, fetchAssets, fetchStrategies, fetchPurchases, fetchSubscriptions]);

  const refetch = useMemo(() => ({
    wallets: fetchWallets,
    strategies: fetchStrategies,
    subscriptions: fetchSubscriptions,
    subscribers: fetchSubscribers,
    actions: fetchActions,
    purchases: fetchPurchases,
    assets: fetchAssets,
    all: fetchAll,
  }), [fetchWallets, fetchStrategies, fetchSubscriptions, fetchSubscribers, fetchActions, fetchPurchases, fetchAssets, fetchAll]);

  const value = useMemo(() => ({
    data,
    isInitialLoading,
    loading,
    refetch,
    refetchGroup,
  }), [data, isInitialLoading, loading, refetch, refetchGroup]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
