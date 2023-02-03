import { StorageType } from "../components/NFTList/NFTList";

export const wrapStorageType = (tokenURI: string, storageType: StorageType) => {
  return `${storageType}:${tokenURI}`;
};

export const unwrapStorageType = (tokenURI: string) => {
  return tokenURI.replace(/^(ipfs:)|(^arweave:)/, "");
};
