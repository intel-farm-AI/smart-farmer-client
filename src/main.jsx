import React from "react";
import ReactDOM from "react-dom/client";
import App from "./SmartFarmerAppV2.jsx"; // Ini akan error kalau file-nya belum ada
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
