/**
 * Author: Libra
 * Date: 2024-09-25 13:54:34
 * LastEditors: Libra
 * Description:
 */
"use client";

import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaDownload,
} from "react-icons/fa";
import { MdReplay } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "@/components/ui/use-toast";

const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
const models = ["tts-1", "tts-1-hd"];

type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

export default function TTS() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<Voice>("alloy");
  const [selectedModel, setSelectedModel] = useState("tts-1");

  const user = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: <span>Only admin can use tts</span>,
      });
      return;
    }
    setIsLoading(true);

    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const mp3 = await openai.audio.speech.create({
        model: selectedModel,
        voice: selectedVoice,
        input: text,
      });

      const blob = new Blob([await mp3.arrayBuffer()], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Convert failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-[hsl(var(--background-nav))] rounded-lg flex items-center justify-center p-4 overflow-auto">
      <Card className="max-w-md w-full max-h-full overflow-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Text to Speech
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Please enter the text to be converted"
              className="min-h-[100px]"
            />
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Voice
                </label>
                <Select
                  value={selectedVoice}
                  onValueChange={(value) => setSelectedVoice(value as Voice)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice} value={voice}>
                        {voice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Model
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Converting..." : "Convert"}
            </Button>
          </form>
          {audioUrl && (
            <div className="mt-8">
              <CustomAudioPlayer
                src={audioUrl}
                title="Generated Speech"
                artist={selectedVoice}
                coverArt="/path/to/cover-art.jpg"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface CustomAudioPlayerProps {
  src: string;
  title: string;
  artist: string;
  coverArt: string;
}

function CustomAudioPlayer({ src, title, artist }: CustomAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number) => {
    const time = value;
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        duration
      );
    }
  };

  const replay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `${title}.mp3`; // 设置下载文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-[#f0e6e0] max-w-md mx-auto">
      <CardContent className="p-6">
        <audio ref={audioRef} src={src} />
        <div className="flex items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="">{artist}</p>
          </div>
        </div>
        <div className="mb-4">
          <Slider
            min={0}
            max={duration}
            value={[currentTime]}
            onValueChange={([value]) => handleSeek(value)}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(duration - currentTime)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={skipBackward}>
            <FaStepBackward size={20} />
          </Button>
          <Button
            onClick={togglePlay}
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </Button>
          <Button variant="ghost" size="icon" onClick={skipForward}>
            <FaStepForward size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={replay}>
            <MdReplay size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <FaDownload size={20} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
