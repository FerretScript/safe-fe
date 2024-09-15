import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Input from "~/components/input";
import { BackgroundBeams } from "~/components/ui/background-beams";
import Row from "../components/row";
import Graph, { ChartJSON } from "../components/graph";

type Props = {};

const chatbotOutput: ChartJSON = {
  dates: ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04"],
  series: [
    {
      name: "Temperature",
      type: "bar",
      values: [20, 22, 21, 30],
    },
    {
      name: "Humidity",
      type: "line",
      values: [50, 55, 52, 80],
    },
  ],
};

export default function Demo({}: Props) {
  const [prompt, setPrompt] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const [textareaHeight, setTextareaHeight] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setTextareaHeight(textareaRef.current.scrollHeight);
    }
  }, [prompt]);

  const handleSendPrompt = () => {
    if (prompt.trim() === "") return;
    setMessageSent(true);
    // Send message to backend here

    // Optionally, clear the prompt after sending
    setPrompt("");
  };

  return (
    <div
      className={`flex h-full w-full justify-center overflow-y-auto ${messageSent ? "items-start" : "items-center"} pb-4`}
    >
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
              handleSendPrompt={handleSendPrompt}
            />
          </div>
        )}
      </>

      {/* Content body */}
      {messageSent && (
        <div
          className="flex h-full w-full flex-col items-center justify-start space-y-2 px-4 pt-4"
          style={{ marginBottom: `calc(${textareaHeight + 70}px )` }}
        >
          {/* Example for things generated per message */}
          <Row>
            <Graph className="col-span-1" json={chatbotOutput} />
          </Row>
        </div>
      )}

      {/* Input */}
      <AnimatePresence>
        {messageSent && (
          <Input
            layoutId="input"
            textareaRef={textareaRef}
            prompt={prompt}
            setPrompt={setPrompt}
            handleSendPrompt={handleSendPrompt}
            className="fixed bottom-4"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
