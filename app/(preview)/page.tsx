"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useAuthKit } from "@picahq/authkit";
import { Header } from "./components/Header";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";

export default function Home() {
  const [input, setInput] = useState('');

  const {
    messages,
    sendMessage,
    stop,
    status,
  } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input.trim() });
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSuggestedAction = (action: string) => {
    sendMessage({ text: action });
  };

  // Add new useEffect to focus after loading completes
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col justify-between h-dvh">
      <div className="flex flex-col h-full">
        <Header />
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput
          inputRef={inputRef}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          status={status}
          stop={stop}
          messages={messages}
          onSuggestedAction={handleSuggestedAction}
        />
      </div>
    </div>
  );
}
