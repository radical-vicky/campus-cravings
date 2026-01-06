import { motion } from 'framer-motion';
import { categories } from '@/data/mockData';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="mt-6 px-4">
      <h2 className="font-semibold text-lg mb-3">Categories</h2>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onSelectCategory(category.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium text-sm whitespace-nowrap">{category.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
