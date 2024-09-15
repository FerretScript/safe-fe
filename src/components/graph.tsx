import { cn, normalizeRadius, processChartData } from "~/lib/utils";
import { AxisOptions, Chart } from "react-charts";
import { useMemo } from "react";
import { ChartData } from "~/lib/chartUtils";

export type ChartJSON = {
  dates: string[];
  series: {
    label: string;
    type: "line" | "area" | "bar" | "bubble" | undefined;
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

  const options = {
    data: processedData,
    primaryAxis,
    secondaryAxes,
  };

  return (
    <div className={cn("h-full w-full", className)}>
      <Chart
        options={{
          ...options,
          dark: true,
          interactionMode: "closest",
          //@ts-expect-error - this entire API is bullshit
          getDatumStyle: (datum) => ({
            circle: {
              r: normalizeRadius(datum.originalDatum.radius ?? 0),
            },
          }),
        }}
      />
    </div>
  );
}
