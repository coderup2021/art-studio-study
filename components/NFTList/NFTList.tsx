import React, { FC, useCallback, useEffect, useState } from "react";
import { getNFTList, NFTItem } from "../../web3Service/nftService";
import NFTCard from "./NFTCard";
import { Button, Modal, Row, Space } from "antd";
import Mint from "../Mint/Mint";

export type StorageType = "ipfs" | "arweave";

interface NFTListProps {
  storageType: StorageType;
}
export const NFTList: FC<NFTListProps> = ({ storageType }) => {
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState<NFTItem[]>([]);

  const getList = useCallback(async () => {
    return await getNFTList(storageType);
  }, [storageType]);

  const updateList = useCallback(async () => {
    const list = await getList();
    console.log("list", list);
    if (list)
      setList(
        list.filter((item) => item.tokenURI.startsWith(storageType + ":"))
      );
  }, [storageType]);

  useEffect(() => {
    if (visible === false) updateList();
  }, [visible]);

  const onAddClick = useCallback(() => {
    setVisible(true);
  }, []);

  return (
    <Space direction="vertical" wrap={true}>
      <Row>
        <Button type={"primary"} onClick={onAddClick}>
          Add +
        </Button>
      </Row>
      <Space wrap={true}>
        {list.map((nft) => (
          <NFTCard nft={nft} storageType={storageType} />
        ))}
      </Space>
      <Modal
        open={visible}
        footer={false}
        title={"铸造NFT"}
        onCancel={() => setVisible(false)}
      >
        <Mint
          closeModal={() => {
            setVisible(false);
          }}
          storageType={storageType}
        />
      </Modal>
    </Space>
  );
};
