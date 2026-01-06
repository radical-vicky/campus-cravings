import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, MenuItem, SelectedCustomization } from '@/types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; quantity: number; customizations: SelectedCustomization[]; specialInstructions?: string; restaurantId: string; restaurantName: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
};

function calculateItemTotal(menuItem: MenuItem, quantity: number, customizations: SelectedCustomization[]): number {
  let total = menuItem.price;
  customizations.forEach((c) => {
    c.selectedOptions.forEach((opt) => {
      total += opt.price;
    });
  });
  return total * quantity;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, quantity, customizations, specialInstructions, restaurantId, restaurantName } = action.payload;
      
      // If adding from different restaurant, clear cart first
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          items: [{
            id: `${menuItem.id}-${Date.now()}`,
            menuItem,
            quantity,
            customizations,
            specialInstructions,
            totalPrice: calculateItemTotal(menuItem, quantity, customizations),
          }],
          restaurantId,
          restaurantName,
        };
      }

      const newItem: CartItem = {
        id: `${menuItem.id}-${Date.now()}`,
        menuItem,
        quantity,
        customizations,
        specialInstructions,
        totalPrice: calculateItemTotal(menuItem, quantity, customizations),
      };

      return {
        ...state,
        items: [...state.items, newItem],
        restaurantId,
        restaurantName,
      };
    }

    case 'REMOVE_ITEM':
      const updatedItems = state.items.filter((item) => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        restaurantId: updatedItems.length === 0 ? null : state.restaurantId,
        restaurantName: updatedItems.length === 0 ? null : state.restaurantName,
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: action.payload.quantity,
                totalPrice: calculateItemTotal(item.menuItem, action.payload.quantity, item.customizations),
              }
            : item
        ),
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (menuItem: MenuItem, quantity: number, customizations: SelectedCustomization[], specialInstructions: string | undefined, restaurantId: string, restaurantName: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (
    menuItem: MenuItem,
    quantity: number,
    customizations: SelectedCustomization[],
    specialInstructions: string | undefined,
    restaurantId: string,
    restaurantName: string
  ) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { menuItem, quantity, customizations, specialInstructions, restaurantId, restaurantName },
    });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getSubtotal = () => {
    return state.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getItemCount = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart, getSubtotal, getItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
