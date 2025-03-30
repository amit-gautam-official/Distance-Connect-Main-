"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  text: string;
  isUser: boolean;
}

const AIChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your AI Career Counselor. I can help you explore career paths, offer guidance on job applications, suggest skill development opportunities, or answer questions about various professions. How can I assist you today?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const generateGeminiResponse = async (prompt: string) => {
    try {
      // Initialize the Gemini API
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
      );

      // For text-only input, use the gemini-pro model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Build the career counselor system prompt
      const careerCounselorPrompt = `
        You are a professional career counselor with expertise in various industries, job roles, and educational pathways.
        Your goal is to provide personalized, empathetic, and practical advice to students about career planning.
        
        You should:
        - Ask clarifying questions if needed to provide better guidance
        - Provide specific, actionable advice tailored to the student's situation
        - Share relevant industry insights and trends
        - Suggest skills development opportunities and resources
        - Help with resume and interview preparation when asked
        - Be encouraging and supportive while being realistic about challenges
        - Format your responses using proper Markdown syntax for better readability
        - Use bullet points, headings, and other formatting when appropriate
        
        VERY IMPORTANT - FORMAT GUIDELINES:
        - Use markdown headings (## and ###) to organize your response
        - Use **bold** for emphasis on important points
        - Use bullet lists (*) or numbered lists (1.) for steps or multiple items
        - Use > blockquotes for important quotes or advice
        - Use \`code\` for specific terms, skills, or technical concepts
        - Use links [text](url) when recommending resources with URLs
        - Use tables for comparing options if relevant
        
        You should NOT:
        - Give generic "one-size-fits-all" advice
        - Promise specific outcomes or job placements
        - Make up statistics or facts
        - Encourage unethical behavior or shortcuts
        
        Current question from student: ${prompt}
      `;

      // Generate content using the career counselor system prompt
      const result = await model.generateContent(careerCounselorPrompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      return "I'm sorry, I encountered an error processing your request. Please try again later.";
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    // Add user message
    setMessages([...messages, { text: inputValue, isUser: true }]);
    setIsLoading(true);

    try {
      // Get AI response from Gemini
      const responseText = await generateGeminiResponse(inputValue);

      // Add AI response to messages
      setMessages((prev) => [...prev, { text: responseText, isUser: false }]);
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm sorry, I encountered an error. Please try again later.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
      setInputValue("");
    }
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
                  {message.isUser ? (
                    message.text
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-1 prose-headings:mt-2 prose-p:mb-1 prose-p:mt-1 prose-ul:mb-1 prose-ul:mt-1 prose-li:mb-0.5 prose-li:mt-0.5">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              className="text-blue-600 underline hover:text-blue-800"
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          ),
                          code: ({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }: any) => {
                            return inline ? (
                              <code
                                className="rounded bg-gray-200 px-1 py-0.5 text-sm"
                                {...props}
                              >
                                {children}
                              </code>
                            ) : (
                              <code
                                className="block overflow-x-auto rounded-md bg-gray-200 p-2 text-sm"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          pre: ({ children }: any) => (
                            <pre className="my-2 overflow-x-auto rounded-md bg-gray-800 p-4 text-white">
                              {children}
                            </pre>
                          ),
                          table: ({ children }: any) => (
                            <div className="my-2 overflow-x-auto">
                              <table className="min-w-full border-collapse border border-gray-300">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({ children }: any) => (
                            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium">
                              {children}
                            </th>
                          ),
                          td: ({ children }: any) => (
                            <td className="border border-gray-300 px-4 py-2">
                              {children}
                            </td>
                          ),
                          blockquote: ({ children }: any) => (
                            <blockquote className="my-2 border-l-4 border-blue-500 pl-4 italic">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] items-start">
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
                <div className="rounded-lg rounded-bl-none bg-gray-100 p-3 text-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="flex items-center rounded-full border p-1">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about career advice..."
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isLoading}
        />
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-1 h-8 w-8"
            disabled={isLoading}
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
            disabled={isLoading}
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
