import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { medicationAPI, prescriptionAPI } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge'; // ✅ ADD THIS LINE
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import PageHeader from '@/components/ui-custom/PageHeader';
import { 
  Upload, 
  FileText, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  Pill,
  Building2,
  Package,
  MapPin,
  Phone
} from 'lucide-react';

export default function CustomerPrescriptionUpload() {
  const { medicationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [medication, setMedication] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    pharmacy_id: '',
    quantity: '1',
    delivery_address: '',
    contact_number: '',
    customer_notes: ''
  });

  // Fetch medication details on load
  useEffect(() => {
    const fetchMedication = async () => {
      try {
        setLoading(true);
        const response = await medicationAPI.getMedicationById(medicationId);
        if (response.success && response.medication) {
          setMedication(response.medication);
          // Auto-fill pharmacy_id from medication data
          setFormData(prev => ({
            ...prev,
            pharmacy_id: response.medication.pharmacy_id || ''
          }));
        } else {
          setError('Medication not found');
        }
      } catch (err) {
        console.error('Error fetching medication:', err);
        setError('Failed to load medication details');
      } finally {
        setLoading(false);
      }
    };

    if (medicationId) {
      fetchMedication();
    }
  }, [medicationId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert("File too large. Please select a file smaller than 10MB");
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please select an image or PDF file");
        return;
      }

      setPrescriptionFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewFile(reader.result);
        reader.readAsDataURL(file);
      } else {
        // For PDFs, just show icon
        setPreviewFile('pdf');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!prescriptionFile) {
      alert('Please upload a prescription file');
      return;
    }

    if (!formData.pharmacy_id) {
      alert('Pharmacy information is missing');
      return;
    }

    if (!formData.quantity || parseInt(formData.quantity) < 1) {
      alert('Please enter a valid quantity');
      return;
    }

    if (!formData.delivery_address.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    if (!formData.contact_number.trim()) {
      alert('Please enter your contact number');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // ✅ Create FormData object (same pattern as medication upload)
      const formDataObj = new FormData();
      
      // Append file with field name 'prescription' (matches multer config)
      formDataObj.append('prescription', prescriptionFile);
      
      // Append all other fields as strings
      formDataObj.append('medication_id', medicationId);
      formDataObj.append('pharmacy_id', formData.pharmacy_id);
      formDataObj.append('quantity', formData.quantity);
      formDataObj.append('delivery_address', formData.delivery_address);
      formDataObj.append('contact_number', formData.contact_number);
      formDataObj.append('customer_notes', formData.customer_notes || '');

      // Log FormData for debugging
      console.log('📤 Submitting prescription upload:');
      for (let pair of formDataObj.entries()) {
        if (pair[0] === 'prescription') {
          console.log(`- ${pair[0]}: [File] ${pair[1].name} (${pair[1].type})`);
        } else {
          console.log(`- ${pair[0]}: ${pair[1]}`);
        }
      }

      const token = localStorage.getItem('token');
      if (!token) {
        navigate(createPageUrl('CustomerLogin'));
        return;
      }

      // ✅ Make API call to your backend
      const response = await fetch(`http://localhost:5001/api/prescriptions/upload/${medicationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // ❌ DO NOT set Content-Type - let browser set it with boundary
        },
        body: formDataObj
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload prescription');
      }

      if (result.success) {
        setSuccess(true);
        // Clear form
        setPrescriptionFile(null);
        setPreviewFile(null);
        setFormData(prev => ({
          ...prev,
          quantity: '1',
          customer_notes: ''
        }));
        
        // Show success message and redirect after 3 seconds
        setTimeout(() => {
          navigate(createPageUrl('CustomerPrescriptionHistory'));
        }, 3000);
      } else {
        throw new Error(result.message || 'Upload failed');
      }

    } catch (err) {
      console.error('❌ Prescription upload error:', err);
      setError(err.message || 'Failed to upload prescription. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CustomerHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-slate-600">Loading medication details...</span>
          </div>
        </div>
        <CustomerFooter />
      </div>
    );
  }

  if (error && !medication) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CustomerHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Error</h3>
            <p className="text-slate-500 mb-4">{error}</p>
            <Button onClick={() => navigate(-1)} variant="default" className="bg-emerald-600">
              Go Back
            </Button>
          </div>
        </div>
        <CustomerFooter />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CustomerHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-lg mx-auto">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Prescription Uploaded!</h3>
            <p className="text-slate-500 mb-6">
              Your prescription has been submitted successfully. A pharmacist will review it shortly.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate(createPageUrl('CustomerPrescriptionHistory'))} className="bg-emerald-600">
                View My Prescriptions
              </Button>
              <Button variant="outline" onClick={() => navigate(createPageUrl('CustomerMedications'))}>
                Browse More
              </Button>
            </div>
          </div>
        </div>
        <CustomerFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PageHeader
            title="Upload Prescription"
            breadcrumbs={[
              { label: 'Medications', href: 'CustomerMedications' },
              { label: medication?.name || 'Medication', href: `CustomerMedicationDetails/${medicationId}` },
              { label: 'Upload Prescription' }
            ]}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Prescription File Upload */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-semibold text-lg text-slate-900 mb-4">Prescription File</h2>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="prescription-upload"
                    required
                  />
                  
                  {previewFile ? (
                    <div>
                      {previewFile === 'pdf' ? (
                        <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-10 w-10 text-red-600" />
                        </div>
                      ) : (
                        <img 
                          src={previewFile} 
                          alt="Prescription Preview" 
                          className="max-h-48 mx-auto rounded-lg mb-4 object-contain" 
                        />
                      )}
                      <p className="font-medium text-slate-900">{prescriptionFile?.name}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {(prescriptionFile?.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-emerald-600 mt-2">Click to change file</p>
                    </div>
                  ) : (
                    <>
                      <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-10 w-10 text-slate-400" />
                      </div>
                      <p className="font-medium text-slate-900">Upload Prescription</p>
                      <p className="text-sm text-slate-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-semibold text-lg text-slate-900 mb-4">Order Details</h2>
                <div className="space-y-4">
                  {/* Medication Info - Read Only */}
                  {medication && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Pill className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-500">Medication</p>
                          <p className="font-semibold text-slate-900">{medication.name}</p>
                          <p className="text-xs text-slate-500 mt-1">Dosage: {medication.dosage || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pharmacy ID - Hidden but required */}
                  <input 
                    type="hidden" 
                    name="pharmacy_id" 
                    value={formData.pharmacy_id} 
                  />

                  {/* Quantity */}
                  <div>
                    <Label htmlFor="quantity" className="text-slate-700">Quantity *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      className="rounded-xl mt-1.5"
                      required
                    />
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <Label htmlFor="delivery_address" className="text-slate-700">Delivery Address *</Label>
                    <Textarea
                      id="delivery_address"
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={handleInputChange}
                      placeholder="Enter complete delivery address"
                      className="rounded-xl mt-1.5 resize-none"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <Label htmlFor="contact_number" className="text-slate-700">Contact Number *</Label>
                    <Input
                      id="contact_number"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      placeholder="Enter contact number"
                      className="rounded-xl mt-1.5"
                      required
                    />
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="customer_notes" className="text-slate-700">Additional Notes (Optional)</Label>
                    <Textarea
                      id="customer_notes"
                      name="customer_notes"
                      value={formData.customer_notes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for the pharmacist?"
                      className="rounded-xl mt-1.5 resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-14 text-base"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Uploading Prescription...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Submit Prescription
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Information Sidebar - Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Medication Summary Card */}
            {medication && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Medication Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={medication.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'} 
                        alt={medication.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{medication.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">${medication.price?.toFixed(2)} per unit</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Prescription Required</span>
                      <Badge className="bg-amber-100 text-amber-700">Yes</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Stock Status</span>
                      <span className="font-medium text-emerald-600">In Stock</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions Card */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Prescription Guidelines</h3>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Upload a clear photo or scan of your prescription</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Prescription must be valid and unexpired</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Pharmacist will review within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>You'll be notified when approved</span>
                </li>
              </ul>
            </div>

            {/* Need Help Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
              <p className="text-sm text-slate-500 mb-4">
                Contact our pharmacy support team for assistance with your prescription upload.
              </p>
              <Button variant="outline" className="w-full rounded-xl">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
}