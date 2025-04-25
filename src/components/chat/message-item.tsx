"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { FileIcon } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import ImageModal from "./image-modal"
import { AvatarImage } from "@radix-ui/react-avatar"

interface Message {
  id: string
  senderId: string
  senderRole: string
  message: string | null
  chatRoomId: string
  imageName?: string | null
  imagePath?: string | null
  fileName?: string | null
  imageUrl? : string | null
  type: string
  createdAt: Date
  updatedAt: Date
  user:{
    image: string | null
    name: string | null
  }
}

interface MessageItemProps {
  message: Message
  isOwn: boolean
}

export default function MessageItem({ message, isOwn }: MessageItemProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  return (
    <>
      <div className={cn("flex gap-3 max-w-[80%]", isOwn ? "ml-auto flex-row-reverse" : "mr-auto")}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.user.image!} alt={"avatar url"} />
          <AvatarFallback>{message?.user?.name?.charAt(0)!}</AvatarFallback>
        </Avatar>        <div>
          <div className={cn("rounded-lg p-3", isOwn ? "bg-blue-500 text-white" : "bg-white border")}>
            {message.type === "TEXT" && message.message && <p className="whitespace-pre-wrap">{message.message}</p>}

            {message.type === "IMAGE" && message.imageUrl && (
              <div className="space-y-2">
                <div className="overflow-hidden rounded-md cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                  <img
                    src={message.imageUrl || "/placeholder.svg"}
                    alt={message.imageName || "Image"}
                    className="w-full h-48 object-cover"
                  />
                </div>
                {message.message && (
                  <p className={cn("whitespace-pre-wrap", isOwn ? "text-white" : "text-gray-700")}>{message.message}</p>
                )}
              </div>
            )}

            {message.type === "FILE" && message.fileName && (
              <div className={cn("flex items-center gap-2 p-2 rounded", isOwn ? "bg-blue-600" : "bg-gray-100")}>
                <FileIcon className={cn("h-5 w-5", isOwn ? "text-white" : "text-gray-500")} />
                <span className={cn("text-sm font-medium", isOwn ? "text-white" : "text-gray-700")}>
                  {message.fileName}
                </span>
              </div>
            )}
          </div>

          <div className={cn("text-xs text-gray-500 mt-1", isOwn ? "text-right" : "text-left")}>
            {format(message.createdAt, "h:mm a")}
          </div>
        </div>
      </div>

      {message.type === "IMAGE" && message.imageUrl && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageSrc={message.imageUrl!}
          imageAlt={message.imageName || "Image"}
        />
      )}
    </>
  )
}

