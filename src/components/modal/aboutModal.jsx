import React from "react";
import { useNavigate } from "react-router-dom";

const FloatingAboutButton = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      navigate("/about");
    }, 200);
  };

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
      {/* Tooltip */}
      <div
        style={{
          marginBottom: 12,
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          color: "#e2e8f0",
          padding: "8px 16px",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(148,163,184,0.1)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          visibility: hovered ? "visible" : "hidden",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(148,163,184,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "linear-gradient(45deg, #10b981, #059669)",
              boxShadow: "0 0 8px rgba(16,185,129,0.4)",
            }}
          />
          Jelajahi tentang kami
        </div>
        {/* Tooltip arrow */}
        <div
          style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid #1e293b",
          }}
        />
      </div>

      {/* Main Button */}
      <div style={{ position: "relative" }}>
        {/* Outer glow ring */}
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            background: "linear-gradient(45deg, #10b981, #059669, #10b981)",
            opacity: hovered ? 0.6 : 0.3,
            filter: "blur(8px)",
            transform: hovered ? "scale(1.1)" : "scale(1)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            animation: hovered ? "pulse 2s infinite" : "none",
          }}
        />
        
        {/* Inner glow ring */}
        <div
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            background: "linear-gradient(45deg, rgba(16,185,129,0.3), rgba(5,150,105,0.3))",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(0.8)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        <button
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: "relative",
            background: hovered 
              ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)" 
              : "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)",
            border: hovered 
              ? "2px solid rgba(16,185,129,0.4)" 
              : "2px solid rgba(148,163,184,0.2)",
            borderRadius: "50%",
            width: "64px",
            height: "64px",
            boxShadow: hovered
              ? "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.9)"
              : "0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(148,163,184,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transform: clicked 
              ? "scale(0.95)" 
              : hovered 
                ? "scale(1.05) translateY(-2px)" 
                : "scale(1)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            backdropFilter: "blur(8px)",
            overflow: "hidden",
          }}
          title="About"
        >
          {/* Shimmer effect */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)",
              transform: hovered ? "translateX(100%)" : "translateX(-100%)",
              transition: "transform 0.6s ease",
              borderRadius: "50%",
            }}
          />
          
          {/* Icon container */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                color: hovered ? "#059669" : "#374151",
                transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1)",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                filter: hovered ? "drop-shadow(0 2px 4px rgba(5,150,105,0.3))" : "none",
              }}
            >
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          </div>

          {/* Ripple effect */}
          {clicked && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)",
                animation: "ripple 0.6s ease-out",
                pointerEvents: "none",
              }}
            />
          )}
        </button>

        {/* Floating particles */}
        {hovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, #10b981, #059669)",
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-40px)`,
                  opacity: 0.6,
                  animation: `float-${i} 2s infinite ease-in-out`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes float-0 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) translateY(-40px) scale(0); }
          50% { transform: translate(-50%, -50%) rotate(0deg) translateY(-50px) scale(1); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translate(-50%, -50%) rotate(60deg) translateY(-40px) scale(0); }
          50% { transform: translate(-50%, -50%) rotate(60deg) translateY(-50px) scale(1); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translate(-50%, -50%) rotate(120deg) translateY(-40px) scale(0); }
          50% { transform: translate(-50%, -50%) rotate(120deg) translateY(-50px) scale(1); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translate(-50%, -50%) rotate(180deg) translateY(-40px) scale(0); }
          50% { transform: translate(-50%, -50%) rotate(180deg) translateY(-50px) scale(1); }
        }
        
        @keyframes float-4 {
          0%, 100% { transform: translate(-50%, -50%) rotate(240deg) translateY(-40px) scale(0); }
          50% { transform: translate(-50%, -50%) rotate(240deg) translateY(-50px) scale(1); }
        }
        
        @keyframes float-5 {
          0%, 100% { transform: translate(-50%, -50%) rotate(300deg) translateY(-40px) scale(0); }
          50% { transform: translate(-50%, -50%) rotate(300deg) translateY(-50px) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default FloatingAboutButton;