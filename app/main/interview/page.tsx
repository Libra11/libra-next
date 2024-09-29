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
import AlgorithmIcon from "@/public/algorithm.svg";
import BrowserIcon from "@/public/chrome.svg";
import ElectronIcon from "@/public/electron.svg";
import CSS3Icon from "@/public/css3.svg";
import GitIcon from "@/public/git.svg";
import HTML5Icon from "@/public/html5.svg";
import NodeIcon from "@/public/nodejs.svg";
import DockerIcon from "@/public/docker.svg";
import VueIcon from "@/public/vue.svg";
import OperatorIcon from "@/public/operator.svg";
import DeleteIcon from "@/public/delete.svg";
import EditIcon from "@/public/edit.svg";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Category } from "@prisma/client";
import { getCategoriesApi } from "@/actions/interview/category/get-categories";
import { getInterviewQuestionsPaginatedApi } from "@/actions/interview/question/get-questions-paginated";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/components/ui/use-toast";

import dynamic from "next/dynamic";

const AddQuestionDialog = dynamic(
  () => import("./components/add-question-dialog")
);
const TagDialog = dynamic(() => import("./components/tag-dialog"));
const CategoryDialog = dynamic(() => import("./components/category-dialog"));
const RemoveQuestionDialog = dynamic(
  () => import("./components/remove-question-dialog"),
  { ssr: false }
);
const MarkDownComponent = dynamic(() =>
  import("@/components/markdown").then((mod) => mod.MarkDownComponent)
);

const Accordion = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => mod.Accordion)
);
const AccordionContent = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => mod.AccordionContent)
);
const AccordionItem = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => mod.AccordionItem)
);
const AccordionTrigger = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => mod.AccordionTrigger)
);
const Badge = dynamic(() =>
  import("@/components/ui/badge").then((mod) => mod.Badge)
);

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

export type IInterviewQuestion = {
  category: string;
  questionText: string;
  answerContent: string;
  tags?: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isActive?: boolean;
};
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { InfiniteScroll } from "@/components/InfiniteScroll";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    {
      title: "Algorithm",
      icon: <AlgorithmIcon width={20} height={20} />,
    },
    {
      title: "Browser",
      icon: <BrowserIcon width={20} height={20} />,
    },
    {
      title: "Electron",
      icon: <ElectronIcon width={20} height={20} />,
    },
    {
      title: "CSS",
      icon: <CSS3Icon width={20} height={20} />,
    },
    {
      title: "HTML",
      icon: <HTML5Icon width={20} height={20} />,
    },
    {
      title: "Node",
      icon: <NodeIcon width={20} height={20} />,
    },
    {
      title: "Docker",
      icon: <DockerIcon width={20} height={20} />,
    },
    {
      title: "Vue",
      icon: <VueIcon width={20} height={20} />,
    },
    {
      title: "Git",
      icon: <GitIcon width={20} height={20} />,
    },
  ];
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [isRemoveQuestionDialogOpen, setIsRemoveQuestionDialogOpen] =
    useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );
  const curUser = useCurrentUser();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const hasMoreRef = useRef(true);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(
    null
  );
  const [isFetching, setIsFetching] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getQuestions = async (categoryId: number, pageNum: number = 1) => {
    if (isFetching || !hasMoreRef.current) return;
    setIsFetching(true);
    try {
      const res = await getInterviewQuestionsPaginatedApi(
        pageNum,
        20,
        categoryId
      );
      if (res.code === 0 && res.data) {
        setQuestions((prev) => {
          const newItems = res.data.items.filter(
            (item) => !prev.some((prevItem) => prevItem.id === item.id)
          );
          return [...prev, ...newItems];
        });
        hasMoreRef.current = res.data.total > res.data.pageSize * pageNum;
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const changeCategory = useCallback((name: string, id: number) => {
    setCurrentCategory(name);
    setCurrentCategoryId(id);
    setPage(1);
    hasMoreRef.current = true;
    setQuestions([]);
    getQuestions(id, 1);
  }, []);

  const getCategories = useCallback(async () => {
    const res = await getCategoriesApi();
    if (res.code === 0) {
      const categories = res.data as Category[];
      if (!categories.length) return;
      setCategories(categories);
      setCurrentCategory(categories[0].name);
      setCurrentCategoryId(categories[0].id);
      getQuestions(categories[0].id);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const loadMore = useCallback(async () => {
    if (currentCategoryId !== null && !isFetching) {
      setIsFetching(true);
      try {
        const res = await getInterviewQuestionsPaginatedApi(
          page + 1,
          20,
          currentCategoryId
        );
        if (res.code === 0 && res.data) {
          setQuestions((prev) => {
            const newItems = res.data.items.filter(
              (item) => !prev.some((prevItem) => prevItem.id === item.id)
            );
            return [...prev, ...newItems];
          });
          setPage(page + 1);
          hasMoreRef.current = res.data.total > res.data.pageSize * (page + 1);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsFetching(false);
      }
    }
  }, [currentCategoryId, isFetching, page]);

  const renderQuestion = useCallback(
    (question: any, index: number) => (
      <AccordionItem key={index} value={`item-${index}`} className="w-full">
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
              <span className="font-bold text-base max-sm:text-sm truncate max-sm:w-[250px] text-left">
                {question.questionText}
              </span>
            </div>
            <div className="flex justify-center items-center max-sm:hidden">
              {question.tags?.map((tag: any, index: number) => (
                <Badge key={index} variant="secondary" className="mr-2 py-1">
                  {tag.tag.name}
                </Badge>
              ))}
              <Badge
                onClick={(e) => {
                  e.stopPropagation();
                  if (curUser?.role === "USER") {
                    toast({
                      variant: "destructive",
                      title: "Oops!",
                      description: (
                        <span>Only operator can edit the question</span>
                      ),
                    });
                    return;
                  }
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
                onClick={(e) => {
                  e.stopPropagation();
                  if (curUser?.role === "USER") {
                    toast({
                      variant: "destructive",
                      title: "Oops!",
                      description: (
                        <span>Only operator can delete the question</span>
                      ),
                    });
                    return;
                  }
                  setCurrentQuestionId(question.id);
                  setIsRemoveQuestionDialogOpen(true);
                }}
                className="w-[26px] h-[22px] px-0 py-0 flex justify-center items-center mr-2"
              >
                <DeleteIcon width={15} height={15} />
              </Badge>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="max-h-[800px] overflow-auto bg-[hsl(var(--background-main))] p-2 text-base leading-7 max-sm:text-sm">
          <MarkDownComponent text={question.answerContent} />
        </AccordionContent>
      </AccordionItem>
    ),
    [
      curUser?.role,
      setIsAddQuestionDialogOpen,
      setCurrentQuestionId,
      setIsRemoveQuestionDialogOpen,
      toast,
    ]
  );

  return (
    <TooltipProvider>
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
        <RemoveQuestionDialog
          isOpen={isRemoveQuestionDialogOpen}
          setIsOpen={setIsRemoveQuestionDialogOpen}
          currentQuestionId={currentQuestionId || 0}
          updateQuestionInList={getQuestions}
        />
        <div
          className={`h-full mr-2 bg-[hsl(var(--background-nav))] rounded-lg ${
            isCollapsed ? "w-20" : "w-60"
          } flex flex-col justify-start items-center max-sm:hidden overflow-hidden transition-all duration-300`}
        >
          <div className="w-full flex-1 overflow-y-auto">
            {categories.map((item, index) => (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <div
                    className="w-full cursor-pointer my-4"
                    onClick={() => changeCategory(item.name, item.id)}
                  >
                    <div
                      className={`
                        ${
                          isCollapsed
                            ? "justify-center w-12 mx-auto"
                            : "px-4 mx-4"
                        } 
                        flex items-center transition-all h-12 rounded-lg py-2 hover:bg-[hsl(var(--accent))] cursor-pointer ${
                          currentCategory === item.name
                            ? "bg-[hsl(var(--primary))] hover:!bg-[hsl(var(--primary))] text-white"
                            : ""
                        }`}
                    >
                      <div className={isCollapsed ? "" : "mr-2"}>
                        {menuData.find((m) => m.title === item.name)?.icon}
                      </div>
                      {!isCollapsed && item.name}
                    </div>
                  </div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
          <div className="mb-4 w-full px-2 flex-shrink-0">
            <Button
              variant="secondary"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full mb-2"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="mx-auto" />
              ) : (
                <>
                  <ChevronLeftIcon className="mr-2" />
                  Collapse
                </>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full">
                <Button variant="secondary" disabled={curUser?.role === "USER"}>
                  <OperatorIcon className="mr-2" width={15} height={15} />
                  {isCollapsed ? "" : "Operator"}
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
        <div className="flex-1 h-full bg-[hsl(var(--background-nav))] w-0 rounded-lg max-sm:flex max-sm:flex-col">
          <div className="w-full sm:hidden my-4 px-4">
            <Select
              defaultValue={categories[0]?.id.toString()}
              onValueChange={(value) => {
                const category = categories.find(
                  (c) => c.id.toString() === value
                );
                if (category) {
                  changeCategory(category.name, category.id);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    <div className="flex items-center">
                      <div className="mr-2">
                        {menuData.find((m) => m.title === item.name)?.icon}
                      </div>
                      {item.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full sm:h-full max-sm:flex-1 max-sm:overflow-auto"
          >
            <InfiniteScroll
              items={questions}
              loadMore={loadMore}
              hasMore={hasMoreRef.current}
              isLoading={isFetching}
              renderItem={renderQuestion}
            />
          </Accordion>
        </div>
      </div>
    </TooltipProvider>
  );
}
