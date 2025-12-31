import { Footer } from "@/components";
import { userRegisterUsingPost } from "@/services/ant-design-pro/userController";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { Helmet, useNavigate } from "@umijs/max";
import { Button, Form, message, Tabs } from "antd";
import { createStyles } from "antd-style";
import React, { FC } from "react";
import { useState } from "react";
import Settings from "../../../../config/defaultSettings";
import UserRegisterRequest = API.UserRegisterRequest;

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: "8px",
      color: "rgba(0, 0, 0, 0.2)",
      fontSize: "24px",
      verticalAlign: "middle",
      cursor: "pointer",
      transition: "color 0.3s",
      "&:hover": {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: "42px",
      position: "fixed",
      right: 16,
      borderRadius: token.borderRadius,
      ":hover": {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "auto",
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: "100% 100%",
    },
  };
});

const Register: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const [type, setType] = useState<string>("register");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue("userPassword")) {
      return promise.reject("两次输入的密码不匹配!");
    }
    return promise.resolve();
  };

  const registerSubmit = async (params: UserRegisterRequest) => {
    setLoading(true);

    try {
      const res = await userRegisterUsingPost(params);
      if (res.code === 0) {
        message.success("注册成功");
        navigate("/user/login");
      }
    } catch (error: any) {
      message.warning(error.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {"用户注册"}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <div
        style={{
          flex: "1",
          padding: "32px 0",
        }}
      >
        <LoginForm
          form={form}
          contentStyle={{
            minWidth: 280,
            maxWidth: "75vw",
          }}
          logo={<img alt="logo" src="/logo.svg"/>}
          title="YY API管理平台"
          subTitle={"YY API平台提供通用的api接口调用"}
          onFinish={async (values) => {
            await registerSubmit(values);
          }}
          submitter={{
            render: () => (
              <Button type="primary" htmlType="submit" loading={loading} block>
                注册
              </Button>
            ),
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: "register",
                label: "用户注册",
              },
            ]}
          />

          {type === "register" && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined/>,
                }}
                placeholder={"请输入呢称"}
                rules={[
                  {
                    required: true,
                    message: "呢称是必填项！",
                  },
                ]}
              />
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined/>,
                }}
                placeholder={"请输入用户名"}
                rules={[
                  {
                    required: true,
                    message: "用户名是必填项！",
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined/>,
                }}
                placeholder={"请输入密码"}
                rules={[
                  {
                    required: true,
                    message: "密码是必填项！",
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined/>,
                }}
                placeholder={"请确认密码"}
                rules={[
                  {
                    required: true,
                    message: "确认密码是必填项！",
                  },
                  {
                    validator: checkConfirm,
                  },
                ]}
              />
            </>
          )}

          <div
            style={{
              textAlign: "right"
            }}
            className="margin8"
          >
            <a onClick={() => {
              navigate("/user/login")
            }}>已有账号，登录</a>
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Register;
