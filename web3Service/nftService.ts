import { connectWallet } from "./connectService";
import { Contract } from "ethers";
import { getArweaveURL, getIpfsURL, NetworkConfiguration } from "./config";
import MyNFT from "../artifacts/contracts/MyNFT.sol/MyNFT.json";
import axios, { AxiosResponse } from "axios";
import { StorageType } from "../components/NFTList/NFTList";

export const mintNFT = async (tokenURI: string) => {
  const { signer, provider } = await connectWallet();
  const nft = new Contract(
    NetworkConfiguration.marketAddress,
    MyNFT.abi,
    provider
  );
  const address = await signer?.getAddress();
  const transaction = await nft
    .connect(signer!)
    .mint(address, tokenURI, { value: 1000000000 });
  const tx = await transaction.wait();
  let event = tx.events[0];
  let value = event.args[2];
  const tokenId = value.toNumber();
  return tokenId;
};

export interface NFTMeta {
  name: string;
  description: string;
  imgURI: string;
  storageType: StorageType;
}

export interface NFTItem {
  meta?: NFTMeta;
  tokenId: number;
  tokenURI: string;
}

export const getNFTList = async (storageType: "ipfs" | "arweave") => {
  const { signer, provider } = await connectWallet();
  const nft = new Contract(
    NetworkConfiguration.marketAddress,
    MyNFT.abi,
    provider
  );
  const address = await signer?.getAddress();

  const count = await nft.balanceOf(address);
  const amount = count.toNumber();

  const ret = await Promise.all(
    Array.from({ length: amount }, async (_, i) => {
      const tokenId: number = await nft.tokenOfOwnerByIndex(address, i);
      const tokenURI: string = await nft.tokenURI(tokenId);
      return { tokenId, tokenURI } as NFTItem;
    })
  );
  return ret;
};

export const getNFTItemMeta = async (
  tokenURI: string,
  storageType: StorageType
) => {
  const itemUrl =
    storageType === "ipfs"
      ? getIpfsURL(tokenURI)
      : storageType === "arweave"
      ? getArweaveURL(tokenURI)
      : "";
  const res = await axios.get(itemUrl);
  let meta = null;
  if (res.status === 200) {
    meta = res.data;
  }
  return meta;
};
