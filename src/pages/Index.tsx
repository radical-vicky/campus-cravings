import { useState } from 'react';
import { Header } from '@/components/home/Header';
import { MealPlanCard } from '@/components/home/MealPlanCard';
import { PromoBanner } from '@/components/home/PromoBanner';
import { CategoryFilter } from '@/components/home/CategoryFilter';
import { RestaurantList } from '@/components/home/RestaurantList';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('1');

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <MealPlanCard />
      <PromoBanner />
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <RestaurantList selectedCategory={selectedCategory} />
    </div>
  );
};

export default Index;
