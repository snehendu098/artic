"use client";

import type React from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "What is Artic Protocol?",
    answer:
      "Artic is an autonomous trading protocol on Mantle blockchain. Create strategies in plain English, and AI agents will execute them 24/7 on your behalf using delegation wallets.",
  },
  {
    question: "How do delegation wallets work?",
    answer:
      "Delegation wallets are isolated wallets created for each strategy subscription. You fund them, and the AI agent executes trades according to your strategy. You maintain full control and can withdraw anytime.",
  },
  {
    question: "Can I sell my trading strategies?",
    answer:
      "Yes! You can publish your strategies to the marketplace and set a price in MNT. When others subscribe, you earn 95% of the purchase price automatically.",
  },
  {
    question: "Is my funds safe?",
    answer:
      "Artic is non-custodial. Your funds stay in your delegation wallets, and all trades are executed on-chain with full transparency. You can pause strategies or withdraw funds at any time.",
  },
  {
    question: "What strategies can I create?",
    answer:
      "You can create any DeFi strategy - from simple swaps to complex multi-step strategies involving lending, staking, and yield farming across protocols on Mantle.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Creating strategies is free. You only pay gas fees for trades and any marketplace purchase fees if you buy strategies from other users.",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle();
  };
  return (
    <div
      className="w-full bg-white/5 shadow-sm overflow-hidden rounded-xl border border-white/10 transition-all duration-500 ease-out cursor-pointer hover:border-primary/30"
      onClick={handleClick}
    >
      <div className="w-full px-5 py-4 pr-4 flex justify-between items-center gap-5 text-left transition-all duration-300 ease-out">
        <div className="flex-1 text-foreground text-base font-medium leading-6">
          {question}
        </div>
        <div className="flex justify-center items-center">
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-all duration-500 ease-out ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div
          className={`px-5 transition-all duration-500 ease-out ${isOpen ? "pb-4 pt-0" : "pb-0 pt-0"}`}
        >
          <div className="text-muted-foreground text-sm leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="w-full pt-16 pb-20 md:pb-32 px-5 relative flex flex-col justify-center items-center">
      <div className="w-[300px] h-[500px] absolute top-[150px] left-1/2 -translate-x-1/2 origin-top-left rotate-[-33.39deg] bg-primary/5 blur-[100px] z-0" />
      <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 relative z-10">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="w-full max-w-[435px] text-center text-foreground text-3xl md:text-4xl font-semibold leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium">
            Everything you need to know about Artic Protocol
          </p>
        </div>
      </div>
      <div className="w-full max-w-[600px] flex flex-col justify-start items-start gap-3 relative z-10">
        {faqData.map((faq, index) => (
          <FAQItem
            key={index}
            {...faq}
            isOpen={openItems.has(index)}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>
    </section>
  );
}
