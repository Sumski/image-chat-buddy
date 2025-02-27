
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./ImageUploader";
import { SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string, image: File | null) => void;
  isProcessing: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isProcessing 
}) => {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (trimmedMessage || selectedImage) {
      onSendMessage(trimmedMessage, selectedImage);
      setMessage("");
      setSelectedImage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <div className={cn(
        "flex items-end gap-2 p-3 rounded-lg border border-border bg-background",
        "transition-all duration-200 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50"
      )}>
        <ImageUploader 
          onImageSelect={setSelectedImage} 
          selectedImage={selectedImage}
        />
        
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedImage ? "Ask about this image..." : "Type a message..."}
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent outline-none text-foreground",
            "placeholder:text-muted-foreground min-h-[40px] max-h-[200px] py-2.5"
          )}
          disabled={isProcessing}
        />
        
        <Button 
          type="submit" 
          size="icon" 
          className="rounded-full h-10 w-10 flex-shrink-0"
          disabled={(!message.trim() && !selectedImage) || isProcessing}
        >
          <SendIcon className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
};
