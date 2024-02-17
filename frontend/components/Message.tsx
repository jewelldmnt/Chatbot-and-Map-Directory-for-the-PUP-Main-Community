import React from "react";

interface MessageProps {
  type: string;
  text: string;
  time: string;
}

const Message: React.FC<MessageProps> = ({ type, text, time }) => {
  const isLink = (str: string) => {
    const regex = /(https?:\/\/[^\s]+)/g;
    return regex.test(str);
  };

  const renderTextWithLinks = (message: string) => {
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
