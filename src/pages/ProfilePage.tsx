import { Link, useNavigate } from 'react-router-dom';
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
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: MapPin, label: 'Saved Addresses', value: '2 addresses', path: '/addresses' },
  { icon: CreditCard, label: 'Payment Methods', value: '2 cards', path: '/payments' },
  { icon: Heart, label: 'Favorites', value: '5 restaurants', path: '/favorites' },
  { icon: Bell, label: 'Notifications', value: 'On', path: '/notifications' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Sign in to your account</h2>
          <p className="text-muted-foreground mb-6">
            Access your orders, meal plan, and saved addresses
          </p>
          <Link to="/auth">
            <Button className="gradient-warm text-primary-foreground rounded-xl px-8">
              Sign In
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Student';
  const studentId = profile?.student_id || 'Not set';
  const mealPlanBalance = profile?.meal_plan_balance ?? 500;
  const mealPlanType = profile?.meal_plan_type || 'Standard Plan';

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
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Student ID: {studentId}
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
            <p className="text-primary-foreground/80 text-sm">{mealPlanType}</p>
            <p className="text-3xl font-bold">${mealPlanBalance.toFixed(2)}</p>
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
          onClick={handleSignOut}
          className="w-full mt-6 flex items-center justify-center gap-2 p-4 text-destructive font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </motion.button>
      </div>
    </div>
  );
}
