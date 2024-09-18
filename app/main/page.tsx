/**
 * Author: Libra
 * Date: 2024-06-04 17:37:13
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import {
  Book,
  BookOpen,
  FileQuestion,
  MessageSquare,
  Users,
  BrainCircuit,
  TrendingUp,
  Activity,
} from "lucide-react";
import { getQuestionsApi } from "@/actions/english/question/get-questions";
import { getSentencesApi } from "@/actions/english/sentence/get-sentences";
import { getWordsApi } from "@/actions/english/word/get-words";
import { getCategoriesApi } from "@/actions/interview/category/get-categories";
import { getQuestionsByCategoryApi } from "@/actions/interview/question/get-questions";
import Loading from "@/components/loading";
import { getParagraphsApi } from "@/actions/english/paragraph/get-paragraph";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export default function DashboardPage() {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalSentences, setTotalSentences] = useState(0);
  const [totalParagraphs, setTotalParagraphs] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [totalInterviewQuestions, setTotalInterviewQuestions] = useState(0);
  const [totalInterviewCategories, setTotalInterviewCategories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<
    { name: string; value: number }[]
  >([]);
  const [recentActivities, setRecentActivities] = useState<
    { type: string; content: string; time: string }[]
  >([]);
  const [learningStreak, setLearningStreak] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [
        questionsRes,
        sentencesRes,
        paragraphsRes,
        wordsRes,
        categoriesRes,
      ] = await Promise.all([
        getQuestionsApi(),
        getSentencesApi(),
        getParagraphsApi(),
        getWordsApi(),
        getCategoriesApi(),
      ]);

      if (questionsRes.code === 0) {
        setTotalQuestions(questionsRes.data?.length ?? 0);
        if (questionsRes.data && questionsRes.data.length > 0) {
          setRecentActivities((prev) => [
            ...prev,
            {
              type: "question",
              content: `Added new question: "${questionsRes.data[0].question.substring(
                0,
                30
              )}..."`,
              time: new Date(questionsRes.data[0].createdAt).toLocaleString(),
            },
          ]);
        }
      }
      if (sentencesRes.code === 0) {
        setTotalSentences(sentencesRes.data?.length ?? 0);
        if (sentencesRes.data && sentencesRes.data.length > 0) {
          setRecentActivities((prev) => [
            ...prev,
            {
              type: "sentence",
              content: `Added new sentence: "${sentencesRes.data?.[0].title.substring(
                0,
                30
              )}..."`,
              time: new Date(
                sentencesRes.data?.[0].createdAt ?? Date.now()
              ).toLocaleString(),
            },
          ]);
        }
      }
      if (paragraphsRes.code === 0) {
        setTotalParagraphs(paragraphsRes.data?.length ?? 0);
        if (paragraphsRes.data && paragraphsRes.data.length > 0) {
          setRecentActivities((prev) => [
            ...prev,
            {
              type: "paragraph",
              content: `Added new paragraph: "${paragraphsRes.data?.[0].title.substring(
                0,
                30
              )}..."`,
              time: new Date(
                paragraphsRes.data?.[0].created_at ?? Date.now()
              ).toLocaleString(),
            },
          ]);
        }
      }
      if (wordsRes.code === 0) {
        setTotalWords(wordsRes.data?.length ?? 0);
        if (wordsRes.data && wordsRes.data.length > 0) {
          setRecentActivities((prev) => [
            ...prev,
            {
              type: "word",
              content: `Added new word: "${wordsRes.data?.[0].textContent}"`,
              time: new Date().toLocaleString(), // Assuming the Word model doesn't have a createdAt field
            },
          ]);
        }
      }

      if (categoriesRes.code === 0 && Array.isArray(categoriesRes.data)) {
        setTotalInterviewCategories(categoriesRes.data.length);
        let totalQuestions = 0;
        const categoryQuestionCounts = [];
        for (const category of categoriesRes.data) {
          const questionsRes = await getQuestionsByCategoryApi(category.id);
          if (questionsRes.code === 0 && Array.isArray(questionsRes.data)) {
            const count = questionsRes.data.length;
            totalQuestions += count;
            categoryQuestionCounts.push({ name: category.name, value: count });
          }
        }
        setTotalInterviewQuestions(totalQuestions);
        setCategoryData(categoryQuestionCounts);
      }

      // Calculate learning streak (this is a placeholder, you might want to implement a more sophisticated logic)
      const streak = Math.min(
        7,
        Math.max(totalQuestions, totalSentences, totalParagraphs, totalWords)
      );
      setLearningStreak(streak);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading size="large" />;
  }

  const learningProgressData = [
    { name: "Words", desktop: totalWords },
    {
      name: "Sentences",
      desktop: totalSentences,
    },
    {
      name: "Paragraphs",
      desktop: totalParagraphs,
    },
    {
      name: "Questions",
      desktop: totalQuestions,
    },
  ];

  const chartConfig = {
    desktop: {
      label: "",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 h-full bg-[hsl(var(--background-nav))] rounded-lg overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              English Questions
            </CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentences</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSentences}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paragraphs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParagraphs}</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Words</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWords}</div>
            <p className="text-xs text-muted-foreground">
              +35% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={learningProgressData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Interview Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={categoryData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="value" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivities.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center">
                  <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.content}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Learning Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{learningStreak}</div>
              <p className="text-sm text-muted-foreground">Days in a row</p>
              <div className="mt-4 flex justify-center space-x-2">
                {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      day <= learningStreak ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
