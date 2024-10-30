/**
 * Author: Libra
 * Date: 2024-10-28 09:48:35
 * LastEditors: Libra
 * Description:
 */
"use client";
import { getAlgorithmsApi } from "@/actions/algorithm/get-algorithms";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import OperatorIcon from "@/public/operator.svg";
import DeleteIcon from "@/public/delete.svg";
import EditIcon from "@/public/edit.svg";
import LeetcodeIcon from "@/public/leetcode.svg";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { MarkDownComponent } from "@/components/markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AddAlgorithmDialog = dynamic(
  () => import("./components/add-algorithm-dialog")
);
const TagDialog = dynamic(() => import("./components/tag-dialog"));
const RemoveAlgorithmDialog = dynamic(
  () => import("./components/remove-algorithm-dialog")
);

interface Algorithm {
  id: number;
  name: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: Array<{ tag: { name: string } }>;
  [key: string]: any;
}

interface AlgorithmResponse {
  code: number;
  message: string;
  data?: {
    items: Algorithm[];
    total: number;
    pageSize: number;
  };
}

type AlgorithmComponent = {
  [key: string]: React.ComponentType;
};

const formatComponentName = (name: string): string => {
  // Convert "[1] two sum" to "two-sum"
  // Remove number in brackets, special characters, and convert spaces to dashes
  return name
    .toLowerCase()
    .replace(/\[\d+\]\s*/g, "") // Remove [number] and following spaces
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and dashes
    .trim()
    .replace(/\s+/g, "-"); // Convert spaces to dashes
};

const getAlgorithmComponent = (name: string) => {
  try {
    // Convert algorithm name to component path format
    const formattedName = formatComponentName(name);
    // Dynamically import the component
    return dynamic(() => import(`./algorithms/${formattedName}`));
  } catch (error) {
    console.warn(`Algorithm component not found for: ${name}`);
    return null;
  }
};

export default function AlgorithmPage() {
  const [isAddAlgorithmDialogOpen, setIsAddAlgorithmDialogOpen] =
    useState(false);
  const [isRemoveAlgorithmDialogOpen, setIsRemoveAlgorithmDialogOpen] =
    useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [currentAlgorithmId, setCurrentAlgorithmId] = useState<number | null>(
    null
  );
  const curUser = useCurrentUser();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const hasMoreRef = useRef(true);
  const [isFetching, setIsFetching] = useState(false);

  const getAlgorithms = useCallback(
    async (pageNum: number = 1) => {
      if (isFetching || !hasMoreRef.current) return;
      setIsFetching(true);
      try {
        const res = (await getAlgorithmsApi(pageNum, 20)) as AlgorithmResponse;
        if (res.code === 0 && res.data) {
          setAlgorithms((prev) => {
            const newItems =
              res.data?.items.filter(
                (item) => !prev.some((prevItem) => prevItem.id === item.id)
              ) ?? [];
            return [...prev, ...newItems];
          });
          hasMoreRef.current = res.data.total > res.data.pageSize * pageNum;
        }
      } catch (error) {
        console.error("Error fetching algorithms:", error);
      } finally {
        setIsFetching(false);
      }
    },
    [isFetching]
  );

  const loadMore = useCallback(async () => {
    if (!isFetching) {
      setIsFetching(true);
      try {
        const res = (await getAlgorithmsApi(page + 1, 20)) as AlgorithmResponse;
        if (res.code === 0 && res.data) {
          setAlgorithms((prev) => {
            const newItems =
              res.data?.items.filter(
                (item) => !prev.some((prevItem) => prevItem.id === item.id)
              ) ?? [];
            return [...prev, ...newItems];
          });
          setPage(page + 1);
          hasMoreRef.current = res.data.total > res.data.pageSize * (page + 1);
        }
      } catch (error) {
        console.error("Error fetching algorithms:", error);
      } finally {
        setIsFetching(false);
      }
    }
  }, [isFetching, page]);

  useEffect(() => {
    getAlgorithms();
  }, [getAlgorithms]);

  const renderAlgorithm = useCallback(
    (algorithm: Algorithm, index: number) => (
      <TooltipProvider key={index}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`w-full cursor-pointer rounded-sm  ${
                currentAlgorithmId === algorithm.id
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "hover:bg-[hsl(var(--accent))]"
              }`}
              onClick={() => setCurrentAlgorithmId(algorithm.id)}
            >
              <div className="px-4">
                <div className="flex items-center">
                  <span
                    className={`truncate font-medium ${
                      algorithm.difficulty === "EASY"
                        ? "text-green-500"
                        : algorithm.difficulty === "MEDIUM"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {algorithm.name}
                  </span>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{algorithm.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    [currentAlgorithmId]
  );

  const currentAlgorithm = algorithms.find(
    (algo) => algo.id === currentAlgorithmId
  );

  return (
    <div className="w-full h-full flex justify-center items-center">
      <AddAlgorithmDialog
        isOpen={isAddAlgorithmDialogOpen}
        setIsOpen={setIsAddAlgorithmDialogOpen}
        currentAlgorithmId={currentAlgorithmId || 0}
        updateAlgorithmList={() => {
          setAlgorithms([]);
          setPage(1);
          hasMoreRef.current = true;
          getAlgorithms(1);
        }}
      />
      <TagDialog isOpen={isTagDialogOpen} setIsOpen={setIsTagDialogOpen} />
      <RemoveAlgorithmDialog
        isOpen={isRemoveAlgorithmDialogOpen}
        setIsOpen={setIsRemoveAlgorithmDialogOpen}
        currentAlgorithmId={currentAlgorithmId || 0}
        updateAlgorithmList={() => {
          setAlgorithms([]);
          setPage(1);
          hasMoreRef.current = true;
          getAlgorithms(1);
        }}
      />

      <div className="h-full mr-2 bg-[hsl(var(--background-nav))] rounded-lg w-60 flex flex-col justify-start items-center max-sm:hidden overflow-hidden transition-all duration-300">
        <div className="w-full flex-1 overflow-y-auto">
          <InfiniteScroll
            items={algorithms}
            loadMore={loadMore}
            hasMore={hasMoreRef.current}
            isLoading={isFetching}
            renderItem={renderAlgorithm}
          />
        </div>
        <div className="mb-4 w-full px-2 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full">
              <Button variant="secondary" disabled={curUser?.role === "USER"}>
                <OperatorIcon className="mr-2" width={15} height={15} />
                Operator
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  setIsAddAlgorithmDialogOpen(true);
                  setCurrentAlgorithmId(null);
                }}
              >
                Add Algorithm
                <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTagDialogOpen(true)}>
                Manage Tags
                <DropdownMenuShortcut>⇧⌘T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 h-full rounded-lg overflow-hidden">
        {!currentAlgorithm ? (
          <div className="w-full h-full flex flex-col justify-center items-center text-muted-foreground space-y-4 bg-[hsl(var(--background-nav))]">
            <LeetcodeIcon width={100} height={100} />
            <div className="text-xl font-medium">
              Select an algorithm from the sidebar to view its details
            </div>
            <p className="text-sm opacity-70">
              Learn algorithms through interactive visualizations and detailed
              explanations
            </p>
          </div>
        ) : (
          <Card className="w-full h-full flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center px-4 pt-4 pb-0">
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="default"
                    className={cn(
                      currentAlgorithm.difficulty === "EASY" && "bg-green-500",
                      currentAlgorithm.difficulty === "MEDIUM" &&
                        "bg-yellow-500",
                      currentAlgorithm.difficulty === "HARD" && "bg-red-500"
                    )}
                  >
                    {currentAlgorithm.difficulty}
                  </Badge>
                  <CardTitle className="text-2xl font-bold">
                    {currentAlgorithm.name}
                  </CardTitle>
                </div>
              </div>

              {curUser?.role !== "USER" && (
                <div className="flex gap-2">
                  <CardDescription>
                    {currentAlgorithm.tags?.map(
                      (tag: any, tagIndex: number) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="mr-2"
                        >
                          {tag.tag.name}
                        </Badge>
                      )
                    )}
                  </CardDescription>
                  <Button
                    className="w-[26px] h-[22px]"
                    variant="default"
                    size="icon"
                    onClick={() => setIsAddAlgorithmDialogOpen(true)}
                  >
                    <EditIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    className="w-[26px] h-[22px]"
                    variant="destructive"
                    size="icon"
                    onClick={() => setIsRemoveAlgorithmDialogOpen(true)}
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-0 flex-1 h-0">
              <Tabs
                defaultValue="description"
                className="w-full h-full flex flex-col px-4"
              >
                <TabsList className="w-full justify-start mb-2 h-12">
                  <TabsTrigger className="h-10 w-1/4" value="description">
                    Description
                  </TabsTrigger>
                  <TabsTrigger className="h-10 w-1/4" value="approach">
                    Approach
                  </TabsTrigger>
                  <TabsTrigger className="h-10 w-1/4" value="solution">
                    Solution
                  </TabsTrigger>
                  <TabsTrigger className="h-10 w-1/4" value="animation">
                    Animation
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="flex-1 h-0 my-2">
                  <Card className="h-full">
                    <CardContent className="h-full p-4">
                      <div className="h-full overflow-y-auto">
                        <div className="prose dark:prose-invert max-w-none">
                          <MarkDownComponent
                            text={currentAlgorithm.description}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="approach" className="flex-1 h-0 my-2">
                  <Card className="h-full">
                    <CardContent className="h-full p-4">
                      <div className="h-full overflow-y-auto">
                        <div className="prose dark:prose-invert max-w-none">
                          <MarkDownComponent text={currentAlgorithm.approach} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="solution" className="flex-1 h-0 my-2">
                  <Card className="h-full">
                    <CardContent className="h-full p-4">
                      <div className="h-full overflow-y-auto">
                        <div className="prose dark:prose-invert max-w-none">
                          <MarkDownComponent text={currentAlgorithm.solution} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="animation" className="flex-1 h-0 my-2">
                  <Card className="h-full">
                    <CardContent className="h-full p-4">
                      <div className="h-full overflow-y-auto">
                        {(() => {
                          const AlgorithmComponent = getAlgorithmComponent(
                            currentAlgorithm.name
                          );
                          return AlgorithmComponent ? (
                            <AlgorithmComponent />
                          ) : (
                            <div className="flex justify-center items-center h-full text-muted-foreground">
                              No animation available for this algorithm
                            </div>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
