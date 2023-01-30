import { Button, message } from "antd";
import React from "react";
import { connectWallet } from "../web3Service/connectService";

const ConnectWallet = () => {
  const connect = async () => {
    if (!window.ethereum) {
      message.error("请先安装MetaMask钱包!");
      return;
    }
    try {
      const { address, success } = await connectWallet();
      if (success) message.success(`连接成功, 我的地址: ${address}`);
    } catch (error) {
      message.error(`连接失败, ${error}`);
    }
  };
  return <Button onClick={connect}>连接钱包</Button>;
};
export default ConnectWallet;
