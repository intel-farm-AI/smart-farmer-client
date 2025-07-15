// src/components/ui/use-toast.jsx

import * as React from "react"
import {
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  Toast,
} from "@radix-ui/react-toast"

import { useToast as useToastPrimitive } from "@radix-ui/react-toast"

export const useToast = useToastPrimitive

export {
  ToastProvider,
  Toast,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
}
