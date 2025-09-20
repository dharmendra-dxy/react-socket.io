'use client';

import { useRef, useState } from "react";
import ChatWindow from "@/components/chat-window";
import NameInput from "@/components/name-input";

export default function Home() {
  const timer = useRef(null);
  const socket = useRef(null);
  const [userName, setUserName] = useState('');
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [inputName, setInputName] = useState('');
  const [typers, setTypers] = useState([]);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');


  // handleNameSubmit:
  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) return;

    setUserName(trimmed);
    setShowNamePopup(false);
  }

  // SEND MESSAGE FUNCTION
  function sendMessage() {
    const t = text.trim();
    if (!t) return;

    // USER MESSAGE
    const msg = {
      id: Date.now(),
      sender: userName,
      text: t,
      ts: Date.now(),
    };
    setMessages((m) => [...m, msg]);

    // emit
    // socket.current.emit('chatMessage', msg);

    setText('');
  }

  // HANDLE ENTER KEY TO SEND MESSAGE
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4 font-inter">
      {/* ENTER YOUR NAME TO START CHATTING */}
      {showNamePopup && (
        <NameInput
          handleNameSubmit={handleNameSubmit}
          inputName={inputName}
          setInputName={setInputName}
        />
      )}``

      {/* CHAT WINDOW */}
      {!showNamePopup && (
        <ChatWindow
          typers={typers}
          userName={userName}
          messages={messages}
          text={text}
          setText={setText}
          handleKeyDown={handleKeyDown}
          sendMessage={sendMessage}
        />
      )}
    </div>
  )

}
