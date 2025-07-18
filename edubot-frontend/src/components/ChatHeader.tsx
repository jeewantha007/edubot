import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Globe, History, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatHeaderProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onToggleHistory?: () => void;
  onToggleMobileMenu?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  currentLanguage, 
  onLanguageChange,
  onToggleHistory,
  onToggleMobileMenu
}) => {
  return (
    <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMobileMenu}
          className="lg:hidden w-9 h-9 p-0 hover:bg-primary-glow/20"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        {/* Chat history button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleHistory}
          className="hidden lg:flex w-9 h-9 p-0 hover:bg-primary-glow/20"
        >
          <History className="w-5 h-5" />
        </Button>
        
        <div className="w-10 h-10 bg-primary-glow rounded-full flex items-center justify-center">
          <MessageCircle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Edubot</h1>
          <p className="text-sm text-primary-light opacity-90">
            Your A/L Political Science Tutor
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Globe className="w-4 h-4" />
        <Select value={currentLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-20 h-8 bg-primary-glow border-none text-primary-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">EN</SelectItem>
            <SelectItem value="si">සි</SelectItem>
            <SelectItem value="ta">த</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};