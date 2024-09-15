import { AnimatePresence, motion, useScroll } from "framer-motion";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
              handleSendPrompt={handleSendPrompt}
            />
          </div>
        )}
      </>
      {/* Content body */}
      {messageSent && (
        <div className="flex min-h-screen pb-36 w-full flex-grow flex-col items-center justify-start space-y-2 overflow-y-auto overflow-x-hidden px-4 pt-4">
          {/* Example for things generated per message */}
          <div className="h-sc mx-2 grid h-screen w-full grid-cols-4 grid-rows-4 gap-2">
            <Graph json={chatbotOutput} />
            <Graph json={chatbotOutput} />
            <Graph json={chatbotOutput} />
            <Graph json={chatbotOutput} />
            <Separator />
          </div>
          <div className="h-sc mx-2 grid h-screen w-full grid-cols-4 grid-rows-4 gap-2">
            <Graph json={chatbotOutput} />
            <Graph json={chatbotOutput} />
            <Graph json={chatbotOutput} />
            <Graph json={chatbotOutput} />
            <Separator />
          </div>

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
            scroll={scrollYProgress}
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
