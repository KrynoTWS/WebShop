import { createContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const checkout = () => {
    if (cart.length === 0) {
      alert("Košarica je prazna!");
      return;
    }
    alert("Kupnja obavljena!");
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;