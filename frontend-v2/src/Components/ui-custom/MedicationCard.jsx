import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, AlertCircle, ShoppingCart, Eye, Loader2 } from 'lucide-react'; // Add Loader2
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MedicationCard = ({ medication, onAddToCart, isAddingToCart = false }) => { // Add isAddingToCart
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add to cart clicked for:', medication.id, medication.name);
    if (onAddToCart && !isAddingToCart) { // Prevent clicking while loading
      onAddToCart(medication);
    }
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('View details clicked, navigating to:', `/medications/${medication.id}`);
    
    if (!medication.id) {
      console.error('Medication ID is missing!');
      return;
    }
    
    navigate(`/medications/${medication.id}`);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button')) {
      console.log('Button clicked, skipping card navigation');
      return;
    }
    
    console.log('Card clicked, navigating to:', `/medications/${medication.id}`);
    
    if (!medication.id) {
      console.error('Medication ID is missing!');
      return;
    }
    
    navigate(`/medications/${medication.id}`);
  };

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-square relative overflow-hidden bg-slate-50">
        <img 
          src={medication.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'} 
          alt={medication.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {medication.is_prescription_required && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Rx Only
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 text-lg line-clamp-1">{medication.name}</h3>
          <Badge variant="secondary" className="shrink-0">
            {medication.category}
          </Badge>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{medication.description}</p>
        
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-2xl font-bold text-emerald-600">${parseFloat(medication.price || 0).toFixed(2)}</p>
            <p className="text-xs text-slate-500">
              Stock: {medication.stock_quantity || 0}
            </p>
          </div>
          <Pill className="h-10 w-10 text-emerald-100 bg-emerald-500/20 p-2 rounded-lg" />
        </div>
        
        <div className="flex gap-2">
          {!medication.is_prescription_required && (
            <Button 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={handleAddToCart}
              disabled={isAddingToCart} // Disable while loading
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          )}
          <Button 
            variant="outline"
            className={medication.is_prescription_required ? "flex-1" : ""}
            onClick={handleViewDetails}
          >
            {medication.is_prescription_required ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </>
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;