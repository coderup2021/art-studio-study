import { ethers, Signer } from "ethers";
import { NetworkConfiguration } from "./config";
import { message } from "antd";
import { Network, Provider } from "@ethersproject/providers";

interface ConnectRes {
  success: boolean;
  network?: Network;
  signer?: Signer;
  address?: string;
  provider?: Provider;
}
const _connect = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  try {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const network = await provider.getNetwork();
    const address = await signer.getAddress();
    return { signer, network, address, provider };
  } catch (error) {
    throw error;
  }
};

const trying = async () => {
  const { signer, network, address, provider } = await _connect();
  const isSupported = NetworkConfiguration.chainId === network.chainId;
  if (isSupported) {
    return {
      success: true,
      signer,
      address,
      network,
      chainId: network.chainId,
      provider,
    };
  } else {
    return { success: false };
  }
};

type Connect = () => Promise<ConnectRes>;

export const connectWallet: Connect = async () => {
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

export const connect = async () => {
  if (!window.ethereum) {
    message.error("请先安装MetaMask钱包!");
    return;
  }
  try {
    const { address, success } = await connectWallet();
    if (success) return address;
  } catch (error: any) {
    //   message.error(`, ${error}`);
    throw new Error("连接钱包失败:" + error.toString());
  }
};
