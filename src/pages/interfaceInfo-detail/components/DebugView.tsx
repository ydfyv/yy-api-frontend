import React, {useState} from "react";
import {Button, Card, message} from "antd";
import {debugInterfaceUsingPost} from "@/services/ant-design-pro/interfaceInfoController";

const DebugView:React.FC = () => {

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
      <hr/>
      <Button
        onClick={async () => {
          await debug();
        }}
      >
        调试
      </Button>
      <span>结果：{result}</span>
    </Card>
  )
}

export default DebugView;
