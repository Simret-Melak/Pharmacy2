import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, X, Sparkles, Send } from 'lucide-react';
import { api } from '@/utils/api';

export default function Chatbot({ sessionId, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "👋 Hello! I'm PharmaBot, your pharmacy assistant. I can help with store hours, delivery info, prescription questions, and more! How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Load quick suggestions on mount
  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchSuggestions = async () => {
    try {
      const response = await api.get('/chatbot/suggestions');
      if (response.success) {
        setSuggestions(response.suggestions.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load suggestions:', err);
      // Default suggestions
      setSuggestions([
        'What are your store hours?',
        'How do I refill a prescription?',
        'Do you deliver medications?'
      ]);
    }
  };

  const sendMessage = async (quickQuestion = null) => {
    const messageToSend = quickQuestion || input.trim();
    if (!messageToSend.trim()) return;

    const userMessage = { 
      role: 'user', 
      text: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setIsTyping(true);
    
    if (!quickQuestion) {
      setInput('');
    }

    try {
      const response = await api.post('/chatbot/chat', {
        message: messageToSend,
        sessionId
      });

      if (response.success) {
        const botMessage = {
          role: 'bot', 
          text: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [...prev, { 
          role: 'bot', 
          text: 'Sorry, I could not respond. Please try again later or call us at (555) 123-4567.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      console.error('Chatbot API error:', err);
      setMessages((prev) => [...prev, { 
        role: 'bot', 
        text: 'I\'m having trouble connecting. Please call our pharmacy at (555) 123-4567 for immediate assistance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([{
      role: 'bot',
      text: "👋 Hello! I'm PharmaBot, your pharmacy assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-48px)] bg-white shadow-2xl rounded-2xl border border-emerald-200 flex flex-col overflow-hidden z-50 h-[600px]">
      
      {/* Fixed Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-t-2xl sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span>PharmaBot Assistant</span>
          <Sparkles className="h-4 w-4 text-yellow-300" />
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={clearChat}
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-white/20 rounded-full text-xs"
            title="Clear chat"
          >
            ↺
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-white/20 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-slate-50"
        style={{ maxHeight: 'calc(600px - 160px)' }}
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
                  <span className="text-white text-xs">U</span>
                ) : (
                  <span className="text-slate-600 text-xs">B</span>
                )}
              </div>
              <div>
                <div className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm ${msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'}`}
                >
                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>
                </div>
                <div className={`text-xs text-slate-500 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Quick Suggestions */}
        {messages.length <= 2 && suggestions.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-slate-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((question, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  variant="outline"
                  size="sm"
                  className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-4">
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

      {/* Fixed Input Area at bottom */}
      <div className="border-t border-slate-200 p-3 bg-white sticky bottom-0">
        <div className="flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about store hours, delivery, prescriptions..."
            className="flex-1 h-10 border border-slate-300 rounded-xl px-3 text-sm focus:ring-emerald-500 focus:border-emerald-500"
            disabled={loading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="ml-2 h-10 px-4 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Emergency Button */}
        <div className="mt-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs"
            onClick={() => window.open('tel:911')}
          >
            🚨 Emergency - Call 911
          </Button>
        </div>
        
        <div className="text-xs text-slate-500 text-center mt-2">
          <div className="flex items-center justify-center gap-2">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI-powered
            </span>
            <span>•</span>
            <span>For medical advice, consult pharmacist</span>
          </div>
        </div>
      </div>
    </div>
  );
}