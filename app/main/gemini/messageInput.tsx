/**
 * Author: Libra
 * Date: 2024-07-10 09:47:56
 * LastEditors: Libra
 * Description:
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

interface MessageInputProps {
  onSendMessage: (msg: string) => void;
  isPending: boolean;
}

export function MessageInput({ onSendMessage, isPending }: MessageInputProps) {
  const [msg, setMsg] = useState("");

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !isPending && msg.trim()) {
      onSendMessage(msg);
      setMsg("");
    }
  }

  return (
    <div className="w-[800px] flex justify-center items-center relative mb-2">
      <Input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className="w-full rounded-full h-12 pl-4"
        placeholder="☺Type your message to Gemini..."
        onKeyDown={handleKeyDown}
      />
      <Button
        onClick={() => {
          onSendMessage(msg);
          setMsg("");
        }}
        disabled={isPending || !msg}
        className="h-10 absolute right-1 top-1 rounded-full w-24 p-0"
      >
        Send <PaperPlaneIcon className="ml-2" width={18} height={18} />
      </Button>
    </div>
  );
}
