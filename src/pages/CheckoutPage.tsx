import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Clock, 
  Plus,
  Check,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const paymentMethods = [
  { id: 'meal_plan', label: 'Meal Plan', icon: Wallet, description: 'Use your meal plan balance' },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: '**** **** **** 4242' },
];

const tipOptions = [0, 2, 3, 5];

export default function CheckoutPage() {
  const { state, getSubtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPayment, setSelectedPayment] = useState('meal_plan');
  const [selectedTip, setSelectedTip] = useState(2);
  const [deliveryAddress, setDeliveryAddress] = useState('Wilson Hall, Room 312');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = 1.99;
  const tax = subtotal * 0.0875;
  const total = subtotal + deliveryFee + tax + selectedTip;

  const mealPlanBalance = profile?.meal_plan_balance ?? 500;
  const canUseMealPlan = selectedPayment === 'meal_plan' && mealPlanBalance >= total;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Please sign in',
        description: 'You need to be signed in to place an order.',
      });
      navigate('/auth');
      return;
    }

    if (!state.restaurantId) {
      toast({
        variant: 'destructive',
        title: 'Cart is empty',
        description: 'Please add items to your cart first.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database
      const orderData = {
        user_id: user.id,
        restaurant_id: state.restaurantId,
        items: JSON.parse(JSON.stringify(state.items)),
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        tax: tax,
        tip: selectedTip,
        total: total,
        status: 'confirmed',
        estimated_delivery: '25-35 min',
        delivery_address: deliveryAddress,
        payment_method: selectedPayment,
        special_instructions: specialInstructions || null,
      };

      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      // Update meal plan balance if using meal plan
      if (selectedPayment === 'meal_plan' && profile) {
        await supabase
          .from('profiles')
          .update({ meal_plan_balance: mealPlanBalance - total })
          .eq('user_id', user.id);
      }

      // Clear cart
      clearCart();

      toast({
        title: 'Order placed!',
        description: 'Your order has been confirmed.',
      });

      // Navigate to order tracking
      navigate(`/order/${order.id}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Order failed',
        description: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Link to="/">
          <Button className="gradient-warm text-primary-foreground rounded-xl">
            Browse Restaurants
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-48">
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-4 border-b border-border">
        <Link
          to="/cart"
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Checkout</h1>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Delivery Address</h2>
            <button className="text-primary text-sm font-medium">Change</button>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <Input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="bg-secondary border-0"
                placeholder="Enter delivery address"
              />
            </div>
          </div>
        </motion.div>

        {/* Estimated Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold">Estimated Delivery</p>
              <p className="text-sm text-muted-foreground">25-35 minutes</p>
            </div>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 shadow-card"
        >
          <h2 className="font-bold mb-4">Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedPayment === method.id;
              const isMealPlan = method.id === 'meal_plan';
              
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-primary' : 'bg-background'
                  }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{method.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {isMealPlan ? `Balance: $${mealPlanBalance.toFixed(2)}` : method.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5 shadow-card"
        >
          <h2 className="font-bold mb-4">Add a Tip</h2>
          <div className="flex gap-3">
            {tipOptions.map((tip) => (
              <button
                key={tip}
                onClick={() => setSelectedTip(tip)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  selectedTip === tip
                    ? 'gradient-warm text-primary-foreground'
                    : 'bg-secondary text-foreground'
                }`}
              >
                {tip === 0 ? 'None' : `$${tip}`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Special Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-5 shadow-card"
        >
          <h2 className="font-bold mb-4">Special Instructions</h2>
          <Input
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests for your order?"
            className="bg-secondary border-0"
          />
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Order Summary</h2>
            <Link to="/cart" className="text-primary text-sm font-medium flex items-center gap-1">
              Edit <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mb-3">From {state.restaurantName}</p>
          <div className="space-y-2">
            {state.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.menuItem.name}</span>
                <span>${item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Summary & Pay */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 pb-24 shadow-elevated">
        <div className="max-w-md mx-auto">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tip</span>
              <span>${selectedTip.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {selectedPayment === 'meal_plan' && !canUseMealPlan && (
            <p className="text-destructive text-sm text-center mb-3">
              Insufficient meal plan balance
            </p>
          )}

          <Button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || (selectedPayment === 'meal_plan' && !canUseMealPlan)}
            className="w-full h-14 text-lg font-semibold rounded-xl gradient-warm border-0"
          >
            {isSubmitting ? 'Placing Order...' : `Pay $${total.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
