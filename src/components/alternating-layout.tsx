import React from "react";
import Graph, { ChartJSON, ChartSkeleton } from "../components/chart";
import AIPrompt, { AIPropmtSkeleton } from "~/components/ai-prompt";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { PageGen } from "~/pages/Demo";
import ChatMessage from "./chat-message";

type Props = {
  messageisSent: boolean;
  groupPageGens: (pageGens: PageGen[]) => PageGen[][];
  pageGens: PageGen[];
  chartMutation: UseMutationResult<
    AxiosResponse<ChartJSON, any>,
    Error,
    {
      query: string;
    },
    unknown
  >;
  mutation: UseMutationResult<
    {
      charts: string[];
      message: string;
    },
    Error,
    {
      query: string;
    },
    unknown
  >;
};

const AlternatingLayout = ({
  messageisSent,
  groupPageGens,
  pageGens,
  chartMutation,
  mutation,
}: Props) => {
  return (
    messageisSent && (
      <div className="flex min-h-screen w-full flex-grow flex-col items-center justify-start space-y-2 overflow-y-auto overflow-x-hidden px-4 pb-36 pt-4">
        {groupPageGens(pageGens).map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {group[0].type === "message" ? (
              <ChatMessage message={group[0].data as string} />
            ) : (
              <div className="mx-2 flex h-[50vh] w-full flex-col gap-2">
                {group.map((gen, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div
                      key={index}
                      className={`flex w-full ${isEven ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`w-1/2 ${isEven ? "pr-1" : "pl-1"}`}>
                        {gen.type === "chart" ? (
                          <Graph json={gen.data as ChartJSON} />
                        ) : (
                          <AIPrompt message={gen.data as string} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </React.Fragment>
        ))}
        {chartMutation.isPending && <ChartSkeleton />}
        {mutation.isPending && <AIPropmtSkeleton />}
      </div>
    )
  );
};

export default AlternatingLayout;
