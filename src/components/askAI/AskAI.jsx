import React, { useState, useEffect, useRef } from "react";
import "../../App.css";
import bg1 from "../assets/bg1.png";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const AskAi = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I am your Studify AI assistant. What can I do for you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    const fetchWithBackoff = async (retries = 3, delay = 1000) => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/genai/sent-message",
          {
            message: input,
          }
        );

        const botMessage = { text: response.data.reply, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = {
          text: "Sorry, something went wrong.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    await fetchWithBackoff();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend(e);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${bg1})` }}>
      <div className="app-layout">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          ))}

          {isLoading && (
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input  
            type="text"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskAi;
