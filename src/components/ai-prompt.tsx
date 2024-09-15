import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

type Props = { message: string, className?: string };

export default function AIPrompt({ message, className }: Props) {
  return (
    <motion.div
      className={cn(
        "col-span-1 row-span-2 flex h-auto w-full rounded-lg border p-4",
        className,
      )}
      transition={{
        type: "spring",
        delay: 0.5,
        stiffness: 260,
        damping: 20,
      }}
    >
      <div className="flex h-full w-full items-center justify-center rounded-lg text-center text-xl shadow-md">
        {message}
      </div>
    </motion.div>
  );
}

export function AIPropmtSkeleton() {
  return (
    <div className="h-20 w-full max-w-[700px] animate-pulse rounded-lg bg-muted"></div>
  );
}