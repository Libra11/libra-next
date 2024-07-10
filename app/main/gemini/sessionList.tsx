/**
 * Author: Libra
 * Date: 2024-07-10 09:47:03
 * LastEditors: Libra
 * Description:
 */
import { Pencil2Icon, Cross2Icon } from "@radix-ui/react-icons";

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
  return (
    <div className="w-[300px] h-full rounded-lg p-4 bg-[hsl(var(--background-nav))] flex-col justify-start items-start">
      <div
        className="flex justify-between items-center hover:bg-[hsl(var(--background-main))] rounded-lg p-2 mb-8 cursor-pointer"
        onClick={() => {
          addNewSession();
        }}
      >
        <span>Gemini</span>
        <Pencil2Icon className="w-5 h-5" />
      </div>
      {sessions.map((session, index) => (
        <div
          key={index}
          onClick={() => getCurrentSessionMessages(session.id)}
          className={`flex justify-between items-center hover:bg-[hsl(var(--background-main))] rounded-lg mb-2 p-2 cursor-pointer ${
            currentSession &&
            session.id === currentSession.id &&
            "bg-[hsl(var(--background-main))]"
          }`}
        >
          <span>{session.name}</span>
          <Cross2Icon
            className="w-5 h-5"
            onClick={(e) => {
              e.stopPropagation();
              deleteCurrentSession(session.id);
            }}
          />
        </div>
      ))}
    </div>
  );
}
