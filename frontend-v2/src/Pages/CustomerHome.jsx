import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import MedicationCard from '@/components/ui-custom/MedicationCard'; 
import { 
  Search, 
  ArrowRight, 
  Truck, 
  Shield, 
  Clock, 
  HeartPulse,
  Pill,
  Syringe,
  Stethoscope,
  Baby,
  Eye,
  Loader2,
  ShoppingCart,
  MessageCircle,
  Bot,
  User,
  Send,
  X,
  Sparkles,
  HelpCircle,
  Phone,
  CreditCard,
  Calendar,
  Star
} from 'lucide-react';
import { api } from '@/utils/api';

const categories = [
  { name: 'Pain Relief', icon: HeartPulse, color: 'bg-rose-100 text-rose-600' },
  { name: 'Vitamins', icon: Pill, color: 'bg-amber-100 text-amber-600' },
  { name: 'Antibiotics', icon: Syringe, color: 'bg-blue-100 text-blue-600' },
  { name: 'Heart Health', icon: Stethoscope, color: 'bg-purple-100 text-purple-600' },
  { name: 'Baby Care', icon: Baby, color: 'bg-pink-100 text-pink-600' },
  { name: 'Eye Care', icon: Eye, color: 'bg-cyan-100 text-cyan-600' },
];

// Chatbot component that uses your backend Gemini API
const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "👋 Hello! I'm PharmaBot, your Addis Pharmacy assistant. I can help with:\n• Store hours & location\n• Prescription refills\n• Delivery options\n• General pharmacy information\n• Payment methods\n• Emergency contacts\n\nHow can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => 
    'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  );
  const messagesEndRef = useRef(null);

  // Quick action questions
  const quickActions = [
    { icon: <Clock className="h-4 w-4" />, text: 'Store Hours', question: 'What are your store hours?' },
    { icon: <Truck className="h-4 w-4" />, text: 'Delivery', question: 'Do you deliver medications?' },
    { icon: <Pill className="h-4 w-4" />, text: 'Prescription', question: 'How do I refill a prescription?' },
    { icon: <CreditCard className="h-4 w-4" />, text: 'Payment', question: 'What payment methods do you accept?' },
    { icon: <HelpCircle className="h-4 w-4" />, text: 'Weekends', question: 'Are you open on weekends?' },
    { icon: <Shield className="h-4 w-4" />, text: 'Emergency', question: 'What should I do in a medication emergency?' },
  ];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // Call your backend Gemini API
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
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback response if API fails
        const errorMessage = {
          role: 'bot',
          text: "I apologize, I'm having trouble connecting. Please call us at (555) 123-4567 for assistance.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      
      // Fallback responses
      let fallbackResponse = "I'm experiencing technical difficulties. Please call our pharmacy directly at (555) 123-4567.";
      
      if (messageToSend.toLowerCase().includes('hour') || messageToSend.toLowerCase().includes('open')) {
        fallbackResponse = "Our store hours are: Monday-Friday 8AM-10PM, Saturday 9AM-8PM, Sunday 10AM-6PM.";
      } else if (messageToSend.toLowerCase().includes('deliver')) {
        fallbackResponse = "We offer free delivery within 5km (2-4 hours). For orders outside 5km, delivery fees apply.";
      } else if (messageToSend.toLowerCase().includes('prescription')) {
        fallbackResponse = "You can refill prescriptions by: 1) Uploading on our website/app 2) Calling (555) 123-4567 3) Visiting in person.";
      }
      
      const errorMessage = {
        role: 'bot',
        text: fallbackResponse + "\n\nNote: I'm an AI assistant. For medical advice, consult a pharmacist.",
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

  const handleEmergency = () => {
    window.open('tel:911');
  };

  const handleCallPharmacy = () => {
    window.open('tel:5551234567');
  };

  const clearChat = async () => {
    try {
      await api.post('/chatbot/clear', { sessionId });
      setMessages([{
        role: 'bot',
        text: "👋 Hello! I'm PharmaBot, your Addis Pharmacy assistant. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error('Failed to clear chat:', err);
      // Still clear locally
      setMessages([{
        role: 'bot',
        text: "👋 Hello! I'm PharmaBot, your Addis Pharmacy assistant. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-48px)] bg-white shadow-2xl rounded-2xl border border-emerald-200 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
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

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto h-80 bg-slate-50">
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
                <div className={`rounded-2xl px-4 py-3 whitespace-pre-line text-sm ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
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

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-4 pt-2 pb-3 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-2 font-medium">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                onClick={() => handleQuickAction(action.question)}
                variant="outline"
                size="sm"
                className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-8"
              >
                {action.icon}
                <span className="ml-1">{action.text}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-200 p-4 bg-white">
        <div className="space-y-3">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about store hours, prescriptions, delivery..."
              className="min-h-[60px] resize-none border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 pr-12 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700"
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>
          
          {/* Emergency & Info */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50 text-xs h-8"
              onClick={handleEmergency}
            >
              🚨 Emergency - 911
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs h-8"
              onClick={handleCallPharmacy}
            >
              📞 Call Pharmacy
            </Button>
          </div>
          
          <div className="text-xs text-slate-500 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Powered by Gemini AI
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                24/7 available
              </span>
            </div>
            <p className="mt-1 text-[10px]">
              ⚠️ For medical advice, consult our pharmacist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CustomerHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredMedications, setFeaturedMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState({});
  const [showChatbot, setShowChatbot] = useState(false);

  // Fetch featured medications on component mount
  useEffect(() => {
    fetchFeaturedMedications();
  }, []);

  const fetchFeaturedMedications = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch medications from backend with a limit of 4 for featured section
      const response = await api.get('/medications?page=1&limit=4');
      
      if (response.success && response.medications) {
        setFeaturedMedications(response.medications);
      } else {
        setError('Failed to load medications');
      }
    } catch (err) {
      console.error('Error fetching medications:', err);
      
      // If it's a 401 error (unauthorized), it might be because user is not logged in
      if (err.message.includes('401')) {
        setError('Please login to view medications');
      } else {
        setError(err.message || 'Failed to load medications. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      // If search query is empty, just redirect to all medications
      window.location.href = createPageUrl('CustomerMedications');
      return;
    }

    try {
      // Search medications by name
      const searchResponse = await api.get(`/medications/search?name=${encodeURIComponent(searchQuery)}&limit=10`);
      
      if (searchResponse.success) {
        // Redirect to medications page with search query
        window.location.href = createPageUrl(`CustomerMedications?search=${encodeURIComponent(searchQuery)}`);
      }
    } catch (err) {
      console.error('Search error:', err);
      // Still redirect to medications page even if search fails
      window.location.href = createPageUrl(`CustomerMedications?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (categoryName) => {
    window.location.href = createPageUrl(`CustomerMedications?category=${encodeURIComponent(categoryName)}`);
  };

  const handlePopularTermClick = (term) => {
    setSearchQuery(term);
  };

  const handleAddToCart = async (medication) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page
      window.location.href = createPageUrl('CustomerLogin');
      return;
    }

    // Check if prescription is required
    if (medication.is_prescription_required) {
      // Redirect to prescription upload page for this medication
      window.location.href = createPageUrl(`CustomerPrescriptionUpload/${medication.id}`);
      return;
    }

    setAddingToCart(prev => ({ ...prev, [medication.id]: true }));

    try {
      // TODO: Implement actual add to cart API call
      // For now, we'll simulate adding to cart
      console.log('Adding to cart:', medication);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success message
      alert(`Added ${medication.name} to cart!`);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [medication.id]: false }));
    }
  };

  const handleChatbotToggle = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-2 text-sm font-medium">
              🎉 Free delivery on orders over $50
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Health,<br />
              <span className="text-emerald-200">Delivered to Your Door</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-xl mx-auto">
              Access thousands of medications, upload prescriptions easily, and enjoy fast, reliable delivery.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-2 flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for medications, vitamins, health products..."
                    className="h-14 pl-12 border-0 text-base focus:ring-0"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  Search
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-emerald-100">
              <span>Popular:</span>
              {['Vitamins', 'Pain Relief', 'Antibiotics', 'Diabetes'].map((term) => (
                <Badge 
                  key={term} 
                  variant="outline" 
                  className="border-emerald-300/50 text-emerald-100 hover:bg-white/10 cursor-pointer"
                  onClick={() => handlePopularTermClick(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: 'Free Delivery', desc: 'On orders $50+' },
              { icon: Shield, label: 'Verified Medications', desc: '100% authentic' },
              { icon: Clock, label: '24/7 Support', desc: 'Always here for you' },
              { icon: HeartPulse, label: 'Expert Care', desc: 'Licensed pharmacists' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <feature.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{feature.label}</p>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Shop by Category</h2>
              <p className="text-slate-500 mt-1">Find what you need quickly</p>
            </div>
            <Link to={createPageUrl('CustomerMedications')}>
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all text-center cursor-pointer"
              >
                <div className={`h-16 w-16 rounded-2xl ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-slate-900">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Medications with MedicationCard */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Medications</h2>
              <p className="text-slate-500 mt-1">Most popular products this week</p>
            </div>
            <Link to={createPageUrl('CustomerMedications')}>
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-3 text-slate-600">Loading medications...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-2">{error}</div>
              <Button 
                variant="outline" 
                onClick={fetchFeaturedMedications}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : featuredMedications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMedications.map((medication) => (
                <MedicationCard 
                  key={medication.id}
                  medication={medication}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">No medications available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Have a Prescription?
                </h3>
                <p className="text-slate-400 max-w-lg">
                  Upload your prescription and our licensed pharmacists will review it. 
                  Get your medications delivered safely to your doorstep.
                </p>
              </div>
              <Link to={createPageUrl('CustomerPrescriptions')}>
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl whitespace-nowrap">
                  Upload Prescription
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CustomerFooter />

      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChatbot ? (
          <Chatbot 
            onClose={() => setShowChatbot(false)}
          />
        ) : (
          <Button
            onClick={handleChatbotToggle}
            className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg animate-bounce"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping" />
          </Button>
        )}
      </div>
    </div>
  );
}