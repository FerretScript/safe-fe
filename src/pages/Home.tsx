import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { motion } from "framer-motion";

type Props = {};

export default function Home({}: Props) {
  return (
    <div className="flex flex-col items-center justify-start">
      <motion.nav
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 60 }}
        className="mb-2 flex h-fit w-full max-w-[1600px] items-center justify-between px-4 py-2"
      >
        <a className="text-2xl transition-all hover:underline" href="#about">
          About Us
        </a>
        <a className="text-2xl transition-all hover:underline" href="/chat">
          Demo
        </a>
        <a className="text-2xl transition-all hover:underline" href="#contact">
          Contact
        </a>
      </motion.nav>
      <Sheet>
        <SheetTrigger>Hello</SheetTrigger>
        <SheetContent>
          <SheetTitle>Hello</SheetTitle>
        </SheetContent>
      </Sheet>
    </div>
  );
}
