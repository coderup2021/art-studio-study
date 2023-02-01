import React, { useEffect, useState } from "react";
import { getNFTList, NFTItem } from "../../web3Service/nftService";
import NFTCard from "./NFTCard";
import { Row, Space } from "antd";

export const NFTList = () => {
  const [list, setList] = useState<NFTItem[]>([]);
  useEffect(() => {
    const run = async () => {
      const list = await getNFTList();
      console.log("list", list);
      setList(list);
    };
    run();
  }, []);

  return (
    <Space>
      {list.map((nft) => (
        <NFTCard nft={nft} />
      ))}
    </Space>
  );
};
