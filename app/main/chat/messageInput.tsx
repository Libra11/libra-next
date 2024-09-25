/**
 * Author: Libra
 * Date: 2024-07-10 09:47:56
 * LastEditors: Libra
 * Description:
 */
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

interface MessageInputProps {
  onSendMessage: (msg: string) => void;
  isPending: boolean;
}

export function MessageInput({ onSendMessage, isPending }: MessageInputProps) {
  const [msg, setMsg] = useState("");

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !isPending && msg.trim()) {
      onSendMessage(msg);
      setMsg("");
    }
  }

  return (
    <div className="w-[800px] rounded-lg min-h-12 border border-[hsl(var(--primary))]  flex justify-center items-center my-2 max-sm:w-11/12">
      <Textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className="flex-1 p-0 pl-4 min-h-10 py-1 border-none shadow-none outline-none focus-visible:ring-0"
        placeholder="☺Type your message to AI..."
        onKeyDown={handleKeyDown}
      />
      <Button
        onClick={() => {
          onSendMessage(msg);
          setMsg("");
        }}
        disabled={isPending || !msg}
        className="h-10 rounded-lg w-24 p-0 mr-1"
      >
        Send <PaperPlaneIcon className="ml-2" width={18} height={18} />
      </Button>
    </div>
  );
}
