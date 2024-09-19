/**
 * Author: Libra
 * Date: 2024-09-13 14:24:39
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { getEnglishQuestionsPaginatedApi } from "@/actions/english/question/get-questions-paginated";
import QuestionDialog from "./components/QuestionDialog";
import { EnglishQuestion, QuestionType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Filter,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import RemoveQuestionDialog from "./components/RemoveQuestionDialog";
import { deleteQuestionApi } from "@/actions/english/question/delete-question";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MarkDownComponent } from "@/components/markdown";
import { useInView } from "react-intersection-observer";
import { InfiniteScroll } from "@/components/InfiniteScroll";

const questionTypeMap = {
  [QuestionType.SINGLE_CHOICE]: "Single Choice",
  [QuestionType.MULTIPLE_CHOICE]: "Multiple Choice",
  [QuestionType.TRUE_FALSE]: "True/False",
  [QuestionType.FILL_IN_THE_BLANK]: "Fill in the Blank",
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<EnglishQuestion[]>([]);
  const [selectedType, setSelectedType] = useState<QuestionType | "ALL">("ALL");
  const [editingQuestion, setEditingQuestion] =
    useState<EnglishQuestion | null>(null);
  const [removingQuestionId, setRemovingQuestionId] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const getQuestions = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    const res = await getEnglishQuestionsPaginatedApi(pageNum);
    if (res.code === 0 && res.data) {
      setQuestions((prev) => {
        const newQuestions = res.data.items.filter(
          (item) => !prev.some((q) => q.id === item.id)
        );
        return [...prev, ...newQuestions];
      });
      setHasMore(res.data.total > res.data.page * res.data.pageSize);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getQuestions(page);
  }, [getQuestions, page]);

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsDialogOpen(true);
  };

  const handleQuestionSubmitted = (newQuestion: EnglishQuestion) => {
    setQuestions((prevQuestions) => {
      const index = prevQuestions.findIndex((q) => q.id === newQuestion.id);
      if (index !== -1) {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[index] = newQuestion;
        return updatedQuestions;
      } else {
        return [newQuestion, ...prevQuestions];
      }
    });
    setIsDialogOpen(false);
  };

  const handleQuestionRemoved = async (questionId: number) => {
    const result = await deleteQuestionApi(questionId);
    if (result.code === 0) {
      setQuestions(questions.filter((q) => q.id !== questionId));
    }
  };

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    const nextPage = page + 1;
    const res = await getEnglishQuestionsPaginatedApi(nextPage);
    if (res.code === 0 && res.data) {
      setQuestions((prevQuestions) => [...prevQuestions, ...res.data.items]);
      setPage(nextPage);
      setHasMore(res.data.total > res.data.page * res.data.pageSize);
    }
    setIsLoading(false);
  }, [hasMore, isLoading, page]);

  const renderQuestion = useCallback(
    (question: EnglishQuestion, index: number) => {
      const handleEditQuestion = (question: EnglishQuestion) => {
        setEditingQuestion(question);
        setIsDialogOpen(true);
      };

      return (
        <AccordionItem
          key={question.id}
          value={`item-${index}`}
          className="w-full"
        >
          <AccordionTrigger>
            <div className="flex-1 flex justify-between items-center">
              <div className="flex-1 flex justify-start items-center">
                <Badge
                  variant="default"
                  className="mr-2 bg-[hsl(var(--primary))]"
                >
                  {questionTypeMap[question.type]}
                </Badge>
                <span className="font-bold text-base max-sm:text-sm text-left break-words">
                  {question.question}
                </span>
              </div>
              <div className="flex-shrink-0 flex justify-center items-center space-x-2 max-sm:hidden">
                <span
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditQuestion(question);
                  }}
                >
                  <Edit className="h-5 w-5 text-[hsl(var(--primary))]" />
                </span>
                <span
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors !mr-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRemovingQuestionId(question.id);
                  }}
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-[hsl(var(--background-main))] p-2 text-base leading-7 max-sm:text-sm">
            <div className="space-y-2">
              <div className="font-semibold">Options:</div>
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-2 rounded",
                    question.answer === option
                      ? "bg-[hsl(var(--primary))] text-white"
                      : "bg-gray-200 dark:bg-gray-800"
                  )}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </div>
              ))}
              <div className="font-semibold mt-4">Explanation:</div>
              <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded">
                <MarkDownComponent text={question.explanation} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    },
    [setEditingQuestion, setIsDialogOpen]
  );

  return (
    <div className="h-full overflow-auto">
      <div className="px-4 pt-4 space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">
          English Question Bank
        </h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Select
            value={selectedType}
            onValueChange={(value) =>
              setSelectedType(value as QuestionType | "ALL")
            }
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {Object.entries(questionTypeMap).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddQuestion} className="flex items-center">
            <PlusCircle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add Question</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full h-full">
        <InfiniteScroll
          items={questions}
          loadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          renderItem={renderQuestion}
        />
      </Accordion>
      <QuestionDialog
        onQuestionSubmitted={handleQuestionSubmitted}
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingQuestion(null);
        }}
        questionToEdit={editingQuestion}
      />
      <RemoveQuestionDialog
        isOpen={!!removingQuestionId}
        onOpenChange={(open) => !open && setRemovingQuestionId(null)}
        onConfirm={() => {
          if (removingQuestionId) {
            handleQuestionRemoved(removingQuestionId);
            setRemovingQuestionId(null);
          }
        }}
      />
    </div>
  );
}
