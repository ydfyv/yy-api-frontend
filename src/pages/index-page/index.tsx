import React, { useEffect, useState } from "react";
import ProList from "@ant-design/pro-list";
import { message } from "antd";
import { listInterfaceInfoVoByPageUsingPost } from "@/services/ant-design-pro/interfaceInfoController";
import InterfaceInfoVO = API.InterfaceInfoVO;
import {useNavigate} from "@umijs/max";

const indexPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<InterfaceInfoVO[]>();
  const navigate = useNavigate();

  useEffect(() => {
    // 获取接口列表
    try {
      listInterfaceInfoVoByPageUsingPost({
        current: 1,
        pageSize: 10,
      }).then((res) => {
        setDataSource(res.data?.records);
      });
    } catch (error: any) {
      message.warning(error.message);
    }
  }, []);

  return (
    <ProList<InterfaceInfoVO>
      rowKey="id"
      headerTitle="接口列表"
      dataSource={dataSource}
      showActions="hover"
      editable={{
        onSave: async (key, record, originRow) => {
          console.log(key, record, originRow);
          return true;
        },
      }}
      onDataSourceChange={setDataSource}
      metas={{
        title: {
          dataIndex: "name",
        },
        // avatar: {
        //   dataIndex: 'image',
        //   editable: false,
        // },
        description: {
          dataIndex: "description",
        },
        // subTitle: {
        //   render: () => {
        //     return (
        //       <Space size={0}>
        //         <Tag color="blue">Ant Design</Tag>
        //         <Tag color="#5BD8A6">TechUI</Tag>
        //       </Space>
        //     );
        //   },
        // },
        actions: {
          render: (text, row, index, action) => [
            <a onClick={() => {navigate(`/interfaceInfo-detail/${row.id}`)}} key="link">
              详情
            </a>,
          ],
        },
      }}
    />
  );
};

export default indexPage;
