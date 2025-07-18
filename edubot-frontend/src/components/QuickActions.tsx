import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, FileQuestion, Shuffle, Star, MessageCircle } from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
  language: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  onActionClick, 
  language 
}) => {
  const getActionText = (action: string) => {
    const texts = {
      'learn': {
        en: 'Learn a Topic',
        si: 'මාතෘකාවක් ඉගෙන ගන්න',
        ta: 'ஒரு தலைப்பைக் கற்றுக்கொள்ளுங்கள்'
      },
      'practice': {
        en: 'Practice MCQs',
        si: 'MCQ අභ්‍යාස කරන්න',
        ta: 'MCQ பயிற்சி செய்யுங்கள்'
      },
      'random': {
        en: 'Random Question',
        si: 'අහම්බෙන් ප්‍රශ්නයක්',
        ta: 'சீரற்ற கேள்வி'
      },
      'help': {
        en: 'How can I help?',
        si: 'මට කොහොමද උදව් කරන්න පුළුවන්?',
        ta: 'நான் எவ்வாறு உதவ முடியும்?'
      }
    };
    return texts[action as keyof typeof texts]?.[language as keyof typeof texts.learn] || texts[action as keyof typeof texts]?.en;
  };

  return (
    <div className="p-4 bg-background border-t border-border">
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <Button
          variant="outline"
          className="h-12 flex items-center gap-2 bg-primary-light hover:bg-primary text-primary-foreground border-primary"
          onClick={() => onActionClick('learn')}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-sm font-medium">{getActionText('learn')}</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-12 flex items-center gap-2 bg-secondary-light hover:bg-secondary text-secondary-foreground border-secondary"
          onClick={() => onActionClick('practice')}
        >
          <FileQuestion className="w-5 h-5" />
          <span className="text-sm font-medium">{getActionText('practice')}</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-12 flex items-center gap-2 bg-accent-light hover:bg-accent text-accent-foreground border-accent"
          onClick={() => onActionClick('random')}
        >
          <Shuffle className="w-5 h-5" />
          <span className="text-sm font-medium">{getActionText('random')}</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-12 flex items-center gap-2 hover:bg-muted"
          onClick={() => onActionClick('help')}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{getActionText('help')}</span>
        </Button>
      </div>
    </div>
  );
};