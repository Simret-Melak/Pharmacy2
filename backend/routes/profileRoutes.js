const express = require('express');
const { authenticateToken } = require('../controllers/authController');
const profileController = require('../controllers/profileController');

const router = express.Router();

// Apply authentication to all routes (user must be logged in)
router.use(authenticateToken);

// ========== PROFILE ROUTES ========== //

// GET /api/profile - Get current user's profile
router.get('/', profileController.getProfile);

// PUT /api/profile - Update user profile
router.put('/', profileController.updateProfile);

// POST /api/profile/change-password - Change password
router.post('/change-password', profileController.changePassword);

// ========== ADDRESS ROUTES ========== //

// GET /api/profile/addresses - Get all user addresses
router.get('/addresses', profileController.getAddresses);

// POST /api/profile/addresses - Add new address
router.post('/addresses', profileController.addAddress);

// PUT /api/profile/addresses/:addressId - Update specific address
router.put('/addresses/:addressId', profileController.updateAddress);

// DELETE /api/profile/addresses/:addressId - Delete address
router.delete('/addresses/:addressId', profileController.deleteAddress);



module.exports = router;