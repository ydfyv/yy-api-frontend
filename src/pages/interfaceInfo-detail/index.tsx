import {
  debugInterfaceUsingPost,
  getInterfaceInfoVoByIdUsingGet,
} from "@/services/ant-design-pro/interfaceInfoController";
import { useParams } from "@@/exports";
import { Editor } from "@monaco-editor/react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsProps,
  Divider,
  message,
  Row,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import InterfaceInfoVO = API.InterfaceInfoVO;

const InterfaceInfoDetail: React.FC = () => {
  const params = useParams();

  const [interfaceInfo, setInterfaceInfo] = useState<InterfaceInfoVO>({});

  const [items, setItems] = useState<DescriptionsProps["items"]>([]);

  const [result, setResult] = useState<string>("");

  const [language, setLanguage] = useState<string>("java");

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

  useEffect(() => {
    try {
      getInterfaceInfoVoByIdUsingGet({ id: Number(params.id) }).then((res) => {
        if (res.code === 0) {
          const data = res.data || ({} as InterfaceInfoVO);
          setInterfaceInfo(data);

          const keys = Object.keys(data) as Array<keyof InterfaceInfoVO>;
          const tempParams: any[] = keys.map((key) => ({
            key,
            label: key,
            children: data[key] ?? "",
          }));

          setItems(tempParams);
        }
      });
    } catch (error: any) {
      message.warning(error.message);
    }
  }, []);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    monaco.editor.defineTheme("myCustomTheme", {
      base: "vs",
      inherit: true,
      rules: [{ background: "EDF9FA" }],
      colors: {
        "editor.background": "#f0f0f0",
      },
    });
  };

  return (
    <Card>
      <Row justify="space-around">
        <Col span={11}>
          <Card>
            <Descriptions title="接口详情" items={items} column={1} />;
          </Card>
          <Divider />
          <Card>
            <Button
              onClick={async () => {
                await debug();
              }}
            >
              调试
            </Button>
            <span>结果：{result}</span>
          </Card>
        </Col>
        <Col span={11}>
          <Select
            value={language}
            onChange={(value) => setLanguage(value)}
            style={{ marginBottom: "10px" }}
          >
            <Select.Option value="java">Java</Select.Option>
            <Select.Option value="javascript">JavaScript</Select.Option>
            <Select.Option value="python">Python</Select.Option>
            <Select.Option value="csharp">C#</Select.Option>
            <Select.Option value="php">PHP</Select.Option>
          </Select>
          <div style={{ height: "700px", width: "100%" }}>
            <Editor
              language={language}
              defaultValue="ggfgfd"
              options={{
                minimap: {
                  enabled: true,
                  side: "right",
                  size: "proportional",
                  showSlider: "mouseover",
                  renderCharacters: true,
                  maxColumn: 120,
                },
              }}
              onMount={handleEditorDidMount}
              theme="vs-dark"
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default InterfaceInfoDetail;
