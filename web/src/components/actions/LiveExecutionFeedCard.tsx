"use client";

import CardLayout from "@/components/layouts/card-layout";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useLiveEvents, LiveEvent, LiveEventType } from "@/hooks";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBrain,
  IconListCheck,
  IconArrowRight,
  IconCheck,
  IconX,
  IconCircleCheck,
} from "@tabler/icons-react";

const typeIcons: Record<LiveEventType, React.ReactNode> = {
  orchestrating: <IconBrain className="w-4 h-4" />,
  tools_selected: <IconListCheck className="w-4 h-4" />,
  tool_call: <IconArrowRight className="w-4 h-4" />,
  tool_result: <IconCheck className="w-4 h-4" />,
  completed: <IconCircleCheck className="w-4 h-4" />,
  error: <IconX className="w-4 h-4" />,
};

const typeColors: Record<LiveEventType, string> = {
  orchestrating: "text-blue-400",
  tools_selected: "text-purple-400",
  tool_call: "text-yellow-400",
  tool_result: "text-green-400",
  completed: "text-green-400",
  error: "text-red-400",
};

const typeLabels: Record<LiveEventType, string> = {
  orchestrating: "Analyzing",
  tools_selected: "Tools Selected",
  tool_call: "Executing",
  tool_result: "Result",
  completed: "Completed",
  error: "Error",
};

function getEventDescription(event: LiveEvent): string {
  const { type, data } = event;
  switch (type) {
    case "orchestrating":
      return data.note || "Analyzing strategy...";
    case "tools_selected":
      return data.tools?.join(", ") || "Tools selected";
    case "tool_call":
      return `Calling ${data.tool || "tool"}...`;
    case "tool_result":
      return data.result || "Execution completed";
    case "completed":
      return data.note || "Strategy execution finished";
    case "error":
      return data.error || "An error occurred";
    default:
      return "";
  }
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);

  if (diffSecs < 5) return "just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  return `${Math.floor(diffMins / 60)}h ago`;
}

const eventVariants = {
  initial: { opacity: 0, x: -20, height: 0 },
  animate: {
    opacity: 1,
    x: 0,
    height: "auto",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: 20,
    height: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const LiveExecutionFeedCard = () => {
  const { data } = useDashboardData();
  const { subscriptions } = data;

  const activeSubscriptionIds = useMemo(() => {
    if (!subscriptions) return [];
    return subscriptions
      .filter((s) => s.isActive)
      .map((s) => s.id);
  }, [subscriptions]);

  const { events, isAnyRunning } = useLiveEvents(activeSubscriptionIds);

  const hasEvents = events.length > 0;

  return (
    <CardLayout>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">// live execution</p>
          <p className="uppercase">Live Feed</p>
        </div>
        {isAnyRunning && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs text-green-400">Running</span>
          </div>
        )}
      </div>

      {hasEvents ? (
        <div className="w-full space-y-2 mt-4 max-h-[300px] overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {events.map((event) => (
              <motion.div
                key={event.id}
                variants={eventVariants}
                initial="initial"
                animate={event.isExiting ? "exit" : "animate"}
                exit="exit"
                layout
                className={`p-3 bg-neutral-800 border border-neutral-700 ${
                  event.isExiting ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 ${typeColors[event.type]}`}>
                    {typeIcons[event.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-1.5 py-0.5 bg-neutral-700/50 ${typeColors[event.type]}`}
                      >
                        {typeLabels[event.type]}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-white/90 line-clamp-2 break-all">
                      {getEventDescription(event)}
                    </p>
                    <span className="text-xs text-white/40 mt-1 block">
                      {formatRelativeTime(event.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="mt-4 p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-white/40">No active executions</p>
          <p className="text-xs text-white/30 mt-1">
            Live events will appear here during strategy execution
          </p>
        </div>
      )}
    </CardLayout>
  );
};

export default LiveExecutionFeedCard;
