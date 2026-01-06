import { motion } from 'framer-motion';
import { Wallet, TrendingUp } from 'lucide-react';
import { currentUser } from '@/data/mockData';

export function MealPlanCard() {
  const balance = currentUser.mealPlanBalance;
  const percentUsed = 100 - (balance / 500) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-4 p-5 rounded-2xl gradient-warm shadow-elevated relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/20 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">Meal Plan Balance</p>
              <p className="text-white text-2xl font-bold">${balance.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">This week</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Semester progress</span>
            <span className="text-white font-medium">{percentUsed.toFixed(0)}% used</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentUsed}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
