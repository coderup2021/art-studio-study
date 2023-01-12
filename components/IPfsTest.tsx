import { Button, message } from "antd";
import React from "react";
import { create as createClient } from "ipfs-http-client";
import axios from "axios";

const IPfsTest = () => {
  const uploadIPFS = async () => {
    const client = createClient({ url: "http://localhost:5001" });
    const { path } = await client.add(JSON.stringify({ test: "hello ipfs" }));
    message.success(
      `upload ipfs success, path is: ${path}, 正在从本地ipfs网络上获取`
    );
    console.log("path", path);
    const res = await axios.get(`http://localhost:8080/ipfs/${path}`);
    console.log("res", res.data);
    message.success(`成功获取内容: ${JSON.stringify(res.data)}`);
  };
  return <Button onClick={uploadIPFS}>ipfs test</Button>;
};
export default IPfsTest;
