import { AppHeader } from "@/components/app-header";
import { ChatPanel } from "@/components/chat-panel";

export default function ChatPage() {
  return (
    <main className="app-container">
      <AppHeader />
      <ChatPanel />
    </main>
  );
}
