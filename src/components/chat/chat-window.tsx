"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Loader2,
  ImagePlus,
  Send,
  ChevronDown,
  Paperclip,
  FileText,
  Download
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { api } from "@/trpc/react"
import { useChannel } from "ably/react"
import * as Ably from "ably"
import { v4 as uuid } from "uuid"

type ChatRoom = {
  id: string
  mentor: {
    id: string
    mentorName: string | null
    user: {
      avatarUrl: string | null
      name: string | null
    }
  }
  student: {
    id: string
    studentName: string | null
    user: {
      avatarUrl: string | null
      name: string | null
    }
  }
  lastMessage: string
  mentorUnreadCount: number
  studentUnreadCount: number
  createdAt: Date
  updatedAt: Date
}

type Message = {
  id: string
  senderId: string
  senderRole: string
  message: string | null
  chatRoomId: string
  imageName?: string | null
  imagePath?: string | null
  fileName?: string | null
  type: string
  createdAt: Date
  updatedAt: Date
  imageUrl?: string | null
  user?: {
    avatarUrl: string | null
    name: string | null
  }
}

interface ChatWindowProps {
  chatRoom: ChatRoom
  onMessageSent: (message: Message) => void
  showChat: boolean
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>
  userRole: "MENTOR" | "STUDENT" | "USER" | "STARTUP"
  userId: string
}

export default function ChatWindow({ 
  chatRoom, 
  onMessageSent, 
  showChat, 
  setShowChat, 
  userRole,
  userId 
}: ChatWindowProps) {
  const [message, setMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isAblyConnected, setIsAblyConnected] = useState(false)
  const [isSendingFile, setIsSendingFile] = useState(false)
  const [newMessages, setNewMessages] = useState<Message[]>([])

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  
  // Create a client for Ably
  const standaloneClient = useRef<Ably.Realtime | null>(null)

  // Get messages from API
  const messageQuery = api.chat.getMessages.useQuery({
    chatRoomId: chatRoom?.id,
  })

  // Send message mutation
  const sendMessage = api.chat.sendMessage.useMutation({
    onSuccess: () => {
      setMessage("")
      setFilePreview(null)
      setFileName(null)
      setFileType(null)
    },
  })

  // Determine viewer information
  const viewerRole = userRole
  let viewerId = userId || "temp"

  if (!userId) {
    if (viewerRole === "MENTOR") {
      viewerId = chatRoom.mentor.id
    } else if (viewerRole === "STUDENT") {
      viewerId = chatRoom.student.id
    }
  }

  const contact = viewerRole === "MENTOR" ? chatRoom.student : chatRoom.mentor
  const allMessages : Message[] = [...(messageQuery.data || []), ...newMessages]
  const isMobile = useMobile()

  // Initialize Ably client
  useEffect(() => {
    if (typeof window !== "undefined" && !standaloneClient.current) {
      try {
        standaloneClient.current = new Ably.Realtime({
          authUrl: "/api/ably",
          autoConnect: true,
        })
      } catch (err) {
        console.error("Failed to initialize Ably:", err)
      }
    }

    return () => {
      if (standaloneClient.current) {
        standaloneClient.current.close()
      }
    }
  }, [])

  // Subscribe to Ably channel
  let channel: any = null
  let ably: any = null
  
  try {
    const result = useChannel(chatRoom.id, (message) => {
      if (message.data && message.data.id) {
        setNewMessages((prev) => {
          const messageExists = prev.some((msg) => msg.id === message.data.id)
          if (!messageExists) {
            return [...prev, message.data]
          }
          return prev
        })
      } else {
        setNewMessages((prev) => [...prev, message.data])
      }
      setIsAblyConnected(true)
    })
    channel = result.channel
    ably = result.ably
  } catch (error) {
    console.warn("Ably context not available, using standalone implementation")

    // Use standalone implementation when not in context
    useEffect(() => {
      if (!standaloneClient.current || !chatRoom.id) return

      try {
        const ablyChannel = standaloneClient.current.channels.get(chatRoom.id)

        const handleMessage = (message: any) => {
          if (message.data && message.data.id) {
            setNewMessages((prev) => {
              const messageExists = prev.some((msg) => msg.id === message.data.id)
              if (!messageExists) {
                return [...prev, message.data]
              }
              return prev
            })
          } else {
            setNewMessages((prev) => [...prev, message.data])
          }
        }

        ablyChannel.subscribe(handleMessage)
        setIsAblyConnected(true)

        return () => {
          ablyChannel.unsubscribe(handleMessage)
        }
      } catch (err) {
        console.error("Error with Ably channel:", err)
      }
    }, [chatRoom.id])
  }

  // Handle scroll events
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      // Show button when not at bottom (with some threshold)
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [chatRoom.id])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" })
  }, [chatRoom.id])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleBackToContacts = () => {
    if (isMobile) {
      setShowChat(false)
    }
  }

  const handleSendFile = async () => {
    if (!filePreview || !chatRoom.id) return
    
    setIsSendingFile(true)
    
    try {
      const chatMessage = await sendMessage.mutateAsync({
        chatRoomId: chatRoom.id,
        message: fileType === "image" ? "📷 Image" : "📄 Document",
        file: filePreview,
        fileName: fileName || undefined,
        fileType: fileType || undefined,
      })

      // Get image URL if needed
      let imageUrl = undefined
      if (chatMessage?.imagePath) {
        try {
          const response = await fetch("/api/storage/signed-url", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imagePath: chatMessage.imagePath }),
          })
          const data = await response.json()
          imageUrl = data.url
        } catch (error) {
          console.error("Error getting signed URL:", error)
        }
      }

      // Create message object
      const messageObj: Message = {
        id: chatMessage.id,
        senderId: viewerId,
        senderRole: viewerRole,
        message: chatMessage.message,
        chatRoomId: chatRoom.id,
        type: chatMessage.type,
        createdAt: chatMessage.createdAt,
        updatedAt: chatMessage.createdAt,
        imagePath: chatMessage.imagePath || null,
        fileName: chatMessage.fileName,
        imageUrl: imageUrl || undefined,
        user: {
          avatarUrl: contact.user.avatarUrl,
          name: contact.user.name,
        }
      }

      // Publish to Ably
      try {
        if (channel) {
          channel.publish({
            name: chatRoom.id,
            data: messageObj,
          })
        } else if (standaloneClient.current) {
          const ablyChannel = standaloneClient.current.channels.get(chatRoom.id)
          ablyChannel.publish({
            name: chatRoom.id,
            data: messageObj,
          })
        }
      } catch (err) {
        console.error("Error publishing message:", err)
      }

      // Add to local messages
      setNewMessages((prev) => [...prev, messageObj])

      // Notify parent component
      onMessageSent(messageObj)
      setIsSendingFile(false)
    } catch (error) {
      console.error("Error sending file:", error)
      setIsSendingFile(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !chatRoom.id) return

    try {
      const chatMessage = await sendMessage.mutateAsync({ 
        chatRoomId: chatRoom.id, 
        message 
      })

      // Get image URL if necessary
      let imageUrl = null
      if (chatMessage?.imagePath) {
        try {
          const response = await fetch("/api/storage/signed-url", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imagePath: chatMessage.imagePath }),
          })
          const data = await response.json()
          imageUrl = data.url
        } catch (error) {
          console.error("Error getting signed URL:", error)
        }
      }

      // Create message object
      const messageObj: Message = {
        id: chatMessage.id,
        senderId: viewerId,
        senderRole: viewerRole,
        message: chatMessage.message,
        chatRoomId: chatRoom.id,
        type: chatMessage.type,
        createdAt: chatMessage.createdAt,
        updatedAt: chatMessage.createdAt,
        imagePath: chatMessage.imagePath || null,
        fileName: chatMessage.fileName,
        imageUrl: imageUrl || undefined,
        user: {
          avatarUrl: contact.user.avatarUrl,
          name: contact.user.name,
        }
      }

      // Add to local messages
      setNewMessages((prev) => [...prev, messageObj])

      // Notify parent component
      onMessageSent(messageObj)

      // Publish to Ably
      try {
        if (channel) {
          channel.publish({
            name: chatRoom.id,
            data: messageObj,
          })
        } else if (standaloneClient.current) {
          const ablyChannel = standaloneClient.current.channels.get(chatRoom.id)
          ablyChannel.publish({
            name: chatRoom.id,
            data: messageObj,
          })
        }
      } catch (err) {
        console.error("Error publishing message:", err)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleFileUpload = (file: File) => {
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()

    reader.onload = (event) => {
      if (event.target?.result) {
        setFilePreview(event.target.result as string)
        setFileName(file.name)

        if (file.type.startsWith("image/")) {
          setFileType("image")
        } else {
          setFileType("document")
        }

        setIsUploading(false)
      }
    }

    reader.readAsDataURL(file)
  }

  // Format date to be more readable
  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          {isMobile && showChat && (
            <Button variant="ghost" size="sm" onClick={handleBackToContacts} className="flex items-center gap-1">
              <ArrowLeft size={16} />
            </Button>
          )}
          <Avatar>
            <AvatarImage src={contact.user.avatarUrl || ""} alt={contact.user.name || "User"} />
            <AvatarFallback>{contact.user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{contact.user.name || "User"}</h2>
          </div>
        </div>
        {isAblyConnected && (
          <div className="text-xs text-green-600">Connected</div>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {allMessages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">No messages yet. Start the conversation!</div>
        ) : (
          allMessages.map((message) => (
            <div 
              key={`${message.id}-${uuid()}`} 
              className={`flex ${message.senderRole === viewerRole ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.senderRole === viewerRole 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.type === "TEXT" && <div>{message.message}</div>}
                
                {message.type === "IMAGE" && (
                  <div className="space-y-2">
                    <img 
                      src={message?.imageUrl! || ""} 
                      alt="Shared image" 
                      className="rounded-md max-w-[300px] max-h-[300px] cursor-pointer object-contain"

                    />
                    {message.message && <div>{message.message}</div>}
                  </div>
                )}
                
                {message.type === "DOCUMENT" && (
                  <div className="flex items-center gap-2">
                    <FileText size={20} />
                    <span className="text-sm break-all">{message.fileName}</span>
                 
                       <a 
                       target="_blank"
                       href={message?.imageUrl!}
                       download={message.imageUrl}
                       className="ml-2 cursor-pointer"
                     >
                       <Download size={16} />
                     </a>
                
                 
                  </div>
                )}
                
                <div className={`text-xs mt-1 ${
                  message.senderRole === viewerRole ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {formatMessageTime(message.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-20 right-8">
          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-full shadow-md"
            onClick={scrollToBottom}
          >
            <ChevronDown size={16} />
          </Button>
        </div>
      )}

      {/* File preview */}
      {filePreview && (
        <div className="p-2 border-t bg-gray-50">
          <div className="flex items-center justify-between bg-white p-2 rounded-md border">
            {fileType === "image" ? (
              <div className="flex items-center">
                <div className="h-12 w-12 rounded overflow-hidden mr-2">
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <span className="text-sm truncate max-w-[200px]">{fileName}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <FileText size={24} className="mr-2 text-blue-500" />
                <span className="text-sm truncate max-w-[200px]">{fileName}</span>
              </div>
            )}
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setFilePreview(null)
                  setFileName(null)
                  setFileType(null)
                }}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSendFile}
                disabled={isSendingFile}
              >
                {isSendingFile ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <div className="absolute right-2 bottom-2 flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-blue-500"
              >
                <ImagePlus size={20} />
              </button>
              <button
                type="button"
                onClick={() => documentInputRef.current?.click()}
                className="text-gray-500 hover:text-blue-500"
              >
                <Paperclip size={20} />
              </button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={sendMessage.isPending || isSendingFile}
            size="icon"
          >
            <Send size={18} />
          </Button>
        </div>
        
        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload(file)
            e.target.value = "" // Reset input
          }}
        />
        <input
          type="file"
          ref={documentInputRef}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload(file)
            e.target.value = "" // Reset input
          }}
        />
      </div>
    </div>
  )
}