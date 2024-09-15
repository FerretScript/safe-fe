import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Input from "~/components/input";
import { BackgroundBeams } from "~/components/ui/background-beams";
import Graph, { ChartJSON } from "../components/chart";
import ChatMessage from "../components/chat-message";
import { Separator } from "~/components/ui/separator";
import Topbar from "~/components/topbar";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "~/hooks/use-toast";
import { postChart, postConversation } from "~/api/functions";
import AIPrompt from "~/components/ai-prompt";
import { processChartResponses } from "~/lib/utils";

type PageGen = {
  type: "message" | "chart";
  data: string | ChartJSON;
  isUser: boolean;
};

type Props = {};

export default function Demo({}: Props) {
  const { toast } = useToast();

  const chartMutation = useMutation({
    mutationFn: postChart,
    onSuccess: () => {
      toast({
        title: "Chart enviada",
      });
    },
    onError: () => {
      toast({
        title: "Error al enviar chart",
        variant: "destructive",
      });
    },
  });

  const mutation = useMutation({
    mutationFn: postConversation,
    onSuccess: () => {
      toast({
        title: "Mensaje enviado",
      });
    },
    onError: () => {
      toast({
        title: "Error al enviar mensaje",
        variant: "destructive",
      });
    },
  });

  const [prompt, setPrompt] = useState("");
  const [pageGens, setPageGens] = useState<PageGen[]>([]);
  const [messageSent, setMessageSent] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSend = async () => {
    if (prompt.trim() === "") return;
    setMessageSent(true);

    // Add user message to pageGens
    setPageGens((prev) => [
      ...prev,
      { type: "message", data: prompt, isUser: true },
    ]);

    const res = await mutation.mutateAsync({
      query: prompt,
    });

    const { charts, message } = res;

    processChartResponses(charts, chartMutation, setPageGens);

    if (message) {
      setPageGens((prev) => [
        ...prev,
        {
          type: "message",
          data: message,
          isUser: false,
        },
      ]);
    }

    setPrompt("");
  };

  return (
    <div
      className={`flex h-full w-full justify-center ${messageSent ? "items-start pl-14" : "items-center"} pb-4`}
    >
      <Topbar open={messageSent} />

      {/* Initial UI */}
      <>
        <AnimatePresence>
          {!messageSent && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BackgroundBeams className="absolute z-0" />
            </motion.div>
          )}
        </AnimatePresence>
        {!messageSent && (
          <div className="z-10 flex h-fit w-[46.875rem] flex-col items-center justify-center space-y-4 pt-2">
            <h1 className="text-5xl">What's on your mind?</h1>
            <Input
              layoutId="input"
              textareaRef={textareaRef}
              prompt={prompt}
              setPrompt={setPrompt}
              handleSendPrompt={handleSend}
            />
          </div>
        )}
      </>

      {/* Content body */}
      {messageSent && (
        <div className="flex min-h-screen w-full flex-grow flex-col items-center justify-start space-y-2 overflow-y-auto overflow-x-hidden px-4 pb-36 pt-4">
          {pageGens.map((gen, index) => {
            if (gen.type === "message") {
              return gen.isUser ? (
                <ChatMessage key={index} message={gen.data as string} />
              ) : (
                <AIPrompt key={index} message={gen.data as string} />
              );
            } else if (gen.type === "chart" || gen.type === "message") {
              const components = pageGens.filter(
                (g) => g.type === "chart" || g.type === "message",
              );
              const isOnlyComponent = components.length === 1;

              return (
                <div
                  key={index}
                  className={`mx-2 grid gap-2 ${
                    isOnlyComponent
                      ? "h-screen w-full place-items-center"
                      : "h-sc h-screen w-full grid-cols-4 grid-rows-4"
                  }`}
                >
                  {gen.type === "chart" ? (
                    <Graph json={gen.data as ChartJSON} />
                  ) : (
                    <AIPrompt message={gen.data as string} />
                  )}
                  {!isOnlyComponent && index < components.length - 1 && (
                    <Separator />
                  )}
                </div>
              );
            }
          })}
          {chartMutation.isPending && (
            <div className="h-[400px] w-[750px] animate-pulse rounded-lg bg-muted"></div>
          )}
        </div>
      )}

      {/* Input */}
      <AnimatePresence>
        {messageSent && (
          <Input
            scroll={scrollYProgress}
            layoutId="input"
            textareaRef={textareaRef}
            prompt={prompt}
            setPrompt={setPrompt}
            handleSendPrompt={handleSend}
            className="fixed bottom-4"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
