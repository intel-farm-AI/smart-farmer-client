// src/components/ui/use-toast.js
import * as React from "react";
import { create } from "zustand";

// Buat store untuk toast
const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

// Hook untuk digunakan di komponen React
export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);

  const toast = ({ title, description, variant }) => {
    const id = Date.now().toString();
    addToast({ id, title, description, variant });
  };

  return { toast };
};
