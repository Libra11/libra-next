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
    <div className=" w-[800px] flex flex-col justify-center items-start">
      <div className="mt-20 mb-8 font-bold text-3xl">
        {wordData?.textContent}
      </div>
      <div className="flex justify-start items-center text-sm">
        {wordData?.phoneticsArray.map((phonetic, idx) => (
          <div
            key={idx}
            className="bg-[hsl(var(--primary))] mr-2 rounded-full px-4 py-2 text-white flex justify-center items-center"
          >
            <span>{phonetic.name}</span>
            <span className=" text-slate-50 mx-2">{phonetic.value}</span>
            <div className=" cursor-pointer hover:text-slate-200">
              <VoiceIcon
                width={16}
                height={16}
                onClick={() => playAudio(phonetic.phonetic, idx)}
              />
            </div>
            <audio id={`audioPlayer_${idx}`} src="" className="hidden"></audio>
          </div>
        ))}
      </div>
      <div className=" mt-4">
        {wordData?.translationsArray.map((translation, idx) => (
          <div key={idx} className="py-2">
            <span className="font-bold mr-2">{translation.pos}</span>
            <span>{translation.trans}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordDisplay;
