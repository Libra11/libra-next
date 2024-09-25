/**
 * Author: Libra
 * Date: 2024-09-25 13:54:07
 * LastEditors: Libra
 * Description: Speech to Text page
 */
"use client";

import { useState, useRef, ChangeEvent } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaMicrophone, FaStop, FaUpload } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "@/components/ui/use-toast";
import React from "react";

const models = ["whisper-1"];
const outputFormats = ["json", "text", "srt", "verbose_json", "vtt"] as const;
type OutputFormat = (typeof outputFormats)[number];

export default function STT() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("whisper-1");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("json");
  const [fileName, setFileName] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        setFileName("Recorded Audio");
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setFileName(file.name);
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: <span>Only admin can use stt</span>,
      });
      return;
    }

    setIsLoading(true);
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const formData = new FormData();
      formData.append("file", audioBlob, fileName || "audio.wav");
      formData.append("model", selectedModel);

      const response = await openai.audio.transcriptions.create({
        file: formData.get("file") as File,
        model: selectedModel,
        response_format: outputFormat,
      });

      if (outputFormat === "json" || outputFormat === "verbose_json") {
        setTranscription(JSON.stringify(response, null, 2));
      } else if (outputFormat === "srt") {
        setTranscription(response.toString());
      }
    } catch (error) {
      console.error("Transcription failed:", error);
      toast({
        variant: "destructive",
        title: "Transcription failed",
        description: <span>Please check your audio file and try again</span>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-[hsl(var(--background-nav))] rounded-lg flex items-center justify-center p-4 overflow-auto">
      <Card className="max-w-md w-full max-h-full overflow-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Speech to Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className="w-16 h-16 rounded-full"
            >
              {isRecording ? <FaStop size={24} /> : <FaMicrophone size={24} />}
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-full"
            >
              <FaUpload size={24} />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />
          </div>
          {fileName && (
            <div className="text-center text-sm">Selected file: {fileName}</div>
          )}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Model</label>
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
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Output Format
              </label>
              <Select
                value={outputFormat}
                onValueChange={(value: OutputFormat) => setOutputFormat(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {outputFormats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleTranscribe}
            className="w-full"
            disabled={!audioBlob || isLoading}
          >
            {isLoading ? "Transcribing..." : "Transcribe"}
          </Button>
          <Textarea
            value={transcription}
            readOnly
            placeholder="Transcription will appear here"
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
