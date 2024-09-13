/**
 * Author: Libra
 * Date: 2024-07-25 16:44:59
 * LastEditors: Libra
 * Description:
 */
import { Word } from "@/lib/puppeteer-crawler";
import VoiceIcon from "@/public/voice.svg";

const WordDisplay = ({
  wordData,
  playAudio,
}: {
  wordData: Word;
  playAudio: any;
}) => {
  return (
    <div className="w-full max-w-[800px] mx-auto py-8">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        {wordData?.textContent}
      </h1>
      <div className="flex flex-wrap gap-3 mb-8">
        {wordData?.phoneticsArray.map((phonetic, idx) => (
          <div
            key={idx}
            className="bg-[hsl(var(--primary))] rounded-full px-4 py-2 text-white flex items-center space-x-2 text-sm sm:text-base"
          >
            <span className="font-semibold">{phonetic.name}</span>
            <span>{phonetic.value}</span>
            <button
              onClick={() => playAudio(phonetic.phonetic, idx)}
              className="hover:text-indigo-200 transition-colors"
            >
              <VoiceIcon width={16} height={16} />
            </button>
            <audio id={`audioPlayer_${idx}`} src="" className="hidden"></audio>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {wordData?.translationsArray.map((translation, idx) => (
          <div
            key={idx}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
          >
            <span className="font-bold text-[hsl(var(--primary))] mr-2">
              {translation.pos}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {translation.trans}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordDisplay;
