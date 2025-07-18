import React from 'react';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";

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

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onRate 
}) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className="max-w-[85%] md:max-w-[70%]">
        <div
          className={`
            p-3 rounded-2xl shadow-sm
            ${isBot 
              ? 'bg-bot-bubble text-bot-bubble-foreground rounded-bl-sm' 
              : 'bg-user-bubble text-user-bubble-foreground rounded-br-sm'
            }
          `}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p className={`text-xs mt-1 ${isBot ? 'text-primary-light' : 'text-muted-foreground'}`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        
        {/* Feedback buttons for bot messages */}
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