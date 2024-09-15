import { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

interface Props extends PropsWithChildren {
  className?: string;
}

export default function Row({ children, className }: Props) {
  return (
    <div
      className={cn(
        "mx-2 grid h-full w-full grid-cols-4 grid-rows-1 gap-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
