import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import type { Message } from "../Chat";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${
          isUser ? "order-first" : ""
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm border ${
            isUser
              ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white border border-indigo-600"
              : "bg-white"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarFallback className="bg-gray-100">
            <User className="w-4 h-4 text-gray-600" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
