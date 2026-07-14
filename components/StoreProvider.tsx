"use client";

import { SAMPLE_PRODUCTS } from "@/lib/products";
import { Account, CartItem, DeliveryInfo, Order, Theme } from "@/lib/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SignupInput = {
  fullName: string;
  email: string;
  password: string;
};

type StoreContextValue = {
  isReady: boolean;
  theme: Theme;
  cart: CartItem[];
  account: Account | null;
  isAuthenticated: boolean;
  skippedAuth: boolean;
  lastOrder: Order | null;
  cartCount: number;
  cartSubtotal: number;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  skipAuth: () => void;
  signup: (details: SignupInput) => { ok: boolean; message?: string };
  login: (email: string, password: string) => { ok: boolean; message?: string };
  logout: () => void;
  addToCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (delivery: DeliveryInfo) => { ok: boolean; message?: string };
};

const KEY_THEME = "lbs_theme";
const KEY_ACCOUNT = "lbs_account";
const KEY_PASSWORD_HASH = "lbs_password_hash";
const KEY_AUTH = "lbs_is_authenticated";
const KEY_SKIPPED = "lbs_skipped_auth";
const KEY_CART = "lbs_cart";
const KEY_LAST_ORDER = "lbs_last_order";

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const calculateSubtotal = (cart: CartItem[]) =>
  cart.reduce((sum, item) => {
    const product = SAMPLE_PRODUCTS.find((entry) => entry.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

const hashPassword = (password: string) => {
  let hash = 5381;
  for (let index = 0; index < password.length; index += 1) {
    hash = (hash * 33) ^ password.charCodeAt(index);
  }
  return (hash >>> 0).toString(16);
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const isReady = true;
  const isClient = typeof window !== "undefined";
  const [theme, setThemeState] = useState<Theme>(() => {
    if (!isClient) return "light";
    const storedTheme = localStorage.getItem(KEY_THEME);
    return storedTheme === "dark" ? "dark" : "light";
  });
  const [account, setAccount] = useState<Account | null>(() => {
    if (!isClient) return null;
    const storedAccount = localStorage.getItem(KEY_ACCOUNT);
    return storedAccount ? JSON.parse(storedAccount) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (!isClient) return false;
    return localStorage.getItem(KEY_AUTH) === "true";
  });
  const [passwordHash, setPasswordHash] = useState<string | null>(() => {
    if (!isClient) return null;
    return localStorage.getItem(KEY_PASSWORD_HASH);
  });
  const [skippedAuth, setSkippedAuth] = useState(() => {
    if (!isClient) return false;
    return localStorage.getItem(KEY_SKIPPED) === "true";
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (!isClient) return [];
    const storedCart = localStorage.getItem(KEY_CART);
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [lastOrder, setLastOrder] = useState<Order | null>(() => {
    if (!isClient) return null;
    const storedOrder = localStorage.getItem(KEY_LAST_ORDER);
    return storedOrder ? JSON.parse(storedOrder) : null;
  });

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem(KEY_THEME, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme, isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem(KEY_CART, JSON.stringify(cart));
  }, [cart, isClient]);

  useEffect(() => {
    if (!isClient) return;
    if (account) {
      localStorage.setItem(KEY_ACCOUNT, JSON.stringify(account));
    }
  }, [account, isClient]);

  useEffect(() => {
    if (!isClient) return;
    if (passwordHash) {
      localStorage.setItem(KEY_PASSWORD_HASH, passwordHash);
    }
  }, [passwordHash, isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem(KEY_AUTH, String(isAuthenticated));
  }, [isAuthenticated, isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem(KEY_SKIPPED, String(skippedAuth));
  }, [skippedAuth, isClient]);

  useEffect(() => {
    if (!isClient) return;
    if (lastOrder) {
      localStorage.setItem(KEY_LAST_ORDER, JSON.stringify(lastOrder));
    }
  }, [lastOrder, isClient]);

  const cartCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart],
  );
  const cartSubtotal = useMemo(() => calculateSubtotal(cart), [cart]);

  const setTheme = (value: Theme) => setThemeState(value);
  const toggleTheme = () => setThemeState((prev) => (prev === "light" ? "dark" : "light"));

  const skipAuth = () => {
    setIsAuthenticated(false);
    setSkippedAuth(true);
  };

  const signup = (details: SignupInput) => {
    if (!details.email || !details.password || !details.fullName) {
      return { ok: false, message: "All signup fields are required." };
    }
    setAccount({ fullName: details.fullName, email: details.email });
    setPasswordHash(hashPassword(details.password));
    setSkippedAuth(false);
    setIsAuthenticated(true);
    return { ok: true };
  };

  const login = (email: string, password: string) => {
    if (!account || !passwordHash) {
      return { ok: false, message: "No account found. Please sign up first." };
    }
    if (account.email !== email || passwordHash !== hashPassword(password)) {
      return { ok: false, message: "Invalid email or password." };
    }
    setIsAuthenticated(true);
    setSkippedAuth(false);
    return { ok: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const current = prev.find((item) => item.productId === productId);
      if (current) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (delivery: DeliveryInfo) => {
    if (!isAuthenticated) {
      return { ok: false, message: "Please log in or sign up before placing order." };
    }
    if (cart.length === 0) {
      return { ok: false, message: "Your cart is empty." };
    }

    const nextOrder: Order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: cart,
      total: calculateSubtotal(cart),
      delivery,
    };

    setLastOrder(nextOrder);
    clearCart();
    return { ok: true };
  };

  return (
    <StoreContext.Provider
      value={{
        isReady,
        theme,
        cart,
        account,
        isAuthenticated,
        skippedAuth,
        lastOrder,
        cartCount,
        cartSubtotal,
        setTheme,
        toggleTheme,
        skipAuth,
        signup,
        login,
        logout,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};
