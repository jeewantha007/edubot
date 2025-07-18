import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  rating?: number;
}

interface ChatWindowProps {
  messages: Message[];
  onRate: (messageId: string, rating: number) => void;
  isTyping?: boolean;
  language: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  onRate, 
  isTyping, 
  language 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getTypingText = () => {
    const typingTexts = {
      en: 'Edubot is typing...',
      si: 'Edubot ටයිප් කරනවා...',
      ta: 'Edubot தட்டச்சு செய்கிறது...'
    };
    return typingTexts[language as keyof typeof typingTexts] || typingTexts.en;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {language === 'si' ? 'ආයුබෝවන්!' : 
               language === 'ta' ? 'வணக்கம்!' : 
               'Welcome!'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {language === 'si' 
                ? 'මම Edubot! මම ඔබට A/L දේශපාලන විද්‍යාව ඉගෙන ගන්න උදව් කරන්නම්. ප්‍රශ්නයක් අහන්න හෝ පහත බොත්තම් භාවිතා කරන්න.' 
                : language === 'ta'
                ? 'நான் Edubot! A/L அரசியல் அறிவியல் கற்க உங்களுக்கு உதவுவேன். ஒரு கேள்வி கேளுங்கள் அல்லது கீழே உள்ள பொத்தான்களைப் பயன்படுத்துங்கள்.'
                : "I'm Edubot! I'll help you learn A/L Political Science. Ask me a question or use the buttons below."}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onRate={onRate}
            />
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[85%] md:max-w-[70%]">
              <div className="bg-bot-bubble text-bot-bubble-foreground p-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{getTypingText()}</span>
                  <div className="flex gap-1 ml-2">
                    <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};