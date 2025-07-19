import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { Bot, Sparkles } from 'lucide-react';

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
  onEditMessage?: (messageId: string, newText: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  onRate, 
  isTyping, 
  language, 
  onEditMessage 
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
      en: 'Edubot is thinking...',
      si: 'Edubot සිතනවා...',
      ta: 'Edubot சிந்தித்துக்கொண்டிருக்கிறது...'
    };
    return typingTexts[language as keyof typeof typingTexts] || typingTexts.en;
  };

  const getWelcomeTexts = () => {
    return {
      greeting: {
        si: 'ආයුබෝවන්!',
        ta: 'வணக்கம்!',
        en: 'Welcome!'
      },
      subtitle: {
        si: 'දේශපාලන විද්‍යාව AI සහයකයා',
        ta: 'அரசியல் அறிவியல் AI உதவியாளர்',
        en: 'Political Science AI Assistant'
      },
      description: {
        si: 'මම Edubot! මම ඔබට A/L දේශපාලන විද්‍යාව ඉගෙන ගන්න උදව් කරන්නම්. මගෙන් ප්‍රශ්නයක් අහන්න.',
        ta: 'நான் Edubot! A/L அரசியல் அறிவியல் கற்க உங்களுக்கு உதவுவேன். என்னிடம் ஒரு கேள்வி கேளுங்கள்.',
        en: "I'm Edubot! I'll help you master A/L Political Science. Ask me anything!"
      }
    };
  };

  const texts = getWelcomeTexts();

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background via-background to-muted/10 dark:from-background dark:via-background dark:to-muted/5">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="text-center py-8 sm:py-16 space-y-8">
            {/* Hero Section */}
            <div className="relative">
              {/* Floating background elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-purple-200/20 dark:from-blue-800/20 dark:to-purple-800/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -top-2 -right-6 w-16 h-16 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-800/20 dark:to-teal-800/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              {/* Main bot avatar */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 dark:from-primary/30 dark:to-purple-500/30 rounded-full animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/90 rounded-full p-4 sm:p-5 shadow-lg shadow-primary/25 dark:shadow-primary/40">
                  <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-sm" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
                </div>
              </div>

              {/* Welcome text */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {texts.greeting[language as keyof typeof texts.greeting] || texts.greeting.en}
                </h1>
                <p className="text-base sm:text-lg text-primary font-semibold">
                  {texts.subtitle[language as keyof typeof texts.subtitle] || texts.subtitle.en}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {texts.description[language as keyof typeof texts.description] || texts.description.en}
                </p>
              </div>
            </div>


          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {messages.map((message, index) => (
              <div 
                key={message.id}
                className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MessageBubble
                  message={message}
                  onRate={onRate}
                  onEditMessage={onEditMessage}
                />
              </div>
            ))}
          </div>
        )}
        
        {isTyping && (
          <div className="flex justify-start mb-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="max-w-[85%] md:max-w-[70%]">
              <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 dark:border-border/30 text-card-foreground p-4 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground/90">
                      {getTypingText()}
                    </span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
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