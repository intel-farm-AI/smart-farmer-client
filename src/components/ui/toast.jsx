// src/components/ui/toast.jsx
import * as React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@radix-ui/react-toast";

const Toaster = () => {
  return (
    <ToastProvider>
      <Toast>
        <div className="flex flex-col gap-1 p-4 bg-white border rounded shadow">
          <ToastTitle className="font-semibold" />
          <ToastDescription className="text-sm text-gray-600" />
          <ToastClose className="text-xs text-gray-500 hover:text-red-500 mt-2">Tutup</ToastClose>
        </div>
      </Toast>
      <ToastViewport className="fixed bottom-4 right-4 w-96 z-50" />
    </ToastProvider>
  );
};

export { Toaster };
