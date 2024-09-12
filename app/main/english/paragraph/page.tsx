/**
 * Author: Libra
 * Date: 2024-09-05 14:00:25
 * LastEditors: Libra
 * Description:
 */
"use client";
import { getParagraphsApi } from "@/actions/english/paragraph/get-paragraph";
import CardItem from "./components/cardItem";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddParagraphDialog from "./components/add-paragraph-dialog";
import { Paragraph } from "@prisma/client";
import { Plus } from "lucide-react";

export default function ParagraphPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [paragraphs, setParagraphs] = useState<Paragraph[] | null>([]);

  const getParagraphs = async () => {
    const res = await getParagraphsApi();
    if (res.code === 0) {
      setParagraphs(res.data);
    }
  };

  useEffect(() => {
    getParagraphs();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <AddParagraphDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Paragraphs</h1>
        <Button onClick={() => setIsOpen(true)} className=" text-white">
          <Plus className="w-5 h-5 mr-2" />
          Add Paragraph
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paragraphs &&
          paragraphs.map((paragraph) => (
            <CardItem key={paragraph.id} paragraph={paragraph} />
          ))}
      </div>
    </div>
  );
}
