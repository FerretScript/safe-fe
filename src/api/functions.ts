import axios from "axios";
import { ChartJSON } from "~/components/chart";
import { extractChartBlocks } from "~/lib/utils";

type ConversationResponse = {
  concise_response: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const postConversation = async ({ query }: { query: string }) => {
  const response = await api.post<ConversationResponse>("/conversation", {
    query,
  });
  const rawMessage = response.data.concise_response;

  const { charts, message } = extractChartBlocks(rawMessage);

  return { charts, message };
};

export const postChart = async ({ query }: { query: string }) => {
  const response = await api.post<ChartJSON>("/graph", { query });
  return response;
};
