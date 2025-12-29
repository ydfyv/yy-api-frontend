import { history } from '@umijs/max';
import {Button, Card, Image, Result, Space} from 'antd';
import React from 'react';
const NoFoundPage: React.FC = () => (
  <Card variant="borderless">
    <Result
      icon={ <Image src="/assets/404.png" width={500} preview={false} />}
      subTitle={'抱歉，您访问的页面不存在'}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {'返回首页'}
        </Button>
      }
    />
  </Card>
);
export default NoFoundPage;
