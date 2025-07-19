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
  Brain,
  Search,
  MoreHorizontal,
  Archive,
  Trash2,
  Edit3,
  Download,
  X,
  Check
} from 'lucide-react';


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
  chatSessions?: ChatSession[];
  onDeleteChat?: (chatId: string) => void;
  onRenameChat?: (chatId: string, newTitle: string) => void;
  onDownloadChat?: (chatId: string) => void;
}

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
      return 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-900';
    case 'practice':
      return 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-900';
    case 'help':
      return 'bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-300 border-green-200 dark:border-green-900';
    default:
      return 'bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (inputDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  } else if (inputDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Sample data for demonstration
const sampleChatSessions: ChatSession[] = [
  {
    id: '1',
    title: 'React Component Best Practices',
    preview: 'Discussing how to structure React components for better maintainability and performance...',
    timestamp: new Date().toISOString(),
    messageCount: 12,
    category: 'learn'
  },
  {
    id: '2',
    title: 'JavaScript Array Methods',
    preview: 'Learning about map, filter, reduce and other useful array methods in JavaScript...',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    messageCount: 8,
    category: 'practice'
  },
  {
    id: '3',
    title: 'CSS Grid vs Flexbox',
    preview: 'When to use CSS Grid versus Flexbox for different layout scenarios...',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    messageCount: 15,
    category: 'help'
  },
  {
    id: '4',
    title: 'API Integration Help',
    preview: 'Need help with integrating REST APIs and handling async operations...',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    messageCount: 23,
    category: 'help'
  },
  {
    id: '5',
    title: 'TypeScript Generics',
    preview: 'Understanding how to use generics in TypeScript for type safety...',
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    messageCount: 18,
    category: 'learn'
  },
  {
    id: '6',
    title: 'Database Design Principles',
    preview: 'Learning about normalization, relationships, and best practices for database design...',
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    messageCount: 31,
    category: 'learn'
  },
  {
    id: '7',
    title: 'Algorithm Practice Session',
    preview: 'Working through sorting algorithms and time complexity analysis...',
    timestamp: new Date(Date.now() - 518400000).toISOString(),
    messageCount: 9,
    category: 'practice'
  },
  {
    id: '8',
    title: 'React Hooks Deep Dive',
    preview: 'Exploring useState, useEffect, useCallback and custom hooks...',
    timestamp: new Date(Date.now() - 604800000).toISOString(),
    messageCount: 27,
    category: 'learn'
  },
  {
    id: '9',
    title: 'Git Workflow Questions',
    preview: 'Questions about branching strategies, merging, and resolving conflicts...',
    timestamp: new Date(Date.now() - 691200000).toISOString(),
    messageCount: 14,
    category: 'help'
  },
  {
    id: '10',
    title: 'Performance Optimization',
    preview: 'Discussing techniques for optimizing web application performance...',
    timestamp: new Date(Date.now() - 777600000).toISOString(),
    messageCount: 19,
    category: 'general'
  }
];

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  isOpen,
  onClose,
  onNewChat,
  onSelectChat,
  currentChatId = '1',
  chatSessions = [],
  onDeleteChat,
  onRenameChat,
  onDownloadChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRename = (chatId: string) => {
    const session = chatSessions.find(s => s.id === chatId);
    if (session) {
      setEditTitle(session.title);
      setEditingChat(chatId);
      setOpenDropdown(null);
    }
  };

  const handleRenameSubmit = (chatId: string) => {
    if (editTitle.trim() && onRenameChat) {
      onRenameChat(chatId, editTitle.trim());
    }
    setEditingChat(null);
    setEditTitle('');
  };

  const handleRenameCancel = () => {
    setEditingChat(null);
    setEditTitle('');
  };

  const handleDelete = (chatId: string) => {
    if (onDeleteChat) {
      onDeleteChat(chatId);
    }
    setOpenDropdown(null);
  };

  const handleDownload = (chatId: string) => {
    if (onDownloadChat) {
      onDownloadChat(chatId);
    }
    setOpenDropdown(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar - Now using flex column with proper height */}
      <div className="absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-xl lg:relative lg:shadow-none flex flex-col">
        {/* Header with gradient - Fixed height */}
        <div className="relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 dark:opacity-30" />
          <div className="relative flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 dark:text-white">Chat History</h2>
                <p className="text-xs text-slate-500 dark:text-gray-400">{chatSessions.length} conversations</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar - Fixed height */}
        <div className="p-4 bg-white/50 dark:bg-black/20 border-b border-slate-100 dark:border-gray-800 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl text-sm placeholder:text-slate-400 dark:placeholder:text-gray-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* New Chat Button - Fixed height */}
        <div className="p-4 bg-white/30 dark:bg-black/10 flex-shrink-0">
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-400 dark:hover:to-purple-400 shadow-lg hover:shadow-xl dark:shadow-black/20 transition-all duration-200 transform hover:scale-[1.02] text-white"
            variant="default"
          >
            <div className="p-1 bg-white/20 dark:bg-black/20 rounded-md">
              <Plus className="w-4 h-4" />
            </div>
            New Chat
          </Button>
        </div>

        {/* Chat Sessions - Scrollable area that takes remaining space */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full px-4">
            <div className="space-y-3 py-4">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations found</p>
                </div>
              ) : (
                filteredSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className={`
                      group cursor-pointer rounded-2xl p-4 border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 dark:hover:shadow-black/20
                      ${currentChatId === session.id 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-black border-blue-200 dark:border-gray-700 shadow-md ring-1 ring-blue-200 dark:ring-gray-600' 
                        : 'bg-white dark:bg-gray-900/80 border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700'
                      }
                    `}
                    onClick={() => onSelectChat?.(session.id)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`
                          p-2 rounded-xl border transition-all group-hover:scale-110
                          ${getCategoryColor(session.category)}
                        `}>
                          {getCategoryIcon(session.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          {editingChat === session.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="flex-1 text-sm font-semibold bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded px-2 py-1 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleRenameSubmit(session.id);
                                  } else if (e.key === 'Escape') {
                                    handleRenameCancel();
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRenameSubmit(session.id)}
                                className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900/50"
                              >
                                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRenameCancel}
                                className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/50"
                              >
                                <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <h3 className="font-semibold text-slate-800 dark:text-white truncate text-sm leading-tight">
                                {session.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  {formatTimestamp(session.timestamp)}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {/* Action buttons (show on hover, except for active chat) */}
                      {currentChatId !== session.id && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-gray-800"
                            onClick={e => {
                              e.stopPropagation();
                              setOpenDropdown(openDropdown === session.id ? null : session.id);
                            }}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                          {openDropdown === session.id && (
                            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                              <button
                                className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-gray-800"
                                onClick={e => { e.stopPropagation(); handleRename(session.id); }}
                              >
                                <Edit3 className="w-4 h-4 mr-2" /> Rename
                              </button>
                              <button
                                className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-gray-800"
                                onClick={e => { e.stopPropagation(); handleDelete(session.id); }}
                              >
                                <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Delete
                              </button>
                              <button
                                className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-gray-800"
                                onClick={e => { e.stopPropagation(); handleDownload(session.id); }}
                              >
                                <Download className="w-4 h-4 mr-2" /> Download
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-600 dark:text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                      {session.preview}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 border-slate-200 dark:border-gray-700 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {session.messageCount} messages
                      </Badge>
                      {currentChatId === session.id && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-full animate-pulse" />
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {/* Add some bottom padding for better scrolling */}
              <div className="h-4" />
            </div>
          </ScrollArea>
        </div>

        {/* Enhanced Footer - Fixed height */}
        <div className="p-4 border-t border-slate-200 dark:border-gray-800 bg-gradient-to-r from-slate-50 to-white dark:from-gray-900 dark:to-black flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Archive className="w-3 h-3" />
              <span>{chatSessions.length} saved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full" />
              <span>Synced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};