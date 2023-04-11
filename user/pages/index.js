import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import io from "socket.io-client";
import { useState, useEffect } from 'react';


const socket = io("https://chat-app-kztb.vercel.app");

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    socket.emit("send_message", { message: message });
    setMessage("");
  };

  socket.on("received_message", (data) => {
    console.log(data);
    setList([...list, data]);
  })

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username && message) {
      socket.emit('chatMessage', { username, message });
      setMessage("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>チャットルーム</h2>
      </div>
      <div className={styles.messages}>
        {messages.map((message, index) => (
          <div key={index} className={styles.message}>
            <strong>{message.username}:</strong> {message.message}
          </div>
        ))}
      </div>
      <div className={styles.chatInputBotton}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="名前"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="ここにメッセージ内容を入力"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className={styles.input}
        />
        <button onClick={() => handleSendMessage()}>
          送信
        </button>
      </form>
      {list.map((chat) => (
        <div clsaaName={styles.chatArea} key={chat.message}>
          {chat.message}
        </div>
      ))}
      </div>
    </div>
  );
}