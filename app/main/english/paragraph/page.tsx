/**
 * Author: Libra
 * Date: 2024-09-05 14:00:25
 * LastEditors: Libra
 * Description:
 */
"use client";
import { getParagraphsPaginatedApi } from "@/actions/english/paragraph/get-paragraphs-paginated";
import CardItem from "./components/cardItem";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddParagraphDialog from "./components/add-paragraph-dialog";
import { Paragraph } from "@prisma/client";
import { Divide, Plus } from "lucide-react";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ParagraphPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const curUser = useCurrentUser();

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    const nextPage = page + 1;
    const res = await getParagraphsPaginatedApi(nextPage);
    if (res.code === 0 && res.data) {
      setParagraphs((prevParagraphs) => [...prevParagraphs, ...res.data.items]);
      setPage(nextPage);
      setHasMore(res.data.total > res.data.page * res.data.pageSize);
    }
    setIsLoading(false);
  }, [hasMore, isLoading, page]);

  const getParagraphs = useCallback(async () => {
    setIsLoading(true);
    const res = await getParagraphsPaginatedApi(page);
    if (res.code === 0 && res.data) {
      setParagraphs(res.data.items);
      setHasMore(res.data.total > res.data.page * res.data.pageSize);
    }
    setIsLoading(false);
  }, [page]);

  useEffect(() => {
    getParagraphs();
  }, [getParagraphs]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col h-full">
      <AddParagraphDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate mr-4">
          Paragraph
        </h1>
        <Button
          disabled={curUser?.role === "USER"}
          onClick={() => setIsOpen(true)}
          className="bg-[hsl(var(--primary))] text-white shrink-0"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Add Paragraph</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
      <div className="overflow-auto h-full">
        <InfiniteScroll
          items={paragraphs}
          loadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          className="flex flex-wrap gap-3 justify-center items-center"
          renderItem={(paragraph) => (
            <CardItem key={paragraph.id} paragraph={paragraph} />
          )}
        />
      </div>
    </div>
  );
}
