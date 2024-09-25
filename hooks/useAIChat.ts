/*
 * @Author: Libra
 * @Date: 2024-07-10 10:38:18
 * @LastEditors: Libra
 * @Description:
 */
import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Content,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { addSessions } from "@/actions/chat/add-session";
import { getSessions } from "@/actions/chat/get-session";
import { addMessages } from "@/actions/chat/add-message";
import { getMessages } from "@/actions/chat/get-message";
import { deleteSession } from "@/actions/chat/delete-session";
import { Session } from "@/app/main/chat/sessionList";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export default function useAIChat() {
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
  const user = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const [selectedModel, setSelectedModel] = useState<
    "gemini" | "gpt-3.5-turbo" | "gpt-4"
  >(isAdmin ? "gpt-3.5-turbo" : "gemini");
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  async function run(msg: string) {
    let sessionToUse = currentSession;

    if (!sessionToUse) {
      const newSession = await addNewSession();
      if (!newSession) return;
      sessionToUse = newSession;
      setCurrentSession(sessionToUse);
    }

    const newUserMessage = { role: "user", parts: [{ text: msg }] };
    setHistory((prevHistory) => [...prevHistory, newUserMessage]);

    await addNewMessage(sessionToUse.id, msg, "user");

    startTransition(async () => {
      let reply = "";

      if (selectedModel === "gemini") {
        reply = await runWithGemini(msg);
      } else {
        reply = await runWithOpenAI(msg);
      }

      await addNewMessage(sessionToUse.id, reply, "model");
    });
  }

  async function runWithGemini(msg: string) {
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(msg);

    textRef.current = "";
    let bufferedText = "";

    for await (const chunk of result.stream) {
      const chunkText = await chunk.text();
      bufferedText += chunkText;
    }
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory.push({
        role: "model",
        parts: [{ text: bufferedText }],
      });
      return newHistory;
    });

    return bufferedText;
  }

  async function runWithOpenAI(msg: string) {
    const messages = history.map((item) => ({
      role: item.role === "user" ? "user" : "assistant",
      content: item.parts[0].text,
    }));
    messages.push({ role: "user", content: msg });

    const chatCompletion = await openai.chat.completions.create({
      model: selectedModel,
      messages: messages as ChatCompletionMessageParam[],
      stream: true,
    });

    textRef.current = "";
    setHistory((prevHistory) => [
      ...prevHistory,
      { role: "model", parts: [{ text: "" }] },
    ]);

    let bufferedText = "";
    for await (const chunk of chatCompletion) {
      const chunkText = chunk.choices[0]?.delta?.content || "";
      bufferedText += chunkText;
      setHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1] = {
          role: "model",
          parts: [{ text: bufferedText }],
        };
        return newHistory;
      });
    }

    return bufferedText;
  }

  async function addNewSession() {
    const res = await addSessions(user?.id!);
    if (res.code === 0) {
      const session = res.data;
      if (session) {
        setSessions((prevSessions) => [...prevSessions, session]);
        setHistory([]);
        return session;
      }
    } else {
      console.error(res.message);
    }
    return null;
  }

  const getAllSessions = useCallback(async () => {
    const res = await getSessions(user?.id!);
    if (res.code === 0) {
      const session = res.data;
      if (session && session.length) {
        setSessions(session);
        setCurrentSession(session[0]);
        await getAllMessages(session[0].id);
      }
    } else {
      console.error(res.message);
    }
  }, [user?.id]);

  async function addNewMessage(
    sessionId: string,
    content: string,
    sender: string
  ) {
    const res = await addMessages(sessionId, content, sender);
    if (res.code !== 0) {
      console.error(res.message);
    }
  }

  async function getAllMessages(sessionId: string) {
    setHistory([]);
    const res = await getMessages(sessionId);
    if (res.code === 0) {
      const messages = res.data || [];
      messages.forEach((message) => {
        const role = message.sender === "user" ? "user" : "model";
        setHistory((prevHistory) => [
          ...prevHistory,
          { role, parts: [{ text: message.content }] },
        ]);
      });
    } else {
      console.error(res.message);
    }
  }

  async function deleteCurrentSession(sessionId: string) {
    const res = await deleteSession(sessionId);
    if (res.code === 0) {
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.id !== sessionId)
      );
      if (currentSession && currentSession.id === sessionId) {
        const [newCurrentSession] = sessions.filter(
          (session) => session.id !== sessionId
        );
        setCurrentSession(newCurrentSession || null);
        if (newCurrentSession) {
          await getAllMessages(newCurrentSession.id);
        }
      }
    } else {
      console.error(res.message);
    }
  }

  async function getCurrentSessionMessages(sessionId: string) {
    const session =
      sessions.find((session) => session.id === sessionId) || null;
    setCurrentSession(session);
    if (session) await getAllMessages(session.id);
  }

  useEffect(() => {
    getAllSessions();
  }, [getAllSessions]);

  return {
    history,
    sessions,
    currentSession,
    isPending,
    run,
    addNewSession,
    getCurrentSessionMessages,
    deleteCurrentSession,
    selectedModel,
    setSelectedModel,
  };
}
