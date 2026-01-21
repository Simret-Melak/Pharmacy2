import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import MedicationCard from '@/components/ui-custom/MedicationCard'; 
import { 
  Search, 
  ArrowRight, 
  Truck, 
  Shield, 
  Clock, 
  HeartPulse,
  Pill,
  Syringe,
  Stethoscope,
  Baby,
  Eye,
  Loader2,
  ShoppingCart
} from 'lucide-react';
import { api } from '@/utils/api';

const categories = [
  { name: 'Pain Relief', icon: HeartPulse, color: 'bg-rose-100 text-rose-600' },
  { name: 'Vitamins', icon: Pill, color: 'bg-amber-100 text-amber-600' },
  { name: 'Antibiotics', icon: Syringe, color: 'bg-blue-100 text-blue-600' },
  { name: 'Heart Health', icon: Stethoscope, color: 'bg-purple-100 text-purple-600' },
  { name: 'Baby Care', icon: Baby, color: 'bg-pink-100 text-pink-600' },
  { name: 'Eye Care', icon: Eye, color: 'bg-cyan-100 text-cyan-600' },
];

export default function CustomerHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredMedications, setFeaturedMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState({});

  // Fetch featured medications on component mount
  useEffect(() => {
    fetchFeaturedMedications();
  }, []);

  const fetchFeaturedMedications = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch medications from backend with a limit of 4 for featured section
      const response = await api.get('/medications?page=1&limit=4');
      
      if (response.success && response.medications) {
        setFeaturedMedications(response.medications);
      } else {
        setError('Failed to load medications');
      }
    } catch (err) {
      console.error('Error fetching medications:', err);
      
      // If it's a 401 error (unauthorized), it might be because user is not logged in
      if (err.message.includes('401')) {
        setError('Please login to view medications');
      } else {
        setError(err.message || 'Failed to load medications. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      // If search query is empty, just redirect to all medications
      window.location.href = createPageUrl('CustomerMedications');
      return;
    }

    try {
      // Search medications by name
      const searchResponse = await api.get(`/medications/search?name=${encodeURIComponent(searchQuery)}&limit=10`);
      
      if (searchResponse.success) {
        // Redirect to medications page with search query
        window.location.href = createPageUrl(`CustomerMedications?search=${encodeURIComponent(searchQuery)}`);
      }
    } catch (err) {
      console.error('Search error:', err);
      // Still redirect to medications page even if search fails
      window.location.href = createPageUrl(`CustomerMedications?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (categoryName) => {
    window.location.href = createPageUrl(`CustomerMedications?category=${encodeURIComponent(categoryName)}`);
  };

  const handlePopularTermClick = (term) => {
    setSearchQuery(term);
  };

  const handleAddToCart = async (medication) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page
      window.location.href = createPageUrl('CustomerLogin');
      return;
    }

    // Check if prescription is required
    if (medication.is_prescription_required) {
      // Redirect to prescription upload page for this medication
      window.location.href = createPageUrl(`CustomerPrescriptionUpload/${medication.id}`);
      return;
    }

    setAddingToCart(prev => ({ ...prev, [medication.id]: true }));

    try {
      // TODO: Implement actual add to cart API call
      // For now, we'll simulate adding to cart
      console.log('Adding to cart:', medication);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success message
      alert(`Added ${medication.name} to cart!`);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [medication.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-2 text-sm font-medium">
              🎉 Free delivery on orders over $50
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Health,<br />
              <span className="text-emerald-200">Delivered to Your Door</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-xl mx-auto">
              Access thousands of medications, upload prescriptions easily, and enjoy fast, reliable delivery.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-2 flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for medications, vitamins, health products..."
                    className="h-14 pl-12 border-0 text-base focus:ring-0"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  Search
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-emerald-100">
              <span>Popular:</span>
              {['Vitamins', 'Pain Relief', 'Antibiotics', 'Diabetes'].map((term) => (
                <Badge 
                  key={term} 
                  variant="outline" 
                  className="border-emerald-300/50 text-emerald-100 hover:bg-white/10 cursor-pointer"
                  onClick={() => handlePopularTermClick(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: 'Free Delivery', desc: 'On orders $50+' },
              { icon: Shield, label: 'Verified Medications', desc: '100% authentic' },
              { icon: Clock, label: '24/7 Support', desc: 'Always here for you' },
              { icon: HeartPulse, label: 'Expert Care', desc: 'Licensed pharmacists' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <feature.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{feature.label}</p>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Shop by Category</h2>
              <p className="text-slate-500 mt-1">Find what you need quickly</p>
            </div>
            <Link to={createPageUrl('CustomerMedications')}>
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all text-center cursor-pointer"
              >
                <div className={`h-16 w-16 rounded-2xl ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-slate-900">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Medications with MedicationCard */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Medications</h2>
              <p className="text-slate-500 mt-1">Most popular products this week</p>
            </div>
            <Link to={createPageUrl('CustomerMedications')}>
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-3 text-slate-600">Loading medications...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-2">{error}</div>
              <Button 
                variant="outline" 
                onClick={fetchFeaturedMedications}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : featuredMedications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMedications.map((medication) => (
                <MedicationCard 
                  key={medication.id}
                  medication={medication}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">No medications available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Have a Prescription?
                </h3>
                <p className="text-slate-400 max-w-lg">
                  Upload your prescription and our licensed pharmacists will review it. 
                  Get your medications delivered safely to your doorstep.
                </p>
              </div>
              <Link to={createPageUrl('CustomerPrescriptions')}>
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl whitespace-nowrap">
                  Upload Prescription
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CustomerFooter />
    </div>
  );
}