/**
 * Author: Libra
 * Date: 2024-09-11 11:21:58
 * LastEditors: Libra
 * Description:
 */

import { addParagraphApi } from "@/actions/english/paragraph/add-paragraph";
import { FormError } from "@/components/formError";
import { FormSuccess } from "@/components/formSuccess";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { uploadToOss } from "@/lib/aliyun-oss";
import { ParagraphSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paragraph } from "@prisma/client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export type ParagraphFormData = Omit<Paragraph, "id" | "created_at">;

const AddParagraphDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof ParagraphSchema>>({
    resolver: zodResolver(ParagraphSchema),
    defaultValues: {
      title: "",
      description: "",
      audio_url: "",
      srt_lyrics: "",
      translation: "",
      note: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ParagraphSchema>) => {
    startTransition(async () => {
      setError("");
      setSuccess("");
      try {
        const paragraphData: ParagraphFormData = {
          title: data.title,
          description: data.description,
          audio_url: data.audio_url ?? null,
          srt_lyrics: data.srt_lyrics,
          translation: data.translation,
          note: data.note,
          updated_at: new Date(),
        };
        const res = await addParagraphApi(paragraphData);
        console.log(res, data);
        if (res.code === 0) {
          setSuccess("Add paragraph success");
          form.reset();
          setTimeout(() => {
            setIsOpen(false);
          }, 1000);
        } else {
          setError(res.message);
        }
      } catch (error) {
        setError("Add paragraph failed");
      }
    });
  };

  const uploadAudio = async () => {
    try {
      const res = await uploadToOss("paragraph", audioFile as File);
      form.setValue("audio_url", res.name);
    } catch (error) {
      console.log(error);
    }
  };

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
      <DialogContent className="max-sm:w-11/12 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Paragraph</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-start items-center gap-2">
            <Input
              id="paragraph"
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  setAudioFile(files[0]);
                }
              }}
              className="w-full sm:w-auto"
            />
            <Button
              variant="default"
              onClick={uploadAudio}
              className="w-full sm:w-auto"
            >
              Upload
            </Button>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
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
                          placeholder="Type the srt lyrics of the paragraph"
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
                Confirm
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddParagraphDialog;
