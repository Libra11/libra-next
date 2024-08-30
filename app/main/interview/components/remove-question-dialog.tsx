/**
 * Author: Libra
 * Date: 2024-08-13 15:30:41
 * LastEditors: Libra
 * Description:
 */
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteQuestionByIdApi } from "@/actions/interview/question/delete-question-by-id";

const RemoveQuestionDialog = ({
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
  const deleteQuestionById = async () => {
    const res = await deleteQuestionByIdApi(currentQuestionId);
    if (res.code === 0) {
      const question = res.data as any;
      updateQuestionInList(question.categoryId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
        </DialogHeader>
        <div>
          <p>Are you sure you want to delete this question?</p>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              deleteQuestionById();
              setIsOpen(false);
            }}
          >
            Delete
          </Button>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveQuestionDialog;
