"use client";

import { AcceptedFriendsList, PendingFriendsList } from "./_components/friends-list";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AddFriend } from "./_components/add-friend";

export default function FriendsPage() {
  return (
    <div className="flex-1 flex-col flex divide-y">
      <header className="flex items-center justify-between p-4">
        <h1 className="font-semibold">Friends</h1>
        <AddFriend />
      </header>
      <div className="grid p-4 gap-4"></div>
      <TooltipProvider delayDuration={0}>
      <PendingFriendsList />
      <AcceptedFriendsList />
      </TooltipProvider>
      
    </div>
  );
}
