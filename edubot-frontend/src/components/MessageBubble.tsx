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

// Enhanced response formatter utility
const formatBotResponse = (text: string): string => {
  if (typeof text !== 'string') {
    return 'Sorry, I could not generate a response. Please try again later or check your credits.';
  }
  // If already formatted with markdown, return as is
  if (text.includes('##') || text.includes('**') || text.includes('- ') || text.includes('* ')) {
    return text;
  }

  // For simple greetings and short responses, return as is
  const simpleGreetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'thanks', 'thank you', 'bye', 'goodbye'];
  const textLower = text.toLowerCase().trim();
  
  if (textLower.length < 30 || simpleGreetings.some(greeting => textLower.includes(greeting))) {
    return text;
  }

  let formattedText = text;

  // Handle the specific pattern: "I can: ✅ item1 ✅ item2 ✅ item3"
  if (formattedText.includes('I can:')) {
    // Split at "I can:" 
    const parts = formattedText.split(/I can:\s*/i);
    if (parts.length >= 2) {
      const beforeIcan = parts[0].trim();
      const afterIcan = parts[1];
      
      // Split the items by emoji checkmarks or other emojis
      const items = afterIcan.split(/(?=✅|❌|🌟|📚|💡|🎯|⭐|🔥|💪|🚀|📝|✨|🎉)/).filter(item => item.trim());
      
      if (items.length > 1) {
        const bulletPoints = items.map(item => `* ${item.trim()}`).join('\n');
        formattedText = `${beforeIcan}\n\nI can:\n\n${bulletPoints}`;
      }
    }
  }
  
  // Add line breaks before common question starters
  formattedText = formattedText.replace(/\s+(What would you like|How can I|Let me know|Feel free to|Which topic)/gi, '\n\n$1');
  
  // Handle other emoji-based lists that aren't after "I can:"
  if (!formattedText.includes('I can:')) {
    // Split by emojis and create bullet points
    const emojiPattern = /([✅❌🌟📚💡🎯⭐🔥💪🚀📝✨🎉])\s*([^✅❌🌟📚💡🎯⭐🔥💪🚀📝✨🎉\n]+)/g;
    const matches = [...formattedText.matchAll(emojiPattern)];
    
    if (matches.length > 1) {
      let result = formattedText;
      matches.forEach(match => {
        const fullMatch = match[0];
        const emoji = match[1];
        const text = match[2].trim();
        result = result.replace(fullMatch, `* ${emoji} ${text}`);
      });
      formattedText = result;
    }
  }

  return formattedText;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onRate 
}) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {/* Avatar - Order based on sender */}
      {isBot && (
        <div className="flex flex-col items-center mr-3 select-none">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl">
            <span>🤖</span>
          </div>
        </div>
      )}
      
      {/* Bubble */}
      <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`p-4 rounded-xl border shadow-sm ${isBot
            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100'
            : 'bg-blue-600 dark:bg-blue-700 text-white border-blue-700 dark:border-blue-600'
          }`}
        >
          {isBot ? (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-slate">
              <ReactMarkdown 
                components={{
                  // Override prose colors for better dark mode support
                  p: ({children}) => <p className="text-slate-900 dark:text-slate-100 mb-3 last:mb-0">{children}</p>,
                  h1: ({children}) => <h1 className="text-slate-900 dark:text-slate-100">{children}</h1>,
                  h2: ({children}) => <h2 className="text-slate-900 dark:text-slate-100">{children}</h2>,
                  h3: ({children}) => <h3 className="text-slate-900 dark:text-slate-100">{children}</h3>,
                  strong: ({children}) => <strong className="text-slate-900 dark:text-slate-100 font-semibold">{children}</strong>,
                  code: ({children}) => <code className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                  pre: ({children}) => <pre className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 p-3 rounded-lg overflow-x-auto">{children}</pre>,
                  ul: ({children}) => <ul className="space-y-2 my-3">{children}</ul>,
                  li: ({children}) => <li className="text-slate-900 dark:text-slate-100 flex items-start">{children}</li>,
                }}
              >
                {formatBotResponse(message.text)}
              </ReactMarkdown>
            </div>
          ) : (
            <span className="text-sm leading-relaxed">{message.text}</span>
          )}
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        
        {/* Feedback for bot messages only */}
        {isBot && onRate && (
          <div className="flex items-center gap-1 mt-2 px-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 p-1 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              onClick={() => onRate(message.id, 1)}
            >
              <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              onClick={() => onRate(message.id, -1)}
            >
              <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
            </Button>
            <div className="flex items-center ml-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                  onClick={() => onRate(message.id, star)}
                >
                  <Star 
                    className={`w-3 h-3 ${
                      message.rating && star <= message.rating 
                        ? 'text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400' 
                        : 'text-slate-400 dark:text-slate-500'
                    }`} 
                  />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* User Avatar - positioned after bubble */}
      {!isBot && (
        <div className="flex flex-col items-center ml-3 select-none">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </div>
        </div>
      )}
    </div>
  );
};