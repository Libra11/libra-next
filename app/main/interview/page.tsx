/**
 * Author: Libra
 * Date: 2024-08-08 16:10:26
 * LastEditors: Libra
 * Description:
 */
"use client";
import { Button } from "@/components/ui/button";
import JavascriptIcon from "@/public/javascript.svg";
import ReactIcon from "@/public/react.svg";
import OperatorIcon from "@/public/operator.svg";
import DeleteIcon from "@/public/delete.svg";
import EditIcon from "@/public/edit.svg";
import { useCallback, useEffect, useState } from "react";
import AddQuestionDialog from "./components/add-question-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TagDialog from "./components/tag-dialog";
import CategoryDialog from "./components/category-dialog";
import { Category } from "@prisma/client";
import { getCategoriesApi } from "@/actions/interview/category/get-categories";
import { getQuestionsByCategoryApi } from "@/actions/interview/question/get-questions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MarkDownComponent } from "@/components/markdown";
import { deleteQuestionByIdApi } from "@/actions/interview/question/delete-question-by-id";

export type IInterviewQuestion = {
  category: string;
  questionText: string;
  answerContent: string;
  tags?: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isActive?: boolean;
};
export default function InterviewPage() {
  const menuData = [
    {
      title: "Javascript",
      icon: <JavascriptIcon width={20} height={20} />,
    },
    {
      title: "React",
      icon: <ReactIcon width={20} height={20} />,
    },
  ];
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );

  const getCategories = useCallback(async () => {
    const res = await getCategoriesApi();
    if (res.code === 0) {
      const categories = res.data as Category[];
      setCategories(categories);
      setCurrentCategory(categories[0].name);
      getQuestions(categories[0].id);
    }
  }, []);

  const changeCategory = (name: string, id: number) => {
    setCurrentCategory(name);
    getQuestions(id);
  };

  const getQuestions = async (id: number) => {
    const res = await getQuestionsByCategoryApi(id);
    if (res.code === 0) {
      const questions = res.data as any;
      setQuestions(questions);
      setCurrentCategory(questions[0].category.name);
    }
  };

  const deleteQuestion = async (id: number) => {
    const res = await deleteQuestionByIdApi(id);
    if (res.code === 0) {
      const question = res.data as any;
      setQuestions(questions.filter((q) => q.id !== question.id));
    }
  };

  useEffect(() => {
    getCategories();
  }, [getCategories]);
  return (
    <div className="w-full h-full flex justify-center items-center">
      <AddQuestionDialog
        isOpen={isAddQuestionDialogOpen}
        setIsOpen={setIsAddQuestionDialogOpen}
        currentQuestionId={currentQuestionId || 0}
        updateQuestionInList={getQuestions}
      />
      <TagDialog isOpen={isTagDialogOpen} setIsOpen={setIsTagDialogOpen} />
      <CategoryDialog
        isOpen={isCategoryDialogOpen}
        setIsOpen={setIsCategoryDialogOpen}
      />
      <div className="h-full mr-2 bg-[hsl(var(--background-nav))] rounded-lg w-60 flex flex-col justify-start items-center">
        <div className="w-full flex-1">
          {categories.map((item, index) => (
            <div
              className="w-full cursor-pointer my-4"
              onClick={() => changeCategory(item.name, item.id)}
              key={item.name}
            >
              <div
                className={`
                  px-4 mx-4 flex items-center transition-all h-12 rounded-lg py-2 hover:bg-[hsl(var(--accent))] cursor-pointe ${
                    currentCategory === item.name
                      ? "bg-[hsl(var(--primary))] hover:!bg-[hsl(var(--primary))] text-white"
                      : ""
                  }`}
              >
                <div className="mr-2">
                  {menuData.find((m) => m.title === item.name)?.icon}
                </div>
                {item.name}
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4 w-full px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full">
              <Button variant="secondary">
                <OperatorIcon className="mr-2" width={15} height={15} />
                Operator
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  setIsAddQuestionDialogOpen(true);
                  setCurrentQuestionId(null);
                }}
              >
                Add
                <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTagDialogOpen(true)}>
                Tag
                <DropdownMenuShortcut>⇧⌘T</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCategoryDialogOpen(true)}>
                Category
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 h-full p-4 bg-[hsl(var(--background-nav))] rounded-lg overflow-auto">
        <Accordion type="single" collapsible className="w-full">
          {questions.map((question, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <div className="flex-1 flex justify-between items-center">
                  <div className="flex-1 flex justify-start items-center">
                    <Badge
                      variant="default"
                      className={`mr-2 ${
                        question.difficulty === "EASY"
                          ? "bg-green-500"
                          : question.difficulty === "MEDIUM"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {question.difficulty}
                    </Badge>
                    <span className="font-bold">{question.questionText}</span>
                  </div>
                  <div className="flex justify-center items-center">
                    {question.tags?.map((tag: any, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="mr-2 py-1"
                      >
                        {tag.tag.name}
                      </Badge>
                    ))}
                    <Badge
                      onClick={() => {
                        setIsAddQuestionDialogOpen(true);
                        setCurrentQuestionId(question.id);
                      }}
                      variant="default"
                      className="w-[26px] h-[22px] px-0 py-0 flex justify-center items-center mr-2"
                    >
                      <EditIcon width={15} height={15} />
                    </Badge>
                    <Badge
                      variant="destructive"
                      onClick={() => deleteQuestion(question.id)}
                      className="w-[26px] h-[22px] px-0 py-0 flex justify-center items-center mr-2"
                    >
                      <DeleteIcon width={15} height={15} />
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="max-h-[800px] overflow-auto bg-[hsl(var(--background-main))] p-2">
                <MarkDownComponent text={question.answerContent} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
