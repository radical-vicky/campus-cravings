import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';

const promos = [
  {
    id: '1',
    title: 'Free Delivery Week',
    description: 'On all orders over $15',
    gradient: 'from-accent to-emerald-400',
    icon: '🚀',
  },
  {
    id: '2',
    title: 'Student Discount',
    description: '15% off with .edu email',
    gradient: 'from-primary to-orange-400',
    icon: '🎓',
  },
];

export function PromoBanner() {
  return (
    <div className="px-4 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-lg">Today's Deals</h2>
      </div>
      
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
        {promos.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`flex-shrink-0 w-72 p-4 rounded-xl bg-gradient-to-r ${promo.gradient} cursor-pointer group`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-3xl mb-2 block">{promo.icon}</span>
                <h3 className="text-white font-bold text-lg">{promo.title}</h3>
                <p className="text-white/80 text-sm">{promo.description}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
