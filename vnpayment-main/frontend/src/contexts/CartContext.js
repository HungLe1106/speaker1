import { createContext, useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

// Create context
const CartContext = createContext();

// Session ID for cart persistence
const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

// Initial state
const initialState = {
  items: {},
  total: 0,
  itemCount: 0,
  savings: 0, // Total discount savings
  sessionId: getSessionId(),
};

// Cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload.items || {},
        total: action.payload.total || 0,
        itemCount: calculateItemCount(action.payload.items || {}),
        savings: calculateSavings(action.payload.items || {}),
      };

    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload;
      if (!product || !product.id) {
        console.error("Invalid product data:", product);
        return state;
      }

      const newItems = { ...state.items };
      const currentQty = newItems[product.id]?.qty || 0;

      newItems[product.id] = {
        ...product,
        qty: currentQty + quantity,
      };

      const newTotal = calculateTotal(newItems);
      const newItemCount = calculateItemCount(newItems);
      const newSavings = calculateSavings(newItems);

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
        savings: newSavings,
      };
    }

    case "UPDATE_ITEM": {
      const { productId, quantity } = action.payload;
      const newItems = { ...state.items };

      if (quantity <= 0) {
        delete newItems[productId];
      } else {
        newItems[productId] = {
          ...newItems[productId],
          qty: quantity,
        };
      }

      const newTotal = calculateTotal(newItems);
      const newItemCount = calculateItemCount(newItems);
      const newSavings = calculateSavings(newItems);

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
        savings: newSavings,
      };
    }

    case "REMOVE_ITEM": {
      const { productId } = action.payload;
      const newItems = { ...state.items };
      delete newItems[productId];

      const newTotal = calculateTotal(newItems);
      const newItemCount = calculateItemCount(newItems);
      const newSavings = calculateSavings(newItems);

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
        savings: newSavings,
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: {},
        total: 0,
        itemCount: 0,
        savings: 0,
      };

    default:
      return state;
  }
}

// Helper functions
function calculateTotal(items) {
  return Object.values(items).reduce((sum, item) => {
    // Apply discount if available
    const finalPrice = item.discount && item.discount > 0
      ? Math.round(item.price * (1 - item.discount / 100))
      : item.price;
    return sum + finalPrice * item.qty;
  }, 0);
}

function calculateItemCount(items) {
  return Object.values(items).reduce((count, item) => {
    return count + item.qty;
  }, 0);
}

// Calculate total savings from discounts
function calculateSavings(items) {
  return Object.values(items).reduce((savings, item) => {
    if (item.discount && item.discount > 0) {
      const discountAmount = Math.round(item.price * (item.discount / 100));
      return savings + (discountAmount * item.qty);
    }
    return savings;
  }, 0);
}

// Cart Provider
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        // Validate cart data structure before loading
        if (cartData && typeof cartData === "object" && cartData.items) {
          dispatch({ type: "LOAD_CART", payload: cartData });
        } else {
          console.warn("Invalid cart data structure in localStorage");
          localStorage.removeItem("cart"); // Clear invalid data
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem("cart"); // Clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      const cartData = {
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      };
      localStorage.setItem("cart", JSON.stringify(cartData));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [state.items, state.total, state.itemCount]);

  // Actions
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { product, quantity },
    });
    toast.success(`Đã thêm ${product.title} vào giỏ hàng`);
  };

  const updateCartItem = (productId, quantity) => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: { productId, quantity },
    });
  };

  const removeFromCart = (productId) => {
    const item = state.items[productId];
    if (item) {
      dispatch({
        type: "REMOVE_ITEM",
        payload: { productId },
      });
      toast.info(`Đã xóa ${item.title} khỏi giỏ hàng`);
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.info("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
  };

  const getCartItems = () => {
    return Object.values(state.items);
  };

  const isInCart = (productId) => {
    return !!state.items[productId];
  };

  const getItemQuantity = (productId) => {
    return state.items[productId]?.qty || 0;
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItems,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
