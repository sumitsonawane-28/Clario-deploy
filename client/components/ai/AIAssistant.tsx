import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Clock, CheckCircle, Sun, Moon, Sparkles, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

// Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// System prompt for ADHD support
const SYSTEM_PROMPT = `You are a helpful AI assistant specialized in supporting people with ADHD. Your responses should be:
- Brief and to the point (1-2 sentences when possible)
- Use simple, clear language
- Break down complex tasks into small, manageable steps
- Be encouraging and non-judgmental
- Use bullet points or numbered lists for clarity
- If asked about schedules, create a simple, flexible daily routine with time blocks
- Help with decision making by providing clear options
- Suggest focus techniques like Pomodoro or timeboxing when relevant`;

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
};

interface AIAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AIAssistant({ open, onOpenChange }: AIAssistantProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Demo prompts for quick access
  const demoPrompts = [
    {
      title: "Daily Schedule",
      description: "Create a schedule for my workday",
      icon: <Clock className="h-5 w-5 mt-0.5 text-cyan-500 flex-shrink-0" />,
      prompt: "Create a daily schedule for me"
    },
    {
      title: "Break Down Tasks",
      description: "Help me organize my project",
      icon: <Target className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />,
      prompt: "Help me organize my project tasks"
    },
    {
      title: "Focus Help",
      description: "I'm having trouble focusing",
      icon: <Sun className="h-5 w-5 mt-0.5 text-amber-500 flex-shrink-0" />,
      prompt: "I need help staying focused"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const simulateTyping = async (text: string, callback: (chunk: string) => void) => {
    const words = text.split(' ');
    let currentText = '';
    
    for (const word of words) {
      // Add a small random delay between words (50-150ms)
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      currentText += (currentText ? ' ' : '') + word;
      callback(currentText);
    }
  };

  const generateResponse = async (userInput: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock responses for demo purposes
    const demoResponses: Record<string, string> = {
      // Schedule related
      "schedule": "Here's a balanced work schedule for you:\n\n9:00-10:30 - Deep work session (most important task)\n10:30-10:45 - Short break (stretch, hydrate)\n10:45-12:00 - Meetings/Emails\n12:00-13:00 - Lunch break (step away from screen)\n13:00-14:30 - Focused work session\n14:30-14:45 - Short walk/stretch\n14:45-16:00 - Collaborative work/Meetings\n16:00-16:15 - Afternoon break\n16:15-17:00 - Wrap up tasks/plan for tomorrow",
      
      // Task breakdown
      "organize": "Let's break down your project into manageable tasks:\n\n1. Define project scope and objectives\n2. Create a list of all required tasks\n3. Prioritize tasks (High/Medium/Low)\n4. Estimate time for each task\n5. Set milestones and deadlines\n6. Assign tasks if working in a team\n7. Set up progress tracking",
      
      // Focus help
      "focus": "Try these focus techniques:\n\n• Pomodoro: 25 min work / 5 min break\n• Time blocking: Assign specific time slots for tasks\n• Two-minute rule: If it takes <2 min, do it now\n• Eat the frog: Do the hardest task first\n• Website blockers: Use apps to block distractions",
      
      // Default response
      "default": "I'm here to help you stay productive and focused. Here are some things I can help with:\n\n• Creating daily schedules\n• Breaking down projects\n• Focus techniques\n• Task prioritization\n• Time management"
    };

    // Check which demo response to show
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('schedule') || lowerInput.includes('daily') || lowerInput.includes('plan')) {
      return demoResponses.schedule;
    } else if (lowerInput.includes('organize') || lowerInput.includes('project') || lowerInput.includes('task')) {
      return demoResponses.organize;
    } else if (lowerInput.includes('focus') || lowerInput.includes('concentrate') || lowerInput.includes('distract')) {
      return demoResponses.focus;
    }
    
    return demoResponses.default;
  };

  const handleDemoPrompt = async (prompt: string) => {
    setInput(prompt);
    // Small delay to allow the input to update
    await new Promise(resolve => setTimeout(resolve, 100));
    await handleSubmit(new Event('submit') as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInput = input.trim();
    if (!userInput || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add a temporary typing indicator
    const tempAiMessage: Message = {
      id: `typing-${Date.now()}`,
      content: "",
      role: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    
    setMessages(prev => [...prev, tempAiMessage]);

    try {
      const response = await generateResponse(userInput);
      
      // Remove the typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== tempAiMessage.id));
      
      // Add the actual response with typing effect
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: 'assistant',
        timestamp: new Date(),
      };
      
      // Add the message with empty content first
      setMessages(prev => [...prev, aiMessage]);
      
      // Simulate typing effect
      setIsTyping(true);
      await simulateTyping(response, (chunk) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id ? { ...msg, content: chunk } : msg
        ));
      });
    } catch (error) {
      // Silent error handling for demo purposes
      console.error('Demo response error:', error);
      return "Here's a helpful response for your query.";
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh] max-h-screen">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-lg font-semibold">AI Assistant</DrawerTitle>
                <DrawerDescription>How can I help you today?</DrawerDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DrawerHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground p-4">
                  <Bot className="h-12 w-12 mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">ADHD Support Assistant</h3>
                  <p className="text-sm mb-4">I'm here to help you stay focused and organized. Try one of these prompts:</p>
                  
                  <div className="space-y-3 w-full max-w-md">
                    {demoPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleDemoPrompt(prompt.prompt)}
                        className="w-full text-left transition-all hover:scale-[1.02] active:scale-[0.99]"
                        disabled={isLoading || isTyping}
                      >
                        <div className="flex items-start gap-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-transparent hover:border-primary/30">
                          <div className="flex-shrink-0">
                            {prompt.icon}
                          </div>
                          <div>
                            <p className="font-medium text-left">{prompt.title}</p>
                            <p className="text-sm text-muted-foreground text-left">{prompt.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 max-w-3xl mx-auto transition-all duration-200",
                      message.role === 'user' ? 'justify-end' : 'justify-start',
                      message.isTyping ? 'opacity-80' : 'opacity-100'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src="/ai-avatar.png" alt="AI" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <div className={cn(
                        "rounded-lg p-4 inline-block",
                        message.role === 'user'
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-slate-100 dark:bg-slate-800 text-black"
                      )}>
                        {message.isTyping ? (
                          <div className="flex space-x-2 py-1">
                            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        ) : (
                          <p className="whitespace-pre-line">{message.content}</p>
                        )}
                      </div>
                      <p className={cn(
                        "text-xs mt-1",
                        message.role === 'user' 
                          ? 'text-primary-foreground/70 text-right' 
                          : 'text-muted-foreground'
                      )}>
                        {!message.isTyping && formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={!input.trim() || isLoading}>
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
