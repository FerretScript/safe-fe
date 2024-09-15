import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChartJSON } from "~/components/graph";

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

export function processChartData(chatbotOutput: ChartJSON) {
  const chartData = chatbotOutput.series.map((series) => ({
    label: series.label,
    secondaryAxisId: series.label,
    data: chatbotOutput.dates.map((date, index) => ({
      primary: new Date(date),
      secondary: series.values[index],
      radius: undefined,
    })),
    elementType: series.type as "line" | "area" | "bar" | "bubble" | undefined,
  }));
  return chartData;
}

export function extractChartTypes(chatbotOutput: ChartJSON) {
  const types = chatbotOutput.series.map((series) => series.type);
  return types;
}