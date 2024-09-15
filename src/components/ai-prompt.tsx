import { motion } from "framer-motion";

type Props = { message: string };

export default function AIPrompt({ message }: Props) {
  return (
    <motion.div>
      <div className="flex h-full w-full items-center justify-center rounded-lg text-center text-xl shadow-md">
        {message}
      </div>
    </motion.div>
  );
}
