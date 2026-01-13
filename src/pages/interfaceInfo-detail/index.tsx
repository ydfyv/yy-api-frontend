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
import {PageContainer} from "@ant-design/pro-components";


const descriptions:Record<string, string> = {
  description: "接口描述",
  method: "请求方式",
  name: "接口名称",
  requestParams: "请求头",
  responseParams: "响应头",
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
    <PageContainer style={{ minHeight: "850px" }}>
      <Row justify="space-around">
        <Col span={11}>
          <Card>
            <Descriptions title="接口详情" items={items} column={1} />
          </Card>
        </Col>
        <Col span={11}>
          <Tabs>
            <Tabs.TabPane tab="调试" key="1">
              <DebugView path={interfaceInfo.path}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="代码示例" key="2">
              <CodeEditorView/>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default InterfaceInfoDetail;
