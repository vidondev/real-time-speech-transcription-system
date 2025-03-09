// hooks/useAudioRecorder.ts
import { useState } from "react";

export const useAudioRecorder = () => {
  const [audioChunk, setAudioChunk] = useState<Blob | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [analyzerData, setAnalyzerData] = useState<{
    analyzer: AnalyserNode | null;
    bufferLength: number;
    dataArray: Uint8Array;
  } | null>(null);

  const audioAnalyzer = (mediaStream: MediaStream) => {
    // create a new AudioContext
    const audioCtx = new AudioContext();
    // create an analyzer node with a buffer size of 2048
    const analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 2048;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const source = audioCtx.createMediaStreamSource(mediaStream);
    source.connect(analyzer);

    // set the analyzerData state with the analyzer, bufferLength, and dataArray
    setAnalyzerData({ analyzer, bufferLength, dataArray });
  };

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
      audioBitsPerSecond: 16000,
    });

    audioAnalyzer(stream);

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
    analyzerData,
  };
};
