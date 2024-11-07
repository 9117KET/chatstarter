"use client";

import { useQuery } from "convex/react";
import { use } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon, SendIcon, TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const user = useQuery(api.functions.user.get);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col divide-y max-h-screen">
      <header className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <Avatar className="size-8 border">
            <AvatarImage src={user?.image} />
            <AvatarFallback />
          </Avatar>
          <h1 className="font-semibold">{user.username}</h1>
        </div>
        <MessageItem />
      </header>
      <ScrollArea className="h-full py-4" />
      <MessageInput />
    </div>
  );
}

function MessageItem() {
  const user = useQuery(api.functions.user.get);

  return (
    <div className="flex items-center px-4 gap-2">
      <Avatar className="size-8 border">
        <AvatarImage src={user!.image} />
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col mr-auto">
        <p className="text-xs text-muted-foreground">{user!.username}</p>
        <p className="text-sm">Hello World</p>
      </div>
      <MessageActions />
    </div>
  );
}

function MessageActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVerticalIcon className="size=4 text-muted-foreground" />
        <span className="sr-only">Message Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="text-destructive">
          <TrashIcon /> <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MessageInput() {
  return (
    <div className="flex items-center p-4 gap-2">
      <Input placeholder="Message" />
      <Button size="icon">
        <SendIcon />
        <span className="sr-only">Send</span>
      </Button>
    </div>
  );
}
