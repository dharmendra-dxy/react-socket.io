'use client';

import { useEffect, useRef, useState } from "react";
import ChatWindow from "@/components/chat-window";
import NameInput from "@/components/name-input";
import { connectWebSocket } from "@/socket";

export default function Home() {

  const timer = useRef(null);

  const socket: any = useRef(null);

  const [userName, setUserName] = useState('');
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [inputName, setInputName] = useState('');
  const [typers, setTypers] = useState<string[]>([]);

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  // connect with socket:
  useEffect(() => {
    socket.current = connectWebSocket();

    socket.current.on("connect", () => {

      socket.current.on("roomNotice", () => {
        console.log(`${userName} has joined the group - client`);
      });

      socket.current.on("chatMessage", (msg: any) => {
        // push message to existing list:
        console.log("message [client] - ", msg);
        setMessages((prev) => [...prev, msg]);
      })

      socket.current.on("typing", (userName: string) => {
        setTypers((prev) => {
          const isExist = prev.find((typer) => typer === userName);
          if (!isExist) return [...prev, userName];

          return prev;
        });
      })

      socket.current.on("stopTyping", (userName: string) => {
        setTypers((prev) => prev.filter((typer) => typer !== userName));
      })

    });

    // clean-up all the socket
    return () => {
      socket.current.off("roomNotice");
      socket.current.off("chatMessage");
      socket.current.off("typing");
      socket.current.off("stopTyping");
    }

  }, [])

  useEffect(() => {
    if (text) {
      socket.current.emit("typing", userName);
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      socket.current.emit("stopTyping", userName);
    }, 1000);

  }, [text, userName]);

  // handleNameSubmit:
  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) return;

    // join room when submit occurs:
    socket.current.emit("joinRoom", trimmed);

    setUserName(trimmed);
    setShowNamePopup(false);
  }

  // sendMessage:
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
    setMessages((m: any) => [...m, msg]);

    // emit
    socket.current.emit('chatMessage', msg);

    setText('');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4 font-inter">
      {/* Name Input fields: */}
      {showNamePopup && (
        <NameInput
          handleNameSubmit={handleNameSubmit}
          inputName={inputName}
          setInputName={setInputName}
        />
      )}

      {/* Chat window: */}
      {!showNamePopup && (
        <ChatWindow
          typers={typers}
          userName={userName}
          messages={messages}
          text={text}
          setText={setText}
          sendMessage={sendMessage}
        />
      )}
    </div>
  )

}
