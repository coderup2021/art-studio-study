import React from "react";
import { Card } from "antd";
import { NFTItem } from "../../web3Service/nftService";
import { getIpfsURL } from "../../web3Service/config";

const { Meta } = Card;

interface NFTCardProps {
  nft: NFTItem;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const { meta, tokenId, tokenURI } = nft;
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<img alt="example" src={meta.imgURI} />}
    >
      <Meta title={meta.name} description={meta.description} />
    </Card>
  );
};

export default NFTCard;
