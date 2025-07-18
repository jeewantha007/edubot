import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  language: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  language, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');

  const getPlaceholderText = () => {
    const placeholders = {
      en: 'Ask me about Political Science...',
      si: 'මගෙන් දේශපාලන විද්‍යාව ගැන අහන්න...',
      ta: 'என்னிடம் அரசியல் அறிவியல் பற்றி கேளுங்கள்...'
    };
    return placeholders[language as keyof typeof placeholders] || placeholders.en;
  };

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-background border-t border-border">
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholderText()}
            disabled={disabled}
            className="pr-12 h-12 rounded-full border-border focus:ring-primary bg-muted"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full hover:bg-muted-foreground/10"
            disabled={disabled}
          >
            <Mic className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary-glow"
          size="sm"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};