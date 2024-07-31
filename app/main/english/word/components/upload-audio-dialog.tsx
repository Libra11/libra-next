/**
 * Author: Libra
 * Date: 2024-07-25 16:44:50
 * LastEditors: Libra
 * Description:
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { uploadToOss } from "@/lib/aliyun-oss";

const UploadAudioDialog = ({
  isOpen,
  setIsOpen,
  files,
  setFiles,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  files: File[];
  setFiles: (files: File[]) => void;
}) => {
  const [totalAudio, setTotalAudio] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(0);

  const uploadAudio = async (fileList: File[]) => {
    setTotalAudio(fileList.length);
    for (const file of fileList) {
      await uploadToOss("word", file);
      setCurrentAudio((prev) => prev + 1);
    }
    setFiles([]);
    setIsOpen(false);
    setTotalAudio(0);
    setCurrentAudio(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Audio</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            id="word"
            type="file"
            multiple
            accept="audio/*"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                setFiles(Array.from(files));
              }
            }}
          />
          <Progress value={Math.floor((currentAudio / totalAudio) * 100)} />
          <span>
            {currentAudio}/{totalAudio}
          </span>
        </div>
        <DialogFooter>
          <Button onClick={() => uploadAudio(files)}>Add</Button>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadAudioDialog;
