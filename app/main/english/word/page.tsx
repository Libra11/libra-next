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
import useAudioCache from "@/hooks/useAudioCache";
import { Word } from "@/lib/puppeteer-crawler";
import SearchIcon from "@/public/search.svg";
import WarnIcon from "@/public/warning.svg";
import Image from "next/image";
import { PlusCircledIcon } from "@radix-ui/react-icons";
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
    const trimmedWord = word.trim();
    if (!trimmedWord) return;

    const res = await getWordApi(trimmedWord.toLowerCase());
    setIsFirst(false);
    if (res.code === 0) {
      setWordData(res.data as Word);
    } else {
      setWordData(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-4 sm:px-6 lg:px-8 py-4">
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

      <div className="self-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="rounded-full"
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
      <div className="w-full max-w-[800px] mx-auto mt-8">
        <div className="relative">
          <Input
            placeholder="Type the word you want to search"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getWord(word);
              }
            }}
            className="w-full pl-4 pr-12 py-2 rounded-lg focus:border-transparent h-11 border-[hsl(var(--primary))]"
          />
          <Button
            variant="default"
            onClick={() => getWord(word)}
            className="absolute right-1 top-1 bottom-1 rounded-lg px-4"
          >
            <SearchIcon className="mr-2" width={18} height={18} /> Search
          </Button>
        </div>
      </div>

      {wordData ? (
        <WordDisplay wordData={wordData} playAudio={playAudio} />
      ) : !isFirst ? (
        <div className="w-full max-w-[800px] mx-auto mt-8 p-4 sm:p-6 bg-red-100 dark:bg-red-900 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <WarnIcon className="text-red-500 w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0" />
            <div>
              <p className="text-xl text-center sm:text-left sm:text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
                Word Not Found
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base text-center sm:text-left">
                Sorry, we couldn&apos;t find any data for the word &quot;{word}
                &quot;. Please check your spelling or try another word.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
