import { getOpenApiDocUsingGet } from "@/services/ant-design-pro/interfaceInfoController";
import { Card, message } from "antd";
import React, { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import Loading from "@/loading";

interface props {
  path?: string;
}

const DebugView: React.FC<props> = ({ path }) => {
  const [apiObj, setApiObj] = useState<object>({});

  useEffect( () => {
    const getOpenApi = async () => {
      try {
        if (path) {
          const res = await getOpenApiDocUsingGet({path: path});
          setApiObj(res.data ?? {});
        }
      } catch (error: any) {
        message.error(error.message);
      }
    }

    getOpenApi();
  }, [path]);

  return (
    <Card>
      {Object.entries(apiObj).length > 0 ? <SwaggerUI spec={apiObj} withCredentials={true} /> : <Loading /> }
    </Card>
  );
};

export default DebugView;
