import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { getNFTItemMeta, NFTItem, NFTMeta } from "../../web3Service/nftService";
import { getIpfsURL } from "../../web3Service/config";
import { StorageType } from "./NFTList";
import { unwrapStorageType } from "../../utils";

const { Meta } = Card;

interface NFTCardProps {
  nft: NFTItem;
  storageType: StorageType;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, storageType }) => {
  const [meta, setMeta] = useState<NFTMeta | null>(null);
  const { tokenId, tokenURI } = nft;
  useEffect(() => {
    const run = async () => {
      const data = await getNFTItemMeta(
        unwrapStorageType(tokenURI),
        storageType
      );
      if (data) setMeta(data);
    };
    run();
  }, [tokenURI]);
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<img alt="example" src={meta?.imgURI} />}
    >
      <Meta title={meta?.name} description={meta?.description} />
    </Card>
  );
};

export default NFTCard;
