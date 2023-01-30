import { connectWallet } from "./connectService";
import { Contract } from "ethers";
import { NetworkConfiguration } from "./config";
import MyNFT from "../artifacts/contracts/MyNFT.sol/MyNFT.json";

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
