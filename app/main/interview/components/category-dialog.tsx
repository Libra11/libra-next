/**
 * Author: Libra
 * Date: 2024-08-08 14:21:10
 * LastEditors: Libra
 * Description:
 */
"use client";
import { addCategoryApi } from "@/actions/interview/category/add-category";
import { getCategoriesApi } from "@/actions/interview/category/get-categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import LabelItem from "./label-item";
import { deleteCategoryApi } from "@/actions/interview/category/delete-category";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";

const CategoryDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [categorys, setCategorys] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const { toast } = useToast();

  const getCategorys = async () => {
    const res = await getCategoriesApi();
    if (res.code === 0) {
      setCategorys(res.data as Category[]);
    }
  };

  const addCategory = async (category: string) => {
    const res = await addCategoryApi(category);
    if (res.code === 0) {
      setCategorys([...categorys, res.data as Category]);
    } else {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: <span>{res.message}</span>,
      });
    }
  };

  const deleteCategory = async (categoryId: number) => {
    try {
      const res = await deleteCategoryApi(categoryId);
      if (res.code === 0) {
        setCategorys(
          categorys.filter((category) => category.id !== categoryId)
        );
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
    getCategorys();
  }, []);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen: boolean) => {
        setIsOpen(isOpen);
        if (!isOpen) {
          setTimeout(() => {
            document.body.style.pointerEvents = "auto";
          }, 1000);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Category</DialogTitle>
        </DialogHeader>
        <div>
          <div className="rounded-lg min-h-12 border border-[hsl(var(--primary))]  flex justify-center items-center my-2">
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="type the category which you want to add"
              className="flex-1 p-0 pl-4 min-h-10 py-1 border-none shadow-none outline-none focus-visible:ring-0"
            />
            <Button
              variant="default"
              onClick={() => addCategory(categoryName)}
              className="h-10 rounded-lg w-24 p-0 mr-1"
            >
              <PlusCircledIcon className="mr-2" width={18} height={18} /> Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mt-4">
            {categorys.map((category) => (
              <LabelItem
                key={category.id}
                name={category.name}
                onClick={() => deleteCategory(category.id)}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
