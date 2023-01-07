import { Button, message } from "antd";
import React from "react";
import { connect } from "../web3Service/connectService";

const HeaderRight = () => {
  const connectWallet = async () => {
    if (!window.ethereum) {
      message.error("请先安装MetaMask钱包!");
      return;
    }
    try {
      const { address, success } = await connect();
      if (success) message.success(`连接成功, 我的地址: ${address}`);
    } catch (error) {
      message.error(`连接失败, ${error}`);
    }
  };
  return (
    <div className="right">
      <Button onClick={connectWallet}>连接钱包</Button>
    </div>
  );
};
export default HeaderRight;
