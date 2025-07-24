import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/ui/ChatMessage";
import { Input } from "@/components/ui/input";
import PdfUpload from "@/components/ui/PdfUpload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserAvatar from "@/components/ui/UserAvatar";
import { LogOut, Send } from "lucide-react";
import { useState } from "react";
import FloatingOrbs from "./ui/FloatingOrbs";

export interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

const Chat = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    // { id: 1, role: "ai", content: "Hello! Upload a PDF to get started." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userEmail = localStorage.getItem("userEmail") || "user@example.com";

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    window.location.reload();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !pdfFile) return;
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          content: `You asked: "${userMessage.content}" (mock response)`,
        },
      ]);
      setIsLoading(false);
    }, 1200);
  };

  const canChat = pdfFile && !isPdfLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <FloatingOrbs />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Chat
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <UserAvatar email={userEmail} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)]">
        {/* PDF Upload Section */}
        <div className="mb-6">
          <PdfUpload
            onFileSelect={setPdfFile}
            selectedFile={pdfFile}
            isLoading={isPdfLoading}
            setIsLoading={setIsPdfLoading}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 py-1 px-2">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Ready to chat!
              </h2>
              <p className="text-gray-600">
                {pdfFile
                  ? "Ask me anything about your PDF document."
                  : "Please attach a PDF to start chatting."}
              </p>
            </div>
          )}

          {messages.map((message: Message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl px-4 py-3 max-w-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-purple-600">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-lg border p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-1">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder={
                        canChat
                          ? "Ask about your PDF..."
                          : "Please attach a PDF first"
                      }
                      disabled={!canChat}
                      className="focus-visible:ring-0 text-base h-12 disabled:opacity-50"
                    />
                  </div>
                </TooltipTrigger>
                {!canChat && (
                  <TooltipContent>
                    <p>
                      You need to attach a PDF file before you can start
                      chatting
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <Button
              type="submit"
              disabled={!canChat || !input.trim() || isLoading}
              className="h-12 aspect-square px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
