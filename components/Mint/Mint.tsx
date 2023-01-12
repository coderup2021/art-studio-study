import { Button, Form, Input, message, Upload, UploadProps } from "antd";
import React from "react";
import { create as createClient } from "ipfs-http-client";
import axios from "axios";
import { useForm } from "antd/es/form/Form";

const Mint = () => {
  const form = useForm();
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
      console.log(file, fileList);
      const client = createClient({ url: "http://localhost:5001" });
      const fileBuf = await fileToBuffer(fileList[0].originFileObj!);
      if (fileBuf) {
        const { path } = await client.add(fileBuf);
        console.log("path", path);
      }
    },
    beforeUpload() {
      return false;
    },
  };
  return (
    <div className="mint-page">
      <Form name="asset" className="form">
        <Form.Item name="name">
          <Input placeholder="asset name" />
        </Form.Item>
        <Form.Item name="description">
          <Input.TextArea placeholder="asset description" />
        </Form.Item>
        <Form.Item name="price">
          <Input type="number" placeholder="asset price" />
        </Form.Item>
        <Form.Item name="img" hidden>
          <Input />
        </Form.Item>
        <Upload {...uploadProps}>
          <Button type="primary">请上传图片</Button>
        </Upload>
      </Form>
    </div>
  );
};
export default Mint;
