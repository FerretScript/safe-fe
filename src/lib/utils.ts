import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChartJSON } from "~/components/chart";
import { toast } from "~/hooks/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertPrimaryValue(
  value: any,
  type: "number" | "string" | "date",
): number | string | Date {
  switch (type) {
    case "number":
      return Number(value);
    case "string":
      return String(value);
    case "date":
      return new Date(value);
    default:
      throw new Error(`Unsupported primary value type: ${type}`);
  }
}

function getSecondaryAxisId(series: {
  type: string | undefined;
  label: string;
}): string {
  switch (series.type) {
    case "area":
      return "area";
    case "bubble":
      return "bubble";
    default:
      return series.label;
  }
}

export function processChartData(chatbotOutput: ChartJSON) {
  const chartData = chatbotOutput.series.map((series) => ({
    label: series.label,
    secondaryAxisId: getSecondaryAxisId(series),
    data: chatbotOutput.dates.map((date, index) => ({
      primary: new Date(date),
      secondary: series.values[index],
      radius: series.values[index],
    })),
    elementType: series.type as "line" | "area" | "bar" | "bubble" | undefined,
  }));
  return chartData;
}

export function extractChartTypes(chatbotOutput: ChartJSON) {
  const types = chatbotOutput.series.map((series) => series.type);
  return types;
}

export const normalizeRadius = (value: number) => {
  const minValue = 1;
  const maxValue = 100;
  const minRadius = 1;
  const maxRadius = 25;

  const clampedValue = Math.max(minValue, Math.min(maxValue, value));

  const normalizedValue = (clampedValue - minValue) / (maxValue - minValue);

  return minRadius + normalizedValue * (maxRadius - minRadius);
};

export function extractChartBlocks(query: string) {
  const regex = /```\{graph\}([\s\S]*?)```/g;
  const charts: string[] = [];
  let match;
  let lastIndex = 0;
  let message = "";

  while ((match = regex.exec(query)) !== null) {
    const chartMessage = match[1].trim();
    charts.push(chartMessage);

    // Add the text between the last match and this match to message
    message += query.slice(lastIndex, match.index);
    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last match
  message += query.slice(lastIndex);

  // Trim the message to remove any leading/trailing whitespace
  message = message.trim();

  return { charts, message };
}

export async function processChartResponses(
  charts: string[],
  chartMutation: UseMutationResult<
    AxiosResponse<ChartJSON, any>,
    Error,
    {
      query: string;
    },
    unknown
  >,
  setPageGens: React.Dispatch<React.SetStateAction<any[]>>,
) {
  const chartsRes: ChartJSON[] = [];

  if (charts.length === 0) return;

  try {
    for (const chart of charts) {
      const chartRes = await chartMutation.mutateAsync({ query: chart });
      chartsRes.push(chartRes.data);
    }

    chartsRes.forEach((parsedChartData) => {
      setPageGens((prev) => [
        ...prev,
        {
          type: "chart",
          data: parsedChartData,
          isUser: false,
        },
      ]);
    });
  } catch (error) {
    console.error("Error processing chart data:", error);
    toast({
      title: "Error processing chart data",
      description:
        error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
  }
}
