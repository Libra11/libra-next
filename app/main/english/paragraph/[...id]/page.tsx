/**
 * Author: Libra
 * Date: 2024-09-05 14:34:23
 * LastEditors: Libra
 * Description:
 */
"use client";
import { useParams } from "next/navigation";
import { parseSrt } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import AudioPlayerWithLyrics, {
  Lyric,
} from "../components/audioPlayerWithLyrics";
import { getParagraphApi } from "@/actions/english/paragraph/get-paragraphs";
import { initClient } from "@/lib/aliyun-oss";
import { MarkDownComponent } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import EditParagraphDialog from "../components/edit-paragraph-dialog";

export default function ParagraphDetailPage() {
  const { id } = useParams();
  const [srt, setSrt] = useState<Lyric[]>([]);
  const [srtContent, setSrtContent] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [audioPath, setAudioPath] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const parse = (srtContent: string) => {
    const res = parseSrt(srtContent);
    setSrt(res);
  };

  const getParagraph = useCallback(async (id: number) => {
    const res = await getParagraphApi(id);
    if (res.code === 0) {
      const client = await initClient();
      const url = res.data?.audio_url || "";
      if (!url) return;
      const audioUrl = client.signatureUrl(url);
      setAudioSrc(audioUrl);
      parse(res.data?.srt_lyrics || "");
      setNote(res.data?.note || "");
      setTranslation(res.data?.translation || "");
      setTitle(res.data?.title || "");
      setDescription(res.data?.description || "");
      setSrtContent(res.data?.srt_lyrics || "");
      setAudioPath(url || "");
    }
  }, []);

  useEffect(() => {
    if (id) {
      getParagraph(Number(id));
    }
  }, [id, getParagraph]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 overflow-auto">
        <div className="w-full lg:w-[500px] flex flex-col gap-4 sm:gap-6">
          <div className="bg-card text-card-foreground rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <AudioPlayerWithLyrics audioSrc={audioSrc} srtData={srt} />
          </div>

          <div className="flex-grow bg-card text-card-foreground rounded-lg shadow-lg p-4 sm:p-6 overflow-auto border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-indigo-600 dark:text-indigo-400">
              Translation
            </h2>
            <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
              {translation}
            </div>
          </div>
        </div>

        <div className="flex-grow bg-card text-card-foreground rounded-lg shadow-lg p-4 sm:p-6 overflow-auto border border-gray-200 dark:border-gray-700 min-h-[300px] lg:min-h-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-indigo-600 dark:text-indigo-400">
            Note
          </h2>
          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
            <MarkDownComponent text={note} />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sm:p-8 rounded-lg shadow-md w-full sm:w-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-0 truncate sm:whitespace-normal w-full sm:w-auto">
            {title}
          </h1>
          <Button
            onClick={() => setIsEditDialogOpen(true)}
            className="bg-white text-indigo-600 hover:bg-indigo-100 mt-2 sm:mt-0"
          >
            Edit
          </Button>
        </div>
        <p className="text-base sm:text-lg text-indigo-100 mt-2 truncate sm:whitespace-normal w-full sm:w-auto">
          {description}
        </p>
      </div>
      <EditParagraphDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        paragraph={{
          id: Number(id),
          title,
          description,
          translation,
          note,
          audio_url: audioPath,
          srt_lyrics: srtContent,
        }}
        onUpdate={() => getParagraph(Number(id))}
      />
    </div>
  );
}
