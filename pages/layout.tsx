import React, { PropsWithChildren, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import HeaderRight from "./headerRight";
import Link from "next/link";

const items: MenuProps["items"] = [
  {
    label: <Link href={"/"}>Home</Link>,
    key: "home",
  },
  {
    label: <Link href={"/create-item"}>Sell Digital Asset</Link>,
    key: "create-item",
  },
  {
    label: <Link href={"/nftlist"}>NFT IPFS</Link>,
    key: "my-nft",
  },
  {
    label: <Link href="/arweave">NFT Arweave</Link>,
    key: "arweave",
  },
];

const Layout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [current, setCurrent] = useState("mail");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  return (
    <div className="layout">
      <div className="header">
        <div className="left">
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
          />
        </div>
        <HeaderRight />
      </div>
      {children}
    </div>
  );
};

export default Layout;
