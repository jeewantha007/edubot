import React from 'react';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
import { User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  rating?: number;
}

interface MessageBubbleProps {
  message: Message;
  onRate?: (messageId: string, rating: number) => void;
}

// Simple response formatter utility
const formatBotResponse = (text: string): string => {
  // If already formatted with markdown, return as is
  if (text.includes('##') || text.includes('**') || text.includes('- ')) {
    return text;
  }

  // For simple greetings and short responses, return as is
  const simpleGreetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'thanks', 'thank you', 'bye', 'goodbye'];
  const textLower = text.toLowerCase().trim();
  
  if (textLower.length < 50 || simpleGreetings.some(greeting => textLower.includes(greeting))) {
    return text;
  }

  // Only format longer, educational content (over 150 characters and multiple sentences)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (text.length < 150 || sentences.length < 3) {
    return text;
  }

  // For educational content, add simple structure
  return text;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onRate 
}) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {/* Avatar */}
      {isBot ? (
        <div className="flex flex-col items-center mr-3 select-none">
          <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-xl">
            <span>🤖</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center ml-3 select-none">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      )}
      {/* Bubble */}
      <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`p-4 rounded-xl border shadow-sm ${isBot
            ? 'bg-white border-primary/20 text-foreground font-mono'
            : 'bg-primary text-primary-foreground border-primary/40'}
          `}
        >
          {isBot ? (
            <div className="prose prose-sm max-w-none font-mono">
              <ReactMarkdown>{formatBotResponse(message.text)}</ReactMarkdown>
            </div>
          ) : (
            <span className="text-sm leading-relaxed">{message.text}</span>
          )}
        </div>
        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {/* Feedback for bot */}
        {isBot && onRate && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 p-1 hover:bg-success-light"
              onClick={() => onRate(message.id, 1)}
            >
              <ThumbsUp className="w-4 h-4 text-success" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 p-1 hover:bg-warning-light"
              onClick={() => onRate(message.id, -1)}
            >
              <ThumbsDown className="w-4 h-4 text-warning" />
            </Button>
            <div className="flex items-center ml-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-accent-light"
                  onClick={() => onRate(message.id, star)}
                >
                  <Star 
                    className={`w-3 h-3 ${
                      message.rating && star <= message.rating 
                        ? 'text-accent fill-accent' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};