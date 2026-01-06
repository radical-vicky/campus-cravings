import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { state, removeItem, updateQuantity, getSubtotal } = useCart();
  
  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 1.99 : 0;
  const tax = subtotal * 0.0875;
  const total = subtotal + deliveryFee + tax;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="px-4 py-4 flex items-center gap-4 border-b border-border">
          <Link
            to="/"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Your Cart</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6"
          >
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </motion.div>
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-6">
            Browse our restaurants and add some delicious items!
          </p>
          <Link to="/">
            <Button className="gradient-warm text-primary-foreground rounded-xl px-8">
              Explore Restaurants
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-48">
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-4 border-b border-border">
        <Link
          to="/"
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Your Cart</h1>
          <p className="text-sm text-muted-foreground">From {state.restaurantName}</p>
        </div>
      </header>

      {/* Cart Items */}
      <div className="px-4 py-6">
        <AnimatePresence mode="popLayout">
          {state.items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-4 p-4 bg-card rounded-xl shadow-card mb-3"
            >
              <img
                src={item.menuItem.image}
                alt={item.menuItem.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{item.menuItem.name}</h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {item.customizations.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.customizations
                      .flatMap((c) => c.selectedOptions.map((o) => o.name))
                      .join(', ')}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-primary">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add more items */}
        <Link
          to={`/restaurant/${state.restaurantId}`}
          className="flex items-center justify-center gap-2 py-4 text-primary font-medium"
        >
          <Plus className="w-5 h-5" />
          Add more items
        </Link>
      </div>

      {/* Order Summary */}
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
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/checkout">
            <Button className="w-full h-14 text-lg font-semibold rounded-xl gradient-warm border-0">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
