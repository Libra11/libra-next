/**
 * Author: Libra
 * Date: 2024-07-10 09:47:03
 * LastEditors: Libra
 * Description:
 */
import { useState, useEffect } from "react";
import { ModifySessionName } from "@/actions/gemini/update-session-name";
import DeleteIcon from "@/public/delete.svg";
import RenameIcon from "@/public/rename.svg";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pencil2Icon,
  PlusIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

export interface Session {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SessionListProps {
  sessions: Session[];
  currentSession: Session | null;
  addNewSession: () => void;
  getCurrentSessionMessages: (id: string) => void;
  deleteCurrentSession: (id: string) => void;
}

export function SessionList({
  sessions,
  currentSession,
  addNewSession,
  getCurrentSessionMessages,
  deleteCurrentSession,
}: SessionListProps) {
  const [editableSessionId, setEditableSessionId] = useState<string | null>(
    null
  );
  const [inputValue, setInputValue] = useState("");
  const [inputRefs, setInputRefs] = useState<(HTMLInputElement | null)[]>([]);
  const [popoverOpenStates, setPopoverOpenStates] = useState(
    sessions.map(() => false)
  );

  useEffect(() => {
    setInputRefs((elRefs) =>
      Array(sessions.length)
        .fill(null)
        .map((_, i) => elRefs[i] || null)
    );
  }, [sessions.length]);

  async function updateName(id: string, name: string) {
    const res = await ModifySessionName(id, name);
    if (res.code === 0) {
      sessions.forEach((session) => {
        if (session.id === id) {
          session.name = name;
        }
      });
      setEditableSessionId(null);
    }
  }

  const handlePopoverOpenChange = (index: number) => {
    setPopoverOpenStates((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="w-[300px] h-full rounded-lg p-4 bg-[hsl(var(--background-nav))] flex-col justify-start items-start">
      <div
        className="flex justify-between items-center bg-[hsl(var(--primary))] text-white rounded-lg p-2 mb-8 cursor-pointer"
        onClick={addNewSession}
      >
        <div className="flex justify-center items-center">
          <PlusIcon className="w-5 h-5 mr-1" />
          <span>Add Session</span>
        </div>
        <Pencil2Icon className="w-5 h-5" />
      </div>
      {sessions.map((session, index) => (
        <div
          key={index}
          className={`flex justify-between items-center hover:bg-[hsl(var(--background-main))] rounded-lg mb-2 p-2 cursor-pointer ${
            currentSession &&
            session.id === currentSession.id &&
            "bg-[hsl(var(--background-main))]"
          }`}
        >
          {editableSessionId === session.id ? (
            <Input
              ref={(el) => {
                inputRefs[index] = el;
              }}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateName(session.id, inputValue);
                }
              }}
              onBlur={() => updateName(session.id, inputValue)}
              className={`flex-1 cursor-pointer disabled:cursor-pointer`}
            />
          ) : (
            <span
              className="flex-1"
              onClick={() => getCurrentSessionMessages(session.id)}
            >
              {session.name}
            </span>
          )}
          <Popover
            open={popoverOpenStates[index]}
            onOpenChange={() => handlePopoverOpenChange(index)}
          >
            <PopoverTrigger>
              <DotsHorizontalIcon className="w-5 h-5 pointer-events-none" />
            </PopoverTrigger>
            <PopoverContent className="w-[120px] rounded-lg p-2 text-sm bg-[hsl(var(--background-nav))]">
              <div
                className="flex justify-between items-center text-red-500 cursor-pointer hover:bg-[hsl(var(--background-main))] p-2 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCurrentSession(session.id);
                }}
              >
                <DeleteIcon width={16} height={16} />
                <span className="w-14">Delete</span>
              </div>
              <div
                className="flex justify-between items-center cursor-pointer hover:bg-[hsl(var(--background-main))] p-2 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditableSessionId(session.id);
                  setInputValue(session.name);
                  handlePopoverOpenChange(index);
                  setTimeout(() => {
                    inputRefs[index]?.focus();
                  }, 0);
                }}
              >
                <RenameIcon width={16} height={16} />
                <span className="w-14">Rename</span>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  );
}
