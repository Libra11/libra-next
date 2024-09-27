/**
 * Author: Libra
 * Date: 2024-08-07 15:26:01
 * LastEditors: Libra
 * Description:
 */
"use client";
import { getCategoriesApi } from "@/actions/interview/category/get-categories";
import { addQuestionApi } from "@/actions/interview/question/add-question";
import { getQuestionByIdApi } from "@/actions/interview/question/get-question-by-id";
import { updateQuestionByIdApi } from "@/actions/interview/question/update-question-by-id";
import { getTagsApi } from "@/actions/interview/tag/get-tags";
import { FormError } from "@/components/formError";
import { FormSuccess } from "@/components/formSuccess";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InterviewQuestionSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Tag } from "@prisma/client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const AddQuestionDialog = ({
  isOpen,
  setIsOpen,
  currentQuestionId,
  updateQuestionInList,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentQuestionId: number;
  updateQuestionInList: (id: number) => void;
}) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const form = useForm<z.infer<typeof InterviewQuestionSchema>>({
    resolver: zodResolver(InterviewQuestionSchema),
    defaultValues: {
      category: "",
      questionText: "",
      answerContent: "",
      tags: [],
      difficulty: "EASY",
    },
  });

  const onSubmit = (data: z.infer<typeof InterviewQuestionSchema>) => {
    // tags as ts
    const ts = data.tags;
    // get tags id
    const tagIds = ts.map((tag: string) =>
      String(tags.find((t) => t.name === tag)?.id)
    );
    data.tags = tagIds;
    setError("");
    setSuccess("");
    startTransition(async () => {
      if (currentQuestionId) {
        data.isActive = true;
        const res = await updateQuestionByIdApi(currentQuestionId, data);
        if (!res) return;
        if (res.code === 0) {
          setSuccess(res.message as string);
        } else {
          setError(res.message as string);
        }
      } else {
        const res = await addQuestionApi(data);
        if (!res) return;
        if (res.code === 0) {
          setSuccess(res.message as string);
        } else {
          setError(res.message as string);
        }
      }
      setIsOpen(false);
      updateQuestionInList(Number(data.category));
      setSuccess("");
      setError("");
      setTimeout(() => {
        document.body.style.pointerEvents = "auto";
      }, 1000);
    });
  };

  const getTags = async () => {
    const res = await getTagsApi();
    if (res.code === 0) {
      setTags(res.data as Tag[]);
    }
  };

  const getCategories = async () => {
    const res = await getCategoriesApi();
    if (res.code === 0) {
      setCategories(res.data as Category[]);
    }
  };

  const getQuestionById = useCallback(
    async (id: number) => {
      const res = await getQuestionByIdApi(id);
      if (res.code === 0) {
        const data = res.data as any;
        form.setValue("questionText", data.questionText);
        form.setValue("answerContent", data.answerContent);
        form.setValue("category", String(data.category.id));
        form.setValue("difficulty", data.difficulty);
        const tags = data.tags.map((tag: any) => tag.tag.name);
        form.setValue("tags", tags);
      }
    },
    [form]
  );

  useEffect(() => {
    if (!isOpen) return;
    const loadQuestion = async (id: number) => {
      await getTags();
      await getCategories();
      if (id) {
        await getQuestionById(id);
      }
    };
    loadQuestion(currentQuestionId);
    !currentQuestionId && form.reset();
  }, [isOpen, currentQuestionId, getQuestionById, form]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen: boolean) => {
        setIsOpen(isOpen);
        setError("");
        setSuccess("");
        if (!isOpen) {
          setTimeout(() => {
            document.body.style.pointerEvents = "auto";
          }, 1000);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="questionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Type the content of the question..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <FormControl>
                        <Select
                          name={field.name}
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue
                              placeholder="Select difficulty"
                              onBlur={field.onBlur}
                              ref={field.ref}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EASY">Easy</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HARD">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          name={field.name}
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue
                              placeholder="Select category"
                              onBlur={field.onBlur}
                              ref={field.ref}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={String(category.id)}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <MultiSelector
                          values={field.value}
                          onValuesChange={field.onChange}
                          loop
                          className="max-w-xs"
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Select your tags" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {tags.map((tag) => (
                                <MultiSelectorItem
                                  key={tag.id}
                                  value={tag.name}
                                >
                                  {tag.name}
                                </MultiSelectorItem>
                              ))}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="answerContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isPending}
                          {...field}
                          placeholder="Type the content of the question..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit" className="w-full">
                Confirm
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionDialog;
