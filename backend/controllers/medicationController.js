const { validationResult } = require('express-validator');
const multer = require('multer');
const medicationImageService = require('../services/medicationImageService');
const { createClient } = require('@supabase/supabase-js');

const medicationUpload = require('../config/multerR2Config');

// ✅ Use the same pattern as your admin controller
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);



// Add medication with image
exports.addMedication = async (req, res) => {
  console.log('=== START addMedication ===');
  console.log('📋 Request Body:', JSON.stringify(req.body, null, 2));
  console.log('👤 User from JWT:', req.user);
  console.log('📁 File uploaded:', req.file ? 'Yes' : 'No');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if user is admin or pharmacist
  if (req.user.role !== 'admin' && req.user.role !== 'pharmacist') {
    console.log('❌ Unauthorized role:', req.user.role);
    return res.status(403).json({ 
      success: false,
      message: 'Unauthorized - Admin or pharmacist access required' 
    });
  }

  const {
    name,
    category,
    dosage,
    price,
    description,
    stock_quantity,
    is_prescription_required,
    pharmacy_id: formPharmacyId
  } = req.body;

  console.log('📊 Form pharmacy_id:', formPharmacyId);
  console.log('🎭 User role:', req.user.role);

  try {
    // ============================================
    // CRITICAL FIX: Get pharmacist's pharmacy_id
    // ============================================
    let finalPharmacyId = formPharmacyId;
    
    // If pharmacist and no pharmacy_id in form, fetch from database
    if (!finalPharmacyId && req.user.role === 'pharmacist') {
      console.log('🔍 Fetching pharmacy_id for pharmacist...');
      console.log('👤 Pharmacist user ID:', req.user.userId);
      
      // First, let's verify the user exists in auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(req.user.userId);
      
      if (authError) {
        console.error('❌ Error fetching auth user:', authError);
      } else {
        console.log('✅ Auth user found:', authUser.user?.email);
      }
      
      // Query clients table
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('pharmacy_id, role')
        .eq('id', req.user.userId)  // This should match auth.users.id
        .single();
      
      console.log('📊 Client query result:', { client, clientError });
      
      if (clientError) {
        console.error('❌ Error fetching client data:', clientError);
        console.error('Error details:', clientError.message, clientError.details);
        return res.status(400).json({
          success: false,
          message: 'Unable to fetch your pharmacy information. Please contact administrator.'
        });
      }
      
      if (!client) {
        console.error('❌ No client record found for user:', req.user.userId);
        return res.status(400).json({
          success: false,
          message: 'Your account is not registered as a pharmacist. Please contact administrator.'
        });
      }
      
      if (!client.pharmacy_id) {
        console.error('❌ Client found but pharmacy_id is null/empty');
        console.log('Client record:', client);
        return res.status(400).json({
          success: false,
          message: 'Your account is not associated with a pharmacy. Please contact your administrator.'
        });
      }
      
      finalPharmacyId = client.pharmacy_id;
      console.log('✅ Found pharmacy_id:', finalPharmacyId);
      console.log('📝 Client role:', client.role);
    }
    
    // For admins, they can specify pharmacy_id in form
    if (!finalPharmacyId && req.user.role === 'admin') {
      console.log('❌ Admin user but no pharmacy_id provided');
      return res.status(400).json({
        success: false,
        message: 'Pharmacy ID is required for admin users'
      });
    }
    
    if (!finalPharmacyId) {
      console.log('❌ No pharmacy_id determined at all');
      return res.status(400).json({
        success: false,
        message: 'Unable to determine pharmacy'
      });
    }
    
    console.log('🎯 Final pharmacy_id to use:', finalPharmacyId);
    
    // Verify the pharmacy exists
    const { data: pharmacy, error: pharmacyError } = await supabase
      .from('pharmacies')
      .select('id, name')
      .eq('id', finalPharmacyId)
      .single();
    
    if (pharmacyError || !pharmacy) {
      console.error('❌ Pharmacy not found:', pharmacyError);
      return res.status(400).json({
        success: false,
        message: 'Associated pharmacy not found in database'
      });
    }
    
    console.log('✅ Pharmacy verified:', pharmacy.name);
    // ============================================

    let imageData = null;

    console.log('📝 Preparing to insert medication...');
    console.log('💊 Medication details:', {
      name,
      category,
      dosage,
      price,
      stock_quantity,
      pharmacy_id: finalPharmacyId,
      created_by: req.user.userId
    });

    // Insert medication into database FIRST to get the real ID
    const { data: medication, error } = await supabase
      .from('medications')
      .insert([{
        name,
        category,
        dosage,
        price: parseFloat(price),
        description,
        stock_quantity: parseInt(stock_quantity) || 0,
        online_stock: parseInt(stock_quantity) || 0,
        in_person_stock: 0,
        is_prescription_required: is_prescription_required || false,
        pharmacy_id: finalPharmacyId,
        created_by: req.user.userId,
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error inserting medication:', error);
      console.error('Error details:', error.message, error.details);
      throw error;
    }

    console.log('✅ Medication created with ID:', medication.id);
    console.log('📋 Medication created:', medication);

    // Handle image upload if provided
    if (req.file) {
      console.log('📸 Processing medication image upload with real ID...');
      
      imageData = await medicationImageService.uploadMedicationImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        medication.id,
        name,
        category,
        dosage
      );

      console.log('✅ Image uploaded:', imageData);

      // Update medication with image data
      const { error: updateError } = await supabase
        .from('medications')
        .update({
          image_url: imageData.publicUrl,
          image_key: imageData.fileKey,
          image_size: imageData.size,
          image_mime_type: imageData.mimeType
        })
        .eq('id', medication.id);

      if (updateError) {
        console.error('❌ Error updating medication with image:', updateError);
        // Clean up uploaded image if database update fails
        if (imageData) {
          await medicationImageService.deleteMedicationImage(imageData.fileKey);
        }
        throw updateError;
      }

      // Refresh medication data with image info
      const { data: updatedMedication } = await supabase
        .from('medications')
        .select('*')
        .eq('id', medication.id)
        .single();

      console.log('✅ Medication added successfully with image:', medication.id);

      return res.status(201).json({
        success: true,
        message: 'Medication added successfully',
        medication: updatedMedication,
        pharmacy_name: pharmacy.name
      });
    }

    // If no image, return the original medication data
    console.log('✅ Medication added successfully (no image):', medication.id);

    res.status(201).json({
      success: true,
      message: 'Medication added successfully',
      medication,
      pharmacy_name: pharmacy.name
    });

  } catch (error) {
    console.error('❌ Add medication error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to add medication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      debug: process.env.NODE_ENV === 'development' ? {
        userId: req.user?.userId,
        role: req.user?.role
      } : undefined
    });
  } finally {
    console.log('=== END addMedication ===');
  }
};
// Update medication with image

exports.updateMedication = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'pharmacist') {
    return res.status(403).json({ 
      success: false,
      message: 'Admin or pharmacist access required' 
    });
  }

  const { id } = req.params;
  const updateData = req.body;

  try {
    // Get current medication data
    const { data: currentMedication, error: fetchError } = await supabase
      .from('medications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentMedication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Verify pharmacist can only update their pharmacy's medications
    if (req.user.role === 'pharmacist' && currentMedication.pharmacy_id !== req.user.pharmacy_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update medications from your pharmacy'
      });
    }

    let imageData = null;

    // Handle new image upload
    if (req.file) {
      console.log('📸 Updating medication image...');
      
      imageData = await medicationImageService.updateMedicationImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        id, // Real medication ID
        currentMedication.name, // Medication name
        currentMedication.category, // Category
        currentMedication.dosage, // Dosage
        currentMedication.image_key // Pass old image key for cleanup
      );

      updateData.image_url = imageData.publicUrl;
      updateData.image_key = imageData.fileKey;
      updateData.image_size = imageData.size;
      updateData.image_mime_type = imageData.mimeType;
    }

    // Update medication in database
    const { data: medication, error } = await supabase
      .from('medications')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Clean up new image if database update fails
      if (imageData) {
        await medicationImageService.deleteMedicationImage(imageData.fileKey);
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Medication updated successfully',
      medication
    });

  } catch (error) {
    console.error('Update medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update medication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Delete medication
exports.deleteMedication = async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'pharmacist') {
    return res.status(403).json({ 
      success: false,
      message: 'Admin or pharmacist access required' 
    });
  }

  const { id } = req.params;

  try {
    // Get medication data first
    const { data: medication, error: fetchError } = await supabase
      .from('medications')
      .select('image_key, pharmacy_id')
      .eq('id', id)
      .single();

    if (fetchError || !medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Verify pharmacist can only delete their pharmacy's medications
    if (req.user.role === 'pharmacist' && medication.pharmacy_id !== req.user.pharmacy_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete medications from your pharmacy'
      });
    }

    // Delete image from R2 if exists
    if (medication.image_key) {
      await medicationImageService.deleteMedicationImage(medication.image_key);
    }

    // Delete medication from database
    const { error: deleteError } = await supabase
      .from('medications')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.status(200).json({
      success: true,
      message: 'Medication deleted successfully',
      deletedId: id
    });

  } catch (error) {
    console.error('Delete medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete medication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all medications (with R2 image URLs)
exports.getMedications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      requires_prescription,
      pharmacy_id
    } = req.query;

    const userRole = req.user ? req.user.role : 'guest';

    let query = supabase
      .from('medications')
      .select(`
        *,
        pharmacies (name, address)
      `, { count: 'exact' });

    // Apply filters
    if (userRole !== 'admin') {
      query = query.gt('stock_quantity', 0);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (requires_prescription !== undefined) {
      query = query.eq('is_prescription_required', requires_prescription === 'true');
    }

    if (pharmacy_id) {
      query = query.eq('pharmacy_id', pharmacy_id);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: medications, error, count } = await query
      .order('name')
      .range(from, to);

    if (error) throw error;

    // Ensure all image URLs are properly formatted
    const medicationsWithImages = medications.map(med => ({
      ...med,
      // image_url is already the public URL from R2, no need to modify
    }));

    res.status(200).json({
      success: true,
      medications: medicationsWithImages,
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });

  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medications'
    });
  }
};

exports.checkPrescriptionRequirement = async (req, res) => {
  try {
    const { medicationId } = req.params;

    const { data: medication, error } = await supabase
      .from('medications')
      .select('is_prescription_required, name')
      .eq('id', medicationId)
      .single();

    if (error || !medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.status(200).json({
      success: true,
      requiresPrescription: medication.is_prescription_required,
      medicationName: medication.name
    });

  } catch (error) {
    console.error('Prescription check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check prescription requirement'
    });
  }
};

// Add these missing functions to medicationController.js

exports.getMedicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: medication, error } = await supabase
      .from('medications')
      .select(`
        *,
        pharmacies (name, address, contact_phone)
      `)
      .eq('id', id)
      .single();

    if (error || !medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.status(200).json({
      success: true,
      medication
    });

  } catch (error) {
    console.error('Get medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medication'
    });
  }
};

exports.updateStock = async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'pharmacist') {
    return res.status(403).json({ 
      success: false,
      message: 'Unauthorized access' 
    });
  }

  const { id } = req.params;
  const { online_stock, in_person_stock } = req.body;

  try {
    const { data: medication, error } = await supabase
      .from('medications')
      .update({
        online_stock: parseInt(online_stock) || 0,
        in_person_stock: parseInt(in_person_stock) || 0,
        stock_quantity: (parseInt(online_stock) || 0) + (parseInt(in_person_stock) || 0),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      medication
    });

  } catch (error) {
    console.error('Stock update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock'
    });
  }
};


/* ============================================================
   SEARCH MEDICATIONS BY NAME (DEBUG VERSION)
   ============================================================ */

exports.searchMedicationsByName = async (req, res) => {
  try {
    const { name, limit = 20 } = req.query;

    console.log('🔍 SEARCH REQUEST:', { name, limit });

    if (!name || name.trim().length === 0) {
      return res.status(200).json({
        success: true,
        medications: [],
        message: 'Please enter a medication name to search'
      });
    }

    const searchTerm = name.trim().toLowerCase();
    console.log('🔍 Searching for:', searchTerm);

    // Build the query
    let query = supabase
      .from('medications')
      .select(`
        *,
        pharmacies (name, address)
      `)
      .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,dosage.ilike.%${searchTerm}%`)
      .order('name')
      .limit(parseInt(limit));

    // For non-admin users, only show medications with stock
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'pharmacist')) {
      query = query.gt('stock_quantity', 0);
    }

    const { data: medications, error } = await query;

    if (error) {
      console.error('❌ Search error:', error);
      throw error;
    }

    console.log(`✅ Found ${medications?.length || 0} medications`);

    // Return success even if no medications found
    res.status(200).json({
      success: true,
      medications: medications || [],
      searchTerm: searchTerm,
      count: medications?.length || 0,
      message: medications?.length > 0 
        ? `Found ${medications.length} medication(s) matching "${searchTerm}"`
        : `No medications found matching "${searchTerm}"`
    });

  } catch (error) {
    console.error('❌ Search medications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search medications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
/* ============================================================
   GET MEDICATION SUGGESTIONS (for autocomplete)
   ============================================================ */
exports.getMedicationSuggestions = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(200).json({
        success: true,
        suggestions: [],
        message: 'Type at least 2 characters to see suggestions'
      });
    }

    const searchTerm = query.trim();

    const { data: medications, error } = await supabase
      .from('medications')
      .select(`
        id,
        name,
        dosage,
        category,
        price,
        image_url
      `)
      .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .order('name')
      .limit(parseInt(limit));

    if (error) throw error;

    const suggestions = medications.map(med => ({
      id: med.id,
      name: med.name,
      dosage: med.dosage,
      category: med.category,
      price: med.price,
      image_url: med.image_url,
      display: `${med.name} ${med.dosage ? `- ${med.dosage}` : ''}`
    }));

    res.status(200).json({
      success: true,
      suggestions: suggestions,
      count: suggestions.length
    });

  } catch (error) {
    console.error('Medication suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medication suggestions'
    });
  }
};