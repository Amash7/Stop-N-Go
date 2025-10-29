import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  imageUrl: string;
}

interface CartStore {
  items: CartItem[];
  userId: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setUserId: (userId: string | null) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Helper to get user-specific storage key
const getUserStorageKey = (userId: string | null) => {
  return userId ? `cart-storage-${userId}` : 'cart-storage-guest';
};

// Helper to load cart from localStorage for a specific user
const loadUserCart = (userId: string | null): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const key = getUserStorageKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.items || [];
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
  return [];
};

// Helper to save cart to localStorage for a specific user
const saveUserCart = (userId: string | null, items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    const key = getUserStorageKey(userId);
    localStorage.setItem(key, JSON.stringify({
      state: { items, userId },
      version: 0
    }));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      
      addItem: (item) => {
        // CRITICAL: Only allow adding items if user is authenticated
        const currentUserId = get().userId;
        if (!currentUserId) {
          console.warn('Cannot add items to cart: User not authenticated');
          return;
        }
        
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          
          let newItems;
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxQuantity) }
                : i
            );
          } else {
            newItems = [...state.items, item];
          }
          
          // Save to user-specific storage
          saveUserCart(currentUserId, newItems);
          
          return { items: newItems };
        });
      },
      
      removeItem: (id) => {
        // Only allow removing items if user is authenticated
        const currentUserId = get().userId;
        if (!currentUserId) {
          console.warn('Cannot remove items from cart: User not authenticated');
          return;
        }
        
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          
          // Save to user-specific storage
          saveUserCart(currentUserId, newItems);
          
          return { items: newItems };
        });
      },
      
      updateQuantity: (id, quantity) => {
        // Only allow updating quantity if user is authenticated
        const currentUserId = get().userId;
        if (!currentUserId) {
          console.warn('Cannot update cart: User not authenticated');
          return;
        }
        
        set((state) => {
          const newItems = state.items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.min(Math.max(1, quantity), i.maxQuantity) }
              : i
          );
          
          // Save to user-specific storage
          saveUserCart(currentUserId, newItems);
          
          return { items: newItems };
        });
      },
      
      clearCart: () => {
        const currentUserId = get().userId;
        set({ items: [] });
        
        // Clear from user-specific storage
        if (currentUserId) {
          saveUserCart(currentUserId, []);
        }
      },
      
      setUserId: (userId) => {
        const currentUserId = get().userId;
        
        // If switching users, load the new user's cart from their specific storage
        if (userId !== currentUserId) {
          const userCart = loadUserCart(userId);
          set({ items: userCart, userId });
        } else {
          set({ userId });
        }
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return str;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, value);
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      })),
    }
  )
);
