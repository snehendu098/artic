"use client";

import { Twitter, Github } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 py-10 md:py-16 border-t border-white/5">
      <div className="flex flex-col justify-start items-start gap-6 p-4 md:p-8">
        <div className="flex gap-3 items-stretch justify-center">
          <div className="text-center text-foreground text-xl font-semibold">
            Artic
          </div>
        </div>
        <p className="text-muted-foreground text-sm font-medium max-w-[200px]">
          Autonomous trading strategies on Mantle
        </p>
        <div className="flex justify-start items-start gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Twitter className="w-full h-full" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-full h-full" />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 p-4 md:p-8 w-full md:w-auto">
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Product
          </h3>
          <div className="flex flex-col justify-end items-start gap-2">
            <a
              href="#features-section"
              className="text-foreground text-sm font-normal hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="/app/strategies"
              className="text-foreground text-sm font-normal hover:text-primary transition-colors"
            >
              Marketplace
            </a>
            <a
              href="#faq-section"
              className="text-foreground text-sm font-normal hover:text-primary transition-colors"
            >
              FAQ
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Resources
          </h3>
          <div className="flex flex-col justify-center items-start gap-2">
            <a
              href="#"
              className="text-foreground text-sm font-normal hover:text-primary transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-foreground text-sm font-normal hover:text-primary transition-colors"
            >
              API
            </a>
            <a
              href="#"
              className="text-foreground text-sm font-normal hover:text-primary transition-colors"
            >
              Support
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Legal
          </h3>
          <div className="flex flex-col justify-center items-start gap-2">
            <a
              href="#"
              className="text-foreground text-sm font-normal hover:text-primary transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-foreground text-sm font-normal hover:text-primary transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
