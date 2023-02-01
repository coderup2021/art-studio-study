import { connectWallet } from "./connectService";
import { Contract } from "ethers";
import { getIpfsURL, NetworkConfiguration } from "./config";
import MyNFT from "../artifacts/contracts/MyNFT.sol/MyNFT.json";
import axios, { AxiosResponse } from "axios";

export const mintNFT = async (tokenURI: string) => {
  const { signer, provider } = await connectWallet();
  const nft = new Contract(
    NetworkConfiguration.marketAddress,
    MyNFT.abi,
    provider
  );
  const address = await signer?.getAddress();
  console.log("address", address);
  const transaction = await nft
    .connect(signer!)
    .mint(address, tokenURI, { value: 1000000000 });
  const tx = await transaction.wait();
  console.log("tx", tx);
  let event = tx.events[0];
  let value = event.args[2];
  console.log("value", value);
  const tokenId = value.toNumber();
  console.log("tokenId", tokenId);
  return tokenId;
};

export interface NFTMeta {
  name: string;
  description: string;
  imgURI: string;
}

export interface NFTItem {
  meta: NFTMeta;
  tokenId: number;
  tokenURI: string;
}

export const getNFTList = async () => {
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
      const res = await axios.get(getIpfsURL(tokenURI));
      const meta = res.data;
      return { meta, tokenId, tokenURI } as NFTItem;
    })
  );
  return ret;
};
