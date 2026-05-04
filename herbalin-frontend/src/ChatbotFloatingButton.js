"use client";

import { useState } from "react";
import Chatbot from "./Chatbot";

export default function ChatbotFloatingButton() {

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FLOATING BUTTON */}
      {!open && (
        <div
          style={{
            position: "fixed",
            right: 30,
            bottom: 30,
            zIndex: 99999,
            animation: "float 3s ease-in-out infinite",
            cursor: "pointer"
          }}
          onClick={() => setOpen(true)}
        >
          <img
            src={require("./assets/Chatbot.png")}
            alt="chatbot"
            style={{
              width: 90,
              height: 90,
              objectFit: "contain",
              filter:
                "drop-shadow(0px 0px 15px rgba(27,94,68,0.7)) drop-shadow(0px 0px 30px rgba(27,94,68,0.5))"
            }}
          />
        </div>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: 30,
            bottom: 30,
            zIndex: 99999
          }}
        >
          <Chatbot onClose={() => setOpen(false)} />
        </div>
      )}

      {/* FLOAT ANIMATION */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </>
  );
}