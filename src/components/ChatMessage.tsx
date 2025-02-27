
import React, { useState } from "react";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const isUser = message.role === "user";
  
  return (
    <div className={cn(
      "flex w-full gap-4 mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <div className="flex items-center justify-center h-full w-full bg-primary text-primary-foreground rounded-full">
            AI
          </div>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        {message.imageUrl && (
          <div className="relative mb-2 overflow-hidden rounded-lg border border-border">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted/20 backdrop-blur-sm flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              </div>
            )}
            <img 
              src={message.imageUrl} 
              alt="Uploaded content"
              className={cn(
                "max-w-full max-h-[300px] object-contain",
                !imageLoaded && "opacity-0",
                imageLoaded && "opacity-100 transition-opacity duration-300"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}
        
        <div className={cn(
          "px-4 py-3 rounded-xl",
          isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
        )}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
        
        <span className="text-xs text-muted-foreground mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <div className="flex items-center justify-center h-full w-full bg-secondary text-secondary-foreground rounded-full">
            You
          </div>
        </Avatar>
      )}
    </div>
  );
};
