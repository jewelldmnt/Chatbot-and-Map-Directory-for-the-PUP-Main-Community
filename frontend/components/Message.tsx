/*
  Message.tsx - React component for displaying chat messages.

  This component renders a chat message, including the message text, sender type (user or bot),
  and the timestamp of the message.

  Last edited: Feb 15, 2024
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
   * @param {MessageProps} param0 - The properties of the message.
   * @returns {JSX.Element} The JSX representation of the Message component.
   */
  return (
    <div
      className={`flex mb-4 ${
        type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {type === "bot" && (
        <div className="img_cont_msg">
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
      >
        {text}
        <span className={type === "user" ? "msg_time_send" : "msg_time"}>
          {time}
        </span>
      </div>

      {type === "user" && (
        <div className="img_cont_msg">
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
