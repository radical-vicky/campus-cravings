import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Clock, MapPin, Heart, Share2, Plus, Minus, X } from 'lucide-react';
import { restaurants, menuItems } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { MenuItem, SelectedCustomization, CustomizationOption } from '@/types';
import { Button } from '@/components/ui/button';

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const restaurant = restaurants.find((r) => r.id === id);
  const items = menuItems[id || ''] || [];
  const { addItem } = useCart();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, CustomizationOption[]>>({});

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Restaurant not found</p>
      </div>
    );
  }

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const customizations: SelectedCustomization[] = Object.entries(selectedCustomizations).map(
      ([customizationId, options]) => {
        const customization = selectedItem.customizations?.find((c) => c.id === customizationId);
        return {
          customizationId,
          customizationName: customization?.name || '',
          selectedOptions: options,
        };
      }
    );

    addItem(selectedItem, quantity, customizations, undefined, restaurant.id, restaurant.name);
    setSelectedItem(null);
    setQuantity(1);
    setSelectedCustomizations({});
  };

  const toggleOption = (customizationId: string, option: CustomizationOption, maxSelections: number) => {
    setSelectedCustomizations((prev) => {
      const current = prev[customizationId] || [];
      const exists = current.some((o) => o.id === option.id);

      if (exists) {
        return {
          ...prev,
          [customizationId]: current.filter((o) => o.id !== option.id),
        };
      }

      if (maxSelections === 1) {
        return {
          ...prev,
          [customizationId]: [option],
        };
      }

      if (current.length >= maxSelections) {
        return prev;
      }

      return {
        ...prev,
        [customizationId]: [...current, option],
      };
    });
  };

  const calculateItemTotal = () => {
    if (!selectedItem) return 0;
    let total = selectedItem.price;
    Object.values(selectedCustomizations).forEach((options) => {
      options.forEach((opt) => {
        total += opt.price;
      });
    });
    return total * quantity;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-56">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link
            to="/"
            className="w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center shadow-soft"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center shadow-soft">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center shadow-soft">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="px-4 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {restaurant.cuisine.join(' • ')}
              </p>
            </div>
            {restaurant.promo && (
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {restaurant.promo}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{restaurant.rating}</span>
              <span className="text-muted-foreground">({restaurant.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.distance}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              {restaurant.deliveryFee === 0 ? (
                <span className="text-accent font-medium">Free delivery</span>
              ) : (
                `$${restaurant.deliveryFee.toFixed(2)} delivery`
              )}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              Min. order ${restaurant.minOrder}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Menu */}
      <div className="mt-6 px-4">
        {Object.entries(groupedItems).map(([category, categoryItems], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-8"
          >
            <h2 className="font-bold text-lg mb-4">{category}</h2>
            <div className="space-y-3">
              {categoryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setQuantity(1);
                    setSelectedCustomizations({});
                  }}
                  className="w-full flex gap-4 p-3 bg-card rounded-xl shadow-card hover:shadow-soft transition-shadow text-left"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.isPopular && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                      {item.calories && (
                        <span className="text-xs text-muted-foreground">{item.calories} cal</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-card rounded-t-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 overflow-y-auto max-h-[calc(85vh-12rem)]">
                <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
                <p className="text-muted-foreground mt-2">{selectedItem.description}</p>
                
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xl font-bold text-primary">
                    ${selectedItem.price.toFixed(2)}
                  </span>
                  {selectedItem.calories && (
                    <span className="text-sm text-muted-foreground">
                      {selectedItem.calories} cal
                    </span>
                  )}
                  {selectedItem.isVegetarian && (
                    <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      Vegetarian
                    </span>
                  )}
                </div>

                {/* Customizations */}
                {selectedItem.customizations?.map((customization) => (
                  <div key={customization.id} className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{customization.name}</h3>
                      {customization.required && (
                        <span className="text-xs text-primary font-medium">Required</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {customization.options.map((option) => {
                        const isSelected = selectedCustomizations[customization.id]?.some(
                          (o) => o.id === option.id
                        );
                        return (
                          <button
                            key={option.id}
                            onClick={() =>
                              toggleOption(customization.id, option, customization.maxSelections)
                            }
                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <span>{option.name}</span>
                            <span className="font-medium">
                              {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Free'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Quantity */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-semibold">Quantity</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="p-5 border-t border-border bg-card">
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-14 text-lg font-semibold rounded-xl gradient-warm border-0"
                >
                  Add to Cart — ${calculateItemTotal().toFixed(2)}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
