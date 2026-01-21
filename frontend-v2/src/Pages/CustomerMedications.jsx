import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { api, medicationAPI } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import MedicationCard from '@/components/ui-custom/MedicationCard'; 
import PageHeader from '@/components/ui-custom/PageHeader';
import SearchInput from '@/components/ui-custom/SearchInput';
import { useCart } from '@/context/CartContext'; // ADD THIS
import { Search, SlidersHorizontal, Grid, List, X, Loader2 } from 'lucide-react';

const categories = ['All', 'Pain Relief', 'Antibiotics', 'Vitamins', 'Allergy', 'Diabetes', 'Heart Health', 'Digestive'];

export default function CustomerMedications() {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // USE CART CONTEXT
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [addingToCart, setAddingToCart] = useState({});

  // Get URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryFromUrl = urlParams.get('category');
      const searchFromUrl = urlParams.get('search');
      const pageFromUrl = urlParams.get('page');
      
      if (categoryFromUrl) {
        setSelectedCategory(categoryFromUrl);
      }
      if (searchFromUrl) {
        setSearchQuery(searchFromUrl);
      }
      if (pageFromUrl) {
        setCurrentPage(parseInt(pageFromUrl) || 1);
      }
    }
  }, []);

  // Fetch medications from API
  useEffect(() => {
    fetchMedications();
  }, [currentPage, searchQuery]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    if (medications.length > 0) {
      applyFilters();
    }
  }, [medications, selectedCategory, priceRange, prescriptionOnly, sortBy]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: 12
      };

      if (searchQuery.trim()) {
        try {
          const searchResponse = await medicationAPI.searchMedications(searchQuery, 50);
          if (searchResponse.success && searchResponse.medications) {
            setMedications(searchResponse.medications);
            setTotalCount(searchResponse.total || searchResponse.medications.length);
            setTotalPages(Math.ceil((searchResponse.total || searchResponse.medications.length) / 12));
            return;
          }
        } catch (searchError) {
          console.log('Search endpoint failed, using regular endpoint');
        }
        
        params.search = searchQuery;
      }

      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const response = await medicationAPI.getMedications(params);
      
      if (response.success && response.medications) {
        setMedications(response.medications);
        setTotalCount(response.total || response.medications.length);
        setTotalPages(response.totalPages || Math.ceil((response.total || response.medications.length) / 12));
      } else {
        setError('Failed to load medications');
        setMedications([]);
      }
    } catch (err) {
      console.error('Error fetching medications:', err);
      
      if (err.message.includes('401')) {
        setError('Please login to view medications');
      } else if (err.message.includes('Network')) {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.message || 'Failed to load medications. Please try again.');
      }
      
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...medications];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(med => med.category === selectedCategory);
    }

    filtered = filtered.filter(med => {
      const price = parseFloat(med.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (prescriptionOnly) {
      filtered = filtered.filter(med => med.is_prescription_required);
    }

    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      return 0;
    });

    setFilteredMedications(filtered);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMedications();
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setPriceRange([0, 100]);
    setPrescriptionOnly(false);
    setSearchQuery('');
    setCurrentPage(1);
    
    const url = createPageUrl('CustomerMedications');
    window.history.pushState({}, '', url);
  };

  // UPDATED: Simplified add to cart using context
  const handleAddToCart = async (medication) => {
    // Check if prescription is required
    if (medication.is_prescription_required) {
      alert('This medication requires a prescription. Please contact a pharmacist.');
      navigate('/prescriptions');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [medication.id]: true }));

    try {
      // Add to cart using context (saves to localStorage)
      addToCart(medication);
      
      // Show success message
      alert(`Added ${medication.name} to cart!`);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [medication.id]: false }));
    }
  };

  // ... Rest of your component (FilterSidebar, JSX) remains the same ...

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerHeader />
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="All Medications"
          description="Browse our complete catalog of medications and health products"
          breadcrumbs={[
            { label: 'Medications' }
          ]}
        />

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search medications..."
              className="flex-1"
            />
            
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'grid' ? 'bg-white shadow-sm' : ''}
                  onClick={() => setViewMode('grid')}
                  type="button"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'list' ? 'bg-white shadow-sm' : ''}
                  onClick={() => setViewMode('list')}
                  type="button"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button type="submit" className="md:hidden rounded-xl">
                <Search className="h-4 w-4" />
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden rounded-xl" type="button">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </form>

          {/* Active Filters */}
          {(selectedCategory !== 'All' || prescriptionOnly || priceRange[0] > 0 || priceRange[1] < 100 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">Active filters:</span>
              {selectedCategory !== 'All' && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  {selectedCategory}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory('All')} />
                </Badge>
              )}
              {prescriptionOnly && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  Prescription Only
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setPrescriptionOnly(false)} />
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 100) && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  ${priceRange[0]} - ${priceRange[1]}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setPriceRange([0, 100])} />
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Search: {searchQuery}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSearchQuery('')} />
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                {loading ? (
                  'Loading medications...'
                ) : (
                  <>
                    Showing <span className="font-medium text-slate-700">{filteredMedications.length}</span> of{' '}
                    <span className="font-medium text-slate-700">{totalCount}</span> medications
                  </>
                )}
              </p>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
                <p className="text-slate-600">Loading medications...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Error loading medications</h3>
                <p className="text-slate-500 mb-4">{error}</p>
                <Button onClick={fetchMedications} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : filteredMedications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No medications found</h3>
                <p className="text-slate-500 mb-4">Try adjusting your filters or search term</p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredMedications.map((med) => (
                    <MedicationCard 
                      key={med.id}
                      medication={med}
                      onAddToCart={() => handleAddToCart(med)} // Pass the function
                      isAddingToCart={addingToCart[med.id] || false}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          className={currentPage === pageNum ? "bg-emerald-600" : ""}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button 
                      variant="outline" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <CustomerFooter />
    </div>
  );

  // FilterSidebar function remains exactly the same as before
  function FilterSidebar() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-100 text-emerald-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Price Range</h3>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100}
            step={1}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Availability</h3>
          <div className="flex items-center gap-2">
            <Checkbox
              id="prescription"
              checked={prescriptionOnly}
              onCheckedChange={setPrescriptionOnly}
            />
            <Label htmlFor="prescription" className="text-sm text-slate-600 cursor-pointer">
              Prescription required only
            </Label>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    );
  }
}