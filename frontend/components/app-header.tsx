"use client";
import { User } from "@/services/api/user/types";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

export function AppHeader() {
  const [value, , removeValue] = useLocalStorage("user", "");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!value) return;
    setCurrentUser(JSON.parse(value));
  }, [value]);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-b-gray-300 px-4">
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarFallback className="bg-blue-400 uppercase text-white">
            {currentUser?.username.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h6>{currentUser?.username}</h6>
          <span className="text-sm text-muted-foreground">
            {currentUser?.email}
          </span>
        </div>
      </div>
      <Button
        onClick={() => {
          removeValue();
        }}
      >
        Logout
      </Button>
    </header>
  );
}
