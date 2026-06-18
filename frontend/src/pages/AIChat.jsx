import { useState } from "react";
import api from "../services/api";

function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = {
      role: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMsg]);

    try {
      const res = await api.post("/ai-diagnosis", {
        message,
      });

      const aiMsg = {
        role: "assistant",
        text: `${res.data.diagnosis}
Confidence: ${res.data.confidence}`,
      };

      setChat((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    }

    setMessage("");
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>🤖 AI Diagnosis Assistant</h1>

      <div
        style={{
          height: "500px",
          overflowY: "auto",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "15px",
              textAlign:
                msg.role === "user"
                  ? "right"
                  : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "12px",
                borderRadius: "12px",
                background:
                  msg.role === "user"
                    ? "#2563eb"
                    : "#1e293b",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Enter symptoms..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AIChat;