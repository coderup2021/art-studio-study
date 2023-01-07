// import "../styles/globals.css";
import "../styles/layout.scss";
import type { AppProps } from "next/app";
import React, { useState } from "react";
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "antd/dist/reset.css";
import Layout from "./layout";
dayjs.locale("zh-cn");

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />;
    </Layout>
  );
}
