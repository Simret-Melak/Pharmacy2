// routes/cartRoutes.js - UPDATED VERSION
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// ✅ CHANGE THIS LINE:
// const { checkAuth } = require('../middleware/authMiddleware'); // OLD - DELETE

// ✅ TO THIS (use your Supabase auth):
const { authenticateToken } = require('../controllers/authController');

// ✅ Update all routes to use authenticateToken instead of checkAuth
router.post('/add', authenticateToken, cartController.addToCart);
router.get('/', authenticateToken, cartController.getCart);
router.put('/:medId', authenticateToken, cartController.updateCartItem);
router.delete('/clear', authenticateToken, cartController.clearCart);

module.exports = router;