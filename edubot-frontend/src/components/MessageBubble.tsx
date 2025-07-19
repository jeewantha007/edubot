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
  // If already well-formatted, return as is
  if (text.includes('##') || text.includes('**') || text.includes('- ')) {
    return text;
  }

  // Only format if the message is long or complex
  const isLong = text.length > 200 || text.split(/[.!?]+/).length > 3;
  if (!isLong) return text;

  // Split into sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length < 2) return text;

  // Extract summary (first sentence)
  const summary = sentences[0].trim() + '.';
  
  // Process remaining content
  const remainingContent = sentences.slice(1).join('. ').trim();
  
  // Split into logical chunks (by common separators)
  const chunks = remainingContent.split(/\b(?:firstly|secondly|thirdly|also|additionally|furthermore|moreover|however|therefore|finally|in conclusion|for example|specifically|notably)\b/i);
  
  // Format main points as bullet points
  const mainPoints = chunks
    .filter(chunk => chunk.trim().length > 20)
    .slice(0, 5) // Limit to 5 main points
    .map(chunk => {
      let point = chunk.trim();
      // Clean up the point
      point = point.replace(/^[.,\s]+/, '');
      if (point && !point.endsWith('.')) point += '.';
      
      // Bold important terms (comprehensive list)
      const importantTerms = [
        'democracy', 'government', 'economy', 'education', 'technology', 'development', 
        'climate', 'health', 'security', 'freedom', 'rights', 'justice', 'equality',
        'innovation', 'sustainability', 'growth', 'policy', 'strategy', 'implementation',
        'solution', 'challenge', 'opportunity', 'benefit', 'advantage', 'disadvantage',
        'impact', 'effect', 'result', 'outcome', 'success', 'failure', 'improvement',
        'progress', 'achievement', 'goal', 'objective', 'target', 'standard', 'quality',
        'efficiency', 'effectiveness', 'productivity', 'performance', 'management',
        'leadership', 'governance', 'administration', 'regulation', 'legislation',
        'law', 'constitution', 'parliament', 'president', 'minister', 'election',
        'vote', 'citizen', 'public', 'private', 'society', 'community', 'culture',
        'tradition', 'heritage', 'history', 'future', 'modern', 'digital', 'online',
        'internet', 'mobile', 'smartphone', 'computer', 'software', 'application',
        'system', 'network', 'database', 'artificial intelligence', 'machine learning',
        'blockchain', 'cryptocurrency', 'renewable energy', 'solar', 'wind',
        'hydroelectric', 'nuclear', 'fossil fuel', 'carbon', 'emission', 'pollution',
        'environment', 'biodiversity', 'conservation', 'protection', 'preservation',
        'sri lanka', 'colombo', 'kandy', 'galle', 'jaffna', 'trincomalee', 'negombo',
        'anuradhapura', 'polonnaruwa', 'sigiriya', 'adams peak', 'nuwara eliya',
        'ella', 'bentota', 'mirissa', 'arugam bay', 'yala', 'udawalawe', 'sinharaja',
        'tea', 'cinnamon', 'coconut', 'rubber', 'rice', 'curry', 'ayurveda',
        'buddhism', 'hinduism', 'christianity', 'islam', 'sinhala', 'tamil', 'english',
        'rupee', 'central bank', 'stock exchange', 'port city', 'export', 'import',
        'tourism', 'hospitality', 'garment', 'textile', 'fisheries', 'agriculture',
        'plantation', 'manufacturing', 'service sector', 'it sector', 'bpo',
        'finance', 'banking', 'insurance', 'investment', 'entrepreneurship',
        'startup', 'sme', 'innovation', 'research', 'university', 'education',
        'healthcare', 'medicine', 'hospital', 'clinic', 'pharmacy', 'treatment',
        'prevention', 'vaccine', 'disease', 'epidemic', 'pandemic', 'public health',
        'infrastructure', 'transport', 'railway', 'highway', 'airport', 'port',
        'electricity', 'water', 'sanitation', 'waste management', 'telecommunication',
        'broadband', 'mobile network', '5g', 'digitalization', 'e-governance',
        'smart city', 'sustainable development', 'green economy', 'circular economy',
        'climate change', 'global warming', 'carbon neutral', 'renewable energy',
        'solar power', 'wind power', 'hydropower', 'energy efficiency',
        'environmental protection', 'forest conservation', 'marine conservation',
        'wildlife protection', 'national park', 'unesco', 'world heritage',
        'cultural heritage', 'archaeological site', 'ancient city', 'temple',
        'dagoba', 'monastery', 'shrine', 'festival', 'perahera', 'vesak',
        'poson', 'diwali', 'christmas', 'eid', 'thai', 'sinhala hindu new year',
        'independence day', 'republic day', 'national day', 'heroes day'
      ];
      
      importantTerms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        point = point.replace(regex, `**${term}**`);
      });
      
      return point;
    });

  // Create recap from summary
  const recap = `In summary, ${summary.toLowerCase().replace(/^./, summary[0].toLowerCase())}`;

  // Build formatted response
  let formattedResponse = `${summary}\n\n`;
  
  if (mainPoints.length > 0) {
    formattedResponse += `## Key Points:\n\n`;
    mainPoints.forEach((point, index) => {
      formattedResponse += `${index + 1}. ${point}\n\n`;
    });
  }
  
  // Add Sri Lankan examples if the content seems relevant
  const textLower = text.toLowerCase();
  if (textLower.includes('government') || textLower.includes('democracy') || 
      textLower.includes('election') || textLower.includes('economy') || 
      textLower.includes('development') || textLower.includes('education') ||
      textLower.includes('technology') || textLower.includes('health') ||
      textLower.includes('environment') || textLower.includes('tourism') ||
      textLower.includes('agriculture') || textLower.includes('culture')) {
    
    formattedResponse += `## Sri Lankan Context:\n\n`;
    
    if (textLower.includes('government') || textLower.includes('democracy')) {
      formattedResponse += `For example, **Sri Lanka's parliamentary system** demonstrates democratic governance, with the **President** serving as head of state and the **Prime Minister** as head of government. The **Parliament** in **Sri Jayawardenepura Kotte** plays a crucial role in legislation.\n\n`;
    } 
    
    if (textLower.includes('economy') || textLower.includes('development')) {
      formattedResponse += `Consider **Sri Lanka's** focus on **tourism** (visiting **Sigiriya**, **Kandy**, **Galle**), **tea exports** from the **Central Highlands**, and **technology services** in **Colombo** as key economic sectors driving national development.\n\n`;
    }
    
    if (textLower.includes('education')) {
      formattedResponse += `**Sri Lanka** has a strong **education system** with prestigious institutions like the **University of Colombo**, **University of Peradeniya**, and **University of Moratuwa** contributing to national development.\n\n`;
    }
    
    if (textLower.includes('technology')) {
      formattedResponse += `**Sri Lanka's IT sector** is rapidly growing, with **Colombo** becoming a regional hub for **software development**, **BPO services**, and **fintech innovations**.\n\n`;
    }
    
    if (textLower.includes('health')) {
      formattedResponse += `**Sri Lanka** has achieved remarkable **health outcomes** with free **healthcare** and traditional **Ayurvedic medicine** alongside modern medical practices.\n\n`;
    }
    
    if (textLower.includes('environment')) {
      formattedResponse += `**Sri Lanka** is committed to **environmental protection** through initiatives like **Sinharaja Forest Reserve**, **marine conservation** around **Mirissa**, and **renewable energy** projects.\n\n`;
    }
    
    if (textLower.includes('tourism')) {
      formattedResponse += `**Sri Lanka's tourism** showcases diverse attractions from **ancient cities** like **Anuradhapura** and **Polonnaruwa** to **pristine beaches** in **Bentota** and **Arugam Bay**.\n\n`;
    }
    
    if (textLower.includes('agriculture')) {
      formattedResponse += `**Sri Lanka's agriculture** is renowned for **Ceylon tea** from **Nuwara Eliya**, **cinnamon** from **Galle**, and **coconut** cultivation across coastal areas.\n\n`;
    }
    
    if (textLower.includes('culture')) {
      formattedResponse += `**Sri Lankan culture** is rich with **Buddhist traditions**, **Hindu festivals**, multicultural harmony, and vibrant celebrations like **Kandy Perahera** and **Vesak**.\n\n`;
    }
  }
  
  formattedResponse += `---\n\n**${recap}**`;
  
  return formattedResponse;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onRate 
}) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {/* Avatar */}
      {isBot ? (
        <div className="flex flex-col items-center mr-3 select-none">
          <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-xl">
            <span>🤖</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center ml-3 select-none">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      )}
      {/* Bubble */}
      <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`p-4 rounded-xl border shadow-sm ${isBot
            ? 'bg-white border-primary/20 text-foreground font-mono'
            : 'bg-primary text-primary-foreground border-primary/40'}
          `}
        >
          {isBot ? (
            <div className="prose prose-sm max-w-none font-mono">
              <ReactMarkdown>{formatBotResponse(message.text)}</ReactMarkdown>
            </div>
          ) : (
            <span className="text-sm leading-relaxed">{message.text}</span>
          )}
        </div>
        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {/* Feedback for bot */}
        {isBot && onRate && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 p-1 hover:bg-success-light"
              onClick={() => onRate(message.id, 1)}
            >
              <ThumbsUp className="w-4 h-4 text-success" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 p-1 hover:bg-warning-light"
              onClick={() => onRate(message.id, -1)}
            >
              <ThumbsDown className="w-4 h-4 text-warning" />
            </Button>
            <div className="flex items-center ml-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-accent-light"
                  onClick={() => onRate(message.id, star)}
                >
                  <Star 
                    className={`w-3 h-3 ${
                      message.rating && star <= message.rating 
                        ? 'text-accent fill-accent' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};