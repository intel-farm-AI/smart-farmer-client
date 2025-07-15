// src/components/ui/card.jsx
import React from "react";

export const Card = ({ children, className }) => (
  <div className={`rounded-lg shadow border bg-white ${className || ""}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`px-4 pt-4 font-semibold ${className || ""}`}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h2 className={`text-lg font-bold ${className || ""}`}>{children}</h2>
);

export const CardContent = ({ children, className }) => (
  <div className={`px-4 pb-4 ${className || ""}`}>{children}</div>
);
