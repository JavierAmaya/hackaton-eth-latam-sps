"use client";

import React, { useEffect, useState } from "react";
import { tbaAbi } from "./abi";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

interface NavigationItem {
  href: string;
  name: string;
}

const HeroSection: React.FC = () => {
  const ERC6551InitABI = [
    {
      inputs: [],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const [account, setAccount] = useState<string | null>(null);
  const [txAddress, setTxAddress] = useState<any>(null);
  // Polygon Mumbai
  // NEXT_PUBLIC_CONTRACT_ERC6551=0x02101dfB77FDE026414827Fdc604ddAF224F0921 > ERC6551Registry
  // Contrato collection nfts =  0xe285913cb8905D3568B6Ab799e9ec3271363f881 > Mumbai Testnet
  // NEXT_PUBLIC_ACCOUNT_PROXY_ERC6551=     > Tokenbound Account Proxy

  // Scroll
  // 0x4672e396F59c792803a68aaE76D84C87EA2a5537 > ERC6551Registry
  // 0xe285913cb8905D3568B6Ab799e9ec3271363f881 > Scroll collection NFTS
  // 0xa8716699243BEac71b6E9F3DAbf2034491aEE26e > Tokenbound Account Proxy

  const ERC6551Interface = new ethers.utils.Interface(ERC6551InitABI);
  const initData = ERC6551Interface.encodeFunctionData("initialize", []);
  const erc6551Address = "0x02101dfB77FDE026414827Fdc604ddAF224F0921"; //NEXT_PUBLIC_CONTRACT_ERC6551
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null);
  const { data, isError } = useContractRead({
    address: erc6551Address as `0x${string}`,
    abi: tbaAbi,
    functionName: "account",
    args: [
      "0x2d25602551487c3f3354dd80d76d54383a243358", // ProxyContract
      80001,
      "0xe285913cb8905D3568B6Ab799e9ec3271363f881", // token contract
      0, // token id
      0, // salt
    ],
  });

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: erc6551Address as `0x${string}`,
    abi: tbaAbi,
    functionName: "createAccount",
    args: [
      "0x2d25602551487c3f3354dd80d76d54383a243358" as `0x${string}`,
      80001,
      "0xe285913cb8905D3568B6Ab799e9ec3271363f881", // token contract
      0, // token id
      0,
      initData,
    ],
  });

  const { data: writeData, isLoading, isError: writingIsError, isSuccess, write } = useContractWrite(config);

  const { data: waitForTransactionData, isLoading: waitForTransactionLoading } = useWaitForTransaction({
    hash: writeData?.hash,
  });

  const handlerConvertToTBA = async () => {
    console.log("Convert to TBA");
    window.location.href = "metamask://app";
    try {
      write?.();
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("writeData >>>", writeData);
    if (writeData) {
      setTxAddress(writeData?.hash);
    }
    console.log("isLoading >>>", isLoading);
    console.log("isError >>>", isError);
    console.log("issuccess >>>", isSuccess);
    console.log("isprepareError >>>", isPrepareError);
    console.log("writingIsError >>>", writingIsError);
    console.log("waitForTransactionLoading >>>", waitForTransactionLoading);
    console.log("waitForTransactionData >>>", waitForTransactionData);
    console.log("checkTba >>>", checkTba("0x2d25602551487c3f3354dd80d76d54383a243358"));
    setProvider(new ethers.providers.Web3Provider((window as any).ethereum));
    console.log("data >>>", data);
    console.log("prepareError >>>", prepareError);
  }, [writeData, isLoading, isError, isSuccess]);

  const checkTba = async (tba_: string) => {
    if (!provider) return null;
    const code = await provider.getCode(tba_);

    return code !== "0x";
  };

  const getTbaAddress = async () => {
    const sdk = new ThirdwebSDK(80001, {
      clientId: "d66cc598e42bb5bad45462d91e39c97f",
    });

    const erc6551Registry = await sdk.getContract("0x02101dfB77FDE026414827Fdc604ddAF224F0921"); //NEXT_PUBLIC_CONTRACT_ERC6551

    console.log("erc6551Registry >>>", erc6551Registry);

    const TBA = await erc6551Registry.call("account", [
      "0x2d25602551487c3f3354dd80d76d54383a243358", // ProxyContract
      80001,
      "0xe285913cb8905D3568B6Ab799e9ec3271363f881", // token contract
      0,
      0,
    ]);

    console.log("TBA >>>", TBA);
    setAccount(TBA);
    return TBA;
  };

  const navigation: NavigationItem[] = [
    {
      href: "/",
      name: "Perfil",
    },
    {
      href: "/",
      name: "Collecionables",
    },
    {
      href: "/",
      name: "Estadisticas",
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 pt-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div>
          <h3 className="text-gray-800 text-2xl font-bold">Niño 1</h3>
        </div>
        <div className="items-center gap-x-3 mt-6 md:mt-0 sm:flex">
          <button
            onClick={handlerConvertToTBA}
            className="block px-4 py-2 mt-3 text-center text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 sm:mt-0 md:text-sm"
          >
            Convertir a TBA
          </button>
          <button
            onClick={getTbaAddress}
            className="block px-4 py-2 mt-3 text-center text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 sm:mt-0 md:text-sm"
          >
            Get TBA Address
          </button>
        </div>
      </div>
      <div className="mt-6 md:mt-4">
        <ul className="w-full border-b flex items-center gap-x-3 overflow-x-auto">
          {navigation.map((item, idx) => (
            // Replace [idx == 0] with [window.location.pathname == item.path] or create your own logic
            <li
              key={idx}
              className={`py-2 border-b-2 ${
                idx === 0 ? "border-indigo-600 text-indigo-600" : "border-white text-gray-500"
              }`}
            >
              <a
                href={item.href}
                className="py-2.5 px-4 rounded-lg duration-150 text-sm hover:text-indigo-600 hover:bg-gray-50 active:bg-gray-100 font-medium"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        <br />
        <h3>Token Bound Account : {account}</h3>
        <br />
        <h3>Convert To TBA Tx: {txAddress}</h3>
      </div>
    </div>
  );
};

export default HeroSection;
