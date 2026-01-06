import { Home, Search, ShoppingBag, Clock, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/orders', icon: Clock, label: 'Orders' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const location = useLocation();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 py-2 px-4"
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* Cart Button */}
        <Link
          to="/cart"
          className="relative flex flex-col items-center gap-1 py-2 px-4"
        >
          <div className="relative">
            <ShoppingBag
              className={`w-6 h-6 transition-colors ${
                location.pathname === '/cart' ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-primary-foreground bg-primary rounded-full"
              >
                {itemCount}
              </motion.span>
            )}
          </div>
          <span
            className={`text-xs font-medium transition-colors ${
              location.pathname === '/cart' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Cart
          </span>
        </Link>
      </div>
    </nav>
  );
}
