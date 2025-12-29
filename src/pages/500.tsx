import { history } from '@umijs/max';
import {Button, Card, Image, Result} from "antd";
import React from "react";

const ErrorPage: React.FC = () => (
  <Card variant="borderless">
    <Result
      icon={ <Image src="/assets/500.png" width={500} preview={false} />}
      subTitle={'抱歉，服务器出错了'}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {'返回首页'}
        </Button>
      }
    />
  </Card>
);
export default ErrorPage;
