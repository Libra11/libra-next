/**
 * Author: Libra
 * Date: 2024-07-10 09:48:06
 * LastEditors: Libra
 * Description:
 */
"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SessionList } from "./sessionList";
import { ChatHistory } from "./chatHistory";
import { MessageInput } from "./messageInput";
import useGeminiChat from "@/hooks/useGeminiChat";

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
    <div className="w-full h-full flex justify-center items-center">
      <SessionList
        sessions={sessions}
        currentSession={currentSession}
        addNewSession={addNewSession}
        getCurrentSessionMessages={getCurrentSessionMessages}
        deleteCurrentSession={deleteCurrentSession}
      />
      <div className="bg-[hsl(var(--background-nav))] rounded-lg ml-2 w-full h-full flex flex-col justify-center items-center">
        <ChatHistory history={history} userImage={image || undefined} />
        <MessageInput onSendMessage={run} isPending={isPending} />
      </div>
    </div>
  );
}
