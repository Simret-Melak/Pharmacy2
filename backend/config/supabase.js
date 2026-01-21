// config/supabase.js - REUSABLE SUPABASE CONFIGURATION
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

// Create clients for different use cases
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, 
    detectSessionInUrl: false
  }
});

// Admin client for privileged operations (optional)
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Test connection on startup
async function testConnection() {
  try {
    console.log('🔌 Testing Supabase connection...');
    
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('❌ Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase client configured successfully');
    return true;
  } catch (err) {
    console.log('❌ Supabase connection error:', err.message);
    return false;
  }
}

// Optional: Initialize connection test (comment out if not needed)
testConnection();

// Export the clients
module.exports = {
  supabase,
  supabaseAdmin,
  testConnection // Export if you want to test elsewhere
};