// src/components/ui/button.jsx
import React from "react";

export const Button = ({ children, onClick, className, variant = "default" }) => {
  const base = "rounded px-4 py-2 font-medium transition";
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700",
    outline: "border border-gray-400 text-gray-800 hover:bg-gray-100",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className || ""}`}>
      {children}
    </button>
  );
};
