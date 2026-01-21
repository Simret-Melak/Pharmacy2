import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacistLayout from '@/components/pharmacist/PharmacistLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  Save,
  Upload,
  Camera,
  Award,
  Briefcase,
  Calendar,
  GraduationCap,
  FileText,
  CreditCard,
  Bell,
  Key,
  CheckCircle
} from 'lucide-react';

export default function PharmacistProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [profile, setProfile] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      bio: '',
    },
    professional: {
      licenseNumber: '',
      licenseExpiry: '',
      npiNumber: '',
      yearsOfExperience: '',
      specialization: '',
      education: '',
      certifications: [],
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: false,
      sessionTimeout: 30,
    },
    preferences: {
      darkMode: false,
      timezone: 'America/New_York',
    },
    accountInfo: {
      accountCreated: '',
      lastLogin: '',
      memberSince: '0 years',
    }
  });

  // Helper functions
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const calculateYearsSince = (dateString) => {
    if (!dateString) return '0';
    
    try {
      const created = new Date(dateString);
      const now = new Date();
      
      if (isNaN(created.getTime())) {
        return '0';
      }
      
      const diffYears = now.getFullYear() - created.getFullYear();
      return Math.max(diffYears, 0).toString();
    } catch (error) {
      console.error('Error calculating years:', error);
      return '0';
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Not set';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting display date:', error);
      return 'Invalid date';
    }
  };

  // Get backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  // Helper function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token') || 
           localStorage.getItem('supabase.auth.token') ||
           sessionStorage.getItem('token');
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('No authentication token found');
        setDefaultData();
        setIsLoading(false);
        return;
      }

      // Parse token if it's stored as JSON string
      let authToken = token;
      if (token.startsWith('{')) {
        try {
          const tokenData = JSON.parse(token);
          authToken = tokenData.access_token || tokenData.token || token;
        } catch (e) {
          console.log('Token is not JSON, using as is');
        }
      }

      console.log('Fetching pharmacist profile data...');
      
      const response = await fetch(`${BACKEND_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.warn('Authentication failed');
        clearAuthData();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const profileResponse = await response.json();
      console.log('Profile API response:', profileResponse);
      
      if (profileResponse.success) {
        const user = profileResponse.user;
        const pharmacist = user.pharmacist || {};
        
        console.log('User data:', user);
        console.log('Pharmacist data:', pharmacist);
        
        // Transform backend data to match frontend structure
        const transformedData = {
          personal: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            address: pharmacist.address || '',
            dateOfBirth: formatDateForInput(pharmacist.date_of_birth),
            bio: pharmacist.bio || '',
          },
          professional: {
            licenseNumber: pharmacist.license_number || '',
            licenseExpiry: formatDateForInput(pharmacist.license_expiry),
            npiNumber: pharmacist.npi_number || '',
            yearsOfExperience: pharmacist.years_of_experience || '',
            specialization: pharmacist.specialization || '',
            education: pharmacist.education || '',
            certifications: pharmacist.certifications || [],
          },
          security: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            twoFactorEnabled: pharmacist.two_factor_enabled || false,
            sessionTimeout: pharmacist.session_timeout || 30,
          },
          preferences: {
            darkMode: pharmacist.dark_mode || false,
            timezone: pharmacist.timezone || 'America/New_York',
          },
          accountInfo: {
            accountCreated: user.accountCreated || '',
            lastLogin: user.lastLogin || '',
            memberSince: calculateYearsSince(user.accountCreated) + ' years',
          }
        };
        
        console.log('Transformed data:', transformedData);
        setProfile(transformedData);
        
        // Store in localStorage for quick access
        localStorage.setItem('pharmacistProfile', JSON.stringify(transformedData));
        
        // Apply dark mode immediately
        if (pharmacist.dark_mode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('darkMode', 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('darkMode', 'false');
        }
      } else {
        throw new Error(profileResponse.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message);
      setDefaultData();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('user');
    localStorage.removeItem('pharmacistProfile');
    localStorage.removeItem('darkMode');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  const setDefaultData = () => {
    // Try to get cached data first
    const cachedData = localStorage.getItem('pharmacistProfile');
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        setProfile(data);
        return;
      } catch (e) {
        console.error('Error parsing cached profile data:', e);
      }
    }

    // Fallback to hardcoded data
    const fallbackData = {
      personal: {
        firstName: 'Simret',
        lastName: 'Melak',
        email: 'simretmelak@gmail.com',
        phone: '+7038560009',
        address: '',
        dateOfBirth: '',
        bio: '',
      },
      professional: {
        licenseNumber: '',
        licenseExpiry: '',
        npiNumber: '',
        yearsOfExperience: '',
        specialization: '',
        education: '',
        certifications: [],
      },
      security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
        sessionTimeout: 30,
      },
      preferences: {
        darkMode: false,
        timezone: 'America/New_York',
      },
      accountInfo: {
        accountCreated: '',
        lastLogin: '',
        memberSince: '0 years',
      }
    };
    
    setProfile(fallbackData);
  };

  const handleSave = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please log in again');
        navigate('/login');
        return;
      }

      // Parse token if it's stored as JSON string
      let authToken = token;
      if (token.startsWith('{')) {
        try {
          const tokenData = JSON.parse(token);
          authToken = tokenData.access_token || tokenData.token || token;
        } catch (e) {
          console.log('Token is not JSON, using as is');
        }
      }

      // Prepare data for backend
      const updateData = {
        firstName: profile.personal.firstName,
        lastName: profile.personal.lastName,
        phone: profile.personal.phone,
        date_of_birth: profile.personal.dateOfBirth,
        address: profile.personal.address,
        bio: profile.personal.bio,
        license_number: profile.professional.licenseNumber,
        license_expiry: profile.professional.licenseExpiry,
        npi_number: profile.professional.npiNumber,
        years_of_experience: profile.professional.yearsOfExperience,
        specialization: profile.professional.specialization,
        education: profile.professional.education,
        certifications: profile.professional.certifications,
        dark_mode: profile.preferences.darkMode,
        timezone: profile.preferences.timezone,
        two_factor_enabled: profile.security.twoFactorEnabled,
        session_timeout: profile.security.sessionTimeout,
      };

      console.log('Sending update data:', updateData);

      const response = await fetch(`${BACKEND_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      
      if (result.success) {
        setIsEditing(false);
        alert('Profile updated successfully!');
        
        // Apply dark mode immediately
        if (profile.preferences.darkMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('darkMode', 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('darkMode', 'false');
        }
        
        // Refresh profile data
        await fetchProfileData();
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile: ' + error.message);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (profile.security.newPassword !== profile.security.confirmPassword) {
        alert('New passwords do not match');
        return;
      }

      if (profile.security.newPassword.length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }

      const token = getAuthToken();
      if (!token) {
        alert('Please log in again');
        navigate('/login');
        return;
      }

      // Parse token if it's stored as JSON string
      let authToken = token;
      if (token.startsWith('{')) {
        try {
          const tokenData = JSON.parse(token);
          authToken = tokenData.access_token || tokenData.token || token;
        } catch (e) {
          console.log('Token is not JSON, using as is');
        }
      }

      const response = await fetch(`${BACKEND_URL}/api/profile/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: profile.security.currentPassword,
          newPassword: profile.security.newPassword,
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Password changed successfully!');
        
        // Clear password fields
        setProfile(prev => ({
          ...prev,
          security: {
            ...prev.security,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }
        }));
      } else {
        alert(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password: ' + error.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload original data
    fetchProfileData();
  };

  const handleChange = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updatePreferences = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please log in again');
        navigate('/login');
        return;
      }

      // Parse token if it's stored as JSON string
      let authToken = token;
      if (token.startsWith('{')) {
        try {
          const tokenData = JSON.parse(token);
          authToken = tokenData.access_token || tokenData.token || token;
        } catch (e) {
          console.log('Token is not JSON, using as is');
        }
      }

      const updateData = {
        dark_mode: profile.preferences.darkMode,
        timezone: profile.preferences.timezone,
      };

      const response = await fetch(`${BACKEND_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (result.success) {
        alert('Preferences saved successfully!');
        
        // Apply dark mode immediately
        if (profile.preferences.darkMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('darkMode', 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('darkMode', 'false');
        }
      } else {
        alert(result.message || 'Failed to save preferences');
      }
    } catch (error) {
      alert('Error saving preferences: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <PharmacistLayout title="My Profile">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </div>
      </PharmacistLayout>
    );
  }

  if (error && !profile.personal.firstName) {
    return (
      <PharmacistLayout title="My Profile">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to Load Profile</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={fetchProfileData} className="bg-purple-600 hover:bg-purple-700">
              Retry
            </Button>
          </div>
        </div>
      </PharmacistLayout>
    );
  }

  return (
    <PharmacistLayout title="My Profile">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <User className="h-16 w-16 text-purple-600" />
                </div>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-white border border-slate-200 shadow-md"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      Dr. {profile.personal.firstName} {profile.personal.lastName}
                    </h1>
                    <p className="text-slate-500">Lead Pharmacist</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-purple-100 text-purple-700">
                        <Shield className="h-3 w-3 mr-1" />
                        {profile.professional.licenseNumber ? 'Licensed' : 'Pending License'}
                      </Badge>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        <Award className="h-3 w-3 mr-1" />
                        {profile.professional.yearsOfExperience || '0'}+ years
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {profile.professional.specialization || 'Pharmacist'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={handleCancel} className="rounded-xl">
                          Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-slate-600 mb-4">{profile.personal.bio || 'No bio provided.'}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{profile.personal.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{profile.personal.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600 truncate">{profile.personal.address || 'No address provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-slate-100 p-1 rounded-xl">
            <TabsTrigger value="personal" className="rounded-lg">
              <User className="h-4 w-4 mr-2" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="professional" className="rounded-lg">
              <Briefcase className="h-4 w-4 mr-2" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-lg">
              <Bell className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        value={profile.personal.firstName}
                        onChange={(e) => handleChange('personal', 'firstName', e.target.value)}
                        disabled={!isEditing}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={profile.personal.lastName}
                        onChange={(e) => handleChange('personal', 'lastName', e.target.value)}
                        disabled={!isEditing}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={profile.personal.email}
                        onChange={(e) => handleChange('personal', 'email', e.target.value)}
                        disabled={!isEditing}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={profile.personal.phone}
                        onChange={(e) => handleChange('personal', 'phone', e.target.value)}
                        disabled={!isEditing}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={profile.personal.dateOfBirth}
                      onChange={(e) => handleChange('personal', 'dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={profile.personal.address}
                      onChange={(e) => handleChange('personal', 'address', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={profile.personal.bio}
                      onChange={(e) => handleChange('personal', 'bio', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="rounded-xl"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                  <CardDescription>
                    Your account status and activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { 
                        label: 'Account Created', 
                        value: profile.accountInfo.accountCreated ? formatDateForDisplay(profile.accountInfo.accountCreated) : 'Not available',
                        icon: Calendar 
                      },
                      { 
                        label: 'Last Login', 
                        value: profile.accountInfo.lastLogin ? formatDateForDisplay(profile.accountInfo.lastLogin) : 'Not available',
                        icon: Shield 
                      },
                      { 
                        label: 'Account Status', 
                        value: 'Verified', 
                        icon: CheckCircle, 
                        color: 'text-emerald-600' 
                      },
                      { 
                        label: 'Member Since', 
                        value: profile.accountInfo.memberSince, 
                        icon: Award 
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">{item.label}</span>
                        </div>
                        <span className={`font-medium ${item.color || 'text-slate-900'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="font-medium text-slate-900 mb-3">Connected Accounts</h4>
                    <div className="space-y-2">
                      {['Google', 'Apple'].map((account) => (
                        <div key={account} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                              {account === 'Google' ? 'G' : 'A'}
                            </div>
                            <span className="text-slate-900">{account} Account</span>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700">Connected</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>
                  Your professional credentials and experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>License Number</Label>
                    <Input
                      value={profile.professional.licenseNumber}
                      onChange={(e) => handleChange('professional', 'licenseNumber', e.target.value)}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>License Expiry Date</Label>
                    <Input
                      type="date"
                      value={profile.professional.licenseExpiry}
                      onChange={(e) => handleChange('professional', 'licenseExpiry', e.target.value)}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>NPI Number</Label>
                    <Input
                      value={profile.professional.npiNumber}
                      onChange={(e) => handleChange('professional', 'npiNumber', e.target.value)}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input
                      type="number"
                      value={profile.professional.yearsOfExperience}
                      onChange={(e) => handleChange('professional', 'yearsOfExperience', parseInt(e.target.value) || '')}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Select
                    value={profile.professional.specialization}
                    onValueChange={(value) => handleChange('professional', 'specialization', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clinical Pharmacy">Clinical Pharmacy</SelectItem>
                      <SelectItem value="Community Pharmacy">Community Pharmacy</SelectItem>
                      <SelectItem value="Hospital Pharmacy">Hospital Pharmacy</SelectItem>
                      <SelectItem value="Pharmacotherapy">Pharmacotherapy</SelectItem>
                      <SelectItem value="Oncology Pharmacy">Oncology Pharmacy</SelectItem>
                      <SelectItem value="Pediatric Pharmacy">Pediatric Pharmacy</SelectItem>
                      <SelectItem value="Geriatric Pharmacy">Geriatric Pharmacy</SelectItem>
                      <SelectItem value="Psychiatric Pharmacy">Psychiatric Pharmacy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Education</Label>
                  <Textarea
                    value={profile.professional.education}
                    onChange={(e) => handleChange('professional', 'education', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="rounded-xl"
                    placeholder="e.g., Doctor of Pharmacy (PharmD), University Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Certifications</Label>
                  <div className="space-y-2">
                    {profile.professional.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          value={cert}
                          onChange={(e) => {
                            const newCerts = [...profile.professional.certifications];
                            newCerts[idx] = e.target.value;
                            handleChange('professional', 'certifications', newCerts);
                          }}
                          disabled={!isEditing}
                          className="rounded-xl"
                          placeholder="e.g., Board Certified Pharmacotherapy Specialist"
                        />
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newCerts = profile.professional.certifications.filter((_, i) => i !== idx);
                              handleChange('professional', 'certifications', newCerts);
                            }}
                            className="h-9 w-9"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newCerts = [...profile.professional.certifications, ''];
                          handleChange('professional', 'certifications', newCerts);
                        }}
                        className="rounded-xl w-full"
                      >
                        Add Certification
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Change Password</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input
                        type="password"
                        value={profile.security.currentPassword}
                        onChange={(e) => handleChange('security', 'currentPassword', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        value={profile.security.newPassword}
                        onChange={(e) => handleChange('security', 'newPassword', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input
                        type="password"
                        value={profile.security.confirmPassword}
                        onChange={(e) => handleChange('security', 'confirmPassword', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={profile.security.twoFactorEnabled}
                      onCheckedChange={(checked) => handleChange('security', 'twoFactorEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Session Timeout</p>
                      <p className="text-sm text-slate-500">Automatically log out after inactivity</p>
                      <p className="text-xs text-slate-400 mt-1">Currently set to {profile.security.sessionTimeout} minutes</p>
                    </div>
                    <Select
                      value={profile.security.sessionTimeout.toString()}
                      onValueChange={(value) => handleChange('security', 'sessionTimeout', parseInt(value))}
                    >
                      <SelectTrigger className="w-32 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handlePasswordChange} 
                    className="bg-purple-600 hover:bg-purple-700 rounded-xl"
                    disabled={!profile.security.currentPassword || !profile.security.newPassword}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    View Login History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your application experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">Display Preferences</h4>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Dark Mode</p>
                      <p className="text-sm text-slate-500">Switch to dark theme</p>
                    </div>
                    <Switch
                      checked={profile.preferences.darkMode}
                      onCheckedChange={(checked) => {
                        handleChange('preferences', 'darkMode', checked);
                        // Apply immediately for better UX
                        if (checked) {
                          document.documentElement.classList.add('dark');
                          localStorage.setItem('darkMode', 'true');
                        } else {
                          document.documentElement.classList.remove('dark');
                          localStorage.setItem('darkMode', 'false');
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={profile.preferences.timezone}
                      onValueChange={(value) => handleChange('preferences', 'timezone', value)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                        <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={updatePreferences} className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PharmacistLayout>
  );
}

// Helper components
const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);