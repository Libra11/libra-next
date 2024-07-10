/*
 * @Author: Libra
 * @Date: 2024-07-10 10:38:18
 * @LastEditors: Libra
 * @Description:
 */
import { useState, useEffect, useRef, useTransition } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Content,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { addSessions } from "@/actions/gemini/add-session";
import { getSessions } from "@/actions/gemini/get-session";
import { addMessages } from "@/actions/gemini/add-message";
import { getMessages } from "@/actions/gemini/get-message";
import { deleteSession } from "@/actions/gemini/delete-session";
import { Session } from "@/app/main/gemini/sessionList";

export default function useGeminiChat() {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
  const safetySetting = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: safetySetting,
  });

  const [history, setHistory] = useState<Content[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isPending, startTransition] = useTransition();
  const textRef = useRef("");
  const indexRef = useRef(0);
  const user = useCurrentUser();

  useEffect(() => {
    getAllSessions();
  }, []);

  async function run(msg: string) {
    let session: Session | null = null;
    if (!currentSession) {
      session = await addNewSession();
      setHistory([]);
    }
    setHistory((preHistory) => [
      ...preHistory,
      { role: "user", parts: [{ text: msg }] },
      { role: "model", parts: [{ text: "" }] },
    ]);
    await addNewMessage(
      currentSession ? currentSession.id : session?.id || "",
      msg,
      "user"
    );

    startTransition(async () => {
      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(msg);

      textRef.current = "";
      indexRef.current = 0;
      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        textRef.current += chunkText;
        setHistory((preHistory) => {
          const newHistory = [...preHistory];
          newHistory[newHistory.length - 1] = {
            role: "model",
            parts: [{ text: textRef.current }],
          };
          return newHistory;
        });
      }
      await addNewMessage(
        currentSession ? currentSession.id : session?.id || "",
        textRef.current,
        "model"
      );
    });
  }

  async function addNewSession() {
    setHistory([]);
    const res = await addSessions(user?.id!);
    if (res.code === 0) {
      const session = res.data;
      if (!session) return null;
      setSessions([...sessions, session]);
      setCurrentSession(session);
      return session;
    } else {
      console.error(res.message);
      return null;
    }
  }

  async function getAllSessions() {
    const res = await getSessions(user?.id!);
    if (res.code === 0) {
      const session = res.data;
      if (!session || !session.length) return;
      setSessions(session || []);
      setCurrentSession(session[0]);
      await getAllMessages(session[0].id);
    } else {
      console.error(res.message);
    }
  }

  async function addNewMessage(
    sessionId: string,
    content: string,
    sender: string
  ) {
    const res = await addMessages(sessionId, content, sender);
    if (res.code === 0) {
      console.log(res.data);
    } else {
      console.error(res.message);
    }
  }

  async function getAllMessages(sessionId: string) {
    setHistory([]);
    const res = await getMessages(sessionId);
    if (res.code === 0) {
      for (const message of res.data || []) {
        setHistory((preHistory) => [
          ...preHistory,
          {
            role: message.sender === "user" ? "user" : "model",
            parts: [{ text: message.content }],
          },
        ]);
      }
    } else {
      console.error(res.message);
    }
  }

  async function deleteCurrentSession(sessionId: string) {
    const res = await deleteSession(sessionId);
    if (res.code === 0) {
      console.log(res.data);
      setSessions(sessions.filter((session) => session.id !== sessionId));
      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession(sessions.length ? sessions[0] : null);
        sessions.length && (await getAllMessages(sessions[0].id));
      }
    } else {
      console.error(res.message);
    }
  }

  async function getCurrentSessionMessages(id: string) {
    setCurrentSession(sessions.find((session) => session.id === id) ?? null);
    await getAllMessages(id);
  }

  return {
    history,
    sessions,
    currentSession,
    isPending,
    run,
    addNewSession,
    getCurrentSessionMessages,
    deleteCurrentSession,
  };
}
