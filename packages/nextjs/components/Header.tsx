"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SwitchTheme } from "./SwitchTheme";
import { hardhat } from "viem/chains";
import { useNetwork } from "wagmi";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  image?: string;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Block Explorer",
    href: "/blockexplorer",
    icon: <MagnifyingGlassIcon className="h-4 w-4" />,
    image: "/images/blockscout_logo.png",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const { chain } = useNetwork();
  const { data: deployedContract } = useDeployedContractInfo("RepoRewards");

  console.log("Chain ID:", chain?.id);
  console.log("Contract Address:", deployedContract?.address);

  const handleBlockExplorerClick = () => {
    if (deployedContract?.address) {
      let blockscoutUrl = "";

      switch (chain?.id) {
        case 11155111: // Optimism Sepolia
          blockscoutUrl = `https://optimism-sepolia.blockscout.com/address/${deployedContract.address}`;
          break;
        case 84531: // Base Sepolia
          blockscoutUrl = `https://base-sepolia.blockscout.com/address/${deployedContract.address}`;
          break;
        case 1001: // Mode Testnet
          blockscoutUrl = `https://sepolia.explorer.mode.network/address/${deployedContract.address}`;
          break;
        case 44787: // Celo Alfajores Testnet
          blockscoutUrl = `https://explorer.celo.org/alfajores/address/${deployedContract.address}`;
          break;
        default:
          console.warn(`Unhandled chain ID: ${chain?.id}. Falling back to Optimism Sepolia.`);
          blockscoutUrl = `https://optimism-sepolia.blockscout.com/address/${deployedContract.address}`;
      }

      console.log("BlockScout URL:", blockscoutUrl);
      window.open(blockscoutUrl, "_blank");
    }
  };

  return (
    <>
      {menuLinks.map(({ label, href, icon, image }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            {label === "Block Explorer" ? (
              <button
                onClick={handleBlockExplorerClick}
                className={`${
                  isActive ? "bg-secondary shadow-md" : ""
                } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
              >
                {icon}
                <span>{label}</span>
                {image && <img src={image} alt={`${label} icon`} className="h-4 w-4" />}
              </button>
            ) : (
              <Link
                href={href}
                passHref
                className={`${
                  isActive ? "bg-secondary shadow-md" : ""
                } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
              >
                {icon}
                {image && <img src={image} alt={`${label} icon`} className="h-4 w-4" />}
                <span>{label}</span>
              </Link>
            )}
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const { chain } = useNetwork();
  const isLocalNetwork = chain?.id === hardhat.id;
  useOutsideClick(burgerMenuRef, () => setIsDrawerOpen(false));

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => setIsDrawerOpen(prevIsOpenState => !prevIsOpenState)}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => setIsDrawerOpen(false)}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image
              alt="SE2 logo"
              className="cursor-pointer"
              src={"/images/repo_rewards_without_bg.png"}
              width={40}
              height={40}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Repo Rewards</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
