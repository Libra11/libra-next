/**
 * Author: Libra
 * Date: 2024-07-31 13:04:46
 * LastEditors: Libra
 * Description:
 */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addWordByFileApi } from "@/actions/english/word/add-word-by-file";

const ImportWordDialog = ({
  isOpen,
  setIsOpen,
  file,
  setFile,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  file: File | null;
  setFile: (files: File | null) => void;
}) => {
  const uploadWords = async (file: File | null) => {
    // read file content
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (e) => {
      const content = e.target?.result;
      if (content) {
        const words = JSON.parse(content as string);
        await addWordByFileApi(words);
        setIsOpen(false);
        setFile(null);
      }
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload English Words By JSON</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            id="word"
            type="file"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                setFile(Array.from(files)[0]);
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => uploadWords(file)}>Add</Button>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportWordDialog;
