import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageCircle, Globe, History, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="relative">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-300"></div>
<div className="absolute inset-0 bg-gradient-to-r from-indigo-200/30 via-sky-200/30 to-cyan-200/30"></div>

      
      {/* Main header content */}
      <div className="relative flex items-center justify-between px-4 lg:px-6 py-3 border-b border-white/30 backdrop-blur-sm">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
                      <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMobileMenu}
            className="lg:hidden w-10 h-10 p-0 hover:bg-white/30 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Menu className="w-5 h-5 text-white" />
          </Button>
          
          {/* Chat history button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleHistory}
            className="hidden lg:flex w-10 h-10 p-0 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <History className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </Button>
          
          {/* Logo and branding */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white drop-shadow-sm">
                Edubot
              </h1>
              <p className="text-sm text-white/90 font-medium">
                Your A/L Political Science Tutor
              </p>
            </div>
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-white/30">
            <Globe className="w-4 h-4 text-white/90" />
            <Select value={currentLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-16 h-6 bg-transparent border-none text-white font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-white/20">
                <SelectItem value="en" className="font-medium">EN</SelectItem>
                <SelectItem value="si" className="font-medium">සි</SelectItem>
                <SelectItem value="ta" className="font-medium">த</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme toggle */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-sm border border-white/30">
            <ThemeToggle />
          </div>

          {/* User profile dropdown */}
          <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 h-auto shadow-sm border border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {username ? username[0].toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-semibold text-white text-sm leading-tight drop-shadow-sm">
                      {username || 'User'}
                    </p>
                    <p className="text-xs text-white/80">
                      Online
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/90 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-white/20 shadow-xl"
            >
              <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  {username || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Student Account
                </p>
              </div>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};