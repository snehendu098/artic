"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { useState } from "react";
import LetterGlitch from "@/components/LetterGlitch";
import { IconChevronDown } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Marquee } from "@/components/ui/marquee";
import Link from "next/link";

const protocols = [
  { name: "Lendle", logo: "/protocols/lendle.jpg" },
  { name: "mETH", logo: "/protocols/meth.png" },
  { name: "OKX", logo: "/protocols/okx.png" },
  { name: "Pyth", logo: "/protocols/pyth.png" },
];

const features = [
  {
    title: "AI-Powered Strategy Creation",
    description:
      "Create sophisticated trading strategies using natural language. Our AI agents translate your ideas into executable strategies without coding.",
  },
  {
    title: "Autonomous Execution",
    description:
      "Strategies run autonomously on your delegated wallets. Set it and forget it while agents execute your vision 24/7 on Mantle blockchain.",
  },
  {
    title: "Strategy Marketplace",
    description:
      "Monetize your strategies by selling them in the marketplace. Subscribe to proven strategies from experienced traders and earn passive income.",
  },
];

export default function Home() {
  const [openFeature, setOpenFeature] = useState<number | null>(null);

  return (
    <div className="w-full relative h-full flex flex-col items-center">
      <div className="w-full flex max-w-5xl flex-col">
        {/* Navbar */}
        <div className="w-full flex items-center justify-between py-10">
          <div className="flex items-center space-x-2">
            <Image src={"/logo.png"} height={30} width={30} alt="logo" />
          </div>

          <div>
            <Button
              asChild
              className="bg-transparent hover:bg-neutral-900 cursor-pointer text-primary border border-primary"
            >
              <Link href={"/app/dashboard"}>Launch App</Link>
            </Button>
          </div>
        </div>
        {/* Hero */}
        <div className="flex mt-10 items-center justify-center space-x-20">
          <div className="text-lg">
            <p className="text-white/50 lowercase">// Welcome to</p>
            <div className="text-8xl font-semibold text-white ">
              <p className="text-white">Artic</p>
              <p className="text-muted-foreground">Protocol</p>
            </div>
            <div className="flex items-center w-full mt-6 space-x-2">
              <div className="border p-2 bg-neutral-900">
                <FaXTwitter className="text-2xl aspect-square text-muted-foreground" />
              </div>

              <div className="border p-2 bg-neutral-900">
                <FaGithub className="text-2xl aspect-square text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="text-muted-foreground">
            Autonomous <span className="text-primary">yield farming </span>
            strategies powered by{" "}
            <span className="text-primary">AI agents </span>on Mantle
            blockchain. Create strategies in plain English, execute them
            automatically on delegated wallets, or{" "}
            <span className="text-primary">monetize </span>your expertise by
            selling strategies in the marketplace
          </div>
        </div>

        {/* Protocol Marquee */}
        <div className="w-full my-20 relative">
          <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-background z-10 pointer-events-none" />
          <Marquee>
            {protocols.map((protocol) => (
              <div
                key={protocol.name}
                className="flex items-center justify-center p-4 bg-neutral-900 border space-x-6 mx-2"
              >
                <div className="relative aspect-square h-10">
                  <Image
                    src={protocol.logo}
                    alt={`${protocol.name} logo`}
                    fill
                    className="object-contain  transition-all"
                  />
                </div>
                <p className="text-xl font-semibold">{protocol.name}</p>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Features */}
        <div className="my-20">
          <div className="flex gap-10">
            {/* Left: Features List */}
            <div className="flex-1 space-y-4">
              <p className="text-5xl font-semibold text-white mb-10">
                Features
              </p>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="border border-neutral-700 bg-neutral-900 hover:border-primary/50 transition-colors"
                >
                  <button
                    onClick={() =>
                      setOpenFeature(openFeature === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <IconChevronDown
                      className={`h-5 w-5 text-white transition-transform duration-300 shrink-0 ml-4 ${
                        openFeature === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFeature === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right: Letter Glitch */}
            <div className="flex items-center justify-center flex-1">
              <div className="max-h-40 w-full">
                <LetterGlitch
                  glitchColors={["#efb100", "#fcda90"]}
                  glitchSpeed={50}
                  centerVignette
                  outerVignette
                  smooth
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
