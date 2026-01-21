const express = require('express');
const { authenticateToken, requireAdminOrPharmacist } = require('../controllers/authController');
const medicationController = require('../controllers/medicationController');
const { medicationUpload, handleMulterError } = require('../config/multerR2Config'); 
const router = express.Router();

// Add medication with image upload
router.post(
  '/',
  authenticateToken,
  requireAdminOrPharmacist,
  medicationUpload.single('image'),
  handleMulterError,
  medicationController.addMedication
);

// 📌 Static and specific routes FIRST
router.get('/search', medicationController.searchMedicationsByName);
router.get('/suggestions', medicationController.getMedicationSuggestions);

// 📌 General list route
router.get('/', medicationController.getMedications);

// 📌 ID-based routes LAST (important!)
router.get('/:id', medicationController.getMedicationById);
router.put(
  '/:id',
  authenticateToken,
  requireAdminOrPharmacist,
  medicationUpload.single('image'),
  handleMulterError,
  medicationController.updateMedication
);
router.delete('/:id', authenticateToken, requireAdminOrPharmacist, medicationController.deleteMedication);
router.patch('/:id/stock', authenticateToken, requireAdminOrPharmacist, medicationController.updateStock);

module.exports = router;
