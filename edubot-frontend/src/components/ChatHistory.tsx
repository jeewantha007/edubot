import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Plus, 
  ChevronLeft, 
  Clock, 
  BookOpen,
  HelpCircle,
  Brain
} from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messageCount: number;
  category: 'learn' | 'practice' | 'help' | 'general';
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat?: (chatId: string) => void;
  currentChatId?: string;
}

const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Constitutional Law Basics',
    preview: 'What is the main function of the executive branch...',
    timestamp: new Date().toISOString(),
    messageCount: 12,
    category: 'learn'
  },
  {
    id: '2',
    title: 'MCQ Practice Session',
    preview: 'Perfect! Let\'s practice with some MCQs...',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    messageCount: 8,
    category: 'practice'
  },
  {
    id: '3',
    title: 'Political Theory Discussion',
    preview: 'Can you explain the difference between federal...',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    messageCount: 15,
    category: 'learn'
  },
  {
    id: '4',
    title: 'Help with Exam Prep',
    preview: 'I\'m here to help you succeed in A/L Political...',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    messageCount: 6,
    category: 'help'
  },
  {
    id: '5',
    title: 'International Relations',
    preview: 'Let\'s explore Political Science topics...',
    timestamp: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    messageCount: 20,
    category: 'learn'
  }
];

const getCategoryIcon = (category: ChatSession['category']) => {
  switch (category) {
    case 'learn':
      return <BookOpen className="w-4 h-4" />;
    case 'practice':
      return <Brain className="w-4 h-4" />;
    case 'help':
      return <HelpCircle className="w-4 h-4" />;
    default:
      return <MessageSquare className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: ChatSession['category']) => {
  switch (category) {
    case 'learn':
      return 'bg-primary/10 text-primary';
    case 'practice':
      return 'bg-accent/10 text-accent';
    case 'help':
      return 'bg-secondary/10 text-secondary';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = parseISO(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM dd');
  }
};

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  isOpen,
  onClose,
  onNewChat,
  onSelectChat,
  currentChatId = '1'
}) => {
  const [chatSessions] = useState<ChatSession[]>(mockChatSessions);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile overlay */}
      <div 
        className="absolute inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-80 bg-card border-r border-border shadow-lg lg:relative lg:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Chat History</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-2 h-11"
            variant="default"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Chat Sessions */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-4">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`
                  group cursor-pointer rounded-lg p-3 border transition-all hover:bg-accent/5
                  ${currentChatId === session.id 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-card border-border/50 hover:border-border'
                  }
                `}
                onClick={() => onSelectChat?.(session.id)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`
                      p-1.5 rounded-full flex-shrink-0
                      ${getCategoryColor(session.category)}
                    `}>
                      {getCategoryIcon(session.category)}
                    </div>
                    <h3 className="font-medium text-sm text-foreground truncate">
                      {session.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(session.timestamp)}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {session.preview}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {session.messageCount} messages
                  </Badge>
                  {currentChatId === session.id && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            {chatSessions.length} chat sessions saved
          </div>
        </div>
      </div>
    </div>
  );
};