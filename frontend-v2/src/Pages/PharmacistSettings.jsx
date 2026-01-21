import { useState } from 'react';
import PharmacistLayout from '@/components/pharmacist/PharmacistLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  Clock,
  CreditCard,
  FileText,
  Mail,
  Phone,
  Save,
  Settings as SettingsIcon,
  Truck,
  Users,
  Shield,
  Bell
} from 'lucide-react';

export default function PharmacistSettings() {
  const [pharmacyInfo, setPharmacyInfo] = useState({
    name: 'MediCare Pharmacy',
    email: 'contact@medicarepharmacy.com',
    phone: '+1 (555) 123-4567',
    address: '123 Health Street, New York, NY 10001',
    licenseNumber: 'PH-12345-AB',
    hours: {
      monday: '9:00 AM - 7:00 PM',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 7:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '10:00 AM - 6:00 PM',
      sunday: '11:00 AM - 4:00 PM'
    }
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    prescriptionReady: true,
    customerMessages: true,
    weeklyReports: false,
    promotionalEmails: false
  });

  const [shippingSettings, setShippingSettings] = useState({
    deliveryRadius: 10,
    deliveryFee: 5.99,
    freeDeliveryThreshold: 50.00,
    sameDayDelivery: true,
    pickupEnabled: true
  });

  return (
    <PharmacistLayout title="Pharmacy Settings">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border border-slate-100 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg">
            <SettingsIcon className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="shipping" className="rounded-lg">
            <Truck className="h-4 w-4 mr-2" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-lg">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Pharmacy Information
                </CardTitle>
                <CardDescription>
                  Update your pharmacy details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Pharmacy Name</Label>
                  <Input
                    value={pharmacyInfo.name}
                    onChange={(e) => setPharmacyInfo({...pharmacyInfo, name: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={pharmacyInfo.email}
                      onChange={(e) => setPharmacyInfo({...pharmacyInfo, email: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={pharmacyInfo.phone}
                      onChange={(e) => setPharmacyInfo({...pharmacyInfo, phone: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={pharmacyInfo.address}
                    onChange={(e) => setPharmacyInfo({...pharmacyInfo, address: e.target.value})}
                    rows={3}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>License Number</Label>
                  <Input
                    value={pharmacyInfo.licenseNumber}
                    onChange={(e) => setPharmacyInfo({...pharmacyInfo, licenseNumber: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
                <CardDescription>
                  Set your pharmacy operating hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(pharmacyInfo.hours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-medium capitalize text-slate-900">{day}</span>
                    <Input
                      value={hours}
                      onChange={(e) => setPharmacyInfo({
                        ...pharmacyInfo,
                        hours: {...pharmacyInfo.hours, [day]: e.target.value}
                      })}
                      className="w-48 rounded-xl"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" className="rounded-xl">
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'newOrders', label: 'New Orders', desc: 'Get notified when customers place new orders' },
                { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Receive alerts when medications are running low' },
                { key: 'prescriptionReady', label: 'Prescription Ready', desc: 'Notify when prescriptions need review' },
                { key: 'customerMessages', label: 'Customer Messages', desc: 'Get alerts for customer inquiries' },
                { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly pharmacy performance reports' },
                { key: 'promotionalEmails', label: 'Promotional Emails', desc: 'Receive promotional offers and updates' },
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
            </CardContent>
            <CardContent>
              <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping */}
        <TabsContent value="shipping">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping & Delivery Settings
              </CardTitle>
              <CardDescription>
                Configure your delivery options and fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Delivery Radius (miles)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    min="1"
                    max="50"
                    value={shippingSettings.deliveryRadius}
                    onChange={(e) => setShippingSettings({...shippingSettings, deliveryRadius: parseInt(e.target.value)})}
                    className="flex-1"
                  />
                  <span className="font-medium text-slate-900">{shippingSettings.deliveryRadius} miles</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Delivery Fee ($)</Label>
                  <Input
                    type="number"
                    value={shippingSettings.deliveryFee}
                    onChange={(e) => setShippingSettings({...shippingSettings, deliveryFee: parseFloat(e.target.value)})}
                    className="rounded-xl"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Free Delivery Threshold ($)</Label>
                  <Input
                    type="number"
                    value={shippingSettings.freeDeliveryThreshold}
                    onChange={(e) => setShippingSettings({...shippingSettings, freeDeliveryThreshold: parseFloat(e.target.value)})}
                    className="rounded-xl"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Same Day Delivery</p>
                    <p className="text-sm text-slate-500">Offer same-day delivery for orders placed before 2 PM</p>
                  </div>
                  <Switch
                    checked={shippingSettings.sameDayDelivery}
                    onCheckedChange={(checked) => setShippingSettings({...shippingSettings, sameDayDelivery: checked})}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">In-Store Pickup</p>
                    <p className="text-sm text-slate-500">Allow customers to pick up orders at your pharmacy</p>
                  </div>
                  <Switch
                    checked={shippingSettings.pickupEnabled}
                    onCheckedChange={(checked) => setShippingSettings({...shippingSettings, pickupEnabled: checked})}
                  />
                </div>
              </div>
            </CardContent>
            <CardContent>
              <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                <Save className="h-4 w-4 mr-2" />
                Update Shipping Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Information
              </CardTitle>
              <CardDescription>
                Manage your subscription and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-emerald-900">Professional Plan</p>
                    <p className="text-sm text-emerald-700">$49.99/month • Next billing: Feb 18, 2024</p>
                  </div>
                  <Button variant="outline" className="rounded-xl border-emerald-200">
                    Manage Subscription
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-4">Payment Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Visa ending in 4242</p>
                        <p className="text-sm text-slate-500">Expires 12/2025 • Primary</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-4">Recent Invoices</h4>
                <div className="space-y-2">
                  {[
                    { id: 'INV-2024-01', date: 'Jan 18, 2024', amount: 49.99, status: 'Paid' },
                    { id: 'INV-2023-12', date: 'Dec 18, 2023', amount: 49.99, status: 'Paid' },
                    { id: 'INV-2023-11', date: 'Nov 18, 2023', amount: 49.99, status: 'Paid' },
                  ].map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-900">{invoice.id}</p>
                        <p className="text-sm text-slate-500">{invoice.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-slate-900">${invoice.amount}</span>
                        <Badge className="bg-emerald-100 text-emerald-700 border-0">{invoice.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Management
              </CardTitle>
              <CardDescription>
                Manage staff members and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { name: 'Dr. Sarah Wilson', role: 'Lead Pharmacist', email: 'sarah@medicarepharmacy.com', status: 'Active' },
                  { name: 'Michael Chen', role: 'Pharmacist', email: 'michael@medicarepharmacy.com', status: 'Active' },
                  { name: 'Emily Rodriguez', role: 'Pharmacy Technician', email: 'emily@medicarepharmacy.com', status: 'Active' },
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.role} • {member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} border-0`}>
                        {member.status}
                      </Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div>
                  <h4 className="font-medium text-slate-900">Invite Team Member</h4>
                  <p className="text-sm text-slate-500">Send invitation to new staff members</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PharmacistLayout>
  );
}

// Badge component if not imported
const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);