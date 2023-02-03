import { Button, message } from "antd";
import React from "react";

const TestArweave = () => {
  const test = async () => {
    await ArConnect();

    message.success("success");
  };
  async function ArConnect() {
    if (!window.arweaveWallet) {
      throw new Error("请先安装arconnect浏览器插件");
      return;
    }
    return await window.arweaveWallet.connect([
      "ACCESS_ADDRESS",
      "SIGN_TRANSACTION",
      "ACCESS_PUBLIC_KEY",
    ]);
  }
  return <Button onClick={test}>TestArweave</Button>;
};

export default TestArweave;
