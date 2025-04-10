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
        process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyDAyKyppuLVnd8mLyYpIudOe3STcVw2Qng",
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
    <div className="flex h-[100dvh] m-auto w-[100%] flex-col bg-white p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-[#3b5998] px-6 py-3">
        <div className="flex items-center">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b5998"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 16.3c0-2.8 2.2-5 5-5s5 2.2 5 5" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AI Career Counselor</h1>
            <div className="flex items-center">
              <div className="mr-1 h-2 w-2 rounded-full bg-green-400"></div>
              <p className="text-xs text-gray-100">Online | Ready to assist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat messages area with circuit board pattern background */}
      <div 
        ref={scrollAreaRef} 
        className="relative flex-1 overflow-y-auto bg-white p-6"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 89, 152, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 89, 152, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[80%] items-start ${!message.isUser && "group"}`}>
                {!message.isUser && (
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#3b5998] bg-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3b5998"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 16.3c0-2.8 2.2-5 5-5s5 2.2 5 5" />
                      </svg>
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
                    </div>
                  </div>
                )}
                <div
                  className={`rounded-lg p-4 shadow-md transition-all duration-200 ${
                    message.isUser
                      ? "rounded-br-none bg-[#3b5998] text-white"
                      : "rounded-bl-none border border-gray-200 bg-white text-gray-800 group-hover:border-[#3b5998]/30"
                  }`}
                  style={{
                    clipPath: message.isUser 
                      ? "polygon(0% 0%, 100% 0%, 100% 95%, 95% 100%, 0% 100%)" 
                      : "polygon(0% 0%, 100% 0%, 100% 100%, 5% 100%, 0% 95%)"
                  }}
                >
                  {message.isUser ? (
                    <div className="font-medium">{message.text}</div>
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-headings:mt-3 prose-headings:text-[#3b5998] prose-p:mb-2 prose-p:mt-2 prose-p:leading-relaxed prose-ul:mb-2 prose-ul:mt-2 prose-li:mb-1 prose-li:mt-1">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              className="font-medium text-[#3b5998] underline decoration-[#3b5998]/30 underline-offset-2 transition-colors hover:text-[#3b5998]/80"
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
                                className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-[#3b5998]"
                                {...props}
                              >
                                {children}
                              </code>
                            ) : (
                              <code
                                className="block overflow-x-auto rounded-md bg-gray-100 p-3 text-sm font-mono"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          pre: ({ children }: any) => (
                            <pre className="my-3 overflow-x-auto rounded-md bg-gray-800 p-4 text-white">
                              {children}
                            </pre>
                          ),
                          table: ({ children }: any) => (
                            <div className="my-3 overflow-x-auto rounded-md border border-gray-200">
                              <table className="min-w-full border-collapse">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({ children }: any) => (
                            <th className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-left font-medium text-[#3b5998]">
                              {children}
                            </th>
                          ),
                          td: ({ children }: any) => (
                            <td className="border-b border-gray-100 px-4 py-2">
                              {children}
                            </td>
                          ),
                          blockquote: ({ children }: any) => (
                            <blockquote className="my-3 border-l-4 border-[#3b5998] bg-[#3b5998]/5 px-4 py-2 italic">
                              {children}
                            </blockquote>
                          ),
                          h2: ({ children }: any) => (
                            <h2 className="mb-2 mt-4 border-b border-gray-100 pb-1 text-lg font-bold text-[#3b5998]">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }: any) => (
                            <h3 className="mb-1.5 mt-3 text-base font-bold text-[#3b5998]">
                              {children}
                            </h3>
                          ),
                          ul: ({ children }: any) => (
                            <ul className="my-2 list-disc pl-5 marker:text-[#3b5998]">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }: any) => (
                            <ol className="my-2 list-decimal pl-5 marker:text-[#3b5998]">
                              {children}
                            </ol>
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
                <div className="mr-3 mt-1 flex-shrink-0">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#3b5998] bg-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3b5998"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="10" r="3" />
                      <path d="M7 16.3c0-2.8 2.2-5 5-5s5 2.2 5 5" />
                    </svg>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
                  </div>
                </div>
                <div className="rounded-lg rounded-bl-none border border-gray-200 bg-white p-4 shadow-md"
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 5% 100%, 0% 95%)"
                  }}
                >
                  <div className="flex space-x-2">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#3b5998]"></div>
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#3b5998] opacity-75" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#3b5998] opacity-50" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-100 bg-white p-4">
        <div className="flex items-center rounded-full border-2 border-gray-200 bg-white p-1 shadow-sm transition-all duration-300 focus-within:border-[#3b5998] focus-within:shadow-md">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about career advice..."
            className="border-0 bg-transparent px-4 focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <div className="flex items-center pr-1">
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 h-10 w-10 rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#3b5998]"
              disabled={isLoading}
              onClick={() => {
                // Handle attachment or file sharing in the future
              }}
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
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-[#3b5998] text-white transition-transform duration-300 hover:scale-105 hover:bg-[#3b5998]/90 active:scale-95"
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
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between px-2">
          <div className="flex items-center text-xs text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-3.5 w-3.5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>DistanceConnect</span>
          </div>
          <div className="text-xs text-gray-400">
            {inputValue.length > 0 ? `${inputValue.length} characters` : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;