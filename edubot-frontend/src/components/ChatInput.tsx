import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
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
  const [listening, setListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const getPlaceholderText = () => {
    const placeholders = {
      en: 'Ask me about Political Science...',
      si: 'මගෙන් දේශපාලන විද්‍යාව ගැන අහන්න...',
      ta: 'என்னிடம் அரசியல் அறிவியல் பற்றி கேளுங்கள்...'
    };
    return placeholders[language as keyof typeof placeholders] || placeholders.en;
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      // Limit max height to ~6 lines (approximately 144px)
      const maxHeight = 144;
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [message]);

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

  // Voice input logic (English only)
  const handleMicClick = () => {
    if (language !== 'en' || disabled) return;
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(''); // Clear input after sending
      setListening(false);
      if (transcript.trim()) {
        onSendMessage(transcript.trim());
      }
    };
    recognition.onerror = () => {
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-t from-background/95 to-background/90 backdrop-blur-sm border-t border-border/50">
      <div className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholderText()}
            disabled={disabled}
            rows={1}
            className={`
              w-full min-h-[48px] max-h-36 p-3 pr-12 
              rounded-2xl border border-border/60 
              bg-card/80 backdrop-blur-sm
              text-foreground placeholder:text-muted-foreground/70
              resize-none overflow-hidden
              shadow-sm hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50
              transition-all duration-200 ease-in-out
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-card/90'}
              text-sm sm:text-base leading-6
            `}
          />
          <Button
            variant="ghost"
            size="sm"
            className={`
              absolute right-2 bottom-2 h-8 w-8 sm:h-9 sm:w-9 
              rounded-full hover:bg-muted/60 transition-all duration-200
              ${disabled || language !== 'en' ? 'opacity-40' : 'hover:scale-105'}
            `}
            disabled={disabled || language !== 'en'}
            onClick={handleMicClick}
            title={language === 'en' ? (listening ? 'Stop listening' : 'Start voice input') : 'Voice input (English only)'}
          >
            <Mic className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground transition-all duration-200 ${
              listening ? 'text-primary scale-110' : ''
            }`} />
            {listening && (
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
            )}
          </Button>
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={`
            h-12 w-12 rounded-2xl 
            bg-gradient-to-r from-primary to-primary/90 
            hover:from-primary/90 hover:to-primary
            shadow-lg hover:shadow-xl
            transition-all duration-200 ease-in-out
            ${!message.trim() || disabled ? 
              'opacity-50 cursor-not-allowed shadow-none' : 
              'hover:scale-105 active:scale-95'
            }
          `}
          size="sm"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </Button>
      </div>
      
      {/* Subtle hint text */}
      <div className="flex justify-center mt-2">
        <p className="text-xs text-muted-foreground/60 text-center max-w-md">
          Press Enter to send • Shift+Enter for new line
          {language === 'en' && ' • Click mic for voice input'}
        </p>
      </div>
    </div>
  );
};