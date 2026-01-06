import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Wallet,
  MapPin,
  CreditCard,
  Bell,
  Heart,
  HelpCircle,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { currentUser } from '@/data/mockData';

const menuItems = [
  { icon: Wallet, label: 'Meal Plan', value: `$${currentUser.mealPlanBalance.toFixed(2)}`, path: '/meal-plan' },
  { icon: MapPin, label: 'Saved Addresses', value: '2 addresses', path: '/addresses' },
  { icon: CreditCard, label: 'Payment Methods', value: '2 cards', path: '/payments' },
  { icon: Heart, label: 'Favorites', value: '5 restaurants', path: '/favorites' },
  { icon: Bell, label: 'Notifications', value: 'On', path: '/notifications' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile Header */}
      <div className="px-4 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-20 h-20 rounded-full gradient-warm flex items-center justify-center text-3xl font-bold text-primary-foreground">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
            <p className="text-muted-foreground">{currentUser.email}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Student ID: {currentUser.studentId}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Meal Plan Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-4 p-5 rounded-2xl gradient-warm shadow-elevated mb-6"
      >
        <div className="flex items-center justify-between text-primary-foreground">
          <div>
            <p className="text-primary-foreground/80 text-sm">Meal Plan Balance</p>
            <p className="text-3xl font-bold">${currentUser.mealPlanBalance.toFixed(2)}</p>
          </div>
          <Wallet className="w-10 h-10 text-primary-foreground/50" />
        </div>
      </motion.div>

      {/* Menu Items */}
      <div className="px-4">
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && (
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Link>
                {index < menuItems.length - 1 && (
                  <div className="h-px bg-border mx-4" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full mt-6 flex items-center justify-center gap-2 p-4 text-destructive font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </motion.button>
      </div>
    </div>
  );
}
