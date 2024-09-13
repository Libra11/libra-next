/**
 * Author: Libra
 * Date: 2024-07-10 09:48:06
 * LastEditors: Libra
 * Description:
 */
"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useGeminiChat from "@/hooks/useGeminiChat";
import LibraIcon from "@/public/Libra.svg";
import { ChevronRight } from "lucide-react";

import dynamic from "next/dynamic";

const SessionList = dynamic(() =>
  import("./sessionList").then((mod) => mod.SessionList)
);
const ChatHistory = dynamic(() =>
  import("./chatHistory").then((mod) => mod.ChatHistory)
);
const MessageInput = dynamic(() =>
  import("./messageInput").then((mod) => mod.MessageInput)
);

const Sheet = dynamic(() =>
  import("@/components/ui/sheet").then((mod) => mod.Sheet)
);
const SheetContent = dynamic(() =>
  import("@/components/ui/sheet").then((mod) => mod.SheetContent)
);
const SheetDescription = dynamic(() =>
  import("@/components/ui/sheet").then((mod) => mod.SheetDescription)
);
const SheetHeader = dynamic(() =>
  import("@/components/ui/sheet").then((mod) => mod.SheetHeader)
);
const SheetTitle = dynamic(() =>
  import("@/components/ui/sheet").then((mod) => mod.SheetTitle)
);
const SheetTrigger = dynamic(() =>
  import("@/components/ui/sheet").then((mod) => mod.SheetTrigger)
);

export default function GeminiPage() {
  const {
    history,
    sessions,
    currentSession,
    isPending,
    run,
    addNewSession,
    getCurrentSessionMessages,
    deleteCurrentSession,
  } = useGeminiChat();

  const user = useCurrentUser();
  const image = user?.image;

  return (
    <div className="w-full h-full flex justify-center items-center max-sm:text-sm">
      <div className="max-sm:hidden h-full">
        <SessionList
          sessions={sessions}
          currentSession={currentSession}
          addNewSession={addNewSession}
          getCurrentSessionMessages={getCurrentSessionMessages}
          deleteCurrentSession={deleteCurrentSession}
        />
      </div>
      <div className="bg-[hsl(var(--background-nav))] flex-1 w-0 rounded-lg ml-2  h-full flex flex-col justify-center items-center relative">
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="fixed -left-2 top-1/2 -translate-y-1/2 bg-[hsl(var(--primary))] text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription className="flex justify-center items-center !mb-4">
                  <LibraIcon className="w-16 h-16" />
                </SheetDescription>
              </SheetHeader>
              <SessionList
                sessions={sessions}
                currentSession={currentSession}
                addNewSession={addNewSession}
                getCurrentSessionMessages={getCurrentSessionMessages}
                deleteCurrentSession={deleteCurrentSession}
              />
            </SheetContent>
          </Sheet>
        </div>

        <ChatHistory history={history} userImage={image || undefined} />
        <MessageInput onSendMessage={run} isPending={isPending} />
      </div>
    </div>
  );
}
