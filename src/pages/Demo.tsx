import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Input from "~/components/input";
import { BackgroundBeams } from "~/components/ui/background-beams";
import { ChartJSON } from "../components/chart";
import Topbar from "~/components/topbar";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "~/hooks/use-toast";
import { postChart, postConversation } from "~/api/functions";
import { processChartResponses } from "~/lib/utils";
import AlternatingLayout from "../components/alternating-layout";

export type PageGen = {
  type: "message" | "chart" | "ai-prompt";
  data: string | ChartJSON;
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
  const [messageisSent, setMessageisSent] = useState(false);

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
    setMessageisSent(true);

    setPrompt("");

    // Add user message to pageGens
    setPageGens((prev) => [...prev, { type: "message", data: prompt }]);

    const res = await mutation.mutateAsync({
      query: prompt,
    });

    const { charts, message: aipropmt } = res;

    console.log("AI prompt", aipropmt);

    processChartResponses(charts, chartMutation, setPageGens);

    if (aipropmt) {
      setPageGens((prev) => [
        ...prev,
        {
          type: "ai-prompt",
          data: aipropmt,
        },
      ]);
    }
  };

  const handleShortcut = useCallback(
    (e: KeyboardEvent) => {
      if (!e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleSend],
  );

  useEffect(() => {
    const ref = textareaRef.current;
    if (ref) {
      ref.addEventListener("keydown", handleShortcut);
    }
    return () => {
      if (ref) {
        ref.removeEventListener("keydown", handleShortcut);
      }
    };
  }, [handleShortcut]);

  const groupPageGens = (pageGens: PageGen[]) => {
    return pageGens.reduce<PageGen[][]>((acc, gen) => {
      if (gen.type === "message") {
        acc.push([gen]);
      } else {
        if (acc.length === 0 || acc[acc.length - 1][0].type === "message") {
          acc.push([gen]);
        } else {
          acc[acc.length - 1].push(gen);
        }
      }
      return acc;
    }, []);
  };

  return (
    <div
      className={`flex h-full w-full justify-center ${messageisSent ? "items-start pl-14" : "items-center"} pb-4`}
    >
      <Topbar open={messageisSent} />

      {/* Initial UI */}
      <>
        <AnimatePresence>
          {!messageisSent && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BackgroundBeams className="absolute z-0" />
            </motion.div>
          )}
        </AnimatePresence>
        {!messageisSent && (
          <div className="z-10 flex h-fit w-[46.875rem] flex-col items-center justify-center space-y-2 pt-2">
            <h1 className="font-mono text-9xl font-medium tracking-wide">
              S4FE
            </h1>
            <h2 className="mb-2 text-4xl tracking-wide">
              What's on your mind?
            </h2>
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
      <AlternatingLayout
        messageisSent={messageisSent}
        groupPageGens={groupPageGens}
        chartMutation={chartMutation}
        mutation={mutation}
        pageGens={pageGens}
      />

      {/* Input */}
      <AnimatePresence>
        {messageisSent && (
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
