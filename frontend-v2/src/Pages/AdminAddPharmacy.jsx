import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Building2 } from 'lucide-react';

export default function AdminAddPharmacy() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    status: 'Active',
  });

  return (
    <AdminLayout title="Add Pharmacy">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={createPageUrl('AdminPharmacies')}>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add New Pharmacy</h1>
          <p className="text-sm text-slate-500">Register a new pharmacy in the system</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Pharmacy Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Pharmacy Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., HealthFirst Pharmacy"
                  className="rounded-xl"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Street Address *</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="123 Main Street"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="New York"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  placeholder="NY"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>ZIP Code *</Label>
                <Input
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                  placeholder="10001"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="contact@pharmacy.com"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Preview */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Preview</h2>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="h-16 w-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900">{formData.name || 'Pharmacy Name'}</h3>
              <p className="text-sm text-slate-500 mt-1">{formData.city || 'City'}, {formData.state || 'State'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl h-12">
              <Save className="h-4 w-4 mr-2" />
              Save Pharmacy
            </Button>
            <Link to={createPageUrl('AdminPharmacies')} className="block">
              <Button variant="ghost" className="w-full rounded-xl">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
