"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

interface Message {
  text: string;
  isUser: boolean;
}

const AIChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! How's it going? What can I help you with today?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    setMessages([...messages, { text: inputValue, isUser: true }]);

    // Simulate AI response
    setTimeout(() => {
      let responseText = "";

      // Hard-coded response for "Why Cubism was revolutionary?" question
      if (inputValue.toLowerCase().includes("cubism")) {
        responseText =
          "Cubism challenged traditional notions of perspective and representation in art. Instead of imitating nature, it emphasized how we perceive and interpret the world. Its impact is still felt in contemporary art and design.";
      } else {
        responseText =
          "I understand your question. Let me think about that for a moment...";
      }

      setMessages((prev) => [...prev, { text: responseText, isUser: false }]);
    }, 1000);

    setInputValue("");
  };

  return (
    <div className="mx-auto flex h-screen w-[calc(100vw-260px)] flex-col p-4">
      {/* Chat messages area */}
      <div ref={scrollAreaRef} className="mb-4 flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div className="flex max-w-[80%] items-start">
                {!message.isUser && (
                  <div className="mr-2 mt-0.5 flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-gray-500"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 16.3c0-2.8 2.2-5 5-5s5 2.2 5 5" />
                      </svg>
                    </div>
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.isUser
                      ? "rounded-br-none bg-[#3b5998] text-white"
                      : "rounded-bl-none bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="flex items-center rounded-full border p-1">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="AI Career Assistance"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-1 h-8 w-8"
            onClick={() => {}}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-[#3b5998] text-white"
            onClick={handleSendMessage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m5 12 14 0" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
