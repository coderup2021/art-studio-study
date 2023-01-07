import { ethers, Signer } from "ethers";
import { NetworkConfiguration } from "./config";
import { message } from "antd";
import { Network } from "@ethersproject/providers";

interface ConnectRes {
  success: boolean;
  network?: Network;
  signer?: Signer;
  address?: string;
}
const _connect = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  try {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const network = await provider.getNetwork();
    const address = await signer.getAddress();
    return { signer, network, address };
  } catch (error) {
    throw error;
  }
};

const trying = async () => {
  const { signer, network, address } = await _connect();
  const isSupported = NetworkConfiguration.chainId === network.chainId;
  if (isSupported) {
    return { success: true, signer, address, network };
  } else {
    return { success: false };
  }
};

type Connect = () => Promise<ConnectRes>;

export const connect: Connect = async () => {
  const { success, ...rest } = await trying();
  if (success) {
    return { success, ...rest };
  }
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: NetworkConfiguration.params,
  });

  const { success: success2, ...rest2 } = await trying();
  if (success2) {
    return { ...rest2, success: success2 };
  } else {
    return { success: false };
  }
};
