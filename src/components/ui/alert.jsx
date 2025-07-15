// src/components/ui/alert.jsx
import React from "react";

export const Alert = ({ children, className }) => (
  <div className={`rounded border p-4 ${className || ""}`}>
    {children}
  </div>
);

export const AlertDescription = ({ children }) => (
  <div className="text-sm text-gray-700">{children}</div>
);
