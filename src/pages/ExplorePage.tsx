import { Search } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { restaurants, categories } from '@/data/mockData';
import { RestaurantCard } from '@/components/home/RestaurantCard';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = ['Open Now', 'Free Delivery', 'Top Rated', 'Fast Delivery'];

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const filteredRestaurants = restaurants.filter((r) => {
    // Search filter
    if (
      searchQuery &&
      !r.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !r.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }

    // Other filters
    if (selectedFilters.includes('Open Now') && !r.isOpen) return false;
    if (selectedFilters.includes('Free Delivery') && r.deliveryFee > 0) return false;
    if (selectedFilters.includes('Top Rated') && r.rating < 4.7) return false;
    if (selectedFilters.includes('Fast Delivery') && parseInt(r.deliveryTime.split('-')[0]) > 20)
      return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, cuisines..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {filters.map((filter) => {
            const isSelected = selectedFilters.includes(filter);
            return (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </header>

      {/* Results */}
      <div className="px-4">
        <p className="text-sm text-muted-foreground mb-4">
          {filteredRestaurants.length} restaurants found
        </p>

        <div className="space-y-4">
          {filteredRestaurants.map((restaurant, index) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground">No restaurants match your search</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
