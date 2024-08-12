/**
 * Author: Libra
 * Date: 2024-08-08 10:45:53
 * LastEditors: Libra
 * Description:
 */
"use client";
import { addTagApi } from "@/actions/interview/tag/add-tag";
import { getTagsApi } from "@/actions/interview/tag/get-tags";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tag } from "@prisma/client";
import { useEffect, useState } from "react";
import LabelItem from "./label-item";
import { deleteTagApi } from "@/actions/interview/tag/delete-tag";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";

const TagDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagName, setTagName] = useState("");
  const { toast } = useToast();

  const getTags = async () => {
    const res = await getTagsApi();
    if (res.code === 0) {
      setTags(res.data as Tag[]);
    }
  };

  const addTag = async (tag: string) => {
    const res = await addTagApi(tag);
    if (res.code === 0) {
      setTags([...tags, res.data as Tag]);
    } else {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: <span>{res.message}</span>,
      });
    }
  };

  const deleteTag = async (tagId: number) => {
    try {
      const res = await deleteTagApi(tagId);
      if (res.code === 0) {
        setTags(tags.filter((tag) => tag.id !== tagId));
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: <span>{error.message}</span>,
      });
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tag</DialogTitle>
        </DialogHeader>
        <div>
          <div className="rounded-lg min-h-12 border border-[hsl(var(--primary))]  flex justify-center items-center my-2">
            <Input
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="type the tag which you want to add"
              className="flex-1 p-0 pl-4 min-h-10 py-1 border-none shadow-none outline-none focus-visible:ring-0"
            />
            <Button
              variant="default"
              onClick={() => addTag(tagName)}
              className="h-10 rounded-lg w-24 p-0 mr-1"
            >
              <PlusCircledIcon className="mr-2" width={18} height={18} /> Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mt-4">
            {tags.map((tag) => (
              <LabelItem
                key={tag.id}
                name={tag.name}
                onClick={() => deleteTag(tag.id)}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TagDialog;
