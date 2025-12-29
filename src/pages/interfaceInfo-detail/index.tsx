import {
  debugInterfaceUsingPost,
  getInterfaceInfoVoByIdUsingGet,
} from "@/services/ant-design-pro/interfaceInfoController";
import { useParams } from "@@/exports";
import {
  Button,
  Card,
  Descriptions,
  DescriptionsProps,
  Divider,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import InterfaceInfoVO = API.InterfaceInfoVO;

const InterfaceInfoDetail: React.FC = () => {
  const params = useParams();

  const [interfaceInfo, setInterfaceInfo] = useState<InterfaceInfoVO>({});

  const [items, setItems] = useState<DescriptionsProps["items"]>([]);

  const [result, setResult] = useState<String>("");

  const debug = async () => {
    try {
      const res = await debugInterfaceUsingPost(JSON.stringify({name: "李明"}));
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

  return (
    <>
      <Card>
        <Descriptions title="接口详情" items={items} column={1} />;
      </Card>
      <Divider />
      <Card>
        <Button
          onClick={ async () => {
            await debug();
          }}
        >
          调试
        </Button>
        <span>结果：{result}</span>
      </Card>
    </>
  );
};

export default InterfaceInfoDetail;
