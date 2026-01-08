import PieChartContainer from "@/pages/analyse/component/PieChartContainer";
import { PageContainer } from "@ant-design/pro-components";

const AnalysePage: React.FC = () => {
  return (
    <PageContainer title={`TOP10接口调用分析`}>
      <PieChartContainer top={10} />
    </PageContainer>
  );
};

export default AnalysePage;
