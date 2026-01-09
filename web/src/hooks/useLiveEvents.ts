"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type LiveEventType =
  | "orchestrating"
  | "tools_selected"
  | "tool_call"
  | "tool_result"
  | "completed"
  | "error";

export interface LiveEventData {
  tool?: string;
  tools?: string[];
  args?: Record<string, unknown>;
  result?: string;
  note?: string;
  txHash?: string;
  blockNumber?: string;
  error?: string;
}

export interface LiveEvent {
  id: string;
  subscriptionId: string;
  type: LiveEventType;
  timestamp: number;
  data: LiveEventData;
  isExiting?: boolean;
}

interface EventsState {
  subscriptionId: string;
  status: "idle" | "running" | "completed" | "error";
  events: Array<{
    id: string;
    type: LiveEventType;
    timestamp: number;
    data: LiveEventData;
  }>;
}

interface BatchResponse {
  events: EventsState[];
}

const AGENT_EXECUTOR_URL = process.env.NEXT_PUBLIC_AGENT_EXECUTOR_URL || "";
const POLL_INTERVAL = 1000;
const EXIT_ANIMATION_DELAY = 1500;

export function useLiveEvents(subscriptionIds: string[]) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [isAnyRunning, setIsAnyRunning] = useState(false);
  const previousEventIdsRef = useRef<Set<string>>(new Set());
  const exitTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const fetchEvents = useCallback(async () => {
    if (!subscriptionIds.length || !AGENT_EXECUTOR_URL) return;

    try {
      const response = await fetch(
        `${AGENT_EXECUTOR_URL}/events/batch?subscriptionIds=${subscriptionIds.join(",")}`
      );
      const data: BatchResponse = await response.json();

      const allEvents: LiveEvent[] = [];
      let anyRunning = false;

      for (const sub of data.events) {
        if (sub.status === "running") anyRunning = true;
        for (const event of sub.events) {
          allEvents.push({
            ...event,
            subscriptionId: sub.subscriptionId,
          });
        }
      }

      // Sort by timestamp descending (newest first)
      allEvents.sort((a, b) => b.timestamp - a.timestamp);

      // Limit to 20 events
      const limitedEvents = allEvents.slice(0, 20);

      setEvents((prev) => {
        const currentIds = new Set(limitedEvents.map((e) => e.id));
        const previousIds = previousEventIdsRef.current;

        // Find events that disappeared (flushed to DB)
        const exitingIds = new Set<string>();
        for (const id of previousIds) {
          if (!currentIds.has(id)) {
            exitingIds.add(id);
          }
        }

        // Schedule removal of exiting events after animation delay
        for (const id of exitingIds) {
          if (!exitTimeoutsRef.current.has(id)) {
            const timeout = setTimeout(() => {
              setEvents((current) => current.filter((e) => e.id !== id));
              exitTimeoutsRef.current.delete(id);
            }, EXIT_ANIMATION_DELAY);
            exitTimeoutsRef.current.set(id, timeout);
          }
        }

        // Keep exiting events from previous state
        const exitingEvents = prev
          .filter((e) => exitingIds.has(e.id) || e.isExiting)
          .map((e) => ({ ...e, isExiting: true }));

        // Merge: new events + exiting events
        const merged = [
          ...limitedEvents,
          ...exitingEvents.filter((e) => !currentIds.has(e.id)),
        ];

        // Update previous IDs ref
        previousEventIdsRef.current = currentIds;

        return merged;
      });

      setIsAnyRunning(anyRunning);
    } catch (error) {
      console.error("Failed to fetch live events:", error);
    }
  }, [subscriptionIds]);

  useEffect(() => {
    if (!subscriptionIds.length) {
      setEvents([]);
      setIsAnyRunning(false);
      return;
    }

    fetchEvents();
    const interval = setInterval(fetchEvents, POLL_INTERVAL);

    return () => {
      clearInterval(interval);
      // Clear all exit timeouts on cleanup
      for (const timeout of exitTimeoutsRef.current.values()) {
        clearTimeout(timeout);
      }
      exitTimeoutsRef.current.clear();
    };
  }, [fetchEvents, subscriptionIds]);

  return { events, isAnyRunning };
}
