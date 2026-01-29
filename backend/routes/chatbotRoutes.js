const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  chatWithAI,
  getChatSuggestions,
  clearChatHistory,
  testConnection
} = require('../controllers/chatbotController');

// Rate limiting for chatbot
const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many chatbot requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat endpoints
router.post('/chat', chatbotLimiter, chatWithAI);
router.get('/suggestions', getChatSuggestions);
router.post('/clear', clearChatHistory);
router.get('/test', testConnection);

// Export router
module.exports = router;