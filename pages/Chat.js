import React, { useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";

export default function Chat() {
  const [messages, setMessages] = useState([]);

  const handleSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{
        _id: 1,
      }}
    />
  );
}