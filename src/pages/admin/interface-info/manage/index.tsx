import CreateModal from "@/pages/admin/interface-info/manage/components/CreateModal";
import UpdateModal from "@/pages/admin/interface-info/manage/components/UpdateModal";
import {
  addInterfaceInfoUsingPost,
  deleteInterfaceInfoUsingPost,
  editInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingPost, offlineUsingPost,
  onlineUsingPost,
} from "@/services/ant-design-pro/interfaceInfoController";
import { PlusOutlined } from "@ant-design/icons";
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from "@ant-design/pro-components";
import {
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
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [model, setModel] = useState<InterfaceInfo>({});
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<InterfaceInfo[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ProColumns<InterfaceInfo>[] = [
    {
      title: "序号",
      dataIndex: "id",
      valueType: "text",
      width: 80,
      hideInSearch: true,
      hideInForm: true,
      render: (_, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "接口名称",
      dataIndex: "name",
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: "接口描述",
      dataIndex: "description",
      valueType: "textarea",
      ellipsis: true,
      formItemProps: {
        rules: [{ required: true }],
      },
      // sorter: true,
      // hideInForm: true,
      // renderText: (val: string) => `${val}万`,
    },
    {
      title: "接口路径",
      dataIndex: "url",
      hideInSearch: true,
      formItemProps: {
        rules: [
          { required: true },
          {
            validator: (_rule: any, value: string, callback) => {
              if (value && !/^https?:\/\//.test(value)) {
                callback("请输入正确的接口路径");
              }
              callback();
            },
          },
        ],
      },
    },
    {
      title: "请求头",
      dataIndex: "requestHeader",
      valueType: "textarea",
      hideInSearch: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            validator: (_rule, _value, callback) => {
              if (_value) {
                try {
                  JSON.parse(_value as string);
                  callback();
                } catch (e) {
                  callback("请输入正确的JSON格式");
                }
              } else {
                callback();
              }
            },
          },
        ],
      },
    },
    {
      title: "响应头",
      dataIndex: "responseHeader",
      valueType: "textarea",
      hideInSearch: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            validator: (_rule, _value, callback) => {
              if (_value) {
                try {
                  JSON.parse(_value as string);
                  callback();
                } catch (e) {
                  callback("请输入正确的JSON格式");
                }
              } else {
                callback();
              }
            },
          },
        ],
      },
    },
    {
      title: "请求方式",
      width: 100,
      dataIndex: "method",
      formItemProps: {
        rules: [{ required: true }],
      },
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
      width: 100,
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
        <Space size={"small"}>
          <Button
            type={"link"}
            onClick={() => {
              setUpdateModalVisible(true);
              setModel(entity);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title={"确定删除吗？"}
            onConfirm={async () => {
              await handleRemove(entity);
            }}
          >
            <Button type={"link"} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: "接口上下线",
      key: "line",
      valueType: "option",
      render: (_, entity) =>
        entity.status === "1" ? (
          <Popconfirm
            title={"确定下线吗？"}
            onConfirm={async () => {
              await handleOffline(entity);
            }}
          >
            <Button danger size={"small"} type={"dashed"}>
              下线
            </Button>
          </Popconfirm>
        ) : (
          <Button
            color="primary"
            variant="outlined"
            type={"dashed"}
            size={"small"}
            onClick={async () => {
              await handleOnline(entity);
            }}
          >
            上线
          </Button>
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
   * 添加接口
   */
  const handleAdd = async (fields: InterfaceInfoAddRequest) => {
    try {
      const res = await addInterfaceInfoUsingPost(fields);
      message.success("添加成功");
      setCreateModalVisible(false);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error("添加失败！" + error);
    }
  };

  /**
   * 编辑接口
   */
  const handleEdit = async (fields: InterfaceInfo) => {
    try {
      const res = await editInterfaceInfoUsingPost(fields);
      message.success("编辑成功！");
      setUpdateModalVisible(false);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error("编辑失败！" + error.message);
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
      message.success("删除成功");
      actionRef?.current?.reload();
    } catch (_error: any) {
      message.error("删除失败！" + _error.message);
    }
  };

  /**
   * 接口上线
   */
  const handleOnline = async (fields: InterfaceInfo) => {
    try {
      const res = await onlineUsingPost({
        id: fields.id,
      });
      message.success("上线成功");
      actionRef?.current?.reload();
    } catch (_error: any) {
      message.error("上线失败！" + _error.message);
    }
  };

  /**
   * 接口下线
   */
  const handleOffline = async (fields: InterfaceInfo) => {
    try {
      const res = await offlineUsingPost({
        id: fields.id,
      });
      message.success("下线成功");
      actionRef?.current?.reload();
    } catch (_error: any) {
      message.error("下线失败！" + _error.message);
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
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        request={async (params: InterfaceInfoQueryRequest, sort, filter) => {
          const res = await listInterfaceInfoByPageUsingPost(params);
          return {
            data: res?.data?.records,
            success: res?.code === 0,
            total: res?.data?.total,
          };
        }}
        columns={columns}
        rowSelection={{
          type: "radio",
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
      />
      {/*{selectedRowsState?.length > 0 && (*/}
      {/*  <FooterToolbar*/}
      {/*    extra={*/}
      {/*      <div>*/}
      {/*        已选择{" "}*/}
      {/*        <a*/}
      {/*          style={{*/}
      {/*            fontWeight: 600,*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          {selectedRowsState.length}*/}
      {/*        </a>{" "}*/}
      {/*        项 &nbsp;&nbsp;*/}
      {/*      </div>*/}
      {/*    }*/}
      {/*  >*/}
      {/*    <Button*/}
      {/*      onClick={async () => {*/}
      {/*        // await handleRemove(selectedRowsState);*/}
      {/*        setSelectedRows([]);*/}
      {/*        actionRef.current?.reloadAndRest?.();*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      批量删除*/}
      {/*    </Button>*/}
      {/*  </FooterToolbar>*/}
      {/*)}*/}

      <CreateModal
        columns={columns}
        onCancel={() => setCreateModalVisible(false)}
        onSubmit={handleAdd}
        visible={createModalVisible}
      />

      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        model={model}
        onCancel={() => setUpdateModalVisible(false)}
        onSubmit={handleEdit}
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
