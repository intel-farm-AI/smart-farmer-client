
import React from "react";
import { useNavigate } from "react-router-dom";


const FloatingAboutButton = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          marginBottom: 8,
          background: "#222",
          color: "#fff",
          padding: "6px 14px",
          borderRadius: 8,
          fontSize: 14,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: hovered ? 0.95 : 0,
          transform: hovered ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          visibility: hovered ? "visible" : "hidden",
        }}
      >
        Jelajahi tentang kami
      </div>
      <button
        onClick={() => navigate("/about")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "box-shadow 0.2s",
        }}
        title="About"
      >
        <span style={{ fontSize: 24, color: "#333" }}>i</span>
      </button>
    </div>
  );
};

export default FloatingAboutButton;
