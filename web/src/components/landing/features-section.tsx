"use client";

import { Bot, Wallet, ShoppingBag, Zap, Shield, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const FeatureCard = ({ title, description, Icon }: FeatureCardProps) => (
  <div className="overflow-hidden rounded-2xl border border-white/10 flex flex-col justify-start items-start relative group hover:border-primary/30 transition-colors">
    <div
      className="absolute inset-0 rounded-2xl"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

    <div className="self-stretch p-6 flex flex-col justify-start items-start gap-4 relative z-10">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <h3 className="text-foreground text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Agents",
      description:
        "Autonomous agents execute your strategies 24/7 without manual intervention. Set it and forget it.",
      Icon: Bot,
    },
    {
      title: "Delegation Wallets",
      description:
        "Create isolated wallets for each strategy. Full control with transparent on-chain execution.",
      Icon: Wallet,
    },
    {
      title: "Strategy Marketplace",
      description:
        "Buy and sell proven strategies. Monetize your trading expertise or leverage others'.",
      Icon: ShoppingBag,
    },
    {
      title: "Instant Execution",
      description:
        "Lightning-fast trades on Mantle. Low gas fees mean more profits in your pocket.",
      Icon: Zap,
    },
    {
      title: "Non-Custodial",
      description:
        "Your keys, your funds. Strategies run on your delegation wallets with full transparency.",
      Icon: Shield,
    },
    {
      title: "Performance Analytics",
      description:
        "Track every action, every trade. Full visibility into how your strategies perform.",
      Icon: TrendingUp,
    },
  ];

  return (
    <section className="w-full px-5 flex flex-col justify-center items-center overflow-visible bg-transparent">
      <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
        <div className="w-[547px] h-[938px] absolute top-[614px] left-[80px] origin-top-left rotate-[-33.39deg] bg-primary/5 blur-[130px] z-0" />
        <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
          <div className="flex flex-col justify-start items-center gap-4">
            <h2 className="w-full max-w-[655px] text-center text-foreground text-4xl md:text-5xl font-semibold leading-tight">
              Trade Smarter, Not Harder
            </h2>
            <p className="w-full max-w-[600px] text-center text-muted-foreground text-base md:text-lg font-medium leading-relaxed">
              Create strategies in plain English. Let AI agents handle the
              execution while you focus on what matters.
            </p>
          </div>
        </div>
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 z-10">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
