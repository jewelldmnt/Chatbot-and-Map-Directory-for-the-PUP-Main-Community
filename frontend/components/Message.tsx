/**
 * Message.tsx - React component for displaying chat messages.
 *
 * This component renders a chat message, including the message text, sender type (user or bot),
 * and the timestamp of the message.
 *
 * @file This file contains the Message component.
 * @lastmodified Feb 15, 2024
 */

import React from "react";

interface MessageProps {
  type: string;
  text: string;
  time: string;
}

const Message: React.FC<MessageProps> = ({ type, text, time }) => {
  /**
   * Message - React functional component for displaying chat messages.
   *
   * @param {MessageProps} props - The properties of the message.
   * @returns {JSX.Element} The JSX representation of the Message component.
   */

  const isLink = (str: string) => {
    /**
     * Checks if a given string is a link.
     *
     * @param {string} str - The string to check for being a link.
     * @returns {boolean} True if the string is a link, false otherwise.
     */
    const regex = /(https?:\/\/[^\s]+)/g;
    return regex.test(str);
  };

  const renderTextWithLinks = (message: string) => {
    /**
     * Renders the message text with hyperlinks styled in blue and underlined.
     *
     * @param {string} message - The message text to render.
     * @returns {JSX.Element[]} An array of JSX elements representing the message text.
     */
    return message.split(" ").map((word, index) => (
      <React.Fragment key={index}>
        {isLink(word) ? (
          <a
            href={word}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline", color: "blue" }}
          >
            {word}{" "}
          </a>
        ) : (
          `${word} `
        )}
      </React.Fragment>
    ));
  };

  return (
    <div
      className={`flex mb-4 ${
        type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {type === "bot" && (
        <div className="img_cont_msg aspect-square">
          <img
            src={`/pbot.png`}
            alt="P-Bot"
            className="rounded-full user_img_msg"
          />
        </div>
      )}

      <div
        className={`${
          type === "user" ? "msg_container_send" : "msg_container"
        }`}
        style={type === "bot" ? { maxWidth: "75%" } : {}}
      >
        {renderTextWithLinks(text)}
        <span className={type === "user" ? "msg_time_send" : "msg_time"}>
          {time}
        </span>
      </div>

      {type === "user" && (
        <div className="img_cont_msg aspect-square">
          <img
            src={`/isko.png`}
            alt="User"
            className="rounded-full user_img_msg"
          />
        </div>
      )}
    </div>
  );
};

export default Message;
