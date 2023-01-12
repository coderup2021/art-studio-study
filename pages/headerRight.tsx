import React from "react";
import ConnectWallet from "../components/connectWallet";
import IPfsTest from "../components/IPfsTest";

const HeaderRight = () => {
  return (
    <div className="right">
      <IPfsTest />
      <ConnectWallet />
    </div>
  );
};
export default HeaderRight;
