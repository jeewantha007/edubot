import React, { useState, useCallback, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatWindow } from './ChatWindow';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';
import { ChatHistory } from './ChatHistory';
import { useToast } from '@/hooks/use-toast';
import { sendMessage, saveMessageToHistory, fetchChatHistory, fetchAllSessions, deleteChatSession } from '@/service/chatService';
import { getUserIdFromToken } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  rating?: number;
}

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messageCount: number;
  category: 'learn' | 'practice' | 'help' | 'general';
}

export const Edubot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState('1');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const { toast } = useToast();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  // Session ID logic
  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => {
    let sid = localStorage.getItem('edubot_session_id');
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('edubot_session_id', sid);
    }
    setSessionId(sid);
    console.log('Edubot sessionId:', sid); // Debug log
  }, []);

  // Get userId from JWT token (declare only once, above all uses)
  const token = localStorage.getItem('jwt_token');
  const userId = getUserIdFromToken(token);

  // Fetch chat history from backend when sessionId or userId is set
  useEffect(() => {
    if (sessionId && userId) {
      fetchAllSessions(userId)
        .then(data => {
          if (data.sessions && data.sessions.length > 0) {
            // Find the session matching the current sessionId
            const session = data.sessions.find((s: any) => s.sessionId === sessionId);
            if (session && Array.isArray(session.messages)) {
              setMessages(session.messages.map((msg: any, idx: number) => ({
                id: msg._id || `msg_${idx}`,
                text: msg.text,
                sender: msg.role,
                timestamp: new Date(msg.timestamp),
                rating: msg.rating,
              })));
            } else {
              setMessages([]);
            }
          } else {
            setMessages([]);
          }
        })
        .catch(err => {
          console.error('Failed to fetch chat history:', err);
        });
    }
  }, [sessionId, userId]);

  // Helper to save message to backend
  const persistMessage = useCallback((msg: Message) => {
    if (!sessionId) return;
    saveMessageToHistory(sessionId, userId, {
      text: msg.text,
      role: msg.sender,
      timestamp: msg.timestamp,
    }).catch(err => {
      console.error('Failed to save message to backend:', err);
    });
  }, [sessionId, userId]);

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const getBotResponse = (userMessage: string, action?: string): string => {
    const responses = {
      en: {
        learn: "Great! Let's explore Political Science topics. Here are some key areas:\n\n📚 **Constitutional Law**\n📚 **Political Theory**\n📚 **International Relations**\n📚 **Public Administration**\n\nWhich topic interests you most?",
        practice: "Perfect! Let's practice with some MCQs. Here's your first question:\n\n**Question:** What is the main function of the executive branch in a democracy?\n\nA) Make laws\nB) Interpret laws\nC) Implement laws\nD) All of the above\n\nTake your time and choose the best answer! 🎯",
        random: "Here's an interesting question for you:\n\n🤔 **Can you explain the difference between a federal system and a unitary system of government?**\n\nTake a moment to think about it, and I'll help guide you through the answer!",
        help: "I'm here to help you succeed in A/L Political Science! 🌟\n\nI can:\n✅ Explain complex topics simply\n✅ Give you practice MCQs\n✅ Answer your specific questions\n✅ Help with exam preparation\n\nWhat would you like to start with?",
        default: "That's a great question! In Political Science, it's important to understand the fundamentals. Let me help you explore this topic step by step. 📖\n\nCould you be more specific about what aspect you'd like to learn?"
      },
      si: {
        learn: "හොඳයි! දේශපාලන විද්‍යා මාතෘකා අධ්‍යයනය කරමු. මෙන්න ප්‍රධාන ක්ෂේත්‍ර:\n\n📚 **ව්‍යවස්ථා නීතිය**\n📚 **දේශපාලන න්‍යාය**\n📚 **ජාත්‍යන්තර සබඳතා**\n📚 **රාජ්‍ය පරිපාලනය**\n\nකුමන මාතෘකාව ඔබට වඩාත්ම කැමතිද?",
        practice: "හොඳයි! MCQ සමග අභ්‍යාස කරමු. මෙන්න ඔබේ පළමු ප්‍රශ්නය:\n\n**ප්‍රශ්නය:** ප්‍රජාතන්ත්‍රවාදයේ විධායක ශාඛාවේ ප්‍රධාන කාර්යය කුමක්ද?\n\nA) නීති සම්පාදනය\nB) නීති අර්ථ කථනය\nC) නීති ක්‍රියාත්මක කිරීම\nD) ඉහත සියල්ල\n\nකාලය ගන්න සහ හොඳම පිළිතුර තෝරන්න! 🎯",
        random: "ඔබට රසවත් ප්‍රශ්නයක්:\n\n🤔 **ෆෙඩරල් ක්‍රමයක් සහ ඒකීය රාජ්‍ය ක්‍රමයක් අතර වෙනස කුමක්ද?**\n\nටිකක් හිතලා බලන්න, මම ඔබට පිළිතුර සොයා ගන්න උදව් කරන්නම්!",
        help: "A/L දේශපාලන විද්‍යාවේ සාර්ථක වීමට මම ඔබට උදව් කරන්නම්! 🌟\n\nමම කරන්න පුළුවන්:\n✅ සංකීර්ණ මාතෘකා සරලව පැහැදිලි කරන්න\n✅ ප්‍රායෝගික MCQ ලබා දෙන්න\n✅ ඔබේ විශේෂ ප්‍රශ්නවලට පිළිතුරු දෙන්න\n✅ විභාග සූදානම උදව් කරන්න\n\nමොනවාද ඔබ පටන් ගන්න කැමති?",
        default: "හොඳ ප්‍රශ්නයක්! දේශපාලන විද්‍යාවේ මූලිකයන් තේරුම් ගන්න වැදගත්. මම ඔබට මේ මාතෘකාව පියවරෙන් පියවර ගවේෂණය කරන්න උදව් කරන්නම්. 📖\n\nඔබ ඉගෙන ගන්න කැමති කොටස ගැන වැඩි විස්තර දෙන්න පුළුවන්ද?"
      },
      ta: {
        learn: "சிறந்தது! அரசியல் அறிவியல் தலைப்புகளை ஆராய்வோம். இங்கே முக்கிய பகுதிகள்:\n\n📚 **அரசியலமைப்பு சட்டம்**\n📚 **அரசியல் கோட்பாடு**\n📚 **சர்வதேச உறவுகள்**\n📚 **பொது நிர்வாகம்**\n\nஎந்த தலைப்பு உங்களுக்கு மிகவும் பிடிக்கிறது?",
        practice: "சிறப்பு! MCQ களுடன் பயிற்சி செய்வோம். இங்கே உங்கள் முதல் கேள்வி:\n\n**கேள்வி:** ஜனநாயகத்தில் நிர்வாகக் கிளையின் முக்கிய செயல்பாடு என்ன?\n\nA) சட்டங்களை உருவாக்குதல்\nB) சட்டங்களை விளக்குதல்\nC) சட்டங்களை நடைமுறைப்படுத்துதல்\nD) மேலே உள்ள அனைத்தும்\n\nநேரம் எடுத்துக்கொண்டு சிறந்த பதிலைத் தேர்ந்தெடுக்கவும்! 🎯",
        random: "உங்களுக்கு ஒரு சுவாரஸ்யமான கேள்வி:\n\n🤔 **கூட்டாட்சி அமைப்புக்கும் ஒற்றையாட்சி அமைப்புக்கும் உள்ள வேறுபாடு என்ன?**\n\nசிறிது நேரம் யோசித்துப் பார்க்கவும், பதிலைக் கண்டுபிடிக்க நான் உங்களுக்கு உதவுவேன்!",
        help: "A/L அரசியல் அறிவியலில் வெற்றி பெற நான் உங்களுக்கு உதவுவேன்! 🌟\n\nநான் செய்ய முடியும்:\n✅ சிக்கலான தலைப்புகளை எளிமையாக விளக்குதல்\n✅ பயிற்சி MCQ கள் வழங்குதல்\n✅ உங்கள் குறிப்பிட்ட கேள்விகளுக்கு பதிலளித்தல்\n✅ தேர்வு தயாரிப்புக்கு உதவுதல்\n\nநீங்கள் எதில் தொடங்க விரும்புகிறீர்கள்?",
        default: "அது ஒரு சிறந்த கேள்வி! அரசியல் அறிவியலில், அடிப்படைகளைப் புரிந்துகொள்வது முக்கியம். இந்த தலைப்பை படிப்படியாக ஆராய உங்களுக்கு உதவுகிறேன். 📖\n\nநீங்கள் கற்க விரும்பும் அம்சத்தைப் பற்றி மேலும் குறிப்பிட முடியுமா?"
      }
    };

    const langResponses = responses[currentLanguage as keyof typeof responses] || responses.en;
    
    if (action && action in langResponses) {
      return langResponses[action as keyof typeof langResponses];
    }
    
    return langResponses.default;
  };

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: generateMessageId(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    persistMessage(newMessage);
    return newMessage;
  }, [persistMessage]);

  // Helper to map frontend language code to backend
  const mapLanguage = (lang: string) => {
    if (lang === 'si') return 'sinhala';
    if (lang === 'ta') return 'tamil';
    return 'english';
  };

  const handleSendMessage = useCallback(async (text: string) => {
    setShowQuickActions(false);
    const userMessage = addMessage(text, 'user');
    setIsTyping(true);
    try {
      if (!sessionId) throw new Error('No sessionId');
      const response = await sendMessage(text, mapLanguage(currentLanguage), sessionId);
      addMessage(response.reply, 'bot');
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessages = {
        en: 'Sorry, there was an error connecting to the server.',
        si: 'සමාවෙන්න, සර්වරය සමඟ සම්බන්ධ වීමේ දෝෂයක් ඇත.',
        ta: 'மன்னிக்கவும், சர்வருடன் இணைப்பதில் பிழை ஏற்பட்டது.'
      };
      const errorMsg = errorMessages[currentLanguage as keyof typeof errorMessages] || errorMessages.en;
      addMessage(errorMsg, 'bot');
    } finally {
      setIsTyping(false);
    }
  }, [addMessage, currentLanguage, sessionId]);

  const handleQuickAction = useCallback((action: string) => {
    setShowQuickActions(false);
    const actionTexts = {
      en: {
        learn: "I want to learn a topic",
        practice: "Let's practice MCQs",
        random: "Give me a random question",
        help: "How can you help me?"
      },
      si: {
        learn: "මට මාතෘකාවක් ඉගෙන ගන්න ඕනේ",
        practice: "MCQ අභ්‍යාස කරමු",
        random: "මට අහම්බෙන් ප්‍රශ්නයක් දෙන්න",
        help: "ඔබ මට කොහොමද උදව් කරන්න පුළුවන්?"
      },
      ta: {
        learn: "நான் ஒரு தலைப்பைக் கற்க விரும்புகிறேன்",
        practice: "MCQ பயிற்சி செய்வோம்",
        random: "எனக்கு ஒரு சீரற்ற கேள்வி கொடுங்கள்",
        help: "நீங்கள் எனக்கு எவ்வாறு உதவ முடியும்?"
      }
    };

    const langTexts = actionTexts[currentLanguage as keyof typeof actionTexts] || actionTexts.en;
    const userText = langTexts[action as keyof typeof langTexts];
    
    if (userText) {
      addMessage(userText, 'user');
      
      // For MCQ practice, send the message to the backend instead of using local response
      if (action === 'practice') {
        setIsTyping(true);
        if (!sessionId) {
          addMessage('Session error. Please refresh the page.', 'bot');
          setIsTyping(false);
          return;
        }
        sendMessage(userText, mapLanguage(currentLanguage), sessionId)
          .then(response => {
            addMessage(response.reply, 'bot');
          })
          .catch(error => {
            addMessage('Sorry, there was an error connecting to the server.', 'bot');
          })
          .finally(() => {
            setIsTyping(false);
          });
      } else {
        // For other actions, use local responses
        simulateTyping(() => {
          const botResponse = getBotResponse(userText, action);
          addMessage(botResponse, 'bot');
        });
      }
    }
  }, [addMessage, currentLanguage, sessionId]);

  const handleRateMessage = useCallback((messageId: string, rating: number) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, rating: rating > 0 ? rating : undefined }
          : msg
      )
    );
    
    const feedbackTexts = {
      en: rating > 0 ? "Thank you for your feedback! 😊" : "Thanks for letting me know. I'll try to improve! 🤗",
      si: rating > 0 ? "ඔබේ ප්‍රතිපෝෂණයට ස්තූතියි! 😊" : "කියා දීම ගැන ස්තූතියි. මම වැඩිදියුණු කරන්න උත්සාහ කරන්නම්! 🤗",
      ta: rating > 0 ? "உங்கள் கருத்துக்கு நன்றி! 😊" : "எனக்குத் தெரியப்படுத்தியதற்கு நன்றி. நான் மேம்படுத்த முயற்சிப்பேன்! 🤗"
    };
    
    toast({
      description: feedbackTexts[currentLanguage as keyof typeof feedbackTexts] || feedbackTexts.en,
      duration: 2000,
    });
  }, [currentLanguage, toast]);

  const handleToggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  // Map backend session to ChatSession template
  function mapSessionToHistoryTemplate(session: any): ChatSession {
    const lastMsg = session.messages[session.messages.length - 1];
    return {
      id: session.sessionId,
      title: session.messages[0]?.text?.slice(0, 30) || 'Untitled Chat',
      preview: lastMsg?.text?.slice(0, 50) || '',
      timestamp: lastMsg?.timestamp || session.createdAt,
      messageCount: session.messages.length,
      category: 'general', // You can improve this if you have category info
    };
  }

  // Load all chat sessions when history tab is opened
  const loadChatSessions = useCallback(() => {
    fetchAllSessions(userId)
      .then(data => {
        if (data.sessions) {
          setChatSessions(data.sessions.map(mapSessionToHistoryTemplate));
        }
      })
      .catch(err => {
        console.error('Failed to fetch chat sessions:', err);
      });
  }, [userId]);

  // Delete chat session handler
  const handleDeleteChat = useCallback((chatId: string) => {
    deleteChatSession(chatId)
      .then(() => {
        loadChatSessions();
      })
      .catch(err => {
        console.error('Failed to delete chat session:', err);
      });
  }, [loadChatSessions]);

  useEffect(() => {
    if (isHistoryOpen) {
      loadChatSessions();
    }
  }, [isHistoryOpen, loadChatSessions]);

  // Update handleNewChat to generate a new sessionId and clear messages
  const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const handleNewChat = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    localStorage.setItem('edubot_session_id', newSessionId);
    setMessages([]);
    setCurrentChatId(newSessionId);
  };

  // Update handleSelectChat to set sessionId and currentChatId
  const handleSelectChat = (chatId: string) => {
    setSessionId(chatId);
    localStorage.setItem('edubot_session_id', chatId);
    setCurrentChatId(chatId);
    // Messages will be loaded by useEffect on sessionId
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
        chatSessions={chatSessions}
        onDeleteChat={handleDeleteChat}
      />
      
      <div className="flex flex-col flex-1 min-w-0">
        <ChatHeader 
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          onToggleHistory={handleToggleHistory}
          onToggleMobileMenu={handleToggleHistory}
        />
        
        <ChatWindow 
          messages={messages}
          onRate={handleRateMessage}
          isTyping={isTyping}
          language={currentLanguage}
        />
        
        {/* Only show QuickActions if showQuickActions is true and there are no messages */}
        {showQuickActions && messages.length === 0 && (
          <QuickActions 
            onActionClick={handleQuickAction}
            language={currentLanguage}
          />
        )}
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          language={currentLanguage}
          disabled={isTyping}
        />
      </div>
    </div>
  );
};