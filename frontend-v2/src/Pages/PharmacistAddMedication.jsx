import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Upload, 
  Save,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Simple modal component for success/error messages
const SimpleDialog = ({ open, onClose, title, description, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-slate-500 mt-2">{description}</p>
        </div>
        {children}
        <div className="mt-6">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// Extended categories matching your backend
const categories = [
  'Pain Relief', 'Antibiotics', 'Vitamins', 'Allergy', 'Diabetes', 
  'Heart Health', 'Digestive', 'Skin Care', 'Respiratory', 'Baby Care',
  'Eye Care', 'First Aid', 'Other'
];

// Drug classes for reference
const drugClasses = [
  'Analgesic', 'Antibiotic', 'Antihistamine', 'Beta Blocker', 'ACE Inhibitor',
  'SSRI', 'NSAID', 'Statin', 'Proton Pump Inhibitor', 'Bronchodilator',
  'Corticosteroid', 'Antidepressant', 'Antipsychotic', 'Anticoagulant', 'Diuretic'
];

// Route of administration options
const administrationRoutes = [
  'Oral', 'Topical', 'Inhalation', 'Intravenous', 'Intramuscular',
  'Subcutaneous', 'Sublingual', 'Rectal', 'Vaginal', 'Ophthalmic',
  'Otic', 'Nasal', 'Transdermal'
];

// Pregnancy categories
const pregnancyCategories = ['A', 'B', 'C', 'D', 'X'];

export default function PharmacistAddMedication() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pharmacyData, setPharmacyData] = useState(null);
  const [fetchingPharmacy, setFetchingPharmacy] = useState(true);

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    description: '',
    category: '',
    manufacturer: '',
    dosage: '',
    sku: '',
    
    // Medical Information
    drug_class: '',
    route_of_administration: 'Oral',
    generic_name: '',
    brand_name: '',
    active_ingredients: '',
    
    // Usage Information
    usage_dosage: '',
    frequency: '',
    duration: '',
    administration_instructions: '',
    special_instructions: '',
    
    // Safety Information
    warnings: '',
    side_effects: '',
    contraindications: '',
    interactions: '',
    pregnancy_category: '',
    
    // Pricing & Inventory
    price: '',
    stock_quantity: '',
    online_stock: '',
    in_person_stock: '',
    low_stock_threshold: '10',
    is_prescription_required: false,
    
    // Storage
    storage_instructions: 'Store at room temperature away from moisture and heat. Keep out of reach of children.',
  });

  // Fetch pharmacy_id from clients table
  useEffect(() => {
    const fetchPharmacyData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setFetchingPharmacy(false);
          return;
        }

        // Try to get pharmacy data from a dedicated endpoint
        const response = await fetch('http://localhost:5001/api/pharmacy/my-pharmacy', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Pharmacy API response:', result);
          
          if (result.success && result.pharmacy) {
            setPharmacyData(result.pharmacy);
          } else if (result.success && result.pharmacy_id) {
            setPharmacyData({ 
              id: result.pharmacy_id,
              name: result.pharmacy_name || 'Your Pharmacy'
            });
          }
        } else {
          // If the dedicated endpoint fails, try to get it from profile
          console.log('Trying profile endpoint as fallback...');
          const profileResponse = await fetch('http://localhost:5001/api/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (profileResponse.ok) {
            const profileResult = await profileResponse.json();
            console.log('Profile API response:', profileResult);
            
            if (profileResult.success && profileResult.user && profileResult.user.pharmacy_id) {
              setPharmacyData({ 
                id: profileResult.user.pharmacy_id,
                name: profileResult.user.pharmacy_name || 'Your Pharmacy'
              });
            }
          } else {
            // Last resort: try a direct clients table query endpoint
            const clientsResponse = await fetch('http://localhost:5001/api/clients/my-info', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (clientsResponse.ok) {
              const clientsResult = await clientsResponse.json();
              console.log('Clients API response:', clientsResult);
              
              if (clientsResult.success && clientsResult.client && clientsResult.client.pharmacy_id) {
                setPharmacyData({ 
                  id: clientsResult.client.pharmacy_id,
                  name: clientsResult.client.pharmacy_name || 'Your Pharmacy'
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching pharmacy data:', error);
      } finally {
        setFetchingPharmacy(false);
      }
    };

    fetchPharmacyData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Please select an image smaller than 5MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert("Invalid file type. Please select an image file (PNG, JPG, JPEG)");
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSKU = () => {
    const prefix = formData.category ? formData.category.substring(0, 3).toUpperCase() : 'MED';
    const namePart = formData.name ? formData.name.substring(0, 3).toUpperCase() : 'NEW';
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${namePart}-${random}`;
  };

  const validateForm = () => {
    const requiredFields = ['name', 'category', 'price', 'stock_quantity'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (parseFloat(formData.price) <= 0) {
      alert("Price must be greater than 0");
      return false;
    }

    if (parseInt(formData.stock_quantity) < 0) {
      alert("Stock quantity cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!pharmacyData || !pharmacyData.id) {
      alert('Unable to determine your pharmacy. Please make sure you are assigned to a pharmacy.');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      console.log('Submitting medication for pharmacy:', pharmacyData);
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      if (!formData.sku) {
        submitData.set('sku', generateSKU());
      }

      if (!formData.online_stock) {
        submitData.set('online_stock', formData.stock_quantity);
      }

      submitData.append('pharmacy_id', pharmacyData.id);
      console.log('Adding pharmacy_id to FormData:', pharmacyData.id);

      console.log('FormData entries:');
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to add medications');
      }

      const response = await fetch('http://localhost:5001/api/medications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to add medication (${response.status})`);
      }

      const result = await response.json();
      
      if (result.success) {
        setShowSuccessDialog(true);
      } else {
        throw new Error(result.message || 'Failed to add medication');
      }

    } catch (error) {
      console.error('Error adding medication:', error);
      setErrorMessage(error.message || 'Failed to add medication. Please try again.');
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    setFormData({
      name: '',
      description: '',
      category: '',
      manufacturer: '',
      dosage: '',
      sku: '',
      drug_class: '',
      route_of_administration: 'Oral',
      generic_name: '',
      brand_name: '',
      active_ingredients: '',
      usage_dosage: '',
      frequency: '',
      duration: '',
      administration_instructions: '',
      special_instructions: '',
      warnings: '',
      side_effects: '',
      contraindications: '',
      interactions: '',
      pregnancy_category: '',
      price: '',
      stock_quantity: '',
      online_stock: '',
      in_person_stock: '',
      low_stock_threshold: '10',
      is_prescription_required: false,
      storage_instructions: 'Store at room temperature away from moisture and heat. Keep out of reach of children.',
    });
    setImageFile(null);
    setPreviewImage(null);
    navigate(createPageUrl('PharmacistInventory'));
  };

  const handleErrorClose = () => {
    setShowErrorDialog(false);
  };

  if (fetchingPharmacy) {
    return (
      <PharmacistLayout title="Add Medication">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-3 text-slate-600">Loading pharmacy information...</span>
        </div>
      </PharmacistLayout>
    );
  }

  if (!pharmacyData || !pharmacyData.id) {
    return (
      <PharmacistLayout title="Add Medication">
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to Add Medication</h3>
          <p className="text-slate-500 mb-4">
            Your account is not associated with a pharmacy. Please contact your administrator.
          </p>
          <div className="space-y-3">
            <div className="bg-amber-50 rounded-xl p-4 text-left">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Your account needs to be assigned to a pharmacy in the clients table.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()} variant="outline">
                Refresh Page
              </Button>
              <Link to={createPageUrl('PharmacistInventory')}>
                <Button variant="default" className="bg-emerald-600">
                  Back to Inventory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PharmacistLayout>
    );
  }

  return (
    <PharmacistLayout title="Add Medication">
      <SimpleDialog
        open={showSuccessDialog}
        onClose={handleSuccessClose}
        title="Medication Added Successfully!"
        description="The medication has been added to your inventory and is now available for customers."
      >
        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleSuccessClose}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Back to Inventory
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowSuccessDialog(false);
              setFormData({
                ...formData,
                name: '',
                sku: '',
                dosage: '',
                price: '',
                stock_quantity: '',
              });
              setImageFile(null);
              setPreviewImage(null);
            }}
          >
            Add Another
          </Button>
        </div>
      </SimpleDialog>

      <SimpleDialog
        open={showErrorDialog}
        onClose={handleErrorClose}
        title="Error Adding Medication"
        description={errorMessage}
      >
        <Button onClick={handleErrorClose}>
          Try Again
        </Button>
      </SimpleDialog>

      <div className="flex items-center gap-4 mb-6">
        <Link to={createPageUrl('PharmacistInventory')}>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Add New Medication</h1>
          <p className="text-sm text-slate-500">Fill in the details to add a new medication to inventory</p>
        </div>
        <div className="bg-emerald-50 rounded-xl px-3 py-2">
          <p className="text-xs text-emerald-700 font-medium">
            Pharmacy: <span className="font-bold">{pharmacyData.name}</span>
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            ID: <span className="font-mono text-xs">{pharmacyData.id.substring(0, 8)}...</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="pharmacy_id" value={pharmacyData.id} />
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-lg text-slate-900 mb-4">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="name">Medication Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Amoxicillin 500mg"
                    className="rounded-xl"
                    required
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter medication description..."
                    className="rounded-xl resize-none"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    placeholder="e.g., PharmaCorp Inc."
                    className="rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="e.g., 500mg Capsules"
                    className="rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sku">
                    SKU
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2 text-xs"
                      onClick={() => handleSelectChange('sku', generateSKU())}
                    >
                      Generate
                    </Button>
                  </Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="e.g., AMOX-500-30"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-lg text-slate-900 mb-4">Medical Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="drug_class">Drug Class</Label>
                  <Select 
                    value={formData.drug_class} 
                    onValueChange={(value) => handleSelectChange('drug_class', value)}
                  >
                    <SelectTrigger id="drug_class" className="w-full">
                      <SelectValue placeholder="Select drug class" />
                    </SelectTrigger>
                    <SelectContent>
                      {drugClasses.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="route_of_administration">Route of Administration</Label>
                  <Select 
                    value={formData.route_of_administration} 
                    onValueChange={(value) => handleSelectChange('route_of_administration', value)}
                  >
                    <SelectTrigger id="route_of_administration" className="w-full">
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {administrationRoutes.map(route => (
                        <SelectItem key={route} value={route}>{route}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="generic_name">Generic Name</Label>
                  <Input
                    id="generic_name"
                    name="generic_name"
                    value={formData.generic_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Amoxicillin"
                    className="rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand_name">Brand Name</Label>
                  <Input
                    id="brand_name"
                    name="brand_name"
                    value={formData.brand_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Amoxil"
                    className="rounded-xl"
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="active_ingredients">Active Ingredients</Label>
                  <Textarea
                    id="active_ingredients"
                    name="active_ingredients"
                    value={formData.active_ingredients}
                    onChange={handleInputChange}
                    placeholder="List active ingredients separated by commas..."
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-lg text-slate-900 mb-4">Usage Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="usage_dosage">Usage & Dosage Instructions</Label>
                  <Textarea
                    id="usage_dosage"
                    name="usage_dosage"
                    value={formData.usage_dosage}
                    onChange={handleInputChange}
                    placeholder="e.g., Take 1 tablet every 8 hours with food..."
                    className="rounded-xl resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    placeholder="e.g., Once daily, Every 6 hours"
                    className="rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 7 days, Until finished"
                    className="rounded-xl"
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="administration_instructions">Administration Instructions</Label>
                  <Textarea
                    id="administration_instructions"
                    name="administration_instructions"
                    value={formData.administration_instructions}
                    onChange={handleInputChange}
                    placeholder="Special instructions for administration..."
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="special_instructions">Special Instructions</Label>
                  <Textarea
                    id="special_instructions"
                    name="special_instructions"
                    value={formData.special_instructions}
                    onChange={handleInputChange}
                    placeholder="Any special instructions or precautions..."
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-lg text-slate-900 mb-4">Safety Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="warnings">Warnings</Label>
                  <Textarea
                    id="warnings"
                    name="warnings"
                    value={formData.warnings}
                    onChange={handleInputChange}
                    placeholder="Important warnings and precautions..."
                    className="rounded-xl resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="side_effects">Side Effects</Label>
                  <Textarea
                    id="side_effects"
                    name="side_effects"
                    value={formData.side_effects}
                    onChange={handleInputChange}
                    placeholder="Common side effects..."
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contraindications">Contraindications</Label>
                  <Textarea
                    id="contraindications"
                    name="contraindications"
                    value={formData.contraindications}
                    onChange={handleInputChange}
                    placeholder="Conditions where medication should not be used..."
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interactions">Drug Interactions</Label>
                  <Textarea
                    id="interactions"
                    name="interactions"
                    value={formData.interactions}
                    onChange={handleInputChange}
                    placeholder="Known drug interactions..."
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pregnancy_category">Pregnancy Category</Label>
                  <Select 
                    value={formData.pregnancy_category} 
                    onValueChange={(value) => handleSelectChange('pregnancy_category', value)}
                  >
                    <SelectTrigger id="pregnancy_category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {pregnancyCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          Category {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-lg text-slate-900 mb-4">Pricing & Inventory</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="rounded-xl"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Total Stock Quantity *</Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="rounded-xl"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="online_stock">Online Stock</Label>
                  <Input
                    id="online_stock"
                    name="online_stock"
                    type="number"
                    min="0"
                    value={formData.online_stock}
                    onChange={handleInputChange}
                    placeholder="Auto-filled from total stock"
                    className="rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="in_person_stock">In-Person Stock</Label>
                  <Input
                    id="in_person_stock"
                    name="in_person_stock"
                    type="number"
                    min="0"
                    value={formData.in_person_stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                  <Input
                    id="low_stock_threshold"
                    name="low_stock_threshold"
                    type="number"
                    min="1"
                    value={formData.low_stock_threshold}
                    onChange={handleInputChange}
                    placeholder="10"
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
                  id="is_prescription_required"
                  checked={formData.is_prescription_required}
                  onCheckedChange={(checked) => handleSelectChange('is_prescription_required', checked)}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-lg text-slate-900 mb-4">Storage Instructions</h2>
              <div className="space-y-2">
                <Label htmlFor="storage_instructions">Storage Instructions</Label>
                <Textarea
                  id="storage_instructions"
                  name="storage_instructions"
                  value={formData.storage_instructions}
                  onChange={handleInputChange}
                  placeholder="Instructions for proper storage..."
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-lg text-slate-900 mb-4">Product Image</h2>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="image-upload"
                />
                {previewImage ? (
                  <div>
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="max-h-48 mx-auto rounded-lg mb-4 object-contain" 
                    />
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
              {imageFile && (
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>

            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-blue-900">Quick Tips</h3>
              </div>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Fields marked with * are required</li>
                <li>• Generate SKU automatically if unsure</li>
                <li>• Add detailed warnings for prescription drugs</li>
                <li>• Upload clear product images</li>
                <li>• Review all information before saving</li>
                <li>• <strong>This medication will be added to:</strong> <span className="font-bold">{pharmacyData.name}</span></li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Medication
                  </>
                )}
              </Button>
              <Link to={createPageUrl('PharmacistInventory')} className="block">
                <Button variant="outline" className="w-full rounded-xl h-12">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </PharmacistLayout>
  );
}