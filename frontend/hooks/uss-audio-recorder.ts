// hooks/useAudioRecorder.ts
import { useEffect, useState } from "react";

export const useAudioRecorder = () => {
  const [audioChunk, setAudioChunk] = useState<Blob | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {}, []);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
      audioBitsPerSecond: 16000,
    });

    mediaRecorder.ondataavailable = (e) => {
      setAudioChunk(e.data);
    };
    mediaRecorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start(1000);
    setRecorder(mediaRecorder);
  };

  const stopRecording = () => {
    recorder?.stop();
    setRecorder(null);
    setIsRecording(false);
    setAudioChunk(null);
  };

  return {
    recorder,
    startRecording,
    stopRecording,
    isRecording,
    audioChunk,
  };
};
