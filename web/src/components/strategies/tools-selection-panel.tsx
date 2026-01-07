"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import CardLayout from "@/components/layouts/card-layout";
import { useProtocols, Protocol } from "@/hooks/useProtocols";
import { getProtocolLogoPath } from "@/lib/protocols";

interface ToolsSelectionPanelProps {
  onClose: () => void;
  selectedTools: string[];
  onToolsChange: (tools: string[]) => void;
}

export const ToolsSelectionPanel = ({
  onClose,
  selectedTools,
  onToolsChange,
}: ToolsSelectionPanelProps) => {
  const { data: protocols, isLoading } = useProtocols();
  const [expandedProtocols, setExpandedProtocols] = useState<Set<string>>(
    new Set()
  );

  const toggleProtocol = (protocolName: string) => {
    const newExpanded = new Set(expandedProtocols);
    if (newExpanded.has(protocolName)) {
      newExpanded.delete(protocolName);
    } else {
      newExpanded.add(protocolName);
    }
    setExpandedProtocols(newExpanded);
  };

  const isProtocolSelected = (protocol: Protocol) => {
    return protocol.tools.every((tool) => selectedTools.includes(tool.name));
  };

  const toggleProtocolSelection = (protocol: Protocol) => {
    const allToolNames = protocol.tools.map((t) => t.name);
    const allSelected = isProtocolSelected(protocol);

    if (allSelected) {
      // Deselect all tools from this protocol
      onToolsChange(
        selectedTools.filter((tool) => !allToolNames.includes(tool))
      );
    } else {
      // Select all tools from this protocol
      const newSelection = new Set([...selectedTools, ...allToolNames]);
      onToolsChange(Array.from(newSelection));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-[40%] mt-[52px]"
    >
      <CardLayout>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-white/50">// select tools</p>
            <p className="uppercase">Available Tools</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-700 border border-neutral-600 hover:border-primary/50 transition-all duration-200 group"
          >
            <X className="w-4 h-4 group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          </div>
        )}

        {/* Protocols List */}
        {!isLoading && protocols && (
          <div className="space-y-3">
            {protocols.map((protocol, index) => (
              <motion.div
                key={protocol.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Protocol Header */}
                <div
                  onClick={() => toggleProtocolSelection(protocol)}
                  className={`p-3 bg-neutral-800 border transition-all cursor-pointer ${
                    isProtocolSelected(protocol)
                      ? "border-primary/50 bg-primary/5"
                      : "border-neutral-700 hover:border-neutral-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        isProtocolSelected(protocol)
                          ? "bg-primary border-primary"
                          : "border-neutral-600 hover:border-primary/50"
                      }`}
                    >
                      {isProtocolSelected(protocol) && (
                        <svg
                          className="w-3 h-3 text-black"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Protocol Logo */}
                    <div className="w-8 h-8 relative flex-shrink-0">
                      <Image
                        src={getProtocolLogoPath(protocol.name)}
                        alt={`${protocol.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Protocol Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{protocol.name}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProtocol(protocol.name);
                          }}
                          className="p-0.5 hover:bg-neutral-700 transition-colors"
                        >
                          <ChevronDown
                            className={`w-4 h-4 text-white/50 transition-transform ${
                              expandedProtocols.has(protocol.name)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-xs text-white/50">
                        {protocol.description}
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        {protocol.tools.length} tools available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tools List (Expandable - Read-only) */}
                <AnimatePresence>
                  {expandedProtocols.has(protocol.name) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-2 space-y-2">
                        {protocol.tools.map((tool) => (
                          <div
                            key={tool.name}
                            className={`p-2 bg-neutral-900 border-l-2 transition-all ${
                              selectedTools.includes(tool.name)
                                ? "border-primary bg-primary/5"
                                : "border-neutral-700"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium font-mono">
                                  {tool.name}
                                </p>
                                <p className="text-xs text-white/40 mt-0.5">
                                  {tool.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer */}
        {!isLoading && protocols && (
          <div className="mt-4 p-3 bg-neutral-800/50 border border-neutral-700">
            <p className="text-xs text-white/50">
              {selectedTools.length} tool{selectedTools.length !== 1 ? "s" : ""}{" "}
              selected
            </p>
          </div>
        )}
      </CardLayout>
    </motion.div>
  );
};
