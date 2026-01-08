import { getTopInterfaceInvokeVoListUsingGet } from "@/services/ant-design-pro/interfaceInfoController";
import { Chart } from "@antv/g2";
import {Card, message} from "antd";
import { useEffect, useRef, useState } from "react";
import InterfaceInvokeVO = API.InterfaceInvokeVO;

interface Props {
  top?: number;
}

const PieChartContainer: React.FC<Props> = ( {top}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const [data, setData] = useState<InterfaceInvokeVO[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!chartRef.current) {
      const chart = new Chart({
        container,
        autoFit: true,
        theme: "light",
      });

      chart.options({
        type: "interval",
        data: data,
        encode: {
          y: "proportion",
          color: "interfaceName",
        },
        transform: [{ type: "stackY" }],
        coordinate: { type: "theta" },
        legend: {
          color: {
            position: "right",
            rowPadding: 5,
          },
        },
        labels: [
          {
            text: (d: InterfaceInvokeVO) =>
              `${d.interfaceName}: ${d.proportion}% 共调用${d.invokeCount}次`,
            position: "outside",
            connector: true,
          },
        ],
      });

      chart.render();
      chartRef.current = chart;
    } else {
      chartRef.current.changeData(data);
    }
  }, [data]);

  useEffect(() => {
    getTopInterfaceInvokeVoListUsingGet({ top: top || 3 }).then((res) => {
      if (res.code === 0) {
        setData(res.data ?? []);
      } else {
        message.warning(`获取TOP${top}接口调用数据失败！${res.message}`);
      }
    });
  }, [top]);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <Card>
      <div className="padding16" ref={containerRef} style={{ height: "500px" }}></div>
    </Card>
  );
};

export default PieChartContainer;
