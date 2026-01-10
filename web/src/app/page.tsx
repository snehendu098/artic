"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { useState } from "react";
import LetterGlitch from "@/components/LetterGlitch";
import { LaserFlow } from "@/components/LaserFlow";
import { HyperText } from "@/components/ui/hyper-text";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { TextAnimate } from "@/components/ui/text-animate";
import { IconChevronDown } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Marquee } from "@/components/ui/marquee";
import Link from "next/link";

const protocols = [
  { name: "Lendle", logo: "/protocols/lendle.jpg" },
  { name: "mETH", logo: "/protocols/meth.png" },
  { name: "OKX", logo: "/protocols/okx.png" },
  { name: "Pyth", logo: "/protocols/pyth.png" },
  { name: "OpenOcean", logo: "/protocols/openocean.jpeg" },
  { name: "Merchant Moe", logo: "/protocols/merchantmoe.png" },
  { name: "Agni", logo: "/protocols/agni.jpg" },
  { name: "Uniswap", logo: "/protocols/uniswap.jpg" },
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
      <div className="w-full flex max-w-5xl flex-col z-10">
        {/* Navbar */}
        <div className="w-full flex items-center justify-between py-10">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image src={"/logo.png"} height={30} width={30} alt="logo" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              asChild
              className="bg-transparent hover:bg-neutral-900 cursor-pointer text-primary border border-primary"
            >
              <Link href={"/app/dashboard"}>Launch App</Link>
            </Button>
          </motion.div>
        </div>
        {/* Hero */}
        <div className="flex mt-10 items-center justify-center space-x-20">
          <div className="text-lg">
            <TypingAnimation
              className="text-white/50 lowercase"
              duration={50}
              delay={0}
              showCursor={true}
              blinkCursor={true}
            >
              // Welcome to
            </TypingAnimation>
            <div className="text-8xl font-semibold">
              <HyperText
                as="p"
                className="text-white text-8xl py-0"
                duration={600}
                delay={200}
              >
                Artic
              </HyperText>
              <HyperText
                as="p"
                className="text-muted-foreground text-8xl py-0"
                duration={600}
                delay={500}
              >
                Protocol
              </HyperText>
            </div>
            <div className="flex items-center w-full mt-6 space-x-2">
              <motion.div
                className="border p-2 bg-neutral-900"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                whileHover={{ scale: 1.1 }}
              >
                <FaXTwitter className="text-2xl aspect-square text-muted-foreground" />
              </motion.div>

              <motion.div
                className="border p-2 bg-neutral-900"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                whileHover={{ scale: 1.1 }}
              >
                <FaGithub className="text-2xl aspect-square text-muted-foreground" />
              </motion.div>
            </div>
          </div>

          <div className="text-muted-foreground max-w-md">
            <TextAnimate
              as="span"
              animation="blurIn"
              by="word"
              delay={0.6}
              duration={0.4}
              startOnView={false}
            >
              Autonomous
            </TextAnimate>{" "}
            <TextAnimate
              as="span"
              className="text-primary"
              animation="blurIn"
              by="word"
              delay={0.7}
              duration={0.4}
              startOnView={false}
            >
              yield farming
            </TextAnimate>{" "}
            <TextAnimate
              as="span"
              animation="blurIn"
              by="word"
              delay={0.9}
              duration={0.4}
              startOnView={false}
            >
              strategies powered by
            </TextAnimate>{" "}
            <TextAnimate
              as="span"
              className="text-primary"
              animation="blurIn"
              by="word"
              delay={1.1}
              duration={0.4}
              startOnView={false}
            >
              AI agents
            </TextAnimate>{" "}
            <TextAnimate
              as="span"
              animation="blurIn"
              by="word"
              delay={1.3}
              duration={0.6}
              startOnView={false}
            >
              on Mantle blockchain. Create strategies in plain English, execute them automatically on delegated wallets, or
            </TextAnimate>{" "}
            <TextAnimate
              as="span"
              className="text-primary"
              animation="blurIn"
              by="word"
              delay={1.9}
              duration={0.3}
              startOnView={false}
            >
              monetize
            </TextAnimate>{" "}
            <TextAnimate
              as="span"
              animation="blurIn"
              by="word"
              delay={2.0}
              duration={0.5}
              startOnView={false}
            >
              your expertise by selling strategies in the marketplace
            </TextAnimate>
          </div>
        </div>

        {/* Protocol Marquee */}
        <motion.div
          className="w-full my-20 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
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
        </motion.div>

        {/* Features */}
        <div className="my-20">
          <div className="flex gap-10">
            {/* Left: Features List */}
            <div className="flex-1 space-y-4">
              <motion.p
                className="text-5xl font-semibold text-white mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Features
              </motion.p>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="border border-neutral-700 bg-neutral-900 hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
                </motion.div>
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
