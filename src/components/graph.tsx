import { cn, processChartData } from "~/lib/utils";
import { AxisOptions, Chart } from "react-charts";
import { useMemo } from "react";
import generateChartConfig, { ChartData } from "~/lib/chartUtils";

export type ChartJSON = {
  dates: string[];
  series: {
    label: string;
    type: string;
    values: number[];
  }[];
};

type Props = {
  json: ChartJSON;
  className?: string;
};

export type DatumType = {
  primary: string | number | Date | null;
  secondary: number | null;
  radius: number | undefined;
};

export default function ChartComp({ json, className }: Props) {
  const processedData: ChartData = processChartData(json);
  const config = generateChartConfig({ series: processedData.length, dataType: "time" });

  const secondaryGetters = processedData.map((data) => ({
    id: data.secondaryAxisId,
    getValue: (datum: DatumType) => datum.secondary,
    elementType: data.elementType,
  }));

  const primaryAxis = useMemo<AxisOptions<ChartData[number]["data"][number]>>(
    () => ({
      getValue: (datum) => datum.primary,
    }),
    [],
  );

  const secondaryAxes = useMemo<
    AxisOptions<ChartData[number]["data"][number]>[]
  >(() => [...secondaryGetters], []);

  // const secondaryAxes = useMemo<
  //   AxisOptions<ChartData[number]["data"][number]>[]
  // >(
  //   () => [
  //     {
  //       getValue: (datum) => datum.secondary,
  //       elementType: "bar",
  //     },
  //     {
  //       id: 2,
  //       getValue: (datum) => datum.secondary,
  //       elementType: "line",
  //     },
  //   ],
  //   [],
  // );

  const options = {
    data: processedData,
    ...config,
    primaryAxis,
    secondaryAxes,
  };

  return (
    <div className={cn("h-full w-full", className)}>
      <Chart options={{ ...options, dark: true }} />
    </div>
  );
}
