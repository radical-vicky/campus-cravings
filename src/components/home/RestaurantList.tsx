import { restaurants, categories } from '@/data/mockData';
import { RestaurantCard } from './RestaurantCard';

interface RestaurantListProps {
  selectedCategory: string;
}

export function RestaurantList({ selectedCategory }: RestaurantListProps) {
  const filteredRestaurants = selectedCategory === '1'
    ? restaurants
    : restaurants.filter((r) => {
        const category = categories.find((c) => c.id === selectedCategory);
        if (!category) return true;
        return r.cuisine.some((c) => 
          c.toLowerCase().includes(category.name.toLowerCase())
        );
      });

  return (
    <div className="mt-6 px-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          {selectedCategory === '1' ? 'All Restaurants' : 'Filtered Results'}
        </h2>
        <span className="text-sm text-muted-foreground">
          {filteredRestaurants.length} places
        </span>
      </div>

      <div className="space-y-4">
        {filteredRestaurants.map((restaurant, index) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="text-muted-foreground">No restaurants found in this category</p>
        </div>
      )}
    </div>
  );
}
