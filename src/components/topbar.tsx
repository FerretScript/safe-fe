import { Link } from "wouter";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

type Props = { open: boolean };

export default function Topbar({ open }: Props) {
  const variants = {
    open: { x: 0 },
    default: { x: -100 },
  };

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={open ? "open" : "default"}
      variants={variants}
      className="fixed left-0 top-0 flex h-full w-14 flex-col items-center justify-between border-r py-2"
    >
      <div className="flex flex-col space-y-1 h-full w-full items-center justify-start">
          <Button className="font-mono font-bold text-2xl" size={"icon"} variant={"ghost"}>
            S4
          </Button>
        <Link href="/demo" asChild>
          <Button size={"icon"} variant={"outline"}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      <Avatar>
        <AvatarFallback className="bg-foreground text-background">
          DB
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
}
