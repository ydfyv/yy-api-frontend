import FormModal from "@/pages/interface-info/manage/components/FormModal";
import {
  addInterfaceInfoUsingPost,
  deleteInterfaceInfoUsingPost,
  editInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingPost,
} from "@/services/ant-design-pro/interfaceInfoController";
import { PlusOutlined } from "@ant-design/icons";
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormInstance,
} from "@ant-design/pro-components";
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Drawer, message, Popconfirm, Space } from "antd";
import React, { useRef, useState } from "react";
import InterfaceInfoQueryRequest = API.InterfaceInfoQueryRequest;
import InterfaceInfo = API.InterfaceInfo;
import InterfaceInfoAddRequest = API.InterfaceInfoAddRequest;

const TableList: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<InterfaceInfo[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalTitle, setModalTitle] = useState<string>("");
  const formRef = useRef<ProFormInstance>();
  const [model, setModel] = useState<InterfaceInfo>({});
  const [method, setMethod] = useState("");

  const columns: ProColumns<InterfaceInfo>[] = [
    {
      title: "序号",
      dataIndex: "id",
      valueType: "text",
      render: (_, record, index) => <span>{index + 1}</span>,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "接口名称",
      dataIndex: "name",
    },
    {
      title: "接口描述",
      dataIndex: "description",
      valueType: "textarea",
      ellipsis: true,
      // sorter: true,
      // hideInForm: true,
      // renderText: (val: string) => `${val}万`,
    },
    {
      title: "接口路径",
      dataIndex: "url",
      hideInSearch: true,
    },
    {
      title: "请求头",
      dataIndex: "requestHeader",
      valueType: "textarea",
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: "响应头",
      dataIndex: "responseHeader",
      valueType: "textarea",
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: "请求方式",
      dataIndex: "method",
      // hideInForm: true,
      valueEnum: {
        GET: {
          text: "GET",
          // status: "Default",
        },
        POST: {
          text: "POST",
          // status: "Processing",
        },
        PUT: {
          text: "PUT",
          // status: "Processing",
        },
        DELETE: {
          text: "DELETE",
          // status: "Processing",
        },
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: {
        0: {
          text: "已关闭",
          status: "Default",
        },
        1: {
          text: "启动中",
          status: "Processing",
        },
      },
    },
    {
      title: "操作",
      key: "action",
      valueType: "option",
      render: (_, entity) => (
        <Space size={"middle"}>
          <Button
            type={"link"}
            onClick={() => {
              openModal("编辑接口", entity);
              setMethod('edit');
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title={"确定删除吗？"}
            onConfirm={async () => {
              const success = await handleRemove(entity);
              if (success) {
                actionRef?.current?.reload();
              }
            }}
          >
            <Button type={"link"} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
    // {
    //   title: "上次调度时间",
    //   sorter: true,
    //   dataIndex: "updatedAt",
    //   valueType: "dateTime",
    //   renderFormItem: (item, { defaultRender, ...rest }, form) => {
    //     const status = form.getFieldValue("status");
    //
    //     if (`${status}` === "0") {
    //       return false;
    //     }
    //
    //     if (`${status}` === "3") {
    //       return <Input {...rest} placeholder="请输入异常原因！" />;
    //     }
    //
    //     return defaultRender(item);
    //   },
    // },
    // {
    //   title: "操作",
    //   dataIndex: "option",
    //   valueType: "option",
    //   render: (_, record) => [
    //     <a
    //       key="config"
    //       onClick={() => {
    //         handleUpdateModalVisible(true);
    //         setCurrentRow(record);
    //       }}
    //     >
    //       配置
    //     </a>,
    //     <a key="subscribeAlert" href="https://procomponents.ant.design/">
    //       订阅警报
    //     </a>,
    //   ],
    // },
  ];

  /**
   * 打开模态框
   * @param title
   * @param fields
   */
  const openModal = (title: string, fields: InterfaceInfo) => {
    setModalTitle(title);
    setVisible(true);
    setModel(fields);
  };

  /**
   * 添加接口
   */
  const handleAdd = () => async (
    fields: InterfaceInfoAddRequest
  ) => {
    try {
      const res = await addInterfaceInfoUsingPost(fields);
      if (res.code !== 0) {
        message.warning(res.message || "添加失败");
      }
      message.success("添加成功");
      actionRef.current?.reload();
    } catch (error) {
      message.error("网络错误，请稍后重试");
    }
  };

  /**
   * 编辑接口
   */
  const handleEdit = () => (fields: InterfaceInfo) => async () => {
      try {
        const res = await editInterfaceInfoUsingPost(fields);
        if (res.code !== 0) {
          message.warning(res.message || "编辑失败");
        }
        message.success("编辑成功");
        actionRef.current?.reload();
      } catch (error) {
        message.error("网络错误，请稍后重试");
      }
    };

  /**
   * 删除节点
   * @param fields
   */
  const handleRemove = async (fields: InterfaceInfo) => {
    try {
      const res = await deleteInterfaceInfoUsingPost({
        id: fields.id,
      });
      if (res.code !== 0) throw new Error(res?.message);
      message.success("删除成功");
      actionRef?.current?.reload();
      return true;
    } catch (_error) {
      message.error("删除失败！" + _error);
      return false;
    }
  };

  return (
    <PageContainer>
      <ProTable<InterfaceInfo, InterfaceInfoQueryRequest>
        headerTitle="接口管理列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          span: 6,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              openModal("新建接口", {});
              setMethod('add');
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params: InterfaceInfoQueryRequest, sort, filter) => {
          const res = await listInterfaceInfoByPageUsingPost({
            ...params,
          });
          return {
            data: res?.data?.records,
            success: res?.code === 0,
            total: res?.data?.total,
          };
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          type: "radio",
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{" "}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{" "}
              项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      <FormModal
        title={modalTitle}
        modalVisible={visible}
        columns={columns}
        model={model}
        onCancel={() => {
          setVisible(false);
        }}
        onSubmit={method === 'add' ? handleAdd : handleEdit}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<InterfaceInfo>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<InterfaceInfo>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
