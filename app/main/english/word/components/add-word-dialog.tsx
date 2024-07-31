/**
 * Author: Libra
 * Date: 2024-07-25 16:43:28
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
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { addWordApi } from "@/actions/english/word/add-word";

const AddWordDialog = ({
  isOpen,
  setIsOpen,
  words,
  setWords,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  words: string;
  setWords: (words: string) => void;
}) => {
  const [totalWord, setTotalWord] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);

  const addWord = async (wordsStr: string) => {
    const wordList = wordsStr
      .split("\n")
      .map((word) => word.trim())
      .filter((word) => word.length > 0);
    setTotalWord(wordList.length);
    let completedWords = 0;

    for (const word of wordList) {
      const res = await addWordApi(word);
      if (res.code === 0) {
        console.log("Add word success");
      }
      completedWords++;
      setCurrentWord(completedWords);
    }

    setWords("");
    setIsOpen(false);
    setTotalWord(0);
    setCurrentWord(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Word</DialogTitle>
        </DialogHeader>
        <div>
          <Textarea
            value={words}
            onChange={(e) => setWords(e.target.value)}
            placeholder="Type your words to add, split by line break..."
          />
          <Progress value={Math.floor((currentWord / totalWord) * 100)} />
          <span>
            {currentWord}/{totalWord}
          </span>
        </div>
        <DialogFooter>
          <Button onClick={() => addWord(words)}>Add</Button>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWordDialog;
