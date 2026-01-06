import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const orderSteps = [
  { id: 'confirmed', label: 'Order Confirmed', icon: Package },
  { id: 'preparing', label: 'Preparing', icon: ChefHat },
  { id: 'on_the_way', label: 'On the Way', icon: Bike },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderTrackingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Simulate order progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
          <h1 className="text-xl font-bold">Order #ORD-2024-001</h1>
          <p className="text-sm text-muted-foreground">Estimated arrival: 12:45 PM</p>
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
                  <p className="font-semibold">Marcus Chen</p>
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
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100"
                  alt="Restaurant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">Campus Grill House</p>
                <p className="text-sm text-muted-foreground">2 items • $31.39</p>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Delivering to</p>
                  <p className="font-medium">Wilson Hall, Room 312</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
