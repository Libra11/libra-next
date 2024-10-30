"use client";
import { deleteAlgorithmApi } from "@/actions/algorithm/delete-algorithm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RemoveAlgorithmDialog = ({
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
  const deleteAlgorithmById = async () => {
    const res = await deleteAlgorithmApi(currentAlgorithmId);
    if (res.code === 0) {
      updateAlgorithmList();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Algorithm</DialogTitle>
        </DialogHeader>
        <div>
          <p>Are you sure you want to delete this algorithm?</p>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              deleteAlgorithmById();
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

export default RemoveAlgorithmDialog;
