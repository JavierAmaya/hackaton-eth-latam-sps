"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { parseEther } from "viem";
import { useWaitForTransaction } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { collectibles } from "~~/lib/collectibles-metadata";
import { studentsData } from "~~/lib/students";

export default function Student() {
  const { id } = useParams();
  const [selectedCollectibleId, setSelectedCollectibleId] = useState(-1);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const {
    data: writeData,
    writeAsync: mint,
    isLoading: isLoadingMint,
  } = useScaffoldContractWrite({
    contractName: "Util",
    functionName: "safeMint",
    args: ["0xF54f4815f62ccC360963329789d62d3497A121Ae", "placeholder"],
  });

  const { data: txData, isLoading: isLoadingWaitForTx } = useWaitForTransaction({
    hash: txHash,
  });

  async function buyCollectible(collectibleId: number) {
    setSelectedCollectibleId(collectibleId);
    const hash = await mint({
      args: ["0xF54f4815f62ccC360963329789d62d3497A121Ae", collectibles[collectibleId - 1].metadata_url],
      value: parseEther(collectibles[collectibleId - 1].price.toString()),
    });
    console.log(hash);
    setTxHash(hash);
  }

  useEffect(() => {
    if (writeData) {
      console.log(writeData);
    }
    if (txData) {
      console.log(txData);
    }
  }, [writeData, txData]);
  return (
    <div className="hero bg-base-200 flex-grow pt-8">
      <div className="w-2/3 h-full card bg-base-100 shadow-xl card-compact lg:card-normal flex flex-col items-center p-8 space-y-4">
        <div className="w-full flex">
          <div className="relative w-1/4 aspect-square">
            <Image
              src={studentsData[parseInt(id as string)].image_url}
              className="w-full aspect-square"
              alt="Tailwind CSS Carousel component"
              fill
            />
          </div>
          <div className="grid grid-cols-3 w-3/4 space-x-12">
            <div className="flex flex-col">
              <p className="text-lg">
                {collectibles[0].metadata.name}: {studentsData[parseInt(id as string)].collectibleBalances[0]}
              </p>
              <p className="text-lg">
                {collectibles[1].metadata.name}: {studentsData[parseInt(id as string)].collectibleBalances[1]}
              </p>
              <p className="text-lg">
                {collectibles[2].metadata.name}: {studentsData[parseInt(id as string)].collectibleBalances[2]}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-lg">
                {collectibles[3].metadata.name}: {studentsData[parseInt(id as string)].collectibleBalances[3]}
              </p>
              <p className="text-lg">
                {collectibles[4].metadata.name}: {studentsData[parseInt(id as string)].collectibleBalances[4]}
              </p>
              <p className="text-lg">
                {collectibles[5].metadata.name}: {studentsData[parseInt(id as string)].collectibleBalances[5]}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-lg">
                {collectibles[6].metadata.name}: {studentsData[parseInt(id as string)].collectibleBalances[6]}
              </p>
              <p className="text-lg">
                {collectibles[7].metadata.name}: {studentsData[parseInt(id as string)].collectibleBalances[7]}
              </p>
              <p className="text-lg">
                {collectibles[8].metadata.name}: {studentsData[parseInt(id as string)].collectibleBalances[8]}
              </p>
            </div>
          </div>
        </div>
        <h1 className="text-4xl">{studentsData[parseInt(id as string)].name}</h1>

        <div className="grid grid-cols-3 w-full md:w-4/5 lg:w-1/2 gap-4 md:gap-8 lg:gap-x-16">
          {collectibles.map(collectible => (
            <div className="flex flex-col items-center space-y-4" key={`${collectible.name}_${collectible.id}`}>
              <div className="w-full rounded-full bg-slate-200 aspect-square flex justify-center items-center">
                <div className="relative w-2/3 aspect-square flex flex-col justify-center items-center">
                  <Image src={collectible.metadata.image} alt="User profile" fill />
                </div>
              </div>
              <button
                disabled={isLoadingMint || isLoadingWaitForTx}
                className="btn btn-accent rounded-box"
                onClick={() => buyCollectible(collectible.id)}
              >
                {(isLoadingMint || isLoadingWaitForTx) && selectedCollectibleId === collectible.id
                  ? "Comprando..."
                  : "Comprar"}
                {(isLoadingMint || isLoadingWaitForTx) && selectedCollectibleId === collectible.id && (
                  <span className="loading loading-spinner loading-sm"></span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
