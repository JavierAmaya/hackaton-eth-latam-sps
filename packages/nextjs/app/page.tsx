"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon } from "@heroicons/react/24/outline";
import NFTGallery from "~~/components/collectiblesGallery";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>
        <div className="tab_content">
          <div className="tab_panel">
            {connectedAddress ? (
              <NFTGallery walletAddress={connectedAddress} />
            ) : (
              <div>
                <BugAntIcon className="w-12 h-12 text-base-500" />
                <p className="text-base-500">Connect your wallet to view NFTs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
