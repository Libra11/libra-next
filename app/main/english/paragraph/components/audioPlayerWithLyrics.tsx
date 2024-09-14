/**
 * Author: Libra
 * Date: 2024-09-11 10:37:44
 * LastEditors: Libra
 * Description:
 */
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export interface Lyric {
  startTime: number;
  endTime: number;
  text: string;
}

const AudioPlayerWithLyrics = ({
  audioSrc,
  srtData,
}: {
  audioSrc: string;
  srtData: Lyric[];
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsRef = useRef<HTMLDivElement>(null); // Reference for the lyrics container
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number | null>(
    null
  ); // Track current subtitle index

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const timeUpdateHandler = () => {
      setCurrentTime(audioElement.currentTime);

      const currentSrtIndex = srtData.findIndex(
        (subtitle) =>
          subtitle.startTime <= audioElement.currentTime * 1000 &&
          subtitle.endTime >= audioElement.currentTime * 1000
      );

      setCurrentLyricIndex(currentSrtIndex >= 0 ? currentSrtIndex : null);

      // Scroll the current lyric into view
      if (lyricsRef.current && currentSrtIndex >= 0) {
        const currentLyricElement = lyricsRef.current.children[currentSrtIndex];
        if (currentLyricElement) {
          currentLyricElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    };

    const loadedMetadataHandler = () => {
      setDuration(audioElement.duration);
    };

    audioElement.addEventListener("timeupdate", timeUpdateHandler);
    audioElement.addEventListener("loadedmetadata", loadedMetadataHandler);

    return () => {
      audioElement.removeEventListener("timeupdate", timeUpdateHandler);
      audioElement.removeEventListener("loadedmetadata", loadedMetadataHandler);
    };
  }, [srtData]);

  const togglePlayPause = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    audioElement.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const skipBackward = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    audioElement.currentTime -= 5;
  };

  const skipForward = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    audioElement.currentTime += 5;
  };

  return (
    <div className="bg-card rounded-lg p-6">
      <audio ref={audioRef} src={audioSrc} />
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={skipBackward}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            onClick={togglePlayPause}
            variant="default"
            size="icon"
            className="rounded-full w-12 h-12"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
          <Button
            onClick={skipForward}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            className="flex-grow"
          />
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
      <div
        ref={lyricsRef}
        className="lyrics-container mt-6 max-h-[300px] overflow-y-auto p-4 bg-muted rounded-md"
      >
        {srtData.map((subtitle, index) => (
          <p
            key={index}
            className={`
              ${currentLyricIndex === index ? "text-primary font-semibold" : ""}
              transition-all duration-200 ease-in-out py-1
            `}
          >
            {subtitle.text}
          </p>
        ))}
      </div>
    </div>
  );
};

// 辅助函数：格式化时间
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export default AudioPlayerWithLyrics;
