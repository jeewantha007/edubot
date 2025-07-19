import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, FileQuestion, Shuffle, MessageCircle, Sparkles, Brain, Zap, HelpCircle } from 'lucide-react';

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

  const getActionDescription = (action: string) => {
    const descriptions = {
      'learn': {
        en: 'Explore concepts',
        si: 'සංකල්ප ගවේෂණය කරන්න',
        ta: 'கருத்துகளை ஆராயுங்கள்'
      },
      'practice': {
        en: 'Test knowledge',
        si: 'දැනුම පරීක්ෂා කරන්න',
        ta: 'அறிவை சோதிக்கவும்'
      },
      'random': {
        en: 'Surprise me',
        si: 'මාව පුදුමයට පත් කරන්න',
        ta: 'என்னை ஆச்சரியப்படுத்துங்கள்'
      },
      'help': {
        en: 'Get guidance',
        si: 'මග පෙන්වීම ලබා ගන්න',
        ta: 'வழிகாட்டுதலைப் பெறுங்கள்'
      }
    };
    return descriptions[action as keyof typeof descriptions]?.[language as keyof typeof descriptions.learn] || descriptions[action as keyof typeof descriptions]?.en;
  };

  const actions = [
    {
      key: 'learn',
      icon: BookOpen,
      gradient: 'from-blue-500 to-purple-600',
      hoverGradient: 'from-blue-600 to-purple-700',
      shadowColor: 'shadow-blue-500/20',
      hoverShadow: 'hover:shadow-blue-500/30',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      darkBgColor: 'dark:bg-blue-950/30 dark:hover:bg-blue-950/50',
      textColor: 'text-blue-700 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      key: 'practice',
      icon: Brain,
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'from-emerald-600 to-teal-700',
      shadowColor: 'shadow-emerald-500/20',
      hoverShadow: 'hover:shadow-emerald-500/30',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100',
      darkBgColor: 'dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      key: 'random',
      icon: Sparkles,
      gradient: 'from-orange-500 to-red-600',
      hoverGradient: 'from-orange-600 to-red-700',
      shadowColor: 'shadow-orange-500/20',
      hoverShadow: 'hover:shadow-orange-500/30',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      darkBgColor: 'dark:bg-orange-950/30 dark:hover:bg-orange-950/50',
      textColor: 'text-orange-700 dark:text-orange-300',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      key: 'help',
      icon: HelpCircle,
      gradient: 'from-violet-500 to-pink-600',
      hoverGradient: 'from-violet-600 to-pink-700',
      shadowColor: 'shadow-violet-500/20',
      hoverShadow: 'hover:shadow-violet-500/30',
      bgColor: 'bg-violet-50 hover:bg-violet-100',
      darkBgColor: 'dark:bg-violet-950/30 dark:hover:bg-violet-950/50',
      textColor: 'text-violet-700 dark:text-violet-300',
      borderColor: 'border-violet-200 dark:border-violet-800'
    }
  ];

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {language === 'en' ? 'Quick Actions' : 
             language === 'si' ? 'ඉක්මන් ක්‍රියාමාර්ග' : 
             'விரைவு செயல்கள்'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? 'Choose how you\'d like to start learning' :
             language === 'si' ? 'ඔබ ඉගෙනීම ආරම්භ කරන්නේ කෙසේද යන්න තෝරන්න' :
             'நீங்கள் எவ்வாறு கற்றலைத் தொடங்க விரும்புகிறீர்கள் என்பதைத் தேர்ந்தெடுக்கவும்'}
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.key}
                variant="outline"
                className={`
                  relative h-20 sm:h-24 p-4 
                  flex flex-col items-center justify-center gap-2
                  ${action.bgColor} ${action.darkBgColor}
                  ${action.borderColor}
                  ${action.shadowColor} ${action.hoverShadow}
                  hover:shadow-lg hover:scale-105
                  transition-all duration-300 ease-out
                  group overflow-hidden rounded-xl
                  border-2 hover:border-opacity-60
                `}
                onClick={() => onActionClick(action.key)}
              >
                {/* Background gradient overlay on hover */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${action.gradient}
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300
                `} />
                
                {/* Icon with gradient background */}
                <div className={`
                  relative p-2 rounded-lg bg-gradient-to-br ${action.gradient}
                  shadow-sm group-hover:shadow-md transition-all duration-300
                  group-hover:scale-110
                `}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                </div>
                
                {/* Text content */}
                <div className="text-center space-y-0.5 relative z-10">
                  <span className={`
                    text-sm sm:text-base font-semibold ${action.textColor}
                    group-hover:scale-105 transition-transform duration-300
                    leading-tight
                  `}>
                    {getActionText(action.key)}
                  </span>
                  <p className="text-xs text-muted-foreground/80 leading-tight">
                    {getActionDescription(action.key)}
                  </p>
                </div>

                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </Button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground/60">
            {language === 'en' ? 'Or type your question in the chat below' :
             language === 'si' ? 'හෝ පහත කතාබස් තුළ ඔබේ ප්‍රශ්නය ටයිප් කරන්න' :
             'அல்லது கீழே உள்ள அரட்டையில் உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்'}
          </p>
        </div>
      </div>
    </div>
  );
};