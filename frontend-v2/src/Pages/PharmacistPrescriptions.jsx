import { useState } from 'react';
import PharmacistLayout from '@/components/pharmacist/PharmacistLayout';
import SearchInput from '@/components/ui-custom/SearchInput';
import StatusBadge from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  Eye,
  Clock,
  FileText,
  User,
  Pill,
  Calendar,
  MessageSquare,
  ZoomIn
} from 'lucide-react';

const mockPrescriptions = [
  {
    id: '1',
    patient_name: 'Alice Johnson',
    patient_email: 'alice@example.com',
    medication_requested: 'Amoxicillin 500mg',
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
    status: 'Pending',
    created_date: '2024-01-18T10:30:00Z',
    notes: null
  },
  {
    id: '2',
    patient_name: 'Bob Williams',
    patient_email: 'bob@example.com',
    medication_requested: 'Metformin 850mg',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
    status: 'Pending',
    created_date: '2024-01-18T09:15:00Z',
    notes: null
  },
  {
    id: '3',
    patient_name: 'Carol Davis',
    patient_email: 'carol@example.com',
    medication_requested: 'Atorvastatin 40mg',
    image_url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800',
    status: 'Pending',
    created_date: '2024-01-18T08:00:00Z',
    notes: null
  },
  {
    id: '4',
    patient_name: 'David Brown',
    patient_email: 'david@example.com',
    medication_requested: 'Lisinopril 10mg',
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
    status: 'Approved',
    created_date: '2024-01-17T14:30:00Z',
    notes: 'Valid prescription. Approved for 30-day supply.'
  },
  {
    id: '5',
    patient_name: 'Eva Martinez',
    patient_email: 'eva@example.com',
    medication_requested: 'Gabapentin 300mg',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
    status: 'Rejected',
    created_date: '2024-01-16T11:00:00Z',
    notes: 'Prescription expired. Please upload a current prescription.'
  },
];

export default function PharmacistPrescriptions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const filteredPrescriptions = mockPrescriptions.filter(rx => {
    const matchesSearch = rx.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rx.medication_requested.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = mockPrescriptions.filter(rx => rx.status === 'Pending').length;

  const openReview = (prescription) => {
    setSelectedPrescription(prescription);
    setReviewNotes('');
    setIsReviewOpen(true);
  };

  const openImage = (prescription) => {
    setSelectedPrescription(prescription);
    setIsImageOpen(true);
  };

  return (
    <PharmacistLayout title="Prescriptions">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Prescriptions', value: mockPrescriptions.length, icon: FileText, color: 'bg-blue-100 text-blue-600' },
          { label: 'Pending Review', value: pendingCount, icon: Clock, color: 'bg-amber-100 text-amber-600' },
          { label: 'Approved', value: mockPrescriptions.filter(rx => rx.status === 'Approved').length, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
          { label: 'Rejected', value: mockPrescriptions.filter(rx => rx.status === 'Rejected').length, icon: XCircle, color: 'bg-rose-100 text-rose-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
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

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by patient or medication..."
            className="flex-1"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Prescriptions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrescriptions.map((prescription) => (
          <div 
            key={prescription.id}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div 
              className="relative h-48 bg-slate-100 cursor-pointer group"
              onClick={() => openImage(prescription)}
            >
              <img
                src={prescription.image_url}
                alt="Prescription"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>
              <div className="absolute top-3 right-3">
                <StatusBadge status={prescription.status} />
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{prescription.patient_name}</h3>
                  <p className="text-sm text-slate-500">{prescription.patient_email}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Pill className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{prescription.medication_requested}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-500">
                    {new Date(prescription.created_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {prescription.notes && (
                <div className={`p-3 rounded-lg mb-4 ${
                  prescription.status === 'Approved' ? 'bg-emerald-50' : 'bg-rose-50'
                }`}>
                  <p className={`text-sm ${
                    prescription.status === 'Approved' ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {prescription.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              {prescription.status === 'Pending' ? (
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    onClick={() => openReview(prescription)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl"
                    onClick={() => openReview(prescription)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full rounded-xl">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Prescription</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <img
                  src={selectedPrescription.image_url}
                  alt="Prescription"
                  className="w-32 h-32 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedPrescription.patient_name}</h3>
                  <p className="text-sm text-slate-500">{selectedPrescription.medication_requested}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Notes for Patient</label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about this prescription..."
                  className="rounded-xl"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  onClick={() => setIsReviewOpen(false)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Prescription
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl"
                  onClick={() => setIsReviewOpen(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Prescription Image</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="py-4">
              <img
                src={selectedPrescription.image_url}
                alt="Prescription"
                className="w-full rounded-xl"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PharmacistLayout>
  );
}
