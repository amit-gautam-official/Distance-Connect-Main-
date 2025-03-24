"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/trpc/react";
import { Loader2, ImagePlus, Send, ChevronDown } from "lucide-react";
import { getAblyChannel } from "@/lib/ably";

type InitialMessage = {
  message: string | null;
  type: string;
  id: string;
  senderId?: string;
  createdAt: Date;
  senderRole: string;
  imagePath: string | null;
  imageUrl?: string;
};

export default function Chat({
  chatRoomId,
  initialMessages,
  userId,
}: {
  chatRoomId: string;
  initialMessages: InitialMessage[];
  userId: string;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get the user role from the db
  const { data: userRoleData } = api.user.getUserRole.useQuery();

  // Update user role when data is available
  useEffect(() => {
    if (userRoleData) {
      setUserRole(userRoleData);
    }
  }, [userRoleData]);

  const sendMessage = api.chat.sendMessage.useMutation({
    onSuccess: async () => {
      setMessage("");
      setImagePreview(null);
    },
  });

  useEffect(() => {
    // Only subscribe to Ably channel if we have a valid chatRoomId
    if (!chatRoomId) return;

    const channel = getAblyChannel(chatRoomId);

    // Subscribe to new messages
    channel.subscribe("message", (message) => {
      setMessages((prev) => [...prev, message.data]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [chatRoomId, userId]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Handle scroll events to show/hide scroll to bottom button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Show button when not at bottom (with some threshold)
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
      };
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendImage = () => {
    if (!imagePreview || !chatRoomId) return;
    sendMessage.mutate({
      chatRoomId,
      message: "📷 Image",
      file: imagePreview,
    });
    setImagePreview(null);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !chatRoomId) return;
    sendMessage.mutate({ chatRoomId, message });
    setMessage("");
  };

  // Format date to be more readable and mobile-friendly
  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(scrollToBottom, [messages]);

  // If no chatRoomId is provided, show a placeholder
  if (!chatRoomId) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white p-4 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-700">
          Select a conversation to start chatting
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Choose a mentor from the list to begin your conversation
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-full flex-col bg-gradient-to-b from-gray-50 to-white"
      ref={chatContainerRef}
    >
      {/* Chat messages area with subtle pattern background */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain p-2 pb-4 md:p-4"
        style={{
          scrollbarWidth: "thin",
          backgroundImage:
            "radial-gradient(circle, rgba(148, 163, 184, 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
        }}
      >
        <div className="space-y-3 md:space-y-4">
          {messages?.map((msg, idx) => {
            const isCurrentUser = msg.senderRole === userRole;
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const nextMsg =
              idx < messages.length - 1 ? messages[idx + 1] : null;
            const showSender =
              !prevMsg || prevMsg.senderRole !== msg.senderRole;
            const isLastInGroup =
              !nextMsg || nextMsg.senderRole !== msg.senderRole;

            // Get the appropriate display name for the sender
            const getSenderDisplayName = () => {
              if (isCurrentUser) return "You";
              if (msg.senderRole === "MENTOR") return "Mentor";
              if (msg.senderRole === "STUDENT") return "Student";
              return msg.senderRole; // Fallback
            };

            return (
              <div
                key={idx}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} ${
                  showSender ? "mt-3 md:mt-4" : "mt-1"
                }`}
              >
                <div className="max-w-[90%] md:max-w-[85%]">
                  {/* Show sender name for first message in a group */}
                  {showSender && (
                    <div
                      className={`mb-1 ${isCurrentUser ? "mr-2 text-right" : "ml-2"} text-xs font-medium text-gray-500`}
                    >
                      {getSenderDisplayName()}
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-2.5 shadow-sm md:p-3 ${
                      isCurrentUser
                        ? "rounded-br-sm bg-blue-500 text-white"
                        : "rounded-bl-sm bg-gray-100 text-gray-800"
                    }`}
                    style={{
                      borderRadius: isCurrentUser
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    }}
                  >
                    {msg.type === "IMAGE" ? (
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={msg.imageUrl}
                          alt="Image"
                          className="w-full rounded-lg"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <p className="break-words text-sm leading-relaxed md:text-base">
                        {msg.message}
                      </p>
                    )}

                    {/* Only show time for last message in a group */}
                    {isLastInGroup && (
                      <p
                        className={`mt-1 text-right text-xs ${
                          isCurrentUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-transform hover:bg-blue-600 active:scale-95 md:bottom-24"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}

      {/* Message input area */}
      <div className="border-t bg-white p-2 shadow-md md:p-4">
        {imagePreview && (
          <div className="relative mb-3 rounded-lg bg-gray-50 p-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-40 w-auto rounded-lg object-contain shadow-sm"
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute right-2 top-2 rounded-full bg-gray-800 bg-opacity-70 p-2 text-white transition-colors hover:bg-opacity-100"
              aria-label="Remove image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={handleSendImage}
              className="mt-2 w-full rounded-lg bg-blue-500 px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:py-2"
            >
              Send Image
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-shrink-0 rounded-full bg-gray-100 p-3 text-gray-600 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 md:p-2.5"
            aria-label="Attach image"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ImagePlus className="h-5 w-5" />
            )}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSendMessage()
            }
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-base transition-shadow focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 md:py-2.5 md:text-sm"
          />

          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || !chatRoomId}
            className="flex-shrink-0 rounded-full bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 md:p-2.5"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
