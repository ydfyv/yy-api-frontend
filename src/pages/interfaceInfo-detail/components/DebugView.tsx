import Loading from "@/loading";
import { getOpenApiDocUsingGet } from "@/services/ant-design-pro/interfaceInfoController";
import { getLoginUserUsingGet } from "@/services/ant-design-pro/userController";
import { Card, message } from "antd";
import React, { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface props {
  path?: string;
}

const DebugView: React.FC<props> = ({ path }) => {
  const [apiObj, setApiObj] = useState<object>({});
  const [akObj, setAkObj] = useState<object>({});

  const getOpenApi = async () => {
    try {
      if (path) {
        const res = await getOpenApiDocUsingGet({ path: path });
        setApiObj(res.data ?? {});
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getAk = async () => {
    try {
      const res = await getLoginUserUsingGet();
      setAkObj({
        accessKey: res.data?.accessKey,
      });
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getReq = (req: any) => {
    let body = "";
    const methodsWithBody = ["POST", "PUT", "PATCH"];
    if (methodsWithBody.includes(req.method?.toUpperCase())) {
      if (typeof req.body === "string") {
        // 移除所有换行、制表符、多余空格（保留 JSON 有效性）
        body = req.body.replace(/\s+/g, ' ').trim();
        try {
          const parsed = JSON.parse(req.body);
          body = JSON.stringify(parsed);
        } catch (e) {
          // 如果不是 JSON，就只清理换行
          body = req.body.replace(/[\r\n\t]/g, ' ');
        }
      } else if (req.body != null && typeof req.body === "object") {
        body = JSON.stringify(req.body); // 自动是单行
      }
    }

    req.headers = {
      ...req.headers,
      ...akObj,
      "X-Request-Body": body,
    };

    return req;
  };

  useEffect(() => {
    getOpenApi();
    getAk();
  }, [path]);

  return (
    <div style={{maxHeight: "700px", overflow: "auto"}}>
      <Card>
        {Object.entries(apiObj).length > 0 ? (
          <SwaggerUI
            spec={apiObj}
            withCredentials={true}
            requestInterceptor={getReq}
          />
        ) : (
          <Loading />
        )}
      </Card>
    </div>
  );
};

export default DebugView;
