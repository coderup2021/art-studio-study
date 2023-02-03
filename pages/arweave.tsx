import React from "react";
import { NFTList } from "../components/NFTList/NFTList";

export default function nftlist() {
  return (
    <div className="layout">
      <NFTList storageType={"arweave"} />
    </div>
  );
}
