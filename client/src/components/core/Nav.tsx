"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import ConnectButton from "./ConnectButton";

const nav = [
  { title: "Home", link: "/" },
  { title: "Marketplace", link: "/marketplace" },
  { title: "Agent", link: "/agent" },
];

function Nav() {
  return (
    <div className="w-full p-4 flex px-8 justify-between border-b items-center border-white/10">
      <div className="flex items-center space-x-4">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={30}
          height={30}
          className="aspect-square"
        />
        <p className="text-2xl font-semibold">ARTIC</p>
      </div>
      {/* Nav Items */}
      <NavigationMenuDemo />
      {/* Connect Button */}

      <div>
        <ConnectButton />
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
