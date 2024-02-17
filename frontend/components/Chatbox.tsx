/*
  Chatbox.tsx - React component for handling chat functionality.

  This component defines a chatbox interface allowing users to interact with a chatbot.
  It includes user input, message display, and communication with a server for chatbot responses.

  Last edited: Feb 15, 2024
*/

"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Message from "./Message"; 

interface MessageType {
  type: string;
  text: string;
  time: string;
}

const useChatbox = () => {
  /**
   * useChatbox - Custom React hook for managing chatbox stateful logic.
   *
   * This hook manages the state and logic related to the chatbox, including user input,
   * chatbot responses, and form submission.
   *
   * @returns {{
   *   message: string,
   *   messages: MessageType[],
   *   handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
   *   handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
   * }}
   */

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    /**
     * handleSubmit - Handles form submission, sends user message to the server, and updates state with bot's response.
     *
     * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
     * @returns {Promise<void>}
     */
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
    /**
     * handleChange - Updates the message state when the user types in the input field.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
     * @returns {void}
     */
    setMessage(event.target.value);
  };
  return { message, messages, handleSubmit, handleChange };
};

const Chatbox = React.memo(() => {
  /**
   * Chatbox - React memoized component for rendering the chatbox interface.
   *
   * @returns {JSX.Element}
   */
  const { message, messages, handleSubmit, handleChange } = useChatbox();

  return (
    <div className="container-fluid h-screen">
      <div className="flex justify-center h-[calc(100%-104px)]">
        <div className="md:w-8/12 xl:w-6/12 chat">
          <div className="card h-[500px]">
            <div className="rounded-tl-2xl rounded-tr-2xl border-b-0 relative p-[12px] px-[20px] ">
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
              className="overflow-y-auto h-[304px] w-650.5 p-[20px]"
            >
              {messages.map((msg, index) => (
                <Message
                  key={`${msg.type}-${index}`}
                  type={msg.type}
                  text={msg.text}
                  time={msg.time}
                />
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
                    type="submit"
                    id="send"
                    className="input-group-text send_btn bg-info text-white p-1.5 px-3 h-[60px]"
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
