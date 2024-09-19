/**
 * Author: Libra
 * Date: 2024-09-14 10:31:38
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { getSentencesApi } from "@/actions/english/sentence/get-sentences";
import SentenceDialog from "./components/SentenceDialog";
import { Sentence } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import RemoveSentenceDialog from "./components/RemoveSentenceDialog";
import { deleteSentenceApi } from "@/actions/english/sentence/delete-sentence";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MarkDownComponent } from "@/components/markdown";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { getSentencesPaginatedApi } from "@/actions/english/sentence/get-sentences-paginated";

export default function SentencesPage() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [editingSentence, setEditingSentence] = useState<Sentence | null>(null);
  const [removingSentenceId, setRemovingSentenceId] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchSentences = async () => {
      setIsLoading(true);
      const res = await getSentencesPaginatedApi(1);
      if (res.code === 0 && res.data?.items) {
        setSentences(res.data.items);
        setPage(res.data.page);
        setHasMore(res.data.total > res.data.page * res.data.pageSize);
      }
      setIsLoading(false);
    };
    fetchSentences();
  }, []);

  const handleAddSentence = () => {
    setEditingSentence(null);
    setIsDialogOpen(true);
  };

  const handleEditSentence = useCallback((sentence: Sentence) => {
    setEditingSentence(sentence);
    setIsDialogOpen(true);
  }, []);

  const handleSentenceSubmitted = (newSentence: Sentence) => {
    setSentences((prevSentences) => {
      const index = prevSentences.findIndex((s) => s.id === newSentence.id);
      if (index !== -1) {
        const updatedSentences = [...prevSentences];
        updatedSentences[index] = newSentence;
        return updatedSentences;
      } else {
        return [newSentence, ...prevSentences];
      }
    });
    setIsDialogOpen(false);
  };

  const handleSentenceRemoved = async (sentenceId: number) => {
    const result = await deleteSentenceApi(sentenceId);
    if (result.code === 0) {
      setSentences(sentences.filter((s) => s.id !== sentenceId));
    }
  };

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    const nextPage = page + 1;
    const res = await getSentencesPaginatedApi(nextPage);
    if (res.code === 0 && res.data?.items) {
      setSentences((prevSentences) => [...prevSentences, ...res.data.items]);
      setPage(nextPage);
      setHasMore(res.data.items.length > 0);
    }
    setIsLoading(false);
  }, [hasMore, isLoading, page]);

  const renderSentence = useCallback(
    (sentence: Sentence, index: number) => (
      <AccordionItem
        key={sentence.id}
        value={`item-${index}`}
        className="w-full"
      >
        <AccordionTrigger>
          <div className="flex-1 flex justify-between items-center">
            <div className="flex-1 flex justify-start items-center">
              <span className="font-bold text-base max-sm:text-sm text-left break-words">
                {sentence.title}
              </span>
            </div>
            <div className="flex-shrink-0 flex justify-center items-center space-x-2 max-sm:hidden">
              <span
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditSentence(sentence);
                }}
              >
                <Edit className="h-5 w-5 text-[hsl(var(--primary))]" />
              </span>
              <span
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors !mr-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setRemovingSentenceId(sentence.id);
                }}
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-[hsl(var(--background-main))] p-2 text-base leading-7 max-sm:text-sm">
          <div className="space-y-2">
            <div className="font-semibold">Translation:</div>
            <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded">
              {sentence.translation}
            </div>
            <div className="font-semibold">Explanation:</div>
            <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded">
              <MarkDownComponent text={sentence.explanation} />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    ),
    [handleEditSentence, setRemovingSentenceId]
  );
  return (
    <div className="h-full overflow-auto">
      <div className="px-4 pt-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sentence Analysis</h1>
        <Button onClick={handleAddSentence} className="flex items-center">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Sentence
        </Button>
      </div>
      <Accordion type="single" collapsible className="w-full h-full">
        <InfiniteScroll
          items={sentences}
          loadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          renderItem={renderSentence}
        />
      </Accordion>
      <SentenceDialog
        onSentenceSubmitted={handleSentenceSubmitted}
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingSentence(null);
        }}
        sentenceToEdit={editingSentence}
      />
      <RemoveSentenceDialog
        isOpen={!!removingSentenceId}
        onOpenChange={(open) => !open && setRemovingSentenceId(null)}
        onConfirm={() => {
          if (removingSentenceId) {
            handleSentenceRemoved(removingSentenceId);
            setRemovingSentenceId(null);
          }
        }}
      />
    </div>
  );
}
