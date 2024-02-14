// Chatbox.tsx
"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Message from "./Message";  // Import the Message component


interface MessageType {
  type: string;
  text: string;
  time: string;
}

// Create a custom hook for stateful logic
const useChatbox = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const str_time = hour + ":" + minute;

    // Update state with the user's message
    const userMessage: MessageType = {
      type: "user",
      text: message,
      time: str_time,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        const chatbotResponse = data.response;

        console.log("Received data from server:", data);
        console.log("Chatbot Response:", chatbotResponse);

        // Update state with the bot's message
        const botMessage: MessageType = {
          type: "bot",
          text: chatbotResponse,
          time: str_time,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }

    setMessage("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return { message, messages, handleSubmit, handleChange };
};

const Chatbox = React.memo(() => {
  const { message, messages, handleSubmit, handleChange } = useChatbox();

  return (
    <div className="container-fluid h-screen">
      <div className="flex justify-center h-[calc(100%-104px)]">
        <div className="md:w-8/12 xl:w-6/12 chat">
          <div style={{ height: "500px" }} className="card">
            <div
              style={{ padding: "12px 20px" }}
              className="rounded-tl-2xl rounded-tr-2xl border-b-0 relative"
            >
              <div className="flex bd-highlight">
                <div className="img_cont">
                  <img
                    src="pbot.png"
                    alt="P-Bot"
                    className="rounded-full user_img"
                  />
                  <span className="online_icon"></span>
                </div>
                <div className="user_info text-white">
                  <span>P-Bot</span>
                  <p>Ask me anything!</p>
                </div>
              </div>
            </div>
            <div
              id="messageFormeight"
              style={{ padding: "20px", height: "304px" }}
              className="overflow-y-auto h-304 w-650.5"
            >
              {messages.map((msg, index) => (
                <Message key={`${msg.type}-${index}`} type={msg.type} text={msg.text} time={msg.time} />
              ))}
            </div>
            <div className="overflow-hidden p-3 px-5 w-full h-auto">
              <form
                id="messageArea"
                className="flex items-center"
                onSubmit={handleSubmit}
              >
                <label htmlFor="text" className="sr-only">
                  Type your message
                </label>
                <input
                  type="text"
                  id="text"
                  name="msg"
                  placeholder="Type your message..."
                  autoComplete="off"
                  className="form-input type_msg p-1.5 px-3 w-full h-12 rounded-tl-[15px] rounded-bl-[15px]"
                  value={message}
                  onChange={handleChange}
                  required
                />
                <div className="h-15.5 input-group-append">
                  <button
                    style={{ height: "60px" }}
                    type="submit"
                    id="send"
                    className="input-group-text send_btn bg-info text-white p-1.5 px-3"
                  >
                    <FontAwesomeIcon icon={faLocationArrow} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
export default Chatbox;
