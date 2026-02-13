import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { api, medicationAPI } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import MedicationCard from '@/components/ui-custom/MedicationCard';
import PageHeader from '@/components/ui-custom/PageHeader';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  FileText, 
  Truck, 
  Shield, 
  CheckCircle,
  Minus,
  Plus,
  ArrowRight,
  Star,
  Loader2,
  AlertCircle,
  Pill,
  Clock,
  Thermometer,
  Droplets,
  AlertTriangle,
  Upload
} from 'lucide-react';

export default function CustomerMedicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedMedications, setRelatedMedications] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);

  console.log('🔍 MedicationDetails Component Mounted');
  console.log('📍 Medication ID from URL:', id);

  useEffect(() => {
    if (id) {
      console.log('📡 Fetching medication details for ID:', id);
      fetchMedicationDetails();
      fetchRelatedMedications();
    } else {
      console.error('❌ No medication ID found in URL');
    }
  }, [id]);

  const fetchMedicationDetails = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📡 API Call: Fetching medication by ID:', id);
      
      const response = await medicationAPI.getMedicationById(id);
      console.log('📡 API Response:', response);
      
      if (response.success && response.medication) {
        console.log('✅ Medication found:', response.medication.name);
        
        // Map all backend data to frontend structure
        const medData = response.medication;
        setMedication({
          // Core fields
          id: medData.id,
          name: medData.name,
          description: medData.description || '',
          price: parseFloat(medData.price) || 0,
          
          // Stock & inventory
          stock_quantity: medData.stock_quantity || 0,
          online_stock: medData.online_stock || 0,
          in_person_stock: medData.in_person_stock || 0,
          low_stock_threshold: medData.low_stock_threshold || 10,
          stock_type: medData.stock_type || 'Online Only',
          
          // Classification
          category: medData.category || '',
          dosage: medData.dosage || '',
          drug_class: medData.drug_class || '',
          route_of_administration: medData.route_of_administration || '',
          generic_name: medData.generic_name || '',
          brand_name: medData.brand_name || '',
          is_prescription_required: medData.is_prescription_required || false,
          
          // Manufacturer & SKU
          manufacturer: medData.manufacturer || 'Unknown Manufacturer',
          sku: medData.sku || `MED-${medData.id?.substring(0, 8).toUpperCase() || 'N/A'}`,
          
          // Images
          image_url: medData.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
          image_key: medData.image_key || '',
          image_size: medData.image_size || 0,
          image_mime_type: medData.image_mime_type || '',
          
          // Medical information
          active_ingredients: medData.active_ingredients || 'See product description for active ingredients',
          storage_instructions: medData.storage_instructions || 'Store at room temperature away from moisture and heat. Keep out of reach of children.',
          usage_dosage: medData.usage_dosage || 'Take as directed by your physician. Follow the dosage instructions provided by your healthcare provider.',
          warnings: medData.warnings || (medData.is_prescription_required 
            ? 'This medication requires a prescription. Do not use without consulting a healthcare professional.'
            : 'Consult your doctor before use if you have any medical conditions or are taking other medications.'),
          side_effects: medData.side_effects || 'May cause side effects. Consult your doctor if you experience any adverse reactions.',
          contraindications: medData.contraindications || 'Do not use if allergic to any ingredients. Consult your doctor for contraindications.',
          interactions: medData.interactions || 'May interact with other medications. Inform your doctor of all medicines you are taking.',
          pregnancy_category: medData.pregnancy_category || '',
          
          // Usage instructions
          frequency: medData.frequency || '',
          duration: medData.duration || '',
          administration_instructions: medData.administration_instructions || '',
          special_instructions: medData.special_instructions || '',
          
          // Metadata
          created_at: medData.created_at,
          updated_at: medData.updated_at,
          pharmacy_id: medData.pharmacy_id,
          created_by: medData.created_by,
          
          // Calculated/derived fields
          quantity: medData.dosage ? `${medData.dosage} per unit` : 'Dosage not specified',
          display_quantity: `${medData.dosage || '30'} units per package`,
        });
      } else {
        console.log('❌ Medication not found in response');
        setError('Medication not found');
      }
    } catch (err) {
      console.error('❌ Error fetching medication details:', err);
      
      if (err.message.includes('401')) {
        setError('Please login to view medication details');
      } else if (err.message.includes('404')) {
        setError('Medication not found');
      } else {
        setError(err.message || 'Failed to load medication details');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedMedications = async () => {
    try {
      // Fetch medications from same category
      if (medication?.category) {
        const response = await medicationAPI.getMedications({
          category: medication.category,
          limit: 3,
          exclude: id
        });
        
        if (response.success && response.medications) {
          setRelatedMedications(response.medications.map(med => ({
            id: med.id,
            name: med.name,
            description: med.description,
            price: parseFloat(med.price) || 0,
            stock_quantity: med.stock_quantity || 0,
            category: med.category || '',
            is_prescription_required: med.is_prescription_required || false,
            image_url: med.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
            drug_class: med.drug_class || '',
            route_of_administration: med.route_of_administration || '',
          })));
        }
      }
    } catch (err) {
      console.error('Error fetching related medications:', err);
    }
  };

  // ✅ FIXED: Handle add to cart with proper prescription flow
  const handleAddToCart = async () => {
    console.log('🛒 Add to cart clicked');
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('🔐 User not logged in, redirecting to login');
      navigate(createPageUrl('CustomerLogin'));
      return;
    }

    // ✅ FIXED: Navigate to the correct prescription upload route
    if (medication.is_prescription_required) {
      console.log('📄 Prescription required, navigating to upload page for medication:', medication.id);
      
      // ✅ OPTION 1: Direct path to match your backend route
      navigate(`/prescriptions/upload/${medication.id}`);
      
      // ✅ OPTION 2: If using createPageUrl, uncomment this and comment the line above
      // navigate(`/prescriptions/upload/${medication.id}`);
      
      // ✅ OPTION 3: Or if you have a specific route pattern in createPageUrl
      // navigate(createPageUrl(`PrescriptionUpload/${medication.id}`));
      
      return;
    }

    if (medication.online_stock < quantity) {
      alert(`Only ${medication.online_stock} items available in stock`);
      return;
    }

    setAddingToCart(true);

    try {
      console.log('Adding to cart:', { medicationId: medication.id, quantity });
      // TODO: Implement actual add to cart API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Added ${quantity} ${medication.name} to cart!`);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate(createPageUrl('CustomerLogin'));
      return;
    }

    setAddingToFavorites(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      alert('Added to favorites!');
      
    } catch (err) {
      console.error('Error adding to favorites:', err);
      alert('Failed to add to favorites');
    } finally {
      setAddingToFavorites(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: medication?.name,
        text: `Check out ${medication?.name} on our pharmacy`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getStockStatus = () => {
    if (!medication) return { text: 'Loading...', color: 'text-slate-500' };
    
    const stock = medication.online_stock || medication.stock_quantity || 0;
    
    if (stock <= 0) {
      return { text: 'Out of Stock', color: 'text-red-600' };
    } else if (stock <= medication.low_stock_threshold) {
      return { text: `Low Stock (${stock} available)`, color: 'text-amber-600' };
    } else {
      return { text: `In Stock (${stock} available)`, color: 'text-emerald-600' };
    }
  };

  const getPregnancyCategoryIcon = () => {
    if (!medication.pregnancy_category) return null;
    
    const categories = {
      'A': { icon: '✓', color: 'bg-emerald-100 text-emerald-700', label: 'Category A' },
      'B': { icon: '✓', color: 'bg-emerald-100 text-emerald-700', label: 'Category B' },
      'C': { icon: '⚠', color: 'bg-amber-100 text-amber-700', label: 'Category C' },
      'D': { icon: '⚠', color: 'bg-red-100 text-red-700', label: 'Category D' },
      'X': { icon: '✗', color: 'bg-red-100 text-red-700', label: 'Category X' },
    };
    
    return categories[medication.pregnancy_category.toUpperCase()] || null;
  };

  const images = medication?.image_url ? [
    medication.image_url,
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
    'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800',
  ] : [];

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

  if (error || !medication) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CustomerHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Medication</h3>
            <p className="text-slate-500 mb-4">{error || 'Medication not found'}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchMedicationDetails} variant="outline">
                Try Again
              </Button>
              <Link to={createPageUrl('CustomerMedications')}>
                <Button variant="default" className="bg-emerald-600">
                  Browse Medications
                </Button>
              </Link>
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
        <PageHeader
          title={medication.name}
          breadcrumbs={[
            { label: 'Medications', href: 'CustomerMedications' },
            { label: medication.name }
          ]}
        />

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden">
                <img
                  src={images[activeImage]}
                  alt={medication.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                        activeImage === idx ? 'border-emerald-500' : 'border-slate-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="bg-blue-100 text-blue-700">{medication.category}</Badge>
                  {medication.drug_class && (
                    <Badge variant="outline" className="border-slate-200">
                      <Pill className="h-3 w-3 mr-1" />
                      {medication.drug_class}
                    </Badge>
                  )}
                  {medication.is_prescription_required && (
                    <Badge className="bg-amber-100 text-amber-700">
                      <FileText className="h-3 w-3 mr-1" />
                      Prescription Required
                    </Badge>
                  )}
                  {getPregnancyCategoryIcon() && (
                    <Badge className={getPregnancyCategoryIcon().color}>
                      {getPregnancyCategoryIcon().icon} {getPregnancyCategoryIcon().label}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{medication.name}</h1>
                {medication.generic_name && (
                  <p className="text-slate-600 text-sm">Generic: {medication.generic_name}</p>
                )}
                {medication.brand_name && (
                  <p className="text-slate-600 text-sm">Brand: {medication.brand_name}</p>
                )}
                <p className="text-slate-500">Manufacturer: {medication.manufacturer}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={`h-5 w-5 ${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <span className="text-slate-500">(128 reviews)</span>
              </div>

              <div className="text-4xl font-bold text-emerald-600">
                ${medication.price.toFixed(2)}
                <span className="text-lg font-normal text-slate-500 ml-2">per package</span>
              </div>

              <p className="text-slate-600 leading-relaxed">{medication.description}</p>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Dosage</p>
                  <p className="font-semibold text-slate-900">{medication.dosage || 'Not specified'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Administration</p>
                  <p className="font-semibold text-slate-900">{medication.route_of_administration || 'Oral'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Stock Type</p>
                  <p className="font-semibold text-slate-900">{medication.stock_type}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">SKU</p>
                  <p className="font-semibold text-slate-900 font-mono">{medication.sku}</p>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className={`${getStockStatus().color} font-medium`}>
                  {getStockStatus().text}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-slate-700 font-medium">Quantity:</span>
                <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={addingToCart || medication.online_stock <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-lg"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={addingToCart || medication.online_stock <= 0 || quantity >= medication.online_stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions - ✅ FIXED: Prescription upload navigation */}
              <div className="flex gap-3">
                {medication.is_prescription_required ? (
                  <Link to={`/prescriptions/upload/${medication.id}`} className="flex-1">
                    <Button 
                      size="lg" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-14"
                      disabled={medication.online_stock <= 0}
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Prescription
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    size="lg" 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-14"
                    onClick={handleAddToCart}
                    disabled={addingToCart || medication.online_stock <= 0}
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-xl h-14"
                  onClick={handleAddToFavorites}
                  disabled={addingToFavorites}
                >
                  {addingToFavorites ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Heart className="h-5 w-5" />
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-xl h-14"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Free Delivery</p>
                    <p className="text-xs text-slate-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">100% Authentic</p>
                    <p className="text-xs text-slate-500">Verified medications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="border-t border-slate-100 p-8">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="details" className="rounded-lg">Product Details</TabsTrigger>
                <TabsTrigger value="usage" className="rounded-lg">Usage & Dosage</TabsTrigger>
                <TabsTrigger value="warnings" className="rounded-lg">Warnings & Safety</TabsTrigger>
                <TabsTrigger value="ingredients" className="rounded-lg">Ingredients</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
              </TabsList>
              
              {/* Product Details Tab */}
              <TabsContent value="details" className="mt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Product Information</h3>
                    <dl className="space-y-3">
                      {[
                        ['SKU', medication.sku],
                        ['Manufacturer', medication.manufacturer],
                        ['Category', medication.category],
                        ['Drug Class', medication.drug_class || 'Not specified'],
                        ['Dosage', medication.dosage || 'Not specified'],
                        ['Route of Administration', medication.route_of_administration || 'Oral'],
                        ['Stock Type', medication.stock_type],
                        ['Created', new Date(medication.created_at).toLocaleDateString()],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between py-2 border-b border-slate-100">
                          <dt className="text-slate-500">{label}</dt>
                          <dd className="font-medium text-slate-900">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Storage Instructions</h3>
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Thermometer className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Storage</span>
                      </div>
                      <p className="text-slate-600">{medication.storage_instructions}</p>
                    </div>
                    
                    {medication.frequency && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="h-5 w-5 text-emerald-600" />
                          <span className="font-medium">Frequency</span>
                        </div>
                        <p className="text-slate-600">{medication.frequency}</p>
                        {medication.duration && (
                          <p className="text-slate-600 mt-1">Duration: {medication.duration}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              {/* Usage & Dosage Tab */}
              <TabsContent value="usage" className="mt-6">
                <div className="bg-emerald-50 rounded-xl p-6 mb-4">
                  <h3 className="font-semibold text-emerald-900 mb-2">Recommended Dosage</h3>
                  <p className="text-emerald-800">{medication.usage_dosage}</p>
                </div>
                
                {medication.administration_instructions && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Administration Instructions</h4>
                    <p className="text-slate-600">{medication.administration_instructions}</p>
                  </div>
                )}
                
                {medication.special_instructions && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Special Instructions</h4>
                    <p className="text-blue-800">{medication.special_instructions}</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Warnings & Safety Tab */}
              <TabsContent value="warnings" className="mt-6 space-y-4">
                <div className="bg-red-50 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-900">Important Warnings</h3>
                  </div>
                  <p className="text-red-800">{medication.warnings}</p>
                </div>
                
                {medication.side_effects && (
                  <div className="bg-amber-50 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-900 mb-2">Side Effects</h4>
                    <p className="text-amber-800">{medication.side_effects}</p>
                  </div>
                )}
                
                {medication.contraindications && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Contraindications</h4>
                    <p className="text-purple-800">{medication.contraindications}</p>
                  </div>
                )}
                
                {medication.interactions && (
                  <div className="bg-rose-50 rounded-xl p-4">
                    <h4 className="font-semibold text-rose-900 mb-2">Drug Interactions</h4>
                    <p className="text-rose-800">{medication.interactions}</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Ingredients Tab */}
              <TabsContent value="ingredients" className="mt-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Active Ingredients</h3>
                  <p className="text-slate-600">{medication.active_ingredients}</p>
                </div>
                
                {medication.pregnancy_category && (
                  <div className="mt-4 bg-emerald-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-emerald-900 mb-1">Pregnancy Category</h4>
                        <p className="text-emerald-800">
                          Category {medication.pregnancy_category.toUpperCase()}
                          {medication.pregnancy_category === 'A' && ' - Adequate and well-controlled studies have failed to demonstrate a risk to the fetus'}
                          {medication.pregnancy_category === 'B' && ' - Animal reproduction studies have failed to demonstrate a risk to the fetus'}
                          {medication.pregnancy_category === 'C' && ' - Animal reproduction studies have shown an adverse effect on the fetus'}
                          {medication.pregnancy_category === 'D' && ' - Positive evidence of human fetal risk'}
                          {medication.pregnancy_category === 'X' && ' - Contraindicated in pregnancy'}
                        </p>
                      </div>
                      <div className={`h-12 w-12 rounded-full ${getPregnancyCategoryIcon()?.color} flex items-center justify-center text-xl font-bold`}>
                        {getPregnancyCategoryIcon()?.icon}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <p className="text-slate-500">Reviews coming soon...</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        {relatedMedications.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Related Medications</h2>
              <Link to={createPageUrl('CustomerMedications')}>
                <Button variant="ghost" className="text-emerald-600">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedMedications.map((med) => (
                <div key={med.id} className="bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all overflow-hidden">
                  <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <img 
                      src={med.image_url} 
                      alt={med.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {med.is_prescription_required && (
                      <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600 text-white text-xs">
                        Prescription
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="font-semibold text-slate-900 line-clamp-1">{med.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {med.drug_class && (
                          <Badge variant="secondary" className="text-xs">
                            {med.drug_class}
                          </Badge>
                        )}
                        {med.route_of_administration && (
                          <Badge variant="outline" className="text-xs">
                            {med.route_of_administration}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-bold text-slate-900">${med.price.toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        {med.category}
                      </Badge>
                    </div>
                    
                    <Button 
                      onClick={() => navigate(`/medications/${med.id}`)}
                      variant="outline" 
                      className="w-full border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <CustomerFooter />
    </div>
  );
}