export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  distance: string;
  promo?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  calories?: number;
  customizations?: Customization[];
}

export interface Customization {
  id: string;
  name: string;
  options: CustomizationOption[];
  required: boolean;
  maxSelections: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: SelectedCustomization[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface SelectedCustomization {
  customizationId: string;
  customizationName: string;
  selectedOptions: CustomizationOption[];
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  estimatedDelivery: string;
  deliveryAddress: string;
  createdAt: Date;
}

export type OrderStatus = 
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  mealPlanBalance: number;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
