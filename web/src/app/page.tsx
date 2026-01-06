"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import NetworkBackground from "@/components/landing/network-background";

export default function Home() {
  const [activeSection, setActiveSection] = useState("");
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-background text-foreground relative scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <NetworkBackground />
      {/* Side Navigation */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {["intro", "features", "how-it-works", "connect"].map((section) => (
            <button
              key={section}
              onClick={() =>
                document
                  .getElementById(section)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`w-2 h-8 rounded-full transition-all duration-500 ${
                activeSection === section
                  ? "bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Navigate to ${section}`}
            />
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
        {/* Hero Section */}
        <header
          id="intro"
          ref={(el) => {
            sectionsRef.current[0] = el;
          }}
          className="min-h-screen flex items-center opacity-0 snap-start"
        >
          <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full">
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-2">
                <div className="text-sm text-muted-foreground font-mono tracking-wider">
                  // automated yield farming
                </div>
                <h1 className="text-5xl uppercase sm:text-6xl lg:text-7xl font-light tracking-tight">
                  Artic
                  <br />
                  <span className="text-muted-foreground">Protocol</span>
                </h1>
              </div>

              <div className="space-y-6 max-w-md">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Create trading strategies in
                  <span className="text-foreground"> plain English</span>. Let
                  AI agents execute them
                  <span className="text-foreground"> 24/7</span> with full
                  <span className="text-foreground"> transparency</span>.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live on Mantle
                  </div>
                </div>

                <Link href="/app/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="text-primary bg-transparent hover:bg-neutral-900/90 px-8 py-3 rounded-full font-medium text-base ring-1 ring-primary/20 mt-4 transition-all duration-300">
                      Launch App
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end space-y-6 sm:space-y-8 mt-8 lg:mt-0">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">
                  BUILT FOR
                </div>
                <div className="space-y-2">
                  <div className="text-foreground">Pro Strategists</div>
                  <div className="text-muted-foreground">
                    Automate your strategies
                  </div>
                  <div className="text-xs text-muted-foreground">
                    No coding required
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">
                  PROTOCOLS
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Swaps", "Lending", "Staking", "Yield", "DEX"].map(
                    (protocol, index) => (
                      <motion.span
                        key={protocol}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.08 }}
                        className="px-3 py-1 text-xs border border-border rounded-full cursor-pointer transition-colors duration-300"
                      >
                        {protocol}
                      </motion.span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section
          id="features"
          ref={(el) => {
            sectionsRef.current[1] = el;
          }}
          className="min-h-screen py-20 sm:py-32 opacity-0 snap-start"
        >
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">Core Features</h2>
              <div className="text-sm text-muted-foreground font-mono">
                WHY ARTIC
              </div>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {[
                {
                  num: "01",
                  title: "AI-Powered Agents",
                  description:
                    "Autonomous agents execute your strategies 24/7 without manual intervention.",
                  tags: ["Automation", "Always On", "Smart"],
                },
                {
                  num: "02",
                  title: "Delegation Wallets",
                  description:
                    "Create isolated wallets for each strategy. Full control with transparent on-chain execution.",
                  tags: ["Non-Custodial", "Secure", "Isolated"],
                },
                {
                  num: "03",
                  title: "Strategy Marketplace",
                  description:
                    "Buy and sell proven strategies. Monetize your trading expertise or leverage others'.",
                  tags: ["Earn", "Share", "Discover"],
                },
                {
                  num: "04",
                  title: "Plain English Strategies",
                  description:
                    "No coding required. Describe what you want in simple terms and let AI handle the rest.",
                  tags: ["Simple", "Intuitive", "Accessible"],
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="group grid lg:grid-cols-12 gap-2 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-primary/30 transition-colors duration-500 cursor-pointer"
                >
                  <div className="lg:col-span-2">
                    <motion.div
                      className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-primary transition-colors duration-500"
                      whileHover={{ scale: 1.2 }}
                    >
                      {feature.num}
                    </motion.div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">
                      {feature.description}
                    </p>
                  </div>

                  <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end mt-2 lg:mt-0">
                    {feature.tags.map((tag, tagIndex) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + tagIndex * 0.05 }}
                        className="px-2 py-1 text-xs text-muted-foreground rounded group-hover:text-primary/80 transition-colors duration-500"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          ref={(el) => {
            sectionsRef.current[2] = el;
          }}
          className="min-h-screen py-20 sm:py-32 opacity-0 snap-start"
        >
          <div className="space-y-12 sm:space-y-16">
            <h2 className="text-3xl sm:text-4xl font-light uppercase">
              How It Works
            </h2>

            <div className="grid gap-2 sm:gap-8 lg:grid-cols-2">
              {[
                {
                  step: "01",
                  title: "Create a Strategy",
                  description:
                    "Describe your trading strategy in plain English. Set conditions, triggers, and actions.",
                },
                {
                  step: "02",
                  title: "Fund Your Wallet",
                  description:
                    "Create a delegation wallet and deposit funds. Your keys, your control.",
                },
                {
                  step: "03",
                  title: "Activate & Relax",
                  description:
                    "Subscribe to your strategy. AI agents handle execution around the clock.",
                },
                {
                  step: "04",
                  title: "Monitor & Earn",
                  description:
                    "Track performance in real-time. Sell your strategies on the marketplace.",
                },
              ].map((item, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{ y: -6 }}
                  className="group p-6 sm:p-8 border bg-neutral-900/80 backdrop-blur-sm border-border rounded-lg hover:border-primary/50 transition-colors duration-500 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <motion.span
                        whileHover={{ color: "rgba(139, 92, 246, 1)" }}
                      >
                        // STEP {item.step}
                      </motion.span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-medium group-hover:text-primary uppercase transition-colors duration-300">
                      {item.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <section
          id="connect"
          ref={(el) => {
            sectionsRef.current[3] = el;
          }}
          className="min-h-screen py-20 sm:py-32 opacity-0 snap-start flex flex-col"
        >
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-3xl uppercase sm:text-4xl font-light">
                Start earning yield
              </h2>

              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-muted-foreground ">
                  Join the future of DeFi. Create your first strategy in minutes
                  and let AI handle the rest.
                </p>

                <Link href="/app/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="text-primary hover:bg-neutral-900/90 bg-transparent px-8 py-3 rounded-full font-medium text-base ring-1 ring-primary/20 transition-all duration-300">
                      Launch App
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="text-sm text-muted-foreground font-mono">
                LINKS
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: "Strategies",
                    description: "Create strategies",
                    link: "/app/strategies/create",
                  },
                  {
                    name: "Marketplace",
                    description: "Browse strategies",
                    link: "/app/marketplace",
                  },
                  {
                    name: "GitHub",
                    description: "View source code",
                    link: "https://www.github.com/snehendu098/artic",
                  },
                  {
                    name: "Twitter",
                    description: "@ArticProtocol",
                    link: "https://www.x.com/ArticProtocol",
                  },
                ].map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="h-full"
                  >
                    <Link
                      href={link.link}
                      className="group block h-full p-4 border bg-neutral-900/80 backdrop-blur-sm border-border rounded-lg hover:border-primary/50 transition-colors duration-300"
                    >
                      <div className="space-y-2">
                        <div className="text-foreground group-hover:text-primary transition-colors duration-300">
                          {link.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {link.description}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-16 mt-auto border-t border-border">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Artic Protocol. Autonomous trading on Mantle.
                </div>
                <div className="text-xs text-muted-foreground">
                  Non-custodial. Transparent. 24/7.
                </div>
              </div>

              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/app/dashboard"
                    className="group px-6 py-2 rounded-full border border-border hover:border-primary/50 transition-all duration-300 inline-block"
                  >
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      Launch App
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-24  from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  );
}
