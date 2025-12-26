import { updateSecretKeyUsingPost } from "@/services/ant-design-pro/userController";
import { useModel } from "@@/exports";
import { CopyOutlined, RedoOutlined, UploadOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { useRequest } from "@umijs/max";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Input,
  message,
  Space,
  Tooltip,
  Upload,
} from "antd";
import React from "react";
import { queryCity, queryCurrent, queryProvince } from "../service";
import useStyles from "./index.style";

const validatorPhone = (
  _rule: any,
  value: string[],
  callback: (message?: string) => void
) => {
  if (!value[0]) {
    callback("Please input your area code!");
  }
  if (!value[1]) {
    callback("Please input your phone number!");
  }
  callback();
};

const BaseView: React.FC = () => {
  const { styles } = useStyles();

  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrent();
  });

  const { initialState, refresh } = useModel("@@initialState");

  const getAvatarURL = () => {
    return initialState?.currentUser?.userAvatar ?? "";
  };
  const handleFinish = async () => {
    message.success("更新基本信息成功");
  };

  const items: DescriptionsProps["items"] = [
    {
      key: "accessKey",
      label: "accessKey",
      children: initialState?.currentUser?.accessKey,
    },
    {
      key: "secretKey",
      label: "secretKey",
      children: initialState?.currentUser?.secretKey,
    },
  ];

  const updateSecret = async () => {
    try {
      await updateSecretKeyUsingPost({ id: initialState?.currentUser?.id });
      refresh();
    } catch (error: any) {
      message.warning("更新失败！" + error.message);
    }
  };

  const handleCopy = async () => {
    console.log("copy....");
    const template = `accessKey: ${initialState?.currentUser?.accessKey}\nsecretKey: ${initialState?.currentUser?.secretKey}`;
    try {
      await navigator.clipboard.writeText(template);
      message.success("复制成功！");
    } catch (error: any) {
      message.error(`复制失败！${error.message}`);
    }
  };

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: "更新基本信息",
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,
                phone: currentUser?.phone.split("-"),
              }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: "请输入您的邮箱!",
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="name"
                label="昵称"
                rules={[
                  {
                    required: true,
                    message: "请输入您的昵称!",
                  },
                ]}
              />
              <ProFormTextArea
                name="profile"
                label="个人简介"
                rules={[
                  {
                    required: true,
                    message: "请输入个人简介!",
                  },
                ]}
                placeholder="个人简介"
              />
              <ProFormSelect
                width="sm"
                name="country"
                label="国家/地区"
                rules={[
                  {
                    required: true,
                    message: "请输入您的国家或地区!",
                  },
                ]}
                options={[
                  {
                    label: "中国",
                    value: "China",
                  },
                ]}
              />

              <ProForm.Group title="所在省市" size={8}>
                <ProFormSelect
                  rules={[
                    {
                      required: true,
                      message: "请输入您的所在省!",
                    },
                  ]}
                  width="sm"
                  fieldProps={{
                    labelInValue: true,
                  }}
                  name="province"
                  request={async () => {
                    return queryProvince().then(({ data }) => {
                      return data.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                        };
                      });
                    });
                  }}
                />
                <ProFormDependency name={["province"]}>
                  {({ province }) => {
                    return (
                      <ProFormSelect
                        params={{
                          key: province?.value,
                        }}
                        name="city"
                        width="sm"
                        rules={[
                          {
                            required: true,
                            message: "请输入您的所在城市!",
                          },
                        ]}
                        disabled={!province}
                        request={async () => {
                          if (!province?.key) {
                            return [];
                          }
                          return queryCity(province.key || "").then(
                            ({ data }) => {
                              return data.map((item) => {
                                return {
                                  label: item.name,
                                  value: item.id,
                                };
                              });
                            }
                          );
                        }}
                      />
                    );
                  }}
                </ProFormDependency>
              </ProForm.Group>
              <ProFormText
                width="md"
                name="address"
                label="街道地址"
                rules={[
                  {
                    required: true,
                    message: "请输入您的街道地址!",
                  },
                ]}
              />
              <ProFormFieldSet
                name="phone"
                label="联系电话"
                rules={[
                  {
                    required: true,
                    message: "请输入您的联系电话!",
                  },
                  {
                    validator: validatorPhone,
                  },
                ]}
              >
                <Input className={styles.area_code} />
                <Input className={styles.phone_number} />
              </ProFormFieldSet>
            </ProForm>
          </div>
          <div className={styles.right}>
            <Space direction={"vertical"} size={"large"}>
              <AvatarView avatar={getAvatarURL()} />
              <SecretKey
                items={items}
                update={updateSecret}
                handleCopy={handleCopy}
              />
            </Space>
          </div>
        </>
      )}
    </div>
  );
};
export default BaseView;

const AvatarView = ({ avatar }: { avatar: string }) => {
  const { styles } = useStyles();

  return (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload showUploadList={false}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  );
};

const SecretKey = ({
  items,
  update,
  handleCopy,
}: {
  items: DescriptionsProps["items"];
  update: () => Promise<void>;
  handleCopy: () => Promise<void>;
}) => {
  return (
    <>
      <Space direction={"vertical"} size={"small"}>
        <Descriptions
          title="访问秘钥"
          items={items}
          column={1}
          labelStyle={{ width: "80px", justifyContent: 'flex-end' }}
          extra={
            <Tooltip title="复制密钥">
              <CopyOutlined
                style={{ fontSize: "16px", color: "#1890ff" }}
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleCopy();
                }}
              />
            </Tooltip>
          }
        />
        <Button
          type="primary"
          size={"small"}
          onClick={async () => {
            await update();
          }}
        >
          <RedoOutlined />
          生成秘钥
        </Button>
      </Space>
    </>
  );
};
