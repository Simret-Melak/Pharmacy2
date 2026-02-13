import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import PageHeader from '@/components/ui-custom/PageHeader';
import { 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Eye,
  MessageSquare,
  Loader2,
  AlertCircle,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  Pill,
  Calendar,
  Check,
  AlertTriangle
} from 'lucide-react';
import { api } from '@/utils/api';

// Status configuration
const statusConfig = {
  pending: { 
    label: 'Pending Review', 
    icon: Clock, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-900',
    badgeColor: 'bg-amber-100 text-amber-700'
  },
  approved: { 
    label: 'Approved', 
    icon: CheckCircle, 
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-900',
    badgeColor: 'bg-emerald-100 text-emerald-700'
  },
  rejected: { 
    label: 'Rejected', 
    icon: XCircle, 
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-900',
    badgeColor: 'bg-rose-100 text-rose-700'
  },
};

export default function CustomerPrescriptions() {
  const navigate = useNavigate();
  
  // Prescription list state
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Fetch prescriptions on component mount and filter changes
  useEffect(() => {
    fetchPrescriptions();
  }, [filters.status, filters.page, filters.search]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        ...(filters.status !== 'all' && { status: filters.status })
      });

      const response = await api.get(`/prescriptions/my-prescriptions?${queryParams}`);
      
      if (response.success) {
        const prescriptionsData = response.prescriptions || [];
        setPrescriptions(prescriptionsData);
        
        // Update pagination
        setPagination({
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 1,
          totalItems: response.pagination?.totalItems || prescriptionsData.length,
          itemsPerPage: response.pagination?.itemsPerPage || 10
        });

        // Calculate stats
        const stats = {
          total: response.pagination?.totalItems || prescriptionsData.length,
          pending: prescriptionsData.filter(p => p.status === 'pending').length,
          approved: prescriptionsData.filter(p => p.status === 'approved').length,
          rejected: prescriptionsData.filter(p => p.status === 'rejected').length
        };
        setStats(stats);
      } else {
        setError('Failed to load prescriptions');
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      
      if (err.message?.includes('401')) {
        setError('Please login to view prescriptions');
        navigate(createPageUrl('CustomerLogin'));
      } else {
        setError(err.message || 'Failed to load prescriptions. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = async (prescriptionId) => {
    try {
      // Open in new tab
      window.open(`${api.defaults.baseURL}/prescriptions/${prescriptionId}/view`, '_blank');
    } catch (err) {
      console.error('Error viewing prescription:', err);
      alert('Failed to view prescription file. Please try again.');
    }
  };

  const handleDownloadPrescription = async (prescriptionId) => {
    try {
      window.open(`${api.defaults.baseURL}/prescriptions/${prescriptionId}/download`, '_blank');
    } catch (err) {
      console.error('Error downloading prescription:', err);
      alert('Failed to download prescription. Please try again.');
    }
  };

  const handleStatusChange = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      search: '',
      page: 1,
      limit: 10
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOrderMedication = (prescription) => {
    if (prescription.status !== 'approved') {
      alert('This prescription needs to be approved first before ordering.');
      return;
    }
    
    // Navigate to medications page with search for this medication
    if (prescription.medications?.name) {
      navigate(createPageUrl(`CustomerMedications?search=${encodeURIComponent(prescription.medications.name)}`));
    } else {
      navigate(createPageUrl('CustomerMedications'));
    }
  };

  const handleContactPharmacist = () => {
    window.open('tel:5551234567');
  };

  const handleUploadNewPrescription = () => {
    // Navigate to medications page to select a medication first
    navigate(createPageUrl('CustomerMedications?uploadPrescription=true'));
  };

  if (loading && prescriptions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CustomerHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
            <p className="mt-4 text-slate-600">Loading prescriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerHeader />
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="My Prescriptions"
          description="View and manage your prescription uploads"
          breadcrumbs={[
            { label: 'Prescriptions' }
          ]}
          actions={
            <Button 
              onClick={handleUploadNewPrescription}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload New Prescription
            </Button>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Total Prescriptions', 
              value: stats.total, 
              icon: FileText, 
              color: 'bg-blue-100 text-blue-600',
              description: 'All your prescriptions'
            },
            { 
              label: 'Approved', 
              value: stats.approved, 
              icon: CheckCircle, 
              color: 'bg-emerald-100 text-emerald-600',
              description: 'Ready for ordering'
            },
            { 
              label: 'Pending Review', 
              value: stats.pending, 
              icon: Clock, 
              color: 'bg-amber-100 text-amber-600',
              description: 'Under pharmacist review'
            },
            { 
              label: 'Rejected', 
              value: stats.rejected, 
              icon: XCircle, 
              color: 'bg-rose-100 text-rose-600',
              description: 'Needs attention'
            },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm font-medium text-slate-900">{stat.label}</p>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow border border-slate-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by medication name..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Status:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => {
                  const config = statusConfig[status] || { label: 'All', badgeColor: 'bg-slate-100 text-slate-700' };
                  return (
                    <Button
                      key={status}
                      variant={filters.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(status)}
                      className={`rounded-lg ${
                        filters.status === status 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {status === 'all' ? 'All' : config.label}
                    </Button>
                  );
                })}
              </div>
              {(filters.status !== 'all' || filters.search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && !loading && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-700">{error}</p>
                <Button
                  variant="link"
                  onClick={fetchPrescriptions}
                  className="p-0 h-auto text-red-600 hover:text-red-800"
                >
                  Try again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Prescriptions List */}
        {loading && prescriptions.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mr-3" />
            <span className="text-slate-600">Loading prescriptions...</span>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No prescriptions yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {filters.status !== 'all' || filters.search
                ? `No ${filters.status !== 'all' ? filters.status : ''} prescriptions${filters.search ? ` matching "${filters.search}"` : ''} found.`
                : "You haven't uploaded any prescriptions yet."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                onClick={handleUploadNewPrescription}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Prescription
              </Button>
              {(filters.status !== 'all' || filters.search) && (
                <Button 
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 rounded-xl"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {prescriptions.map((prescription) => {
                const config = statusConfig[prescription.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                
                return (
                  <div 
                    key={prescription.id}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Prescription Info */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${config.badgeColor}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                              <span className="text-sm text-slate-500">
                                ID: {prescription.id.slice(0, 8)}...
                              </span>
                            </div>
                            
                            <h3 className="font-semibold text-lg text-slate-900 mb-1">
                              {prescription.medications?.name || 'Prescription'}
                            </h3>
                            <p className="text-sm text-slate-500 mb-3">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              Uploaded on {formatDate(prescription.created_at)}
                            </p>
                            
                            {prescription.medications?.description && (
                              <p className="text-sm text-slate-600 mb-4">
                                <Pill className="h-3 w-3 inline mr-1" />
                                {prescription.medications.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status Info */}
                        <div className={`flex items-start gap-3 p-4 rounded-xl ${config.bgColor} mb-4`}>
                          <StatusIcon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                          <div className="flex-1">
                            <p className={`font-medium ${config.textColor}`}>
                              {prescription.status === 'pending' && 'Awaiting Review'}
                              {prescription.status === 'approved' && 'Prescription Approved'}
                              {prescription.status === 'rejected' && 'Prescription Rejected'}
                            </p>
                            <p className={`text-sm mt-1 ${config.textColor}`}>
                              {prescription.notes || 
                                (prescription.status === 'pending' 
                                  ? 'Your prescription is being reviewed by our pharmacists.' 
                                  : prescription.status === 'approved'
                                    ? 'Your prescription has been approved and is ready for ordering.'
                                    : 'Please upload a new prescription.')
                              }
                            </p>
                            {prescription.pharmacist_id && (
                              <div className="flex items-center gap-2 mt-2">
                                <Shield className="h-3 w-3 text-slate-500" />
                                <p className="text-xs text-slate-500">
                                  Reviewed by pharmacist
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          <Button
                            onClick={() => handleViewPrescription(prescription.id)}
                            variant="outline"
                            size="sm"
                            className="border-slate-300 hover:bg-slate-50 rounded-lg"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View File
                          </Button>
                          
                          <Button
                            onClick={() => handleDownloadPrescription(prescription.id)}
                            variant="outline"
                            size="sm"
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>

                          {prescription.status === 'approved' && (
                            <Button
                              onClick={() => handleOrderMedication(prescription)}
                              className="bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                              size="sm"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Order Medication
                            </Button>
                          )}
                          
                          {prescription.status === 'rejected' && (
                            <Button
                              onClick={handleUploadNewPrescription}
                              variant="outline"
                              size="sm"
                              className="border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload New
                            </Button>
                          )}
                          
                          <Button
                            onClick={handleContactPharmacist}
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>

                      {/* File Info Sidebar */}
                      <div className="md:w-64 bg-slate-50 p-6 border-t md:border-t-0 md:border-l border-slate-200">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">File Information</p>
                            <p className="text-sm text-slate-600 truncate" title={prescription.file_name}>
                              📄 {prescription.file_name}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {(prescription.file_size / 1024).toFixed(1)} KB • {prescription.mime_type?.split('/')[1]?.toUpperCase() || 'PDF'}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Last Updated</p>
                            <p className="text-sm text-slate-600">
                              {formatDate(prescription.updated_at || prescription.created_at)}
                            </p>
                          </div>
                          
                          <div className="pt-4">
                            <Button
                              onClick={handleUploadNewPrescription}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                              size="sm"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Upload Another Prescription
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
                <div className="text-sm text-slate-600">
                  Showing <span className="font-semibold">{(filters.page - 1) * filters.limit + 1}</span> to{' '}
                  <span className="font-semibold">
                    {Math.min(filters.page * filters.limit, pagination.totalItems)}
                  </span>{' '}
                  of <span className="font-semibold">{pagination.totalItems}</span> prescriptions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-slate-700">
                    Page {filters.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Need to upload a prescription?</h3>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto">
            Upload your prescription for review by our licensed pharmacists. We'll notify you once it's approved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-emerald-700 hover:bg-slate-100 font-semibold"
              onClick={handleUploadNewPrescription}
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload New Prescription
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={handleContactPharmacist}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Pharmacist
            </Button>
          </div>
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
}

// Badge component for status
const Badge = ({ children, className }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};