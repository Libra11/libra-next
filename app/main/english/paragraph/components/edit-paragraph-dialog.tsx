/**
 * Author: Libra
 * Date: 2024-09-12 10:49:29
 * LastEditors: Libra
 * Description:
 */
import { useState, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateParagraphApi } from "@/actions/english/paragraph/update-paragraph";
import { ParagraphSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/formError";
import { FormSuccess } from "@/components/formSuccess";
import { Paragraph } from "@prisma/client";

type ParagraphFormData = Omit<Paragraph, "created_at" | "updated_at">;

interface EditParagraphDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  paragraph: ParagraphFormData;
  onUpdate: () => void;
}

const EditParagraphDialog = ({
  isOpen,
  setIsOpen,
  paragraph,
  onUpdate,
}: EditParagraphDialogProps) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ParagraphSchema>>({
    resolver: zodResolver(ParagraphSchema),
    defaultValues: {
      title: paragraph.title,
      description: paragraph.description ?? "",
      audio_url: paragraph.audio_url,
      srt_lyrics: paragraph.srt_lyrics,
      translation: paragraph.translation ?? "",
      note: paragraph.note ?? "",
    },
  });

  // 当 paragraph 属性变化时更新表单值
  useEffect(() => {
    form.reset({
      ...paragraph,
      description: paragraph.description ?? "",
      translation: paragraph.translation ?? "",
      note: paragraph.note ?? "",
    });
  }, [form, paragraph]);

  const onSubmit = async (data: z.infer<typeof ParagraphSchema>) => {
    startTransition(async () => {
      setError("");
      setSuccess("");
      try {
        const res = await updateParagraphApi({
          ...paragraph,
          ...data,
          updated_at: new Date(),
        });
        console.log("API response:", res);
        if (res.code === 0) {
          setSuccess("Update paragraph success");
          onUpdate();
          setTimeout(() => {
            setIsOpen(false);
          }, 1000);
        } else {
          setError(res.message || "Update failed");
        }
      } catch (error) {
        console.error("Error updating paragraph:", error);
        setError("Update paragraph failed");
      }
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen: boolean) => {
        setIsOpen(isOpen);
        setError("");
        setSuccess("");
        if (!isOpen) {
          form.reset();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Paragraph</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="Type the title of the paragraph"
                      />
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
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="Type the description of the paragraph"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="srt_lyrics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SRT Lyrics</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
                        {...field}
                        placeholder="Type the srt lyrics of the paragraph"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="translation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Translation</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
                        {...field}
                        placeholder="Type the translation of the paragraph"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
                        {...field}
                        placeholder="Type the note of the paragraph"
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
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditParagraphDialog;
