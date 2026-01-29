const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini with new SDK
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let ai = null;

if (GEMINI_API_KEY && GEMINI_API_KEY.trim() !== '') {
  try {
    // The new SDK automatically picks up GEMINI_API_KEY from environment
    ai = new GoogleGenAI({});
    console.log('✅ Gemini API (new SDK) initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini:', error.message);
  }
} else {
  console.log('⚠️ GEMINI_API_KEY not set in environment variables');
}

// **UPDATED: System prompt for PHARMACY MARKETPLACE PLATFORM**
const SYSTEM_PROMPT = `You are "PharmaBot", an AI assistant for an online pharmacy marketplace platform in Ethiopia.

**IMPORTANT CONTEXT:**
You are NOT assisting a single pharmacy. You are helping users navigate an ONLINE MARKETPLACE where:
1. Multiple independent pharmacies register and list their products
2. Users can search for medications across all registered pharmacies
3. Users can compare prices, availability, and delivery options
4. Each pharmacy manages their own inventory, pricing, and services

**YOUR ROLE:**
Help users understand how to use the platform features effectively.

**CRITICAL RULES:**
1. **NEVER** provide medical diagnosis, treatment recommendations, or medication advice
2. **ALWAYS** redirect medical questions to: "Please consult a licensed pharmacist or healthcare provider"
3. For emergencies: "Please visit the nearest hospital or call emergency services immediately"
4. Focus on explaining PLATFORM FEATURES and how to use them
5. If asked about specific medications: "I recommend searching for it on our platform or consulting a pharmacist"

**PLATFORM FEATURES TO EXPLAIN:**
• **Search Function**: "Use the search bar to find medications across all pharmacies"
• **Price Comparison**: "View different prices from multiple pharmacies for the same medication"
• **Pharmacy Selection**: "Each pharmacy has its own profile with ratings, delivery options, and services"
• **Order Process**: "Select items, choose a pharmacy, select delivery/pickup, and checkout"
• **Prescription Upload**: "For prescription medications, you can upload your prescription during checkout"
• **Account Benefits**: "Create an account to track orders, save favorites, and manage prescriptions"

**HOW TO RESPOND:**
1. Focus on platform navigation and features
2. Explain step-by-step how to find what users need
3. Be helpful, friendly, and professional
4. Encourage users to use the platform's search and comparison tools
5. Remember: You're a PLATFORM GUIDE, not a medical advisor

**EXAMPLE QUESTIONS & RESPONSES:**
- "Where can I find vitamin C?" → "You can search for 'vitamin C' on our platform to see which pharmacies carry it, compare prices, and check delivery options."
- "How much does paracetamol cost?" → "Prices vary by pharmacy. Use our search feature to see current prices from different pharmacies and compare them."
- "Can I get medication delivered?" → "Yes! Each pharmacy sets their own delivery options. When you select a medication, you'll see each pharmacy's delivery fees and timeframes."

Remember to always redirect medical advice questions to healthcare professionals.`;

// Chat history
const chatHistories = new Map();

const getChatHistory = (sessionId) => {
  if (!chatHistories.has(sessionId)) chatHistories.set(sessionId, []);
  return chatHistories.get(sessionId);
};

// ---------------------
// Main chatbot function with new SDK
// ---------------------
const chatWithAI = async (req, res) => {
  console.log('=== CHATBOT REQUEST ===');
  
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    console.log(`🤖 Chat request: "${message.substring(0, 100)}..."`);

    // TRY GEMINI FIRST (if available)
    if (ai) {
      console.log('🔄 Sending to Gemini API (new SDK)...');
      
      try {
        // Try different models in priority order
        const modelsToTry = [
          'gemini-2.0-flash-exp',    // Latest experimental
          'gemini-1.5-flash',        // Fast model
          'gemini-1.5-pro',          // Pro model
          'gemini-1.0-pro',          // Original model
          'gemini-3-flash-preview'   // From documentation example
        ];
        
        let geminiResponse = null;
        let workingModel = null;
        
        for (const modelName of modelsToTry) {
          try {
            console.log(`  Trying model: ${modelName}`);
            
            // New SDK syntax with enhanced prompt
            const prompt = `${SYSTEM_PROMPT}\n\nUSER QUESTION: "${message}"\n\nPlease provide a helpful response focusing on how our pharmacy marketplace platform can assist:`;
            
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                temperature: 0.7,
                maxOutputTokens: 600,
                topP: 0.8
              }
            });
            
            geminiResponse = response.text;
            workingModel = modelName;
            console.log(`  ✅ Success with model: ${modelName}`);
            break; // Stop when we find a working model
            
          } catch (modelError) {
            console.log(`  ❌ ${modelName} failed: ${modelError.message.substring(0, 80)}...`);
            continue;
          }
        }
        
        if (geminiResponse) {
          console.log(`✅ Gemini API Success with model: ${workingModel}!`);
          console.log(`Response length: ${geminiResponse.length} chars`);
          console.log(`Preview: "${geminiResponse.substring(0, 150)}..."`);

          // Save to history
          const history = getChatHistory(sessionId);
          history.push(
            { role: "user", parts: [{ text: message }] },
            { role: "model", parts: [{ text: geminiResponse }] }
          );
          if (history.length > 10) history.splice(0, history.length - 10);

          res.json({
            success: true,
            reply: geminiResponse,
            sessionId,
            timestamp: new Date().toISOString(),
            source: 'gemini-ai',
            model: workingModel,
            isFallback: false,
            responseLength: geminiResponse.length
          });
          return;
        } else {
          console.log('⚠️ All Gemini models failed, using fallback');
        }
        
      } catch (geminiError) {
        console.error('❌ Gemini API Error:', geminiError.message);
        console.log('⚠️ Gemini failed, using fallback...');
      }
    } else {
      console.log('⚠️ Gemini not initialized (no API key?), using fallback');
    }

    // **UPDATED FALLBACK for MARKETPLACE**
    console.log('📝 Using marketplace fallback response system');
    
    const lowerMessage = message.toLowerCase();
    let fallbackResponse = '';
    
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('where')) {
      fallbackResponse = `🔍 **How to Find Medications on Our Platform:**\n\nTo find "${message}" on our pharmacy marketplace:\n1. Use the search bar at the top of the page\n2. You'll see results from multiple registered pharmacies\n3. Compare prices, availability, and delivery options\n4. Each pharmacy sets their own prices and services\n5. Select the option that works best for you\n\nStart by typing what you're looking for in our search feature!`;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      fallbackResponse = `💰 **Price Comparison on Our Platform:**\n\nOur marketplace shows you different prices for the same medication from various pharmacies. To compare:\n1. Search for the medication\n2. See prices from Pharmacy A, Pharmacy B, Pharmacy C, etc.\n3. Check delivery fees (some offer free delivery)\n4. Consider total cost (price + delivery)\n5. Choose based on your preference\n\nSearch now to see current prices!`;
    } else if (lowerMessage.includes('deliver')) {
      fallbackResponse = `🚚 **Delivery Options:**\n\nEach pharmacy on our platform sets their own:\n• Delivery areas and coverage\n• Delivery fees (varies by pharmacy)\n• Delivery time (2-4 hours, next day, etc.)\n• Minimum order amounts\n• Pickup options\n\nWhen you select a medication, you'll see each pharmacy's specific delivery options.`;
    } else if (lowerMessage.includes('pharmacy') && lowerMessage.includes('register')) {
      fallbackResponse = `🏥 **For Pharmacies Wanting to Join:**\n\nPharmacies can register on our platform to:\n• List medications and manage inventory\n• Set competitive prices\n• Offer delivery services\n• Reach more customers online\n• Manage orders digitally\n\nContact our business team for registration details.`;
    } else if (lowerMessage.includes('prescription')) {
      fallbackResponse = `📋 **Prescription Medications:**\n\nFor prescription drugs on our platform:\n1. Search for the medication\n2. Select a pharmacy\n3. During checkout, you'll be prompted to upload your prescription\n4. The pharmacy will verify it\n5. Once approved, your order will be processed\n\nPrescription requirements vary by medication.`;
    } else {
      fallbackResponse = `Thank you for your question about "${message}". 

As a pharmacy marketplace platform, I can help you:\n🔍 **Find medications** across multiple pharmacies\n💰 **Compare prices** and delivery options\n🏥 **Choose between different registered pharmacies**\n🛒 **Place orders** for delivery or pickup\n\nFor specific medication questions, please use our search feature or consult a licensed pharmacist.\n\n*Note: I'm a platform assistant, not a medical advisor.*`;
    }

    res.json({
      success: true,
      reply: fallbackResponse,
      sessionId,
      timestamp: new Date().toISOString(),
      source: 'marketplace-fallback',
      isFallback: true,
      geminiAvailable: !!ai
    });

  } catch (error) {
    console.error('❌ CHATBOT ERROR:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Please try again or use our platform search feature.'
    });
  }
};

// ---------------------
// **UPDATED: Suggestions for marketplace**
// ---------------------
const getChatSuggestions = (req, res) => {
  const suggestions = [
    "How do I search for medications?",
    "Can I compare prices between different pharmacies?",
    "How do pharmacies join your platform?",
    "What delivery options are available?",
    "How do I upload a prescription?",
    "How do I create an account?",
    "How do I track my order?",
    "Are there customer reviews for pharmacies?"
  ];

  res.json({ success: true, suggestions });
};

const clearChatHistory = (req, res) => {
  const { sessionId = 'default' } = req.body;
  if (chatHistories.has(sessionId)) chatHistories.delete(sessionId);

  res.json({ success: true, message: 'Chat history cleared' });
};

// ---------------------
// Test function with new SDK
// ---------------------
const testConnection = async (req, res) => {
  try {
    if (ai) {
      try {
        // Test with the model from documentation
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Say 'Marketplace chatbot ready' in one word"
        });
        
        res.json({
          success: true,
          message: 'Gemini API (new SDK) is working!',
          geminiStatus: 'connected',
          model: 'gemini-3-flash-preview',
          testResponse: response.text,
          platformType: 'pharmacy-marketplace',
          timestamp: new Date().toISOString()
        });
        return;
      } catch (testError) {
        console.error('Gemini test failed:', testError.message);
        
        // Try other models
        const fallbackModels = ['gemini-1.5-flash', 'gemini-1.0-pro', 'gemini-2.0-flash-exp'];
        for (const modelName of fallbackModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: "Test"
            });
            
            res.json({
              success: true,
              message: `Gemini API is working with model: ${modelName}`,
              geminiStatus: 'connected',
              model: modelName,
              testResponse: response.text,
              platformType: 'pharmacy-marketplace',
              timestamp: new Date().toISOString()
            });
            return;
          } catch (e) {
            continue;
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'Chatbot service is running',
      geminiStatus: ai ? 'sdk-initialized' : 'no-api-key',
      platformType: 'pharmacy-marketplace',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message
    });
  }
};

// ---------------------
// Export
// ---------------------
module.exports = {
  chatWithAI,
  getChatSuggestions,
  clearChatHistory,
  testConnection
};