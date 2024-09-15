import { Avatar, AvatarFallback } from "./ui/avatar";

type Props = {
  message: string;
};

export default function GrowingTextDisplayComponent({ message }: Props) {
  return (
    <div className="flex w-full max-w-[46.875rem] my-2 items-end justify-end rounded-lg bg-secondary p-3 ring-1 ring-ring">
      <div className="flex-grow overflow-hidden">
        <div className="w-full whitespace-pre-wrap break-words text-right px-2">
          {message}
        </div>
      </div>
      <div className="ml-2 flex h-full w-fit flex-shrink-0 items-start justify-center">
        <Avatar>
          <AvatarFallback className="bg-foreground text-background">
            DB
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}