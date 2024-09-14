/**
 * Author: Libra
 * Date: 2024-09-13 17:48:02
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addQuestionApi } from "@/actions/english/question/add-question";
import { updateQuestionApi } from "@/actions/english/question/update-question";
import { QuestionFormData, EnglishQuestion } from "@/types/question";
import { QuestionType } from "@prisma/client";
import { PlusCircle, MinusCircle } from "lucide-react";

interface Props {
  onQuestionSubmitted: (question: EnglishQuestion) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  questionToEdit: EnglishQuestion | null;
}

export default function QuestionDialog({
  questionToEdit,
  onQuestionSubmitted,
  isOpen,
  onOpenChange,
}: Props) {
  const [formData, setFormData] = useState<QuestionFormData>({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    explanation: "",
    type: QuestionType.SINGLE_CHOICE,
  });

  useEffect(() => {
    if (questionToEdit) {
      setFormData({
        question: questionToEdit.question,
        options: questionToEdit.options,
        answer: questionToEdit.answer,
        explanation: questionToEdit.explanation,
        type: questionToEdit.type,
      });
    } else {
      setFormData({
        question: "",
        options: ["", "", "", ""],
        answer: "",
        explanation: "",
        type: QuestionType.SINGLE_CHOICE,
      });
    }
  }, [questionToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let result;
    if (questionToEdit) {
      result = await updateQuestionApi(questionToEdit.id, formData);
    } else {
      result = await addQuestionApi(formData);
    }
    if (result.code === 0 && result.data) {
      onQuestionSubmitted(result.data);
      onOpenChange(false);
    }
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {questionToEdit ? "Edit Question" : "Add New Question"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Question Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as QuestionType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={QuestionType.SINGLE_CHOICE}>
                  Single Choice
                </SelectItem>
                <SelectItem value={QuestionType.MULTIPLE_CHOICE}>
                  Multiple Choice
                </SelectItem>
                <SelectItem value={QuestionType.TRUE_FALSE}>
                  True/False
                </SelectItem>
                <SelectItem value={QuestionType.FILL_IN_THE_BLANK}>
                  Fill in the Blank
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
            />
          </div>
          {formData.type === QuestionType.SINGLE_CHOICE && (
            <>
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[index] = e.target.value;
                      setFormData({ ...formData, options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="answer">Correct Answer</Label>
            <Input
              id="answer"
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
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
            {questionToEdit ? "Update Question" : "Add Question"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
