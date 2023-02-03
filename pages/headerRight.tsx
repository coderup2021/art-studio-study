import React from "react";
import ConnectWallet from "../components/ConnectWallet";
import IPfsTest from "../components/IPfsTest";
import TestArweave from "../components/TestArweave";
import { Space } from "antd";

const HeaderRight = () => {
  return (
    <div className="right">
      <Space>
        <IPfsTest />
        <ConnectWallet />
        <TestArweave />
      </Space>
    </div>
  );
};
export default HeaderRight;
