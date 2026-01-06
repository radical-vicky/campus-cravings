import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  ChefHat, 
  Bike, 
  CheckCircle2,
  MapPin,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const orderSteps = [
  { id: 'confirmed', label: 'Order Confirmed', icon: Package },
  { id: 'preparing', label: 'Preparing', icon: ChefHat },
  { id: 'on_the_way', label: 'On the Way', icon: Bike },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

interface Order {
  id: string;
  status: string;
  items: any;
  total: number;
  delivery_address: string | null;
  estimated_delivery: string | null;
  created_at: string;
  restaurant_id: string;
  driver_name: string | null;
  driver_phone: string | null;
}

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [restaurant, setRestaurant] = useState<{ name: string; image: string | null } | null>(null);

  useEffect(() => {
    if (!id || !user) return;

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setOrder(data);
        // Set current step based on status
        const stepIndex = orderSteps.findIndex(s => s.id === data.status);
        setCurrentStep(stepIndex >= 0 ? stepIndex + 1 : 1);

        // Fetch restaurant
        const { data: restaurantData } = await supabase
          .from('restaurants')
          .select('name, image')
          .eq('id', data.restaurant_id)
          .maybeSingle();
        
        if (restaurantData) {
          setRestaurant(restaurantData);
        }
      }
    };

    fetchOrder();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          setOrder(updatedOrder);
          const stepIndex = orderSteps.findIndex(s => s.id === updatedOrder.status);
          setCurrentStep(stepIndex >= 0 ? stepIndex + 1 : 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  // Simulate order progress for demo
  useEffect(() => {
    if (!order || order.status === 'delivered') return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 4) {
          // Update order status in database
          const newStatus = orderSteps[prev]?.id;
          if (newStatus && order) {
            supabase
              .from('orders')
              .update({ status: newStatus })
              .eq('id', order.id)
              .then();
          }
          return prev + 1;
        }
        return prev;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const orderItems = Array.isArray(order.items) ? order.items : [];
  const itemCount = orderItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-4 border-b border-border">
        <Link
          to="/orders"
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-muted-foreground">
            Estimated arrival: {order.estimated_delivery || '25-35 min'}
          </p>
        </div>
      </header>

      {/* Map placeholder */}
      <div className="h-64 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
              className="w-16 h-16 rounded-full bg-primary/40 flex items-center justify-center"
            >
              <Bike className="w-8 h-8 text-primary" />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Markers */}
        <div className="absolute top-8 left-8">
          <div className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-foreground" />
          </div>
          <span className="text-xs font-medium mt-1 block">Restaurant</span>
        </div>
        <div className="absolute bottom-8 right-8">
          <div className="w-10 h-10 rounded-full bg-primary shadow-soft flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium mt-1 block">You</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-card"
        >
          <h2 className="font-bold text-lg mb-6">Order Status</h2>
          
          <div className="space-y-6">
            {orderSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep - 1;

              return (
                <div key={step.id} className="flex gap-4">
                  <div className="relative">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isCurrent ? 1.1 : 1,
                        backgroundColor: isCompleted || isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted || isCurrent ? 'shadow-soft' : ''
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isCompleted || isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}
                      />
                    </motion.div>
                    {index < orderSteps.length - 1 && (
                      <div
                        className={`absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-6 ${
                          isCompleted ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pt-3">
                    <p
                      className={`font-semibold ${
                        isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-primary animate-pulse-soft"
                      >
                        In progress...
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Driver Info */}
      {currentStep >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mb-6"
        >
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <h2 className="font-bold mb-4">Your Driver</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl">
                  🚴
                </div>
                <div>
                  <p className="font-semibold">{order.driver_name || 'Marcus Chen'}</p>
                  <p className="text-sm text-muted-foreground">4.9 ⭐ • 234 deliveries</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Order Details */}
      <div className="px-4">
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h2 className="font-bold mb-4">Order Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                {restaurant?.image ? (
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ChefHat className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold">{restaurant?.name || 'Restaurant'}</p>
                <p className="text-sm text-muted-foreground">
                  {itemCount} items • ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Delivering to</p>
                  <p className="font-medium">{order.delivery_address || 'Address not set'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
