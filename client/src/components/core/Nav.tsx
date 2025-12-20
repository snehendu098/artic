"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb-client";
import { defineChain } from "thirdweb";

const nav = [
  { title: "Home", link: "/" },
  { title: "Marketplace", link: "/marketplace" },
  { title: "Agent", link: "/agent" },
];

function Nav() {
  return (
    <div className="w-full p-4 flex px-8 justify-between items-center">
      <div className="flex items-center space-x-4">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={40}
          height={40}
          className="aspect-square"
        />
        <p className="text-2xl font-semibold">ARTIC</p>
      </div>
      {/* Nav Items */}
      <NavigationMenuDemo />
      {/* Connect Button */}
      <div>
        <ConnectButton
          client={client}
          chains={[defineChain(5003), defineChain(5000)]}
          connectButton={{
            className:
              "!bg-primary !rounded-2xl !hover:bg-primary/40 !text-white",
          }}
        />
      </div>
    </div>
  );
}

function NavigationMenuDemo() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {nav.map((item, idx) => (
          <NavigationMenuItem key={idx}>
            <NavigationMenuLink asChild className="px-3 text-md">
              <Link href={item.link}>{item.title}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Nav;
