import { debugInterfaceUsingPost } from "@/services/ant-design-pro/interfaceInfoController";
import { Button, Card, message } from "antd";
import React, { useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const DebugView: React.FC = () => {
  const [result, setResult] = useState<string>("");

  const debug = async () => {
    try {
      const res = await debugInterfaceUsingPost(
        JSON.stringify({ name: "李明" })
      );
      setResult(res.data ?? "");
    } catch (error: any) {
      message.warning(error.message);
    }
  };

  return (
    <Card>
      展示调用文档
      <hr />
      <SwaggerUI
        url="/api/v2/api-docs?group=api"
        requestInterceptor={(req: { url: string }) => {
          // 把 http://localhost:8101/api/... 改成 /api/...
          if (req.url?.startsWith("http://localhost:8101/api/api")) {
            console.log('进去了。。。。', req.url)
            req.url = req.url.replace("http://localhost:8101/api/api", "http://localhost:8101/api");
            console.log('进去了。。。。', req.url)
          }
          return req;
        }}
      />
      <Button
        onClick={async () => {
          await debug();
        }}
      >
        调试
      </Button>
      <span>结果：{result}</span>
    </Card>
  );
};

export default DebugView;
