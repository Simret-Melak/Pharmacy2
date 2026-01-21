import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PharmacistLayout from '@/components/pharmacist/PharmacistLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Save,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

const categories = ['Pain Relief', 'Antibiotics', 'Vitamins', 'Allergy', 'Diabetes', 'Heart Health', 'Digestive', 'Skin Care', 'Respiratory', 'Other'];

// Mock data for editing
const mockMedication = {
  id: '1',
  name: 'Amoxicillin 500mg',
  description: 'Amoxicillin is a penicillin antibiotic that fights bacteria. It is used to treat many different types of infection caused by bacteria.',
  price: '12.99',
  stock: '150',
  category: 'Antibiotics',
  prescription_required: true,
  manufacturer: 'PharmaCorp Inc.',
  dosage: '500mg Capsules',
  expiration_date: '2025-06-15',
  sku: 'AMOX-500-30',
  image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'
};

export default function PharmacistEditMedication() {
  const [formData, setFormData] = useState(mockMedication);
  const [previewImage, setPreviewImage] = useState(mockMedication.image_url);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <PharmacistLayout title="Edit Medication">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('PharmacistInventory')}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Edit Medication</h1>
            <p className="text-sm text-slate-500">Update medication details</p>
          </div>
        </div>
        <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Medication
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Medication Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="rounded-xl resize-none"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Manufacturer</Label>
                <Input
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Dosage</Label>
                <Input
                  value={formData.dosage}
                  onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Pricing & Inventory</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price ($) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity *</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Expiration Date *</Label>
                <Input
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) => setFormData({...formData, expiration_date: e.target.value})}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Prescription Required</p>
                <p className="text-sm text-slate-500">Enable if this medication requires a prescription</p>
              </div>
              <Switch
                checked={formData.prescription_required}
                onCheckedChange={(checked) => setFormData({...formData, prescription_required: checked})}
              />
            </div>
          </div>

          {/* Stock History */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Stock History</h2>
            <div className="space-y-3">
              {[
                { date: '2024-01-15', action: 'Restocked', quantity: '+100', by: 'Admin' },
                { date: '2024-01-10', action: 'Sold', quantity: '-25', by: 'Order #1234' },
                { date: '2024-01-05', action: 'Restocked', quantity: '+75', by: 'Admin' },
              ].map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">{entry.action}</p>
                    <p className="text-sm text-slate-500">{entry.by}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${entry.quantity.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {entry.quantity}
                    </p>
                    <p className="text-sm text-slate-500">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Product Image</h2>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewImage ? (
                <div>
                  <img src={previewImage} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-4 object-contain" />
                  <p className="text-sm text-slate-500">Click to change image</p>
                </div>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-900">Upload Image</p>
                  <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* Medication Info */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Created</span>
                <span className="font-medium text-slate-900">Jan 1, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Updated</span>
                <span className="font-medium text-slate-900">Jan 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Sales</span>
                <span className="font-medium text-slate-900">234 units</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Link to={createPageUrl('PharmacistInventory')} className="block">
              <Button variant="ghost" className="w-full rounded-xl">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PharmacistLayout>
  );
}
