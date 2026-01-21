const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

// Get current user's pharmacy
exports.getMyPharmacy = async (req, res) => {
  try {
    console.log('🔍 Fetching pharmacy for user:', req.user.userId, req.user.role);
    
    if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied - pharmacist or admin only'
      });
    }

    // Get client record
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('pharmacy_id, role')
      .eq('id', req.user.userId)
      .single();

    if (clientError || !client) {
      console.error('Client not found:', clientError);
      return res.status(404).json({
        success: false,
        message: 'Client record not found'
      });
    }

    if (!client.pharmacy_id) {
      return res.status(400).json({
        success: false,
        message: 'No pharmacy assigned to your account'
      });
    }

    // Get pharmacy details
    const { data: pharmacy, error: pharmacyError } = await supabase
      .from('pharmacies')
      .select('*')
      .eq('id', client.pharmacy_id)
      .single();

    if (pharmacyError || !pharmacy) {
      console.error('Pharmacy not found:', pharmacyError);
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    res.json({
      success: true,
      pharmacy: {
        id: pharmacy.id,
        name: pharmacy.name,
        address: pharmacy.address,
        contact_email: pharmacy.contact_email,
        contact_phone: pharmacy.contact_phone,
        created_at: pharmacy.created_at,
        updated_at: pharmacy.updated_at
      },
      role: client.role
    });

  } catch (error) {
    console.error('Get pharmacy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching pharmacy'
    });
  }
};

// Get pharmacy by ID (for admins or pharmacists from same pharmacy)
exports.getPharmacyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Authorization: Only admins or pharmacists from same pharmacy
    if (req.user.role === 'pharmacist') {
      // Check if pharmacist belongs to this pharmacy
      const { data: client } = await supabase
        .from('clients')
        .select('pharmacy_id')
        .eq('id', req.user.userId)
        .single();
      
      if (!client || client.pharmacy_id !== id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied - can only view your own pharmacy'
        });
      }
    }

    const { data: pharmacy, error } = await supabase
      .from('pharmacies')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    res.json({
      success: true,
      pharmacy
    });

  } catch (error) {
    console.error('Get pharmacy by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get all pharmacies (admin only)
exports.getAllPharmacies = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { data: pharmacies, error } = await supabase
      .from('pharmacies')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      pharmacies,
      count: pharmacies.length
    });

  } catch (error) {
    console.error('Get all pharmacies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update pharmacy (admin or pharmacy owner)
exports.updatePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check permissions
    if (req.user.role === 'pharmacist') {
      const { data: client } = await supabase
        .from('clients')
        .select('pharmacy_id')
        .eq('id', req.user.userId)
        .single();
      
      if (!client || client.pharmacy_id !== id) {
        return res.status(403).json({
          success: false,
          message: 'Can only update your own pharmacy'
        });
      }
    }

    const { data: pharmacy, error } = await supabase
      .from('pharmacies')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !pharmacy) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update pharmacy'
      });
    }

    res.json({
      success: true,
      message: 'Pharmacy updated successfully',
      pharmacy
    });

  } catch (error) {
    console.error('Update pharmacy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Assign pharmacist to pharmacy (admin only)
exports.assignPharmacist = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { pharmacistId, pharmacyId } = req.body;

    // Update client record
    const { data: client, error } = await supabase
      .from('clients')
      .update({ pharmacy_id: pharmacyId })
      .eq('id', pharmacistId)
      .eq('role', 'pharmacist')
      .select()
      .single();

    if (error || !client) {
      return res.status(400).json({
        success: false,
        message: 'Failed to assign pharmacist'
      });
    }

    res.json({
      success: true,
      message: 'Pharmacist assigned successfully',
      client
    });

  } catch (error) {
    console.error('Assign pharmacist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};