import { cn, normalizeRadius, processChartData } from "~/lib/utils";
import { AxisOptions, Chart } from "react-charts";
import { useEffect, useMemo, useState } from "react";
import { ChartData } from "~/lib/chartUtils";
import { motion } from "framer-motion";

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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

  const variants = {
    middle: { gridColumn: "span 2 / span 2" },
    final: {
      gridColumn: "span 2 / span 2",
      opacity: 1,
      transition: { duration: 2 },
      y: 0,
    },
  };

  return (
    <motion.div
      initial={{ gridColumn: "span 1 / span 1", opacity: 0 }}
      variants={variants}
      animate={isLoaded ? "final" : "middle"}
      className={cn(
        "col-span-2 flex h-auto w-full rounded-lg border p-4",
        className,
      )}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <div className="flex h-full w-full items-center justify-center rounded-lg shadow-md">
        <Chart
          className="h-[90%] w-[90%]"
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
    </motion.div>
  );
}
