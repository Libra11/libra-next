/**
 * Author: Libra
 * Date: 2024-09-14 10:31:47
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sentence } from "@prisma/client";
import { updateSentenceApi } from "@/actions/english/sentence/update-sentence";
import { addSentenceApi } from "@/actions/english/sentence/add-sentence";

interface Props {
  onSentenceSubmitted: (sentence: Sentence) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sentenceToEdit: Sentence | null;
}

export default function SentenceDialog({
  sentenceToEdit,
  onSentenceSubmitted,
  isOpen,
  onOpenChange,
}: Props) {
  const [formData, setFormData] = useState<
    Omit<Sentence, "id" | "createdAt" | "updatedAt">
  >({
    title: "",
    translation: "",
    explanation: "",
  });

  useEffect(() => {
    if (sentenceToEdit) {
      setFormData({
        title: sentenceToEdit.title,
        translation: sentenceToEdit.translation,
        explanation: sentenceToEdit.explanation,
      });
    } else {
      setFormData({
        title: "",
        translation: "",
        explanation: "",
      });
    }
  }, [sentenceToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let result;
    if (sentenceToEdit) {
      result = await updateSentenceApi(sentenceToEdit.id, formData);
    } else {
      result = await addSentenceApi(formData);
    }
    if (result.code === 0 && result.data) {
      onSentenceSubmitted(result.data);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {sentenceToEdit ? "Edit Sentence" : "Add New Sentence"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Sentence</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="translation">Translation</Label>
            <Input
              id="translation"
              value={formData.translation}
              onChange={(e) =>
                setFormData({ ...formData, translation: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation</Label>
            <Textarea
              id="explanation"
              value={formData.explanation}
              onChange={(e) =>
                setFormData({ ...formData, explanation: e.target.value })
              }
            />
          </div>
          <Button type="submit" className="w-full">
            {sentenceToEdit ? "Update Sentence" : "Add Sentence"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
