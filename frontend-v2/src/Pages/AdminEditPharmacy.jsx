import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Trash2, Building2 } from 'lucide-react';

const mockPharmacy = {
  id: '1',
  name: 'MediCare Central',
  address: '123 Health St',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  phone: '+1 (555) 123-4567',
  email: 'central@medicare.com',
  status: 'Active',
};

export default function AdminEditPharmacy() {
  const [formData, setFormData] = useState(mockPharmacy);

  return (
    <AdminLayout title="Edit Pharmacy">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('AdminPharmacies')}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Edit Pharmacy</h1>
            <p className="text-sm text-slate-500">Update pharmacy information</p>
          </div>
        </div>
        <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Pharmacy
        </Button>
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
                  className="rounded-xl"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Street Address *</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>ZIP Code *</Label>
                <Input
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
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
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
              <h3 className="font-semibold text-slate-900">{formData.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{formData.city}, {formData.state}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Pharmacists</span>
                <span className="font-semibold text-slate-900">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Medications</span>
                <span className="font-semibold text-slate-900">1,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Orders</span>
                <span className="font-semibold text-slate-900">4,532</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Revenue</span>
                <span className="font-semibold text-emerald-600">$45,678.90</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl h-12">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
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
