import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Input from "~/components/input";
import { BackgroundBeams } from "~/components/ui/background-beams";

type Props = {};

export default function Demo({}: Props) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSendPrompt = () => {
    if (prompt.trim() === "") return;
    setMessageSent(true);
    // Here you would typically also send the message to a backend or perform other actions
    console.log("Message sent:", prompt);
    // Optionally, clear the prompt after sending
    setPrompt("");
  };

  return (
    <div
      className={`flex h-full w-full justify-center ${messageSent ? "items-end" : "items-center"} pb-4 transition-all duration-300`}
    >
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
      <AnimatePresence>
        {messageSent && (
          <Input
            layoutId="input"
            textareaRef={textareaRef}
            prompt={prompt}
            setPrompt={setPrompt}
            handleSendPrompt={handleSendPrompt}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
