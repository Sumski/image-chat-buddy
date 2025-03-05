
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage } from "@/components/ChatMessage";
import { MessageInput } from "@/components/MessageInput";
import { fileToBase64, sendChatWithImage } from "@/lib/openai";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";

// Welcome message after the page loads
const WELCOME_MESSAGE: ChatMessageType = {
  id: uuidv4(),
  role: "assistant",
  content: "Please upload image and I will write ALT text for you",
  timestamp: Date.now(),
};

const Index = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([WELCOME_MESSAGE]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string, image: File | null) => {
    try {
      setError(null);
      setIsProcessing(true);
      
      // Create message with image preview if available
      let imageUrl: string | undefined;
      
      if (image) {
        imageUrl = URL.createObjectURL(image);
      }
      
      // Add user message to chat
      const userMessage: ChatMessageType = {
        id: uuidv4(),
        role: "user",
        content: content || (image ? "What's in this image?" : ""),
        timestamp: Date.now(),
        imageUrl,
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Convert image to base64 if it exists
      let imageBase64: string | null = null;
      if (image) {
        imageBase64 = await fileToBase64(image);
      }
      
      // Call OpenAI API through Supabase Edge Function
      const data = await sendChatWithImage(content, imageBase64);
      
      // Add AI response to chat
      const aiMessage: ChatMessageType = {
        id: uuidv4(),
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError((err as Error).message);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-3xl min-h-screen px-4 py-8 flex flex-col">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Image Chat</h1>
          <p className="text-muted-foreground">
            Upload an image and chat with AI about it
          </p>
        </header>
        
        <div className="flex-1 overflow-y-auto mb-4 py-2 px-2">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isProcessing && (
            <div className="flex justify-center my-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
                <Loader2Icon className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-4 my-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="sticky bottom-0 pt-2 pb-2 bg-background">
          {messages.length > 1 && (
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={handleReset}
              >
                <RefreshCwIcon className="h-3 w-3" />
                Reset conversation
              </Button>
            </div>
          )}
          
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isProcessing={isProcessing} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
