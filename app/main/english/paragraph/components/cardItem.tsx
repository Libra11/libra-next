/**
 * Author: Libra
 * Date: 2024-09-05 14:24:24
 * LastEditors: Libra
 * Description:
 */
"use client";
import { Paragraph } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Music,
  FileText,
  Calendar,
  ArrowRight,
  Headphones,
} from "lucide-react";

const CardItem = ({ paragraph }: { paragraph: Paragraph }) => {
  const router = useRouter();
  const goDetail = (id: number) => {
    router.push(`/main/english/paragraph/${id}`);
  };

  const formatUpdateTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return "刚刚";
  };

  return (
    <div
      onClick={() => goDetail(paragraph.id)}
      className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-purple-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
        ID: {paragraph.id}
      </div>
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full opacity-70 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="relative">
        <Headphones className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
        <h2 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
          {paragraph.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
          {paragraph.description}
        </p>
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <Music className="w-4 h-4 mr-1" />
            <span>音频</span>
          </div>
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            <span>字幕</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatUpdateTime(paragraph.updated_at)}</span>
          </div>
        </div>
        <div className="flex justify-end items-center text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">
          <span className="text-sm font-semibold mr-1">查看详情</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900 rounded-tl-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
    </div>
  );
};

export default CardItem;
