"use client";

import { motion } from "motion/react";
import { useMemo } from "react";

const baseNodePositions = {
  node1: { x: 100, y: 100 },
  node2: { x: 1100, y: 80 },
  node3: { x: 1050, y: 720 },
  node4: { x: 50, y: 700 },
  node5: { x: 600, y: 400 },
  node6: { x: 250, y: 300 },
  node7: { x: 950, y: 350 },
  node8: { x: 600, y: 100 },
};

const animationDeltas = {
  float1: {
    x: [0, 30, 50, 20, 0],
    y: [0, -20, 30, -40, 0],
  },
  float2: {
    x: [0, -40, -20, 35, 0],
    y: [0, 30, -30, 20, 0],
  },
  float3: {
    x: [0, 25, -30, -25, 0],
    y: [0, 25, 40, -30, 0],
  },
  float4: {
    x: [0, -30, 40, -35, 0],
    y: [0, -25, -20, 35, 0],
  },
  float5: {
    x: [0, 35, -25, 20, 0],
    y: [0, 15, -25, 30, 0],
  },
  float6: {
    x: [0, -25, 35, -30, 0],
    y: [0, -35, 20, 25, 0],
  },
  float7: {
    x: [0, 40, -30, 25, 0],
    y: [0, 20, -40, 30, 0],
  },
  float8: {
    x: [0, -35, 25, 30, 0],
    y: [0, -25, 35, -20, 0],
  },
};

const sharedTransition = {
  duration: 20,
  repeat: Infinity,
  ease: "easeInOut",
};

// Define which nodes are connected - sparse network to avoid congestion
const connections = [
  ["node1", "node5"],
  ["node1", "node6"],
  ["node2", "node5"],
  ["node2", "node7"],
  ["node2", "node8"],
  ["node3", "node5"],
  ["node3", "node7"],
  ["node4", "node5"],
  ["node4", "node6"],
  ["node6", "node7"],
  ["node7", "node8"],
  ["node8", "node1"],
];

const VectorBackground = () => {
  // Precompute animation keyframes for each node
  const nodeAnimations = useMemo(() => {
    return Object.entries(baseNodePositions).reduce(
      (acc, [key, pos], idx) => {
        const deltaKey = `float${idx + 1}` as keyof typeof animationDeltas;
        const delta = animationDeltas[deltaKey];
        acc[key] = {
          x: delta.x.map((v) => pos.x + v),
          y: delta.y.map((v) => pos.y + v),
        };
        return acc;
      },
      {} as Record<string, { x: number[]; y: number[] }>
    );
  }, []);

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 800"
    >
      <defs>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Animated Lines - use motion values from nodes */}
      {connections.map(([fromKey, toKey], idx) => {
        const fromAnim = nodeAnimations[fromKey];
        const toAnim = nodeAnimations[toKey];

        return (
          <motion.line
            key={`line-${idx}`}
            x1={fromAnim.x[0]}
            y1={fromAnim.y[0]}
            x2={toAnim.x[0]}
            y2={toAnim.y[0]}
            animate={{
              x1: fromAnim.x,
              y1: fromAnim.y,
              x2: toAnim.x,
              y2: toAnim.y,
            }}
            stroke="#ffffff"
            strokeWidth="0.8"
            opacity="0.12"
            transition={sharedTransition}
          />
        );
      })}

      {/* Animated Nodes */}
      {Object.entries(baseNodePositions).map(([nodeKey, position], idx) => {
        const anim = nodeAnimations[nodeKey];
        return (
          <motion.circle
            key={nodeKey}
            cx={anim.x[0]}
            cy={anim.y[0]}
            r="2.5"
            fill="#ffffff"
            opacity="0.35"
            filter="url(#nodeGlow)"
            animate={{ cx: anim.x, cy: anim.y }}
            transition={sharedTransition}
          />
        );
      })}
    </svg>
  );
};

export default VectorBackground;
