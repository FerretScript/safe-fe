import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Input from "~/components/input";
import { BackgroundBeams } from "~/components/ui/background-beams";
import Graph, { ChartJSON } from "../components/graph";
import ChatMessage from "../components/chat-message";
import { Separator } from "~/components/ui/separator";
import Topbar from "~/components/topbar";

type Props = {};

const chatbotOutput: ChartJSON = {
  dates: ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04"],
  series: [
    {
      label: "Temperature",
      type: "line",
      values: [1, 2, 3, 5],
    },
    {
      label: "Humidity",
      type: "line",
      values: [500, 55, 52, 80],
    },
  ],
};

export default function Demo({}: Props) {
  const [prompt, setPrompt] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [messages, setMessages] = useState<string[]>([]); // New state for storing messages
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
    // Add new message to messages state
    setMessages((prevMessages) => [...prevMessages, prompt]);
    // Send message to backend here
    // Clear the prompt after sending
    setPrompt("");
  };

  return (
    <>
      <Topbar open={messageSent} />
      <div
        className={`flex min-h-screen w-full justify-center overflow-y-auto ${messageSent ? "items-start pl-14" : "items-center"} pb-4`}
        style={{ height: `calc(100% + ${textareaHeight + 70}px )` }}
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
            className="flex h-full w-full flex-col items-center justify-start space-y-4 px-4 pt-4"
            style={{ marginBottom: `calc(${textareaHeight + 100}px )` }}
          >
            {/* Example for things generated per message */}
            <div className="mx-2 grid h-full min-h-screen w-full grid-cols-4 grid-rows-4 gap-2">
              <Graph json={chatbotOutput} />
              <Graph json={chatbotOutput} />
              <Graph json={chatbotOutput} />
              <Graph json={chatbotOutput} />
            </div>
            <Separator />

            {/* Render all messages */}
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
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
    </>
  );
}
