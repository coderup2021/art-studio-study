import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useCallback, useState } from "react";
import { ethers, Signer } from "ethers";
import MyNFT from "../artifacts/contracts/MyNFT.sol/MyNFT.json";
import contract from "../address.json";
import { message, Button, notification } from "antd";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [signer, setSigner] = useState<Signer | null>(null);
  const connectWallet = useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    if (signer) {
      message.success("连接钱包成功");
      setSigner(signer);
    }
  }, []);

  const callContract = useCallback(async () => {
    if (!signer) {
      message.error("请先连接钱包");
      return;
    }
    const myNFT = new ethers.Contract(contract.address, MyNFT.abi, signer);
    const transaction = await myNFT.mint(
      await signer.getAddress(),
      "http://baidu1.com",
      { value: 10 ** 9 }
    );
    const txReceipt = await transaction.wait();
    const [setEvent] = txReceipt.events;
    const { args } = setEvent;
    notification.success({
      message: "铸造NFT成功啦",
      description: (
        <div>
          <p>
            铸造者地址：
            <br />
            {args[0]}
          </p>
          <p>url：{args[1]}</p>
        </div>
      ),
    });
  }, [signer]);

  const getBalance = useCallback(async () => {
    if (!signer) {
      message.error("请先连接钱包");
      return;
    }
    const myNFT = new ethers.Contract(contract.address, MyNFT.abi, signer);
    const transaction = await myNFT.getBalance();
    notification.info({
      message: "当前账户余额",
      description: transaction.toNumber() + " Wei",
    });
  }, [signer]);

  const withdraw = useCallback(async () => {
    if (!signer) {
      message.error("请先连接钱包");
      return;
    }
    const myNFT = new ethers.Contract(contract.address, MyNFT.abi, signer);
    const transaction = await myNFT.withdraw();
    const ts = await transaction.wait();
    const [{ args }] = ts.events;
    notification.success({
      message: "提款成功啦",
      description: `本地提款金额：${args.fee.toNumber()} wei`,
    });
  }, [signer]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Button type={"primary"} onClick={connectWallet}>
          连接钱包
        </Button>
        <Button type={"primary"} onClick={callContract}>
          铸造NFT
        </Button>
        <Button type={"primary"} onClick={getBalance}>
          查询合约账户
        </Button>
        <Button type={"primary"} onClick={withdraw}>
          从合约账户提款到我的账户
        </Button>
      </main>
    </>
  );
}
