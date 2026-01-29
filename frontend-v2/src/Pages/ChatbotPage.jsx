import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Clock, 
  Phone, 
  MapPin, 
  Truck, 
  CreditCard,
  Pill,
  Loader2,
  X,
  Sparkles,
  Zap,
  HelpCircle,
  Calendar,
  Shield,
  Star
} from 'lucide-react';
import { chatbotAPI, chatbotUtils } from '@/utils/api';
import { createPageUrl } from '@/utils';

export default function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => chatbotUtils.generateSessionId());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = chatbotUtils.getWelcomeMessage();
    setMessages([welcomeMessage]);
    scrollToBottom();
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Quick action questions
  const quickActions = [
    {
      icon: <Clock className="h-4 w-4" />,
      text: 'Store Hours',
      question: 'What are your store hours?'
    },
    {
      icon: <Truck className="h-4 w-4" />,
      text: 'Delivery',
      question: 'Do you deliver medications? What are the delivery options?'
    },
    {
      icon: <Pill className="h-4 w-4" />,
      text: 'Prescription',
      question: 'How do I refill a prescription?'
    },
    {
      icon: <Phone className="h-4 w-4" />,
      text: 'Contact',
      question: 'What is your phone number and address?'
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      text: 'Payment',
      question: 'What payment methods do you accept?'
    },
    {
      icon: <Shield className="h-4 w-4" />,
      text: 'Emergency',
      question: 'What should I do in a medication emergency?'
    }
  ];

  // Pharmacy quick info
  const pharmacyInfo = [
    { icon: <Clock className="h-4 w-4" />, label: 'Hours', value: 'Mon-Fri 8AM-10PM' },
    { icon: <Phone className="h-4 w-4" />, label: 'Phone', value: '(555) 123-4567' },
    { icon: <MapPin className="h-4 w-4" />, label: 'Address', value: '123 Pharmacy St' },
    { icon: <Truck className="h-4 w-4" />, label: 'Delivery', value: 'Free within 5km' }
  ];

  const sendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || input.trim();
    
    if (!messageToSend) return;

    // Add user message
    const userMessage = {
      role: 'user',
      text: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    if (!customMessage) {
      setInput('');
    }

    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await chatbotAPI.sendMessage(messageToSend, sessionId);
      
      if (response.success) {
        const botMessage = {
          role: 'bot',
          text: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage = {
          role: 'bot',
          text: "I apologize, I'm having trouble responding. Please call us at (555) 123-4567 for assistance.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        role: 'bot',
        text: "I'm experiencing technical difficulties. Please call our pharmacy directly at (555) 123-4567.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (question) => {
    sendMessage(question);
  };

  const clearChat = async () => {
    try {
      await chatbotAPI.clearHistory(sessionId);
      const welcomeMessage = chatbotUtils.getWelcomeMessage();
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  const handleEmergency = () => {
    window.open('tel:911');
  };

  const handleCallPharmacy = () => {
    window.open('tel:5551234567');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <CustomerHeader />
        
        {/* Page Header - Fixed */}
        <div className="border-t border-slate-100 bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                      PharmaBot Assistant
                    </h1>
                    <p className="text-slate-500 flex items-center gap-2 mt-1">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      AI-powered pharmacy assistant available 24/7
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl('CustomerMedications'))}
                  className="border-slate-200"
                >
                  Browse Medications
                </Button>
                <Button
                  variant="outline"
                  onClick={clearChat}
                  className="border-slate-200"
                >
                  Clear Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Quick Info */}
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-600" />
                  Quick Pharmacy Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pharmacyInfo.map((info, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <div className="text-emerald-600">
                        {info.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{info.label}</p>
                      <p className="text-sm text-slate-600">{info.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-emerald-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    onClick={() => handleQuickAction(action.question)}
                    className="w-full justify-start h-auto py-3 px-4 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-emerald-600">
                        {action.icon}
                      </div>
                      <span className="text-left">{action.text}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Section */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                  <Shield className="h-5 w-5" />
                  Emergency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-red-600">
                  In case of medical emergency or adverse drug reaction:
                </p>
                <Button
                  onClick={handleEmergency}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  🚨 Call 911
                </Button>
                <Button
                  onClick={handleCallPharmacy}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-100"
                >
                  📞 Call Pharmacy
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 h-full flex flex-col">
              {/* Fixed Chat Header */}
              <CardHeader className="border-b border-slate-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                    Chat with PharmaBot
                  </CardTitle>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Assistant
                  </Badge>
                </div>
              </CardHeader>
              
              {/* Scrollable Messages Container */}
              <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 md:p-6 chatbot-scroll-container"
                    style={{ maxHeight: 'calc(70vh - 120px)' }}
                  >
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                      >
                        <div className={`inline-flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                            msg.role === 'user' 
                              ? 'bg-emerald-600 ml-3' 
                              : 'bg-slate-100 mr-3'
                          }`}>
                            {msg.role === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <div className={`rounded-2xl px-4 py-3 ${
                              msg.role === 'user'
                                ? 'bg-emerald-600 text-white rounded-br-none'
                                : 'bg-slate-100 text-slate-800 rounded-bl-none'
                            }`}>
                              <div className="whitespace-pre-line text-sm md:text-base">
                                {msg.text}
                              </div>
                            </div>
                            <div className={`text-xs text-slate-500 mt-1 ${
                              msg.role === 'user' ? 'text-right' : 'text-left'
                            }`}>
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Bot className="h-4 w-4" />
                        <div className="flex gap-1">
                          <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />
                          <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                          <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                        </div>
                        <span>PharmaBot is typing...</span>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Fixed Input Area at Bottom */}
                  <div className="border-t border-slate-200 p-4 md:p-6 bg-white sticky bottom-0">
                    <div className="space-y-4">
                      <div className="relative">
                        <Textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Ask about store hours, prescriptions, delivery, medications..."
                          className="min-h-[100px] resize-none border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 pr-12"
                          disabled={isLoading}
                        />
                        <Button
                          onClick={() => sendMessage()}
                          disabled={isLoading || !input.trim()}
                          className="absolute right-2 bottom-2 h-10 w-10 p-0 bg-emerald-600 hover:bg-emerald-700"
                          size="icon"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="text-xs text-slate-500 text-center">
                        <div className="flex items-center justify-center gap-4">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            AI-powered responses
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Secure & private
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            24/7 availability
                          </span>
                        </div>
                        <p className="mt-2">
                           For medical advice, always consult our pharmacist. AI assistant provides general information only.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Tips for Best Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Be Specific',
                    description: 'Mention medication names or specific concerns'
                  },
                  {
                    title: 'Ask Follow-ups',
                    description: 'Feel free to ask clarifying questions'
                  },
                  {
                    title: 'Use Keywords',
                    description: 'Hours, delivery, prescription, contact, etc.'
                  },
                  {
                    title: 'Check Information',
                    description: 'Verify important details with pharmacist'
                  }
                ].map((tip, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50">
                    <h4 className="font-semibold text-slate-900 mb-1">{tip.title}</h4>
                    <p className="text-sm text-slate-600">{tip.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CustomerFooter />

      {/* Add this CSS for custom scrollbar */}
      <style jsx>{`
        .chatbot-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        
        .chatbot-scroll-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .chatbot-scroll-container::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        
        .chatbot-scroll-container::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        
        .chatbot-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}