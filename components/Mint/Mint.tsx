import {
  Button,
  Form,
  Input,
  message,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import React, { FC, useCallback, useState } from "react";
import { create as createClient } from "ipfs-http-client";
import { connect } from "../../web3Service/connectService";
import { mintNFT } from "../../web3Service/nftService";
import { getArweaveURL, getIpfsURL } from "../../web3Service/config";
import { uploadToArweave } from "../../web3Service/arweaveService";
import { wrapStorageType } from "../../utils/index";

interface MintProps {
  closeModal: () => void;
  storageType: "ipfs" | "arweave";
}
const Mint: FC<MintProps> = ({ closeModal, storageType }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
    async onChange({ file, fileList }) {
      setFileList(fileList);
      form.setFieldValue("img", file.name);
    },
    beforeUpload() {
      return false;
    },
    showUploadList: false,
  };
  const uploadToIPFS = async (content: any) => {
    const client = createClient({ url: "http://localhost:5001" });
    if (!content) throw new Error("can not upload empty item to ipfs");
    const { path } = await client.add(content);
    if (!path) {
      throw new Error("can not upload image to ipfs");
    }
    return path;
  };
  const storeOnLine = useCallback(
    async (
      content: any,
      tags?: { [props: string]: string } | null | undefined
    ) => {
      if (storageType === "ipfs") {
        return (await uploadToIPFS(content)) as string;
      } else if (storageType === "arweave") {
        return await uploadToArweave(content, tags);
      } else {
        throw new Error("unknown storage type: " + storageType);
      }
    },
    [storageType]
  );

  const resetForm = useCallback(() => {
    form.resetFields();
    setFileList([]);
  }, [form]);

  const onFinish = useCallback(
    async (values: any) => {
      try {
        await connect();
        const fileBuf = await fileToBuffer(fileList[0].originFileObj as File);
        const imgCID =
          (await storeOnLine(fileBuf, {
            "content-type": fileList[0].type || "",
          })) || "";
        const { name, description } = values;
        const data = {
          name,
          description,
          storageType,
          imgURI:
            storageType === "ipfs" ? getIpfsURL(imgCID) : getArweaveURL(imgCID),
        };
        setLoading(true);
        let tokenURI =
          (await storeOnLine(JSON.stringify(data), {
            "content-type": "html/text",
          })) || "";

        if (tokenURI) {
          tokenURI = wrapStorageType(tokenURI, storageType);
        }
        const tokenId = await mintNFT(tokenURI);
        message.success("铸币成功：" + tokenId);
        closeModal();
        resetForm();
      } catch (error: any) {
        console.log("error", error);
        message.error(error.toString());
      } finally {
        setLoading(false);
      }
    },
    [fileList, closeModal]
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
                <span style={{ cursor: "pointer" }}>点击上传图片</span>
              </Upload>
            }
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" loading={loading}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Mint;
