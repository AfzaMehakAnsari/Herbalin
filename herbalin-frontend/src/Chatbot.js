import { useState, useRef, useEffect } from "react";
import icon from "./assets/icon.png";
import bg from "./assets/Chatbot-bg.png";

export default function Chatbot({ onClose }) {

const renderText = (text) => {
  if (typeof text !== "string") return JSON.stringify(text);
  
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return <span key={i}>{parts}{i < text.split("\n").length - 1 && <br />}</span>;
  });
};

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi! I am Herbalin Bot. How can I help you?"
    }
  ]);

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, loading]);

  const sendMessage = async () => {
  if (!userInput.trim()) return;

  const userMessage = userInput;

  const updatedMessages = [
    ...messages,
    { type: "user", text: userMessage }
  ];

  setMessages(updatedMessages);
  setUserInput("");
  setLoading(true);

  try {
    const contents = updatedMessages.map((msg) => ({
      role: msg.type === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    const res = await fetch(
      `http://localhost:5000/api/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents
        })
      }
    );

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        text: data.reply || "No response"
      }
    ]);

    setLoading(false);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        text: "Chatbot service error."
      }
    ]);

    setLoading(false);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (

<div
  style={{
    width: "100%",
    maxWidth: 350,
    height: "100%",
    maxHeight: 520,
    background: "white",
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Poppins",
    animation: "chatOpen 0.35s ease"
  }}
  className="chatbot-container"
>

{/* HEADER */}

<div
style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  borderBottom: "1px solid #eee",
  background: "#f7f9f8",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20
}}
>

<div style={{ display: "flex", gap: 10, alignItems: "center" }}>

<img
src={icon}
alt="logo"
style={{
  width: 36,
  height: 36,
  borderRadius: "50%"
}}
/>

<div>
<div style={{
  fontWeight: 600,
  fontSize: 18,
  color: "#1B5E44"
}}>
Herbalin
</div>

<div style={{
  fontSize: 12,
  color: "#777"
}}>
Always here to help
</div>
</div>

</div>

<div
  onClick={onClose}
  style={{
    fontSize: 20,
    cursor: "pointer",
    fontWeight: "bold",
    color: "#1B5E44",
    transition: "0.3s"
  }}
  onMouseEnter={(e) => (e.target.style.color = "#154635")}
  onMouseLeave={(e) => (e.target.style.color = "#1B5E44")}
>
  ✕
</div>

</div>

{/* CHAT AREA */}

<div
ref={chatRef}
style={{
  flex: 1,
  overflowY: "auto",
  padding: 14,
  backgroundImage: `url(${bg})`,
  backgroundSize: "250px",
  backgroundRepeat: "repeat"
}}
>

{messages.map((msg, index) => (

<div
key={index}
style={{
  display: "flex",
  justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
  marginBottom: 14,
  alignItems: "flex-start"
}}
>

{msg.type === "bot" && (
<img
src={icon}
alt="bot"
style={{
  width: 28,
  height: 28,
  borderRadius: "50%",
  marginRight: 8
}}
/>
)}

<div
style={{
  position: "relative",
  maxWidth: "70%",
  padding: "10px 14px",
  borderRadius: 5,
  background: msg.type === "user" ? "#145A3B" : "#e9eeec",
  color: msg.type === "user" ? "white" : "#333",
  fontSize: 14
}}
>

<div style={{ lineHeight: "1.5" }}>
  {renderText(msg.text)}
</div>

{msg.type === "user" && (
<div
style={{
  position: "absolute",
  top: 2,
  right: -2,
  width: 12,
  height: 12,
  background: "#145A3B",
  transform: "rotate(35deg)"
}}
/>
)}

{msg.type === "bot" && (
<div
style={{
  position: "absolute",
  top: 3,
  left: -4,
  width: 12,
  height: 12,
  background: "#e9eeec",
  transform: "rotate(55deg)"
}}
/>
)}

</div>

</div>

))}

{loading && (
<div style={{
  display: "flex",
  alignItems: "center",
  paddingLeft: 35
}}>
<div className="typingBubble">
<span></span>
<span></span>
<span></span>
</div>
</div>
)}

</div>

{/* INPUT */}

<div style={{
  display: "flex",
  gap: 8,
  padding: "10px 12px",
  alignItems: "flex-end",
  borderTop: "1px solid #eee",
  background: "#fff"
}}>

<textarea
  rows={1}
  placeholder="Ask about skin disease..."
  value={userInput}
  onChange={(e) => {
    setUserInput(e.target.value);
    e.target.style.height = "45px";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }}
  onKeyDown={handleKeyDown}
  className="chat-input"
  style={{
    flex: 1,
    minWidth: 0,
    height: 45,
    minHeight: 45,
    maxHeight: 120,
    borderRadius: 22,
    border: "2px solid #ccc",
    padding: "11px 12px",
    outline: "none",
    fontFamily: "Poppins",
    fontSize: 13,
    lineHeight: "1.4",
    resize: "none",
    overflowY: "auto",
    boxSizing: "border-box",
    display: "block"
  }}
/>

<button
  onClick={sendMessage}
  className="send-btn"
  style={{
    width: 45,
    height: 45,
    borderRadius: "50%",
    border: "none",
    background: "#145A3B",
    color: "white",
    fontSize: 18,
    cursor: "pointer",
    transition: "background 0.3s",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
  onMouseEnter={(e) => (e.currentTarget.style.background = "#154635")}
  onMouseLeave={(e) => (e.currentTarget.style.background = "#145A3B")}
>
  ➤
</button>

</div>

<style>{`

.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 520px;
  z-index: 9999;
}

@media (max-width: 480px) {
  .chatbot-container {
    width: 100vw;
    height: 100vh;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }

  .chatbot-container > div:first-child {
    border-radius: 0;
  }

  .chatbot-container .chat-input {
    font-size: 14px !important;
    min-height: 50px !important;
    height: 50px !important;
    padding: 13px 12px !important;
    border-radius: 20px !important;
  }

  .chatbot-container .send-btn {
    width: 50px !important;
    height: 50px !important;
    font-size: 20px !important;
    flex-shrink: 0 !important;
  }
}

.chat-input:focus {
  border-color: #145A3B !important;
}

.chat-input::placeholder {
  color: #aaa;
  font-size: 13px;
}

.chatbot-container div[style*="overflowY"] {
  scrollbar-width: thin;
}

@keyframes chatOpen {
from {
  transform: translateY(40px) scale(0.95);
  opacity: 0;
}
to {
  transform: translateY(0px) scale(1);
  opacity: 1;
}
}

.typingBubble {
display: flex;
gap: 4px;
background: #e9eeec;
padding: 8px 10px;
border-radius: 12px;
}

.typingBubble span {
width: 6px;
height: 6px;
background: #777;
border-radius: 50%;
animation: typing 1.4s infinite;
}

.typingBubble span:nth-child(2) {
animation-delay: 0.2s;
}

.typingBubble span:nth-child(3) {
animation-delay: 0.4s;
}

@keyframes typing {
0% { opacity: 0.3; transform: translateY(0); }
50% { opacity: 1; transform: translateY(-3px); }
100% { opacity: 0.3; transform: translateY(0); }
}

`}</style>

</div>

);
}