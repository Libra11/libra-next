/*
 * @Author: Libra
 * @Date: 2024-07-09 15:19:32
 * @LastEditors: Libra
 * @Description:
 */
import { Session } from "@/app/main/gemini/sessionList";
import { db } from "@/lib/db";

export const AddSession = async (userId: string): Promise<Session | null> => {
  let session: Session | null = null;
  try {
    session = await db.session.create({
      data: {
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return session;
};

export const GetSession = async (userId: string): Promise<Session[]> => {
  let session: Session[] = [];
  try {
    session = await db.session.findMany({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return session;
};

export const AddMessage = async (
  sender: string,
  sessionId: string,
  content: string
) => {
  try {
    const message = await db.message.create({
      data: {
        createdAt: new Date(),
        sessionId,
        content,
        sender,
      },
    });
    return message;
  } catch (error) {
    return error;
  }
};

export const GetMessage = async (sessionId: string) => {
  try {
    const message = await db.message.findMany({
      where: {
        sessionId,
      },
    });
    return message;
  } catch (error) {
    return null;
  }
};

export const DeleteSession = async (sessionId: string) => {
  try {
    await db.session.delete({
      where: {
        id: sessionId,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};
