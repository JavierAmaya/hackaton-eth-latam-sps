import { NextRequest, NextResponse } from "next/server";
import { Alchemy, Network, Nft, NftFilters } from "alchemy-sdk";

function isValidNFT(nft: Nft): boolean {
  // Comprobaciones iniciales
  if (!nft.name || !nft.contract.address || nft.image === null) {
    return false;
  }
  // Palabras clave a buscar
  const keywordsToCheck = [
    "exchange",
    "voucher",
    "airdrop",
    "notification",
    "giveaway",
    "reward",
    "claim",
    "prize",
    "lottery",
    "USDC",
    "USDT",
    "BUSD",
    "DAI",
    "TUSD",
    "USDP",
  ];

  // Comprobar si alguna palabra clave está presente
  const lowercaseTitle = nft.name.toLowerCase();
  const lowercaseDescription = (nft.description || "").toLowerCase();

  if (keywordsToCheck.some(keyword => lowercaseTitle.includes(keyword) || lowercaseDescription.includes(keyword))) {
    return false;
  }

  return true;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { address, pageSize, excludeFilter, pageKey } = data;

    const responsePageKey = null;

    if (req.method !== "POST") {
      return NextResponse.json({
        error: "Error ...",
      });
    }

    // apiKey: process.env.ALCHEMY_API_KEY,
    const settings = {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      network: Network.MATIC_MUMBAI,
    };

    const alchemy = new Alchemy(settings);

    console.log("Alchemy Obj >>>>", Alchemy);

    const nfts = await alchemy.nft.getNftsForOwner(address, {
      pageSize: pageSize ? pageSize : 100,
      excludeFilters: excludeFilter ? [NftFilters.SPAM] : [],
      pageKey: pageKey ? pageKey : "",
    });

    return NextResponse.json({
      nfts: nfts.ownedNfts.filter(isValidNFT),
      pageKey: responsePageKey,
    });
  } catch (error) {
    return NextResponse.json({
      error: error,
    });
  }
}
