import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
}

export function RestaurantCard({ restaurant, index }: RestaurantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/restaurant/${restaurant.id}`}
        className="block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow group"
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Promo badge */}
          {restaurant.promo && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {restaurant.promo}
            </div>
          )}
          
          {/* Open/Closed indicator */}
          <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${
            restaurant.isOpen ? 'bg-accent animate-pulse-soft' : 'bg-destructive'
          }`} />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg leading-tight">{restaurant.name}</h3>
            <div className="flex items-center gap-1 bg-secondary rounded-full px-2 py-0.5">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold">{restaurant.rating}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-3">
            {restaurant.cuisine.slice(0, 3).join(' • ')}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.distance}</span>
            </div>
            <span className={restaurant.deliveryFee === 0 ? 'text-accent font-medium' : ''}>
              {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
