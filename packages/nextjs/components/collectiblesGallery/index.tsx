"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nft } from "alchemy-sdk";

// import { useChainId } from "wagmi";

interface NFTGalleryProps {
  walletAddress: string;
}

export default function NFTGallery({ walletAddress }: NFTGalleryProps) {
  const [nfts, setNfts] = useState<Nft[] | null>(null);
  const [pageKey, setPageKey] = useState<string | undefined>();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const fetchNFTs = async (pagekey?: string) => {
    console.log("fetch **************");
    if (!pageKey) setIsloading(true);

    try {
      const addressToFetch = walletAddress;
      const chainIdToFetch = 137;

      console.log("addressToFetch >>>>>>", walletAddress);
      console.log("chain <<<>>>>", chainIdToFetch);

      if (!addressToFetch) {
        return;
      }

      console.log("!!!!!!!*********###########");

      const res = await fetch("/api/getNfts", {
        method: "POST",
        body: JSON.stringify({
          address: addressToFetch,
          pageKey: pagekey ?? null,
          chain: chainIdToFetch,
          excludeFilter: false,
        }),
      }).then(res => res.json());

      console.log("res >>>>>>", res);

      if (nfts?.length && pageKey && res.nfts?.length) {
        setNfts(prevState => [...(prevState || []), ...res.nfts]);
        setIsAdding(false);
      } else {
        setNfts(res.nfts);
      }
      if (res.pageKey) {
        setPageKey(res.pageKey);
      } else {
        setPageKey(undefined);
      }
    } catch (e) {
      console.log(e);
    }

    setIsloading(false);
  };

  useEffect(() => {
    console.log("address >>>", walletAddress);
    fetchNFTs();
  }, []);

  isLoading && console.log("Loading ...");

  return (
    <div className="nft_gallery_page">
      <div className="nft_gallery">
        <div className="nfts_display">
          {nfts?.length ? (
            nfts.map((nft, index) => {
              return <NftCard key={index} nft={nft} />;
            })
          ) : (
            <div className="loading_box">
              <p>No NFTs found for the selected address.</p>
            </div>
          )}
        </div>
      </div>

      {pageKey && nfts && nfts.length > 0 && (
        <div>
          <a
            className="button_black"
            onClick={() => {
              localStorage.removeItem("tbas");
              setIsAdding(true);
              fetchNFTs(pageKey);
            }}
          >
            {isAdding ? (
              <div className="loading_box">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="loading_box">
                <p>Load More</p>
              </div>
            )}
          </a>
        </div>
      )}
    </div>
  );
}

function NftCard({ nft }: { nft: Nft }) {
  const router = useRouter();

  return (
    <div
      className="card_container"
      onClick={() => {
        router.push(`/nft/${nft.contract.address}`);
      }}
    >
      <div className="image_container">
        <img src={nft.image.pngUrl} />
        <div className="legend_container">
          <span className={`legend NFT`}>NFT</span>
        </div>
      </div>
      <div className="info_container">
        <div className="title_container">
          <h3>{nft.name}</h3>
        </div>
        <hr className="separator" />
        <div className="symbol_contract_container">
          {/* <div className="symbol_container">
                        <p>
                            {nft.contract.symbol}
                        </p>
                    </div> */}
          <div className="description_container">
            <p>{nft.description}</p>
          </div>
          <div className="contract_container">
            <p className="contract_container"></p>
            <img src={"https://etherscan.io/images/brandassets/etherscan-logo-circle.svg"} width="15px" height="15px" />
          </div>
        </div>
      </div>
    </div>
  );
}
// Tu componente NftCard se mantiene igual
