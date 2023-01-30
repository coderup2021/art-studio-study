import { Button, Form, Input, message, Upload, UploadProps } from "antd";
import React, { useCallback, useState } from "react";
import { create as createClient } from "ipfs-http-client";
import axios from "axios";
import { FormInstance, useForm } from "antd/es/form/Form";
import { Filelike, Web3Storage } from "web3.storage";
import { connectWallet } from "../../web3Service/connectService";
import { mintNFT } from "../../web3Service/nftService";
const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEE0NzA2YzlDMTYwMDI5MGZhNDQ3NjJkZjJCM0E3MTBjZWQxYTYxRDUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzM0NDI0OTc1NTEsIm5hbWUiOiJ0MSJ9.0KBqihEFS5akr5RdcD7qZt6Rfao9QJNr4YnlNEw3Q0w";

const Mint = () => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [form] = Form.useForm();
  const fileToBuffer = (file: File): Promise<Buffer | null> => {
    return new Promise((resolve) => {
      if (!file) resolve(null);
      const fr = new FileReader();
      fr.readAsArrayBuffer(file);
      fr.addEventListener("loadend", (e) => {
        resolve(e.target?.result as Buffer);
      });
    });
  };
  const uploadProps: UploadProps = {
    // async onChange({ file, fileList }) {
    //   if (!fileList.length) {
    //     return;
    //   }
    //   // Construct with token and endpoint
    //   const client = new Web3Storage({ token: API_TOKEN });

    //   // Pack files into a CAR and send to web3.storage
    //   const rootCid = await client.put([
    //     fileList[0].originFileObj,
    //   ] as Iterable<Filelike>); // Promise<CIDString>

    //   // Get info on the Filecoin deals that the CID is stored in
    //   const info = await client.status(rootCid); // Promise<Status | undefined>

    //   // Fetch and verify files from web3.storage
    //   const res = await client.get(rootCid); // Promise<Web3Response | null>
    //   console.log("res", res);
    //   const files = await res!.files(); // Promise<Web3File[]>
    //   const resFile = files[0];
    //   console.log(`${resFile.cid} ${resFile.name} ${resFile.size}`);
    //   const assetUrl = `https://w3s.link/ipfs/${resFile.cid}`;
    //   form.setFieldsValue({ img: assetUrl });
    // },
    async onChange({ file, fileList }) {
      setFileList([fileList[0].originFileObj as File]);
    },
    beforeUpload() {
      return false;
    },
    // showUploadList: false,
  };
  const connect = async () => {
    if (!window.ethereum) {
      message.error("请先安装MetaMask钱包!");
      return;
    }
    try {
      const { address, success } = await connectWallet();
      if (success) return address;
    } catch (error: any) {
      //   message.error(`, ${error}`);
      throw new Error("连接钱包失败:" + error.toString());
    }
  };
  const uploadToIPFS = async (content: any) => {
    const client = createClient({ url: "http://localhost:5001" });
    const fileBuf = await fileToBuffer(fileList[0]);
    if (!fileBuf) throw new Error("file buffer generated fail");
    const { path } = await client.add(fileBuf);
    if (!path) {
      throw new Error("can not upload image to ipfs");
    }
    return path;
  };
  const onFinish = useCallback(
    async (values: any) => {
      try {
        await connect();
        const fileBuf = await fileToBuffer(fileList[0]);
        const imgCID = await uploadToIPFS(fileBuf);
        const { name, description } = values;
        const data = {
          name,
          description,
          imgURI: `http://127.0.0.1:8080/ipfs/${imgCID}`,
        };
        const tokenURI = await uploadToIPFS(JSON.stringify(data));
        console.log("tokenURI", tokenURI);
        const tokenId = await mintNFT(tokenURI);
        message.success("铸币成功：" + tokenId);
      } catch (error: any) {
        console.log("error", error);
        message.error(error.toString());
      }
    },
    [fileList]
  );
  return (
    <div className="mint-page">
      <Form name="asset" className="form" form={form} onFinish={onFinish}>
        <Form.Item name="name">
          <Input placeholder="asset name" />
        </Form.Item>
        <Form.Item name="description">
          <Input.TextArea placeholder="asset description" />
        </Form.Item>
        <Form.Item name="price">
          <Input type="number" placeholder="asset price" />
        </Form.Item>
        <Form.Item name="img">
          <Input
            placeholder="asset url"
            readOnly
            addonBefore={
              <Upload {...uploadProps}>
                <span>点击上传图片</span>
              </Upload>
            }
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Mint;
