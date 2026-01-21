import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import PageHeader from '@/components/ui-custom/PageHeader';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Plus,
  Edit2,
  Trash2,
  Save,
  Camera,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { profileAPI, getCurrentUser, authAPI } from '@/utils/api';
import { createPageUrl } from '@/utils';

export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
  });

  // Dialog states
  const [addAddressDialog, setAddAddressDialog] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    isDefault: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  // Load user data and addresses on mount
  useEffect(() => {
    loadUserData();
    loadAddresses();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        
        // Extract first and last name from full_name if available
        const fullName = currentUser.full_name || '';
        const nameParts = fullName.split(' ');
        
        setProfile({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          username: currentUser.username || ''
        });
      } else {
        // Redirect to login if no user
        navigate(createPageUrl('CustomerLogin'));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data');
    }
  };

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use the actual backend API
      const response = await profileAPI.getAddresses();
      
      if (response.success) {
        setAddresses(response.addresses || []);
        
        // Also store in localStorage as backup
        localStorage.setItem('userAddresses', JSON.stringify(response.addresses || []));
      } else {
        setError(response.message || 'Failed to load addresses');
        // Fallback to localStorage
        const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
        setAddresses(savedAddresses);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setError('Failed to load addresses from server');
      // Fallback to localStorage
      const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
      setAddresses(savedAddresses);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Call the actual backend API
      const response = await profileAPI.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        username: profile.username
      });
      
      if (response.success) {
        // Update local user data
        const updatedUser = {
          ...user,
          full_name: response.user.full_name,
          phone: response.user.phone,
          username: response.user.username
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Also update the profile state with the returned data
        const nameParts = response.user.full_name?.split(' ') || [];
        setProfile({
          ...profile,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: response.user.phone || '',
          username: response.user.username || ''
        });
        
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Call the actual backend API
      const response = await profileAPI.addAddress({
        ...newAddress,
        zip_code: newAddress.zip_code // Use correct field name
      });
      
      if (response.success) {
        setAddresses(response.addresses);
        
        // Also update localStorage as backup
        localStorage.setItem('userAddresses', JSON.stringify(response.addresses));
        
        setNewAddress({
          label: '',
          address: '',
          city: '',
          state: '',
          zip_code: '',
          phone: '',
          isDefault: false
        });
        
        setAddAddressDialog(false);
        setSuccess('Address added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      setError(error.message || 'Failed to add address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      // Call the actual backend API
      const response = await profileAPI.deleteAddress(addressId);
      
      if (response.success) {
        setAddresses(response.addresses);
        
        // Also update localStorage as backup
        localStorage.setItem('userAddresses', JSON.stringify(response.addresses));
        
        setSuccess('Address deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setError(error.message || 'Failed to delete address. Please try again.');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      // Call the actual backend API
      const response = await profileAPI.setDefaultAddress(addressId);
      
      if (response.success) {
        setAddresses(response.addresses);
        
        // Also update localStorage as backup
        localStorage.setItem('userAddresses', JSON.stringify(response.addresses));
        
        setSuccess('Default address updated!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to update default address');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      setError(error.message || 'Failed to update default address. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    try {
      setSaving(true);
      setError('');
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      // Call the actual backend API
      const response = await profileAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setChangePasswordDialog(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSuccess('Password changed successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Call the actual delete account API
      const response = await authAPI.deleteAccount(user.email, passwordData.currentPassword);

      if (response.success) {
        // Clear local storage and redirect to home
        localStorage.clear();
        navigate(createPageUrl('CustomerHome'));
      } else {
        setError(response.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(error.message || 'Failed to delete account. Please check your password and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerHeader />
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="My Profile"
          description="Manage your account settings and preferences"
          breadcrumbs={[
            { label: 'Profile' }
          ]}
        />

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center text-emerald-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Success</span>
            </div>
            <p className="mt-1 text-sm text-emerald-600">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Error</span>
            </div>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                    <span className="text-3xl font-bold text-emerald-600">
                      {profile.firstName?.charAt(0) || 'U'}
                      {profile.lastName?.charAt(0) || ''}
                    </span>
                  </div>
                  <button 
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors"
                    title="Change profile picture (coming soon)"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mt-4">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-sm text-slate-500">{user.email}</p>
                <p className="text-xs text-emerald-600 mt-1 capitalize">{user.role}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{user.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Member since {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="bg-white border border-slate-100 p-1 rounded-xl">
                <TabsTrigger value="personal" className="rounded-lg">Personal Info</TabsTrigger>
                <TabsTrigger value="addresses" className="rounded-lg">Addresses</TabsTrigger>
                <TabsTrigger value="security" className="rounded-lg">Security</TabsTrigger>
              </TabsList>

              {/* Personal Info */}
              <TabsContent value="personal">
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                    <Button 
                      variant={isEditing ? "default" : "outline"}
                      className="rounded-xl"
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700">First Name *</Label>
                      <Input
                        value={profile.firstName}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                        disabled={!isEditing}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Last Name *</Label>
                      <Input
                        value={profile.lastName}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                        disabled={!isEditing}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Email Address *</Label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        disabled={!isEditing}
                        className="rounded-xl"
                        readOnly // Email shouldn't be editable
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Phone Number</Label>
                      <Input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        disabled={!isEditing}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Username</Label>
                      <Input
                        value={profile.username}
                        onChange={(e) => setProfile({...profile, username: e.target.value})}
                        disabled={!isEditing}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Addresses */}
              <TabsContent value="addresses">
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">Saved Addresses</h2>
                    <Button 
                      onClick={() => setAddAddressDialog(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div 
                          key={address.id}
                          className={`p-4 rounded-xl border-2 transition-colors ${
                            address.isDefault ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">{address.label}</span>
                              {address.isDefault && (
                                <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">Default</span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleSetDefaultAddress(address.id)}
                                disabled={address.isDefault}
                              >
                                <MapPin className="h-4 w-4 text-slate-400" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                <Trash2 className="h-4 w-4 text-slate-400" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-slate-600 space-y-1">
                            <p>{address.name || `${profile.firstName} ${profile.lastName}`}</p>
                            <p>{address.address}</p>
                            <p>{address.city}, {address.state} {address.zip_code || address.zip}</p>
                            <p>{address.phone || profile.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No addresses saved yet</p>
                      <p className="text-sm text-slate-400 mt-1">Add your first delivery address</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Security */}
              <TabsContent value="security">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-slate-900">Security Settings</h2>

                  {/* Change Password */}
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center">
                          <Lock className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Password</p>
                          <p className="text-sm text-slate-500">Change your account password</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="rounded-xl"
                        onClick={() => setChangePasswordDialog(true)}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="font-medium text-rose-600 mb-2">Danger Zone</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Once you delete your account, all your data will be permanently removed.
                      This action cannot be undone.
                    </p>
                    <Button 
                      variant="outline" 
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl"
                      onClick={() => setDeleteAccountDialog(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <CustomerFooter />

      {/* Add Address Dialog */}
      <Dialog open={addAddressDialog} onOpenChange={setAddAddressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Label *</Label>
              <Input 
                placeholder="Home, Office, etc." 
                className="rounded-xl"
                value={newAddress.label}
                onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Street Address *</Label>
              <Input 
                className="rounded-xl"
                placeholder="123 Main Street"
                value={newAddress.address}
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City *</Label>
                <Input 
                  className="rounded-xl"
                  placeholder="New York"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Input 
                  className="rounded-xl"
                  placeholder="NY"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>ZIP Code *</Label>
                <Input 
                  className="rounded-xl"
                  placeholder="10001"
                  value={newAddress.zip_code}
                  onChange={(e) => setNewAddress({...newAddress, zip_code: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input 
                type="tel" 
                className="rounded-xl"
                placeholder="+1 (555) 123-4567"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="defaultAddress"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                className="h-4 w-4 rounded"
              />
              <Label htmlFor="defaultAddress" className="text-sm cursor-pointer">
                Set as default delivery address
              </Label>
            </div>
            <Button 
              onClick={handleAddAddress}
              disabled={saving || !newAddress.label || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.zip_code}
              className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Address'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordDialog} onOpenChange={setChangePasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and new password to update.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Password *</Label>
              <Input 
                type="password" 
                className="rounded-xl"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>New Password *</Label>
              <Input 
                type="password" 
                className="rounded-xl"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password *</Label>
              <Input 
                type="password" 
                className="rounded-xl"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <Button 
              onClick={handleChangePassword}
              disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountDialog} onOpenChange={setDeleteAccountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-rose-600">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please enter your password to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Warning</span>
              </div>
              <p className="text-sm text-rose-600 mt-2">
                Deleting your account will permanently remove all your data including:
              </p>
              <ul className="text-sm text-rose-600 mt-2 space-y-1">
                <li>• Personal information</li>
                <li>• Order history</li>
                <li>• Prescriptions</li>
                <li>• Addresses and payment methods</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label>Enter your password to confirm *</Label>
              <Input 
                type="password" 
                className="rounded-xl"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setDeleteAccountDialog(false);
                  setPasswordData({...passwordData, currentPassword: ''});
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteAccount}
                disabled={saving || !passwordData.currentPassword}
                className="bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Account Permanently'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}