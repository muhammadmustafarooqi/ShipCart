"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  category: string;
  slug: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (productId: string) => boolean;
  totalItems: number;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

export default function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("allinone_wishlist");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem("allinone_wishlist");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("allinone_wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.productId === item.productId)) return prev;
      return [...prev, item];
    });
    toast.success(`${item.name} added to wishlist! 💖`);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    toast.success("Removed from wishlist");
  };

  const toggleItem = (item: WishlistItem) => {
    const exists = items.find((i) => i.productId === item.productId);
    if (exists) {
      removeItem(item.productId);
    } else {
      addItem(item);
    }
  };

  const isWishlisted = (productId: string) =>
    items.some((i) => i.productId === productId);

  const clearWishlist = () => {
    setItems([]);
    localStorage.removeItem("allinone_wishlist");
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, toggleItem, isWishlisted, totalItems, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
