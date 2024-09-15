import { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

interface Props extends PropsWithChildren {
  className?: string;
}

export default function Row({ children, className }: Props) {
  return (
    <div className={cn("grid grid-cols-2 grid-rows-1 h-full max-h-[45%] w-full", className)}>{children}</div>
  );
}
