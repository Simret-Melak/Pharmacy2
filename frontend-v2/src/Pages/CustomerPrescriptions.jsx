import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import PageHeader from '@/components/ui-custom/PageHeader';
import StatusBadge from '@/components/ui-custom/StatusBadge';
import { 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Image as ImageIcon,
  Plus,
  Eye,
  MessageSquare
} from 'lucide-react';

const mockPrescriptions = [
  {
    id: '1',
    medication_requested: 'Amoxicillin 500mg',
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
    status: 'Approved',
    created_date: '2024-01-15T10:30:00Z',
    notes: 'Prescription verified. Valid for 30-day supply.',
    reviewed_by: 'Dr. Sarah Wilson'
  },
  {
    id: '2',
    medication_requested: 'Metformin 850mg',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    status: 'Pending',
    created_date: '2024-01-18T14:20:00Z',
    notes: null,
    reviewed_by: null
  },
  {
    id: '3',
    medication_requested: 'Atorvastatin 40mg',
    image_url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400',
    status: 'Rejected',
    created_date: '2024-01-10T09:15:00Z',
    notes: 'Prescription expired. Please upload a new prescription dated within the last 6 months.',
    reviewed_by: 'Dr. Michael Chen'
  },
];

const statusIcons = {
  Pending: Clock,
  Approved: CheckCircle,
  Rejected: XCircle,
};

const statusColors = {
  Pending: 'text-amber-500',
  Approved: 'text-emerald-500',
  Rejected: 'text-rose-500',
};

export default function CustomerPrescriptions() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerHeader />
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="My Prescriptions"
          description="Upload and manage your prescriptions"
          breadcrumbs={[
            { label: 'Prescriptions' }
          ]}
          actions={
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Upload New Prescription</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Prescription Image</Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {previewImage ? (
                        <div className="space-y-3">
                          <img src={previewImage} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                          <p className="text-sm text-slate-600">{selectedFile?.name}</p>
                        </div>
                      ) : (
                        <>
                          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                            <Upload className="h-6 w-6 text-emerald-600" />
                          </div>
                          <p className="font-medium text-slate-900">Click or drag to upload</p>
                          <p className="text-sm text-slate-500 mt-1">PNG, JPG or PDF up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Medication Requested */}
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication Requested</Label>
                    <Input
                      id="medication"
                      placeholder="e.g., Amoxicillin 500mg"
                      className="rounded-xl"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information..."
                      className="rounded-xl resize-none"
                      rows={3}
                    />
                  </div>

                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Prescription
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Prescriptions', value: mockPrescriptions.length, icon: FileText, color: 'bg-blue-100 text-blue-600' },
            { label: 'Approved', value: mockPrescriptions.filter(p => p.status === 'Approved').length, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
            { label: 'Pending Review', value: mockPrescriptions.filter(p => p.status === 'Pending').length, icon: Clock, color: 'bg-amber-100 text-amber-600' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {mockPrescriptions.map((prescription) => {
            const StatusIcon = statusIcons[prescription.status];
            return (
              <div 
                key={prescription.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-48 h-48 md:h-auto bg-slate-100 relative shrink-0">
                    <img
                      src={prescription.image_url}
                      alt="Prescription"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 mb-1">
                          {prescription.medication_requested}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Uploaded on {new Date(prescription.created_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        prescription.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        prescription.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {prescription.status}
                      </div>
                    </div>

                    {/* Status Info */}
                    <div className={`flex items-start gap-3 p-4 rounded-xl ${
                      prescription.status === 'Approved' ? 'bg-emerald-50' :
                      prescription.status === 'Rejected' ? 'bg-rose-50' : 'bg-amber-50'
                    }`}>
                      <StatusIcon className={`h-5 w-5 mt-0.5 ${statusColors[prescription.status]}`} />
                      <div>
                        <p className={`font-medium ${
                          prescription.status === 'Approved' ? 'text-emerald-900' :
                          prescription.status === 'Rejected' ? 'text-rose-900' : 'text-amber-900'
                        }`}>
                          {prescription.status === 'Pending' ? 'Awaiting Review' :
                           prescription.status === 'Approved' ? 'Prescription Approved' : 'Prescription Rejected'}
                        </p>
                        <p className={`text-sm mt-1 ${
                          prescription.status === 'Approved' ? 'text-emerald-700' :
                          prescription.status === 'Rejected' ? 'text-rose-700' : 'text-amber-700'
                        }`}>
                          {prescription.notes || 'Your prescription is being reviewed by our pharmacists.'}
                        </p>
                        {prescription.reviewed_by && (
                          <p className="text-sm mt-2 text-slate-500">
                            Reviewed by: {prescription.reviewed_by}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {prescription.status === 'Approved' && (
                      <div className="mt-4 flex gap-3">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                          Order Medication
                        </Button>
                        <Button variant="outline" className="rounded-xl">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Pharmacist
                        </Button>
                      </div>
                    )}
                    {prescription.status === 'Rejected' && (
                      <div className="mt-4">
                        <Button variant="outline" className="rounded-xl" onClick={() => setIsUploadOpen(true)}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New Prescription
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {mockPrescriptions.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No prescriptions yet</h3>
            <p className="text-slate-500 mb-4">Upload your first prescription to get started</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl" onClick={() => setIsUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Prescription
            </Button>
          </div>
        )}
      </div>

      <CustomerFooter />
    </div>
  );
}
