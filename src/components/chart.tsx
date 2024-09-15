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
    middle: {
      transition: { duration: 0.5 },
      gridRow: "span 2 / span 2",
    },
    final: {
      gridRow: "span 2 / span 2",
      opacity: 1,
    },
  };

  return (
    <motion.div
      initial={{ gridRow: "span 1 / span 1", opacity: 0 }}
      variants={variants}
      animate={isLoaded ? "final" : "middle"}
      className={cn(
        "col-span-2 flex h-auto w-full rounded-lg border p-4",
        className,
      )}
      transition={{
        type: "spring",
        delay: 0.5,
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

export function ChartSkeleton() {
  return (
    <div className="col-span-2 flex h-auto w-full rounded-lg border p-4">
      <div className="flex h-full w-full items-center justify-center rounded-lg shadow-md">
        <div className="animate-pulse h-[90%] w-[90%] bg-background" />
      </div>
    </div>
  );
}