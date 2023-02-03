import { message } from "antd";
import Arweave from "arweave";
import { arweaveConfig, getArweaveURL } from "./config";

const arweave = Arweave.init(arweaveConfig);

export const uploadToArweave = async (
  content: string | Uint8Array | ArrayBuffer,
  tags?:
    | {
        [propName: string]: string;
      }
    | undefined
    | null
) => {
  if (!window.arweaveWallet) {
    throw new Error("请先安装arconnect浏览器插件");
    return;
  }
  await window.arweaveWallet.connect([
    "ACCESS_ADDRESS",
    "SIGN_TRANSACTION",
    "ACCESS_PUBLIC_KEY",
  ]);
  const tx = await arweave.createTransaction({
    data: content,
  });
  if (tags) {
    const tagKeys = Object.keys(tags);
    if (tagKeys.length > 0) {
      tagKeys.forEach((key) => {
        tx.addTag(key, tags[key]);
      });
    }
  }

  await arweave.transactions.sign(tx);
  const res = await arweave.transactions.post(tx);
  if (res.status === 200) {
    const myurl = getArweaveURL(tx.id);
    message.success("success" + myurl);
    return tx.id;
  } else {
    throw new Error(res.statusText);
  }
};
