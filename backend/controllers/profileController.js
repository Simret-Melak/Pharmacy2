const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

// Helper function to get and update user metadata
const getUserMetadata = async (userId) => {
  const { data: userData, error } = await supabase.auth.admin.getUserById(userId);
  if (error) throw error;
  return userData.user.user_metadata || {};
};

const updateUserMetadata = async (userId, updatedMetadata) => {
  const { data: userData } = await supabase.auth.admin.getUserById(userId);
  const currentMetadata = userData.user.user_metadata || {};
  
  const finalMetadata = {
    ...currentMetadata,
    ...updatedMetadata
  };
  
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: finalMetadata
  });
  
  if (error) throw error;
  return finalMetadata;
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Get basic user info from Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData.user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userData.user;
    const metadata = user.user_metadata || {};

    // 2. Get role from clients table
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('role, created_at')
      .eq('id', userId)
      .single();

    // 3. Get pharmacist details if user is a pharmacist
    let pharmacistData = null;
    if (clientData?.role === 'pharmacist') {
      const { data: pharmaData } = await supabase
        .from('pharmacists')
        .select('*')
        .eq('id', userId)
        .single();
      pharmacistData = pharmaData;
    }

    // Format the name
    const fullName = metadata.full_name || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Build response
    const response = {
      success: true,
      user: {
        // Basic info from auth
        id: user.id,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        full_name: fullName,
        phone: metadata.phone || '',
        
        // Role and account info
        role: clientData?.role || 'user',
        accountCreated: pharmacistData?.account_created || clientData?.created_at || user.created_at,
        lastLogin: pharmacistData?.last_login || user.last_sign_in_at,
        
        // Preferences from auth metadata
        preferences: metadata.preferences || {
          notifications: true
        }
      }
    };

    // Add pharmacist-specific data if available
    if (pharmacistData) {
      response.user.pharmacist = {
        // Personal info
        date_of_birth: pharmacistData.date_of_birth,
        address: pharmacistData.address,
        bio: pharmacistData.bio,
        
        // Professional info
        license_number: pharmacistData.license_number,
        license_expiry: pharmacistData.license_expiry,
        npi_number: pharmacistData.npi_number,
        years_of_experience: pharmacistData.years_of_experience,
        specialization: pharmacistData.specialization,
        education: pharmacistData.education,
        certifications: pharmacistData.certifications || [],
        
        // Preferences
        dark_mode: pharmacistData.dark_mode,
        timezone: pharmacistData.timezone,
        two_factor_enabled: pharmacistData.two_factor_enabled,
        session_timeout: pharmacistData.session_timeout,
        
        // Metadata
        metadata: pharmacistData.metadata || {}
      };
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};
// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      firstName, 
      lastName, 
      phone,
      preferences,
      // Pharmacist data (if user is pharmacist)
      date_of_birth,
      address,
      bio,
      license_number,
      license_expiry,
      npi_number,
      years_of_experience,
      specialization,
      education,
      certifications,
      dark_mode,
      timezone,
      two_factor_enabled,
      session_timeout
    } = req.body;

    // 1. Check if user is a pharmacist
    const { data: clientData } = await supabase
      .from('clients')
      .select('role')
      .eq('id', userId)
      .single();

    const isPharmacist = clientData?.role === 'pharmacist';

    // 2. Update auth metadata (for all users)
    const { data: currentUserData } = await supabase.auth.admin.getUserById(userId);
    const currentMetadata = currentUserData.user.user_metadata || {};

    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || currentMetadata.full_name;
    
    const updatedAuthMetadata = {
      full_name: fullName,
      phone: phone !== undefined ? phone : currentMetadata.phone,
      preferences: {
        ...(currentMetadata.preferences || {}),
        ...(preferences || {})
      }
    };

    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: updatedAuthMetadata
    });

    // 3. Update pharmacists table if user is a pharmacist
    if (isPharmacist) {
      const pharmacistUpdateData = {
        date_of_birth,
        address,
        bio,
        license_number,
        license_expiry,
        npi_number,
        years_of_experience,
        specialization,
        education,
        certifications,
        dark_mode,
        timezone,
        two_factor_enabled,
        session_timeout,
        updated_at: new Date().toISOString()
      };

      // Remove undefined/null values
      Object.keys(pharmacistUpdateData).forEach(key => {
        if (pharmacistUpdateData[key] === undefined || pharmacistUpdateData[key] === null) {
          delete pharmacistUpdateData[key];
        }
      });

      // Check if pharmacist record exists
      const { data: existingPharmacist } = await supabase
        .from('pharmacists')
        .select('id')
        .eq('id', userId)
        .single();

      if (existingPharmacist) {
        // Update existing record
        await supabase
          .from('pharmacists')
          .update(pharmacistUpdateData)
          .eq('id', userId);
      } else {
        // Create new record (should only happen for new pharmacists)
        await supabase
          .from('pharmacists')
          .insert({
            id: userId,
            ...pharmacistUpdateData
          });
      }
    }

    // 4. Get updated data for response
    const { data: updatedUserData } = await supabase.auth.admin.getUserById(userId);
    let updatedPharmacistData = null;
    
    if (isPharmacist) {
      const { data: pharmaData } = await supabase
        .from('pharmacists')
        .select('*')
        .eq('id', userId)
        .single();
      updatedPharmacistData = pharmaData;
    }

    const newMetadata = updatedUserData.user.user_metadata || {};
    const nameParts = newMetadata.full_name?.split(' ') || [];
    
    // 5. Build response
    const response = {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: userId,
        email: updatedUserData.user.email,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        full_name: newMetadata.full_name,
        phone: newMetadata.phone,
        role: clientData?.role,
        preferences: newMetadata.preferences || {}
      }
    };

    // Add pharmacist data if available
    if (updatedPharmacistData) {
      response.user.pharmacist = {
        date_of_birth: updatedPharmacistData.date_of_birth,
        address: updatedPharmacistData.address,
        bio: updatedPharmacistData.bio,
        license_number: updatedPharmacistData.license_number,
        license_expiry: updatedPharmacistData.license_expiry,
        npi_number: updatedPharmacistData.npi_number,
        years_of_experience: updatedPharmacistData.years_of_experience,
        specialization: updatedPharmacistData.specialization,
        education: updatedPharmacistData.education,
        certifications: updatedPharmacistData.certifications || [],
        dark_mode: updatedPharmacistData.dark_mode,
        timezone: updatedPharmacistData.timezone,
        two_factor_enabled: updatedPharmacistData.two_factor_enabled,
        session_timeout: updatedPharmacistData.session_timeout,
        metadata: updatedPharmacistData.metadata || {}
      };
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Get user addresses from metadata
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get metadata
    const metadata = await getUserMetadata(userId);
    
    // Initialize addresses array if it doesn't exist
    const addresses = metadata.addresses || [];

    res.status(200).json({
      success: true,
      addresses: addresses,
      count: addresses.length,
      defaultAddress: addresses.find(addr => addr.isDefault) || null
    });

  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add new address to metadata
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const newAddress = req.body;

    // Validation
    if (!newAddress.label || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.zip_code) {
      return res.status(400).json({
        success: false,
        message: 'Label, address, city, state, and zip code are required'
      });
    }

    // Get current metadata
    const metadata = await getUserMetadata(userId);
    
    // Initialize addresses if doesn't exist
    const currentAddresses = metadata.addresses || [];
    
    // Generate unique ID for the address
    const addressWithId = {
      ...newAddress,
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      name: metadata.full_name || `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // If setting as default, update others
    let updatedAddresses;
    if (newAddress.isDefault) {
      updatedAddresses = currentAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
      updatedAddresses.push(addressWithId);
    } else {
      updatedAddresses = [...currentAddresses, addressWithId];
    }

    // Update metadata with new addresses
    const updatedMetadata = {
      ...metadata,
      addresses: updatedAddresses
    };

    // Save to Supabase
    await updateUserMetadata(userId, updatedMetadata);

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      address: addressWithId,
      addresses: updatedAddresses
    });

  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update specific address in metadata
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;
    const updates = req.body;

    // Get current metadata
    const metadata = await getUserMetadata(userId);
    
    // Get addresses
    const addresses = metadata.addresses || [];
    
    // Find and update the address
    const addressIndex = addresses.findIndex(addr => addr.id === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    let updatedAddresses = [...addresses];
    updatedAddresses[addressIndex] = {
      ...updatedAddresses[addressIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    // If setting as default, update others
    if (updates.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
    }

    // Update metadata
    const updatedMetadata = {
      ...metadata,
      addresses: updatedAddresses
    };

    await updateUserMetadata(userId, updatedMetadata);

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address: updatedAddresses[addressIndex],
      addresses: updatedAddresses
    });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete address from metadata
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    // Get current metadata
    const metadata = await getUserMetadata(userId);
    
    // Get addresses
    const addresses = metadata.addresses || [];
    
    // Check if address exists
    const addressExists = addresses.some(addr => addr.id === addressId);
    if (!addressExists) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Filter out the address to delete
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);

    // Update metadata
    const updatedMetadata = {
      ...metadata,
      addresses: updatedAddresses
    };

    await updateUserMetadata(userId, updatedMetadata);

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      addresses: updatedAddresses,
      deletedAddressId: addressId
    });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Set address as default in metadata
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    // Get current metadata
    const metadata = await getUserMetadata(userId);
    
    // Get addresses
    const addresses = metadata.addresses || [];
    
    // Update all addresses - set only the specified one as default
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));

    // Update metadata
    const updatedMetadata = {
      ...metadata,
      addresses: updatedAddresses
    };

    await updateUserMetadata(userId, updatedMetadata);

    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      addresses: updatedAddresses
    });

  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update default address',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters'
      });
    }

    // First, verify current password by trying to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: req.user.email,
      password: currentPassword
    });

    if (verifyError) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (updateError) throw updateError;

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};