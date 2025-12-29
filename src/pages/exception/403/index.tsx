import { history } from "@@/core/history";
import { Button, Card, Image, Result } from "antd";

export default () => (
  <Card variant="borderless">
    <Result
      icon={<Image src="/assets/403.png" width={500} preview={false} />}
      subTitle={"抱歉，你无权访问此页面"}
      extra={
        <Button type="primary" onClick={() => history.push("/")}>
          {"返回首页"}
        </Button>
      }
    />
  </Card>
);
