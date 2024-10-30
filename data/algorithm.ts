/*
 * @Author: Libra
 * @Date: 2024-10-28 14:04:46
 * @LastEditors: Libra
 * @Description: 
 */
import { db } from "@/lib/db";
import { Difficulty } from "@prisma/client";

export const addAlgorithmTag = async (name: string) => {
  const existingTag = await db.algorithmTag.findUnique({
    where: { name },
  });

  if (existingTag) {
    return "Tag already exists";
  }

  return await db.algorithmTag.create({
    data: { name },
  });
};

export const deleteAlgorithmTag = async (id: number) => {
  return await db.algorithmTag.delete({
    where: { id },
  });
};

export const getAlgorithmTags = async () => {
  return await db.algorithmTag.findMany();
};

export const addAlgorithm = async ({
  name,
  description,
  difficulty,
  approach,
  solution,
  tags,
}: {
  name: string;
  description: string;
  difficulty: Difficulty;
  approach: string;
  solution: string;
  tags: string[];
}) => {
  return await db.algorithm.create({
    data: {
      name,
      description,
      difficulty,
      approach,
      solution,
      tags: {
        create: tags.map((tagId) => ({
          tag: {
            connect: { id: parseInt(tagId) },
          },
        })),
      },
    },
  });
};

export const updateAlgorithm = async (
  id: number,
  {
    name,
    description,
    difficulty,
    approach,
    solution,
    tags,
  }: {
    name: string;
    description: string;
    difficulty: Difficulty;
    approach: string;
    solution: string;
    tags: string[];
  }
) => {
  return await db.algorithm.update({
    where: { id },
    data: {
      name,
      description,
      difficulty,
      approach,
      solution,
      tags: {
        deleteMany: {},
        create: tags.map((tagId) => ({
          tag: {
            connect: { id: parseInt(tagId) },
          },
        })),
      },
    },
  });
};

export const deleteAlgorithm = async (id: number) => {
  return await db.algorithm.delete({
    where: { id },
  });
};

export const getAlgorithm = async (id: number) => {
  return await db.algorithm.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

export const getAlgorithms = async (
  page: number = 1,
  pageSize: number = 20
) => {
  const skip = (page - 1) * pageSize;
  const [total, items] = await Promise.all([
    db.algorithm.count(),
    db.algorithm.findMany({
      skip,
      take: pageSize,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  return {
    total,
    items,
    page,
    pageSize,
  };
};
