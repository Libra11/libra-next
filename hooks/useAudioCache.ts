/*
 * @Author: Libra
 * @Date: 2024-07-25 16:46:06
 * @LastEditors: Libra
 * @Description:
 */
import { useState } from "react";
import { initClient } from "@/lib/aliyun-oss";
import OSS from "ali-oss";

const useAudioCache = () => {
  const [audioCache, setAudioCache] = useState<{ [key: string]: string }>({});

  const fetchAudioBlob = async (url: string, client: OSS) => {
    const audioUrl = client.signatureUrl(url);
    const response = await fetch(audioUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    return objectUrl;
  };

  const playAudio = async (url: string, idx: number) => {
    const audio = document.getElementById(
      `audioPlayer_${idx}`
    ) as HTMLAudioElement;
    if (audioCache[url] && audio) {
      audio.src = audioCache[url];
      audio.play();
      return;
    }
    const client = await initClient();
    const objectUrl = await fetchAudioBlob(url, client);
    setAudioCache((prevCache: { [key: string]: string }) => ({
      ...prevCache,
      [url]: objectUrl,
    }));
    audio.src = objectUrl;
    audio.play();
  };

  return { playAudio };
};

export default useAudioCache;
