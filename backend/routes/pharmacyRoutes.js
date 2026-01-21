// routes/pharmacyRoutes.js
const express = require('express');
const { authenticateToken } = require('../controllers/authController');
const pharmacyController = require('../controllers/pharmacyController');
const router = express.Router();

// Get current user's pharmacy
router.get('/my-pharmacy', authenticateToken, pharmacyController.getMyPharmacy);

// Get pharmacy by ID
router.get('/:id', authenticateToken, pharmacyController.getPharmacyById);

// Get all pharmacies (admin only)
router.get('/', authenticateToken, pharmacyController.getAllPharmacies);

// Update pharmacy
router.put('/:id', authenticateToken, pharmacyController.updatePharmacy);

// Assign pharmacist to pharmacy (admin only)
router.post('/assign-pharmacist', authenticateToken, pharmacyController.assignPharmacist);

module.exports = router; // ⬅️ MUST export the router