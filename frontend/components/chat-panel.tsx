"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { Message, User } from "@/services/api/user/types";
import { Service } from "@/services/api";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Recorder } from "./recorder";

const webSocket = io(process.env.NEXT_PUBLIC_API_URL, {
  autoConnect: true,
});

export function ChatPanel() {
  const [value] = useLocalStorage("user", "");
  const [currentUser, setCurrentUser] = useState<User>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);

  const [transcriptions, setTranscriptions] = useState<string[]>([]);

  webSocket.on("transcription", (text: string) => {
    console.log("transcription => ", text);
    if (text) setTranscriptions([...transcriptions, text]);
  });

  useEffect(() => {
    return () => {
      webSocket.disconnect();
    };
  }, []);

  webSocket.on("messages", (text: string) => {
    setMessages(JSON.parse(text));
  });

  const sendAudio = async (audioData: Blob) => {
    console.log("🚀 ~ sendAudio ~ audioData:", audioData);
    webSocket?.emit("audio_chunk", audioData);
  };

  const fetchAllMessage = async () => {
    const messages = await Service.user.messages();
    setMessages(messages);
  };
  useEffect(() => {
    if (!value) {
      router.replace("/");
      return;
    }
    const user = JSON.parse(value) as User;
    if (user.id) {
      setCurrentUser(user);
      fetchAllMessage();
      webSocket?.emit("user_login", value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      <div className="chat-panel">
        <div className="space-y-4 p-4">
          {messages.map(({ message, updatedAt, user }, k) => {
            return user?.id === currentUser?.id ? (
              <div
                key={`message-${k}`}
                className="flex justify-end space-x-4 items-end "
              >
                <div className="relative break-words flex max-w-lg flex-col items-end justify-end rounded-2xl bg-blue-400 p-3 text-white">
                  <div>{user?.username}</div>
                  <div>{message}</div>
                  <div className="text-end text-sm text-secondary">
                    {formatDistanceToNow(new Date(updatedAt))}
                  </div>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-blue-400 uppercase text-white">
                    {user?.username.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div
                key={`message-${k}`}
                className="flex justify-start space-x-4 items-end"
              >
                <Avatar>
                  <AvatarFallback className="bg-gray-500 uppercase text-white">
                    {user?.username.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="relative break-words  max-w-lg rounded-2xl bg-gray-500 p-3 dark:bg-dark-700 text-white">
                  <div className="font-bold">{user?.username}</div>
                  <div>{message}</div>
                  <div className="text-end text-sm text-secondary">
                    {formatDistanceToNow(new Date(updatedAt))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef}></div>
      </div>

      <div className="chat-bar bg-gray-900">
        <div className="w-full">
          <Recorder sendAudio={sendAudio} webSocket={webSocket} />
        </div>
      </div>
    </>
  );
}
