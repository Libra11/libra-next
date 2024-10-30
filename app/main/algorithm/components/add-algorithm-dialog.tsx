/**
 * Author: Libra
 * Date: 2024-10-28 14:06:39
 * LastEditors: Libra
 * Description:
 */
"use client";
import { addAlgorithmApi } from "@/actions/algorithm/add-algorithm";
import { getAlgorithmApi } from "@/actions/algorithm/get-algorithm";
import { getAlgorithmTagsApi } from "@/actions/algorithm/tag/get-tags";
import { updateAlgorithmApi } from "@/actions/algorithm/update-algorithm";
import { FormError } from "@/components/formError";
import { FormSuccess } from "@/components/formSuccess";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { AlgorithmSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlgorithmTag } from "@prisma/client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const AddAlgorithmDialog = ({
  isOpen,
  setIsOpen,
  currentAlgorithmId,
  updateAlgorithmList,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentAlgorithmId: number;
  updateAlgorithmList: () => void;
}) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [tags, setTags] = useState<AlgorithmTag[]>([]);

  const form = useForm<z.infer<typeof AlgorithmSchema>>({
    resolver: zodResolver(AlgorithmSchema),
    defaultValues: {
      name: "",
      description: "",
      approach: "",
      solution: "",
      tags: [],
      difficulty: "EASY",
    },
  });

  const onSubmit = (data: z.infer<typeof AlgorithmSchema>) => {
    const ts = data.tags;
    const tagIds = ts.map((tag: string) =>
      String(tags.find((t) => t.name === tag)?.id)
    );
    data.tags = tagIds;
    setError("");
    setSuccess("");
    startTransition(async () => {
      let res;
      if (currentAlgorithmId) {
        res = await updateAlgorithmApi(currentAlgorithmId, data);
      } else {
        res = await addAlgorithmApi(data);
      }
      if (!res) return;
      if (res.code === 0) {
        setSuccess(res.message as string);
        updateAlgorithmList();
        setIsOpen(false);
      } else {
        setError(res.message as string);
      }
      setTimeout(() => {
        document.body.style.pointerEvents = "auto";
      }, 1000);
    });
  };

  const getTags = async () => {
    const res = await getAlgorithmTagsApi();
    if (res.code === 0) {
      setTags(res.data as AlgorithmTag[]);
    }
  };

  const getAlgorithmById = useCallback(
    async (id: number) => {
      const res = await getAlgorithmApi(id);
      if (res.code === 0) {
        const data = res.data as any;
        form.setValue("name", data.name);
        form.setValue("description", data.description);
        form.setValue("approach", data.approach);
        form.setValue("solution", data.solution);
        form.setValue("difficulty", data.difficulty);
        const tags = data.tags.map((tag: any) => tag.tag.name);
        form.setValue("tags", tags);
      }
    },
    [form]
  );

  useEffect(() => {
    if (!isOpen) return;
    const loadAlgorithm = async (id: number) => {
      await getTags();
      if (id) {
        await getAlgorithmById(id);
      }
    };
    loadAlgorithm(currentAlgorithmId);
    !currentAlgorithmId && form.reset();
  }, [isOpen, currentAlgorithmId, getAlgorithmById, form]);

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
          <DialogTitle>Add Algorithm</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Algorithm name"
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
                            <MultiSelectorInput placeholder="Select tags" />
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isPending}
                          placeholder="Algorithm description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="approach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approach</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isPending}
                          placeholder="Solution approach"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="solution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solution</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isPending}
                          placeholder="Code solution"
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
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlgorithmDialog;
