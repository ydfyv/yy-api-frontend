import CodeEditorView from "@/pages/interfaceInfo-detail/components/CodeEditorView";
import DebugView from "@/pages/interfaceInfo-detail/components/DebugView";
import { getInterfaceInfoVoByIdUsingGet } from "@/services/ant-design-pro/interfaceInfoController";
import { useParams } from "@@/exports";
import {
  Card,
  Col,
  Descriptions,
  DescriptionsProps,
  message,
  Row,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import InterfaceInfoVO = API.InterfaceInfoVO;

const descriptions:Record<string, string> = {
  description: "接口描述",
  method: "请求方式",
  name: "接口名称",
  requestHeader: "请求头",
  responseHeader: "响应头",
  status: "状态",
  url: "请求地址",
};

const InterfaceInfoDetail: React.FC = () => {
  const params = useParams();

  const [interfaceInfo, setInterfaceInfo] = useState<InterfaceInfoVO>({});

  const [items, setItems] = useState<DescriptionsProps["items"]>([]);

  useEffect(() => {
    try {
      getInterfaceInfoVoByIdUsingGet({ id: Number(params.id) }).then((res) => {
        if (res.code === 0) {
          const data = res.data || ({} as InterfaceInfoVO);
          setInterfaceInfo(data);

          const keys = Object.keys(data) as Array<keyof InterfaceInfoVO>;
          const tempParams: any[] = keys
            .filter(key => descriptions[key])
            .map((key) => ({
                key,
                label: descriptions[key] ?? "",
                children: data[key] ?? "",
              }));

          setItems(tempParams);
        }
      });
    } catch (error: any) {
      message.warning(error.message);
    }
  }, []);

  return (
    <Card style={{ minHeight: "850px" }}>
      <Row justify="space-around">
        <Col span={11}>
          <Card>
            <Descriptions title="接口详情" items={items} column={1} />
          </Card>
        </Col>
        <Col span={11}>
          <Tabs>
            <Tabs.TabPane tab="调试" key="1">
              <DebugView />
            </Tabs.TabPane>
            <Tabs.TabPane tab="代码示例" key="2">
              <CodeEditorView
                code={`class Main {

    public static void main(String[] args) {
        String jsonStr = "{\\"name\\":\\"阿狸\\"}";

        Gson gson = new Gson();
        com.yy.yyapiclientsdk.model.User user = gson.fromJson(jsonStr, com.yy.yyapiclientsdk.model.User.class);
        // 创建API调用客户端（输入AK、SK）
        YyApiClient yyApiClient = new YyApiClient( "7fbd0ed36482f8f4abf19061e3b995ac", "111bd3c9d96caf079ba183f095ef091d");
        String result = yyApiClient.getNameByPost(user);

        System.out.println("调用结果=======>" + result);
    }
}`}
              />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  );
};

export default InterfaceInfoDetail;
