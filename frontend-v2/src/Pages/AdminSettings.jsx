import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Palette, 
  Bell, 
  Shield, 
  Mail, 
  Globe,
  Save,
  Upload
} from 'lucide-react';

export default function AdminSettings() {
  const [branding, setBranding] = useState({
    name: 'MediCare',
    tagline: 'Your Health, Our Priority',
    primaryColor: '#059669',
    logo: null
  });

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailPrescriptions: true,
    emailLowStock: true,
    pushOrders: false,
    pushPrescriptions: true
  });

  return (
    <AdminLayout title="System Settings">
      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="bg-white border border-slate-100 p-1 rounded-xl">
          <TabsTrigger value="branding" className="rounded-lg">
            <Palette className="h-4 w-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="general" className="rounded-lg">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
        </TabsList>

        {/* Branding */}
        <TabsContent value="branding">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-semibold text-lg text-slate-900 mb-4">Brand Identity</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Application Name</Label>
                    <Input
                      value={branding.name}
                      onChange={(e) => setBranding({...branding, name: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input
                      value={branding.tagline}
                      onChange={(e) => setBranding({...branding, tagline: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Click to upload logo</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-semibold text-lg text-slate-900 mb-4">Theme Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Emerald', color: '#059669' },
                    { name: 'Blue', color: '#2563eb' },
                    { name: 'Purple', color: '#7c3aed' },
                    { name: 'Rose', color: '#e11d48' },
                  ].map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => setBranding({...branding, primaryColor: theme.color})}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        branding.primaryColor === theme.color
                          ? 'border-slate-900'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div 
                        className="h-8 w-full rounded-lg mb-2"
                        style={{ backgroundColor: theme.color }}
                      />
                      <p className="text-sm font-medium text-slate-900">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
                <h2 className="font-semibold text-lg text-slate-900 mb-4">Preview</h2>
                <div 
                  className="p-4 rounded-xl text-white text-center"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  <h3 className="font-bold text-lg">{branding.name}</h3>
                  <p className="text-sm opacity-80">{branding.tagline}</p>
                </div>
                <Button className="w-full mt-4 rounded-xl" style={{ backgroundColor: branding.primaryColor }}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-2xl">
            <h2 className="font-semibold text-lg text-slate-900 mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-slate-400" />
                  Email Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailOrders', label: 'New Orders', desc: 'Receive email when new orders are placed' },
                    { key: 'emailPrescriptions', label: 'Prescription Uploads', desc: 'Notify when prescriptions need review' },
                    { key: 'emailLowStock', label: 'Low Stock Alerts', desc: 'Alert when medications are running low' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key]}
                        onCheckedChange={(checked) => setNotifications({...notifications, [item.key]: checked})}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-slate-400" />
                  Push Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'pushOrders', label: 'Order Updates', desc: 'Browser notifications for order changes' },
                    { key: 'pushPrescriptions', label: 'Prescription Alerts', desc: 'Urgent prescription notifications' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key]}
                        onCheckedChange={(checked) => setNotifications({...notifications, [item.key]: checked})}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button className="mt-6 bg-purple-600 hover:bg-purple-700 rounded-xl">
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-2xl">
            <h2 className="font-semibold text-lg text-slate-900 mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-slate-900">Session Timeout</p>
                    <p className="text-sm text-slate-500">Automatically log out inactive users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="font-medium text-slate-900 mb-2">Password Policy</p>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>• Minimum 8 characters</p>
                  <p>• At least one uppercase letter</p>
                  <p>• At least one number</p>
                  <p>• At least one special character</p>
                </div>
              </div>
            </div>

            <Button className="mt-6 bg-purple-600 hover:bg-purple-700 rounded-xl">
              <Save className="h-4 w-4 mr-2" />
              Save Security Settings
            </Button>
          </div>
        </TabsContent>

        {/* General */}
        <TabsContent value="general">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-2xl">
            <h2 className="font-semibold text-lg text-slate-900 mb-6">General Settings</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Input defaultValue="USD ($)" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input defaultValue="America/New_York (EST)" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Input defaultValue="MM/DD/YYYY" className="rounded-xl" />
              </div>
            </div>

            <Button className="mt-6 bg-purple-600 hover:bg-purple-700 rounded-xl">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
