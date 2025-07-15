import React, { useEffect } from "react";
import { useToastStore } from "./use-toast";

const ToastItem = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 4000); // auto-close after 4s

    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div
      className={`transform transition-all duration-300 ease-out animate-slide-in px-4 py-3 rounded shadow-md text-white flex flex-col gap-1
        ${
          toast.variant === "destructive"
            ? "bg-red-600 border border-red-800"
            : "bg-green-600 border border-green-800"
        }`}
    >
      <strong className="font-bold">{toast.title}</strong>
      {toast.description && (
        <span className="text-sm text-white/90">{toast.description}</span>
      )}
    </div>
  );
};

const ToastList = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-[300px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastList;
