import {
  HTMLMotionProps,
  motion,
  MotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { Paperclip, Send } from "lucide-react";
import { RefObject, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "~/lib/utils";

interface InputProps extends HTMLMotionProps<"div"> {
  textareaRef: RefObject<HTMLTextAreaElement>;
  prompt: string;
  setPrompt: (value: string) => void;
  handleSendPrompt: () => void;
  className?: string;
  scroll?: MotionValue<number>;
}

export default function Input({
  textareaRef,
  prompt,
  setPrompt,
  handleSendPrompt,
  className,
  scroll,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [move, setMove] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const variants = {
    default: {
      y: 0,
      opacity: 1,
    },
    moved: {
      y: 100,
      opacity: 0,
    },
  };

  useMotionValueEvent(scroll ?? new MotionValue(), "change", (latest) => {
    console.log("Page scroll: ", latest);
  });

  useEffect(() => {
    function updateOpacity(n: number) {
      if (!scroll) return;

      if (n === 1) setMove(true);
      else setMove(false);
    }

    if (!scroll) return;

    const unsubscribeScroll = scroll.on("change", (latest) =>
      updateOpacity(latest),
    );

    return () => {
      unsubscribeScroll();
    };
  }, []);

  return (
    <motion.div
      {...props}
      initial={{ y: 0, opacity: 1 }}
      animate={move ? "moved" : "default"}
      variants={variants}
      className={cn(
        `flex w-full max-w-[46.875rem] flex-col items-center justify-center rounded-lg border bg-background px-2 pb-2 pt-2 text-sm shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${
          isFocused
            ? "border-ring ring-1 ring-ring ring-offset-background"
            : "border-input"
        }`,
        className,
      )}
    >
      <Textarea
        ref={textareaRef}
        className="h-24 max-h-[250px] w-full overflow-y-auto border-0 outline-none ring-0 ring-offset-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Write your prompt here"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div className="mt-2 flex h-fit w-full justify-between">
        <Button variant="outline" size="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Button
          onClick={handleSendPrompt}
          variant="outline"
          size="icon"
          className="bg-border transition-all duration-100 ease-in hover:scale-110"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
}
