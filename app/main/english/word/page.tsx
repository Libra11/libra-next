/**
 * Author: Libra
 * Date: 2024-07-22 13:51:59
 * LastEditors: Libra
 * Description:
 */
"use client";
import { getWordApi } from "@/actions/english/word/get-word";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";
// import AddWordDialog from "@/app/main/english/word/components/add-word-dialog";
// import UploadAudioDialog from "@/app/main/english/word/components/upload-audio-dialog";
// import WordDisplay from "@/app/main/english/word/components/word-display";
import useAudioCache from "@/hooks/useAudioCache";
import { Word } from "@/lib/puppeteer-crawler";
import SearchIcon from "@/public/search.svg";
import WarnIcon from "@/public/warning.svg";
import Image from "next/image";
import { PlusCircledIcon } from "@radix-ui/react-icons";
// import ImportWordDialog from "./components/import-word-dialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import dynamic from "next/dynamic";

const AddWordDialog = dynamic(() => import("./components/add-word-dialog"));
const UploadAudioDialog = dynamic(
  () => import("./components/upload-audio-dialog")
);
const WordDisplay = dynamic(() => import("./components/word-display"));

const ImportWordDialog = dynamic(
  () => import("./components/import-word-dialog")
);

export default function WordPage() {
  const [word, setWord] = useState("");
  const [wordData, setWordData] = useState<Word | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [words, setWords] = useState("");
  const [isUploadAudioModalOpen, setIsUploadAudioModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isImportWordModalOpen, setIsImportWordModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const { playAudio } = useAudioCache();
  const curUser = useCurrentUser();
  const [isFirst, setIsFirst] = useState(true);

  const getWord = async (word: string) => {
    const res = await getWordApi(word);
    setIsFirst(false);
    if (res.code === 0) {
      setWordData(res.data as Word);
    } else {
      setWordData(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <AddWordDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        words={words}
        setWords={setWords}
      />
      <UploadAudioDialog
        isOpen={isUploadAudioModalOpen}
        setIsOpen={setIsUploadAudioModalOpen}
        files={files}
        setFiles={setFiles}
      />
      <ImportWordDialog
        isOpen={isImportWordModalOpen}
        setIsOpen={setIsImportWordModalOpen}
        file={importFile}
        setFile={setImportFile}
      />

      <div className=" self-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className=" rounded-full"
              disabled={curUser?.role === "USER"}
            >
              <PlusCircledIcon width={16} height={16} className="mr-2" />
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
              Add Word
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsUploadAudioModalOpen(true)}>
              Upload Audio
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsImportWordModalOpen(true)}>
              Import Word
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="h-20 flex justify-center items-center mb-4">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff40]"
          src="/Libra.svg"
          alt="Libra Logo"
          width={70}
          height={29}
          priority
        />
      </div>
      <div className="w-[800px] rounded-lg min-h-12 border border-[hsl(var(--primary))]  flex justify-center items-center my-2 max-sm:w-full">
        <Input
          placeholder="type the word you want to search"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="flex-1 p-0 pl-4 min-h-10 py-1 border-none shadow-none outline-none focus-visible:ring-0"
        />
        <Button
          variant="default"
          onClick={() => getWord(word)}
          className="h-10 rounded-lg w-24 p-0 mr-1"
        >
          <SearchIcon className="mr-2" width={18} height={18} /> Search
        </Button>
      </div>

      {wordData ? (
        <WordDisplay wordData={wordData} playAudio={playAudio} />
      ) : !isFirst ? (
        <div className="mt-20 text-white w-[800px] bg-[hsl(var(--primary))] rounded-lg px-4 py-2 flex justify-start items-center">
          <WarnIcon className="mr-2 text-red-500" width={32} height={32} />
          <div className="flex-1">No word data found</div>
        </div>
      ) : null}
    </div>
  );
}
