/**
 * Author: Libra
 * Date: 2024-09-13 14:24:39
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useEffect, useState } from "react";
import { getQuestionsApi } from "@/actions/english/question/get-questions";
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

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await getQuestionsApi();
      if (res.code === 0) {
        setQuestions(res.data!);
      }
    };
    fetchQuestions();
  }, []);

  const filteredQuestions =
    selectedType === "ALL"
      ? questions
      : questions.filter((q) => q.type === selectedType);

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsDialogOpen(true);
  };

  const handleEditQuestion = (question: EnglishQuestion) => {
    setEditingQuestion(question);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">English Question Bank</h1>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedType}
            onValueChange={(value) =>
              setSelectedType(value as QuestionType | "ALL")
            }
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select question type" />
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
            Add Question
          </Button>
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {filteredQuestions.map((question, index) => (
          <AccordionItem key={question.id} value={`item-${index}`}>
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
        ))}
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
