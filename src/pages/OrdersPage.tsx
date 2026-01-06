import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Package, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface Order {
  id: string;
  status: string;
  items: any;
  total: number;
  created_at: string;
  restaurant_id: string;
}

interface Restaurant {
  id: string;
  name: string;
  image: string | null;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Map<string, Restaurant>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);

        // Fetch restaurant details
        const restaurantIds = [...new Set(data.map(o => o.restaurant_id))];
        if (restaurantIds.length > 0) {
          const { data: restaurantData } = await supabase
            .from('restaurants')
            .select('id, name, image')
            .in('id', restaurantIds);

          if (restaurantData) {
            const restaurantMap = new Map<string, Restaurant>();
            restaurantData.forEach(r => restaurantMap.set(r.id, r));
            setRestaurants(restaurantMap);
          }
        }
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'on_the_way':
        return 'bg-blue-100 text-blue-700';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'on_the_way':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 pb-24">
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Sign in to view orders</h2>
        <p className="text-muted-foreground text-center mb-6">
          Your order history will appear here
        </p>
        <Link
          to="/auth"
          className="gradient-warm text-primary-foreground px-8 py-3 rounded-xl font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const pastOrders = orders.filter(o => o.status === 'delivered');

  const getItemCount = (items: any): number => {
    if (Array.isArray(items)) {
      return items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-8 pb-4">
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 pt-16">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground text-center mb-6">
            Start ordering from your favorite campus restaurants
          </p>
          <Link
            to="/"
            className="gradient-warm text-primary-foreground px-8 py-3 rounded-xl font-semibold"
          >
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="px-4 space-y-6">
          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <section>
              <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Active Orders
              </h2>
              <div className="space-y-3">
                {activeOrders.map((order, index) => {
                  const restaurant = restaurants.get(order.restaurant_id);
                  const itemCount = getItemCount(order.items);

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={`/order/${order.id}`}
                        className="block bg-card rounded-2xl p-4 shadow-card"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                            {restaurant?.image ? (
                              <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold truncate">
                                {restaurant?.name || 'Restaurant'}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {itemCount} items • ${order.total.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(order.created_at), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Past Orders */}
          {pastOrders.length > 0 && (
            <section>
              <h2 className="font-bold text-lg mb-3">Past Orders</h2>
              <div className="space-y-3">
                {pastOrders.map((order, index) => {
                  const restaurant = restaurants.get(order.restaurant_id);
                  const itemCount = getItemCount(order.items);

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/order/${order.id}`}
                        className="block bg-card rounded-2xl p-4 shadow-card"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                            {restaurant?.image ? (
                              <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {restaurant?.name || 'Restaurant'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {itemCount} items • ${order.total.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(order.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
