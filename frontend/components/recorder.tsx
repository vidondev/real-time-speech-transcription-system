"use client";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

import { useAudioRecorder } from "@/hooks/uss-audio-recorder";
import { Button } from "./ui/button";

import { CircleStop, Mic } from "lucide-react";
import WaveForm from "./wave-form/wave-form";

interface RecorderProps {
  sendAudio: (audioData: Blob) => void;
  webSocket: Socket;
}

export function Recorder({ sendAudio, webSocket }: RecorderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    startRecording,
    stopRecording,
    isRecording,
    audioChunk,
    analyzerData,
  } = useAudioRecorder();
  console.log("🚀 ~ Recorder ~ analyzerData:", analyzerData);

  useEffect(() => {
    if (!audioChunk) return;
    sendAudio(audioChunk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioChunk]);

  useEffect(() => {
    webSocket.emit(isRecording ? "start_taking" : "stop_taking");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  if (!isMounted) return;

  return (
    <>
      <div className="flex items-center justify-center py-4 w-f">
        <Button
          className="cursor-pointer w-48"
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "default"}
        >
          {isRecording ? (
            <div className="relation">
              <CircleStop className="absolute  h-full w-full animate-ping" />
              <CircleStop className="relative " />
            </div>
          ) : (
            <Mic className="" />
          )}
          {analyzerData && isRecording && (
            <WaveForm analyzerData={analyzerData} />
          )}
        </Button>
      </div>
    </>
  );
}
