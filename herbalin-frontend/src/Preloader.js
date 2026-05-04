import React from "react";
import "./index.css";
import logo from "./assets/herbalin_logo.png";

export default function Preloader() {
  return (
    <div className="preloader">

      <img src={logo} alt="Herbalin Logo" className="logo" />

      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>

      <p className="loading-text">Loading...</p>

    </div>
  );
}