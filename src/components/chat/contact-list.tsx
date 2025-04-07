"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"


type Contact = {
  id: string
  mentor: {
    id: string
    mentorName: string | null
    user : {
      avatarUrl: string   | null
      name : string | null
    }
  }
  student: {
    id: string
    studentName: string | null
    user : {
      avatarUrl: string | null
      name : string | null

    }
  }
  lastMessage: string
  mentorUnreadCount: number
  studentUnreadCount: number
  createdAt: Date
  updatedAt: Date
}

interface ContactListProps {
  chatRooms: Contact[]
  selectedChatRoom: string | null
  onSelectChat: (chatRoomId: string) => void
  showDashboardButton?: boolean
  userRole : "MENTOR" | "STUDENT" | "USER" | "STARTUP"
}

export default function ContactList({
  chatRooms,
  selectedChatRoom,
  onSelectChat,
  showDashboardButton,
  userRole
}: ContactListProps) {
  const viewerRole = userRole

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold">Messages</h1>
        {showDashboardButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/dashboard")}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatRooms?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No conversations yet</div>
        ) : (
          <ul className="divide-y">
            {chatRooms?.map((chatRoom) => {
              const contact = viewerRole === "MENTOR" ? chatRoom.student : chatRoom.mentor
              const unreadCount = viewerRole === "MENTOR" ? chatRoom.mentorUnreadCount : chatRoom.studentUnreadCount

              return (
                <li
                  key={chatRoom.id}
                  onClick={() => onSelectChat(chatRoom.id)}
                  className={cn(
                    "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                    selectedChatRoom === chatRoom.id && "bg-gray-100",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={contact.user.avatarUrl!} alt={"avatar url"} />
                      <AvatarFallback>{contact?.user?.name}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{contact.user.name}</h3>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(chatRoom.updatedAt, { addSuffix: true })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600 truncate">{chatRoom.lastMessage}</p>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="rounded-full px-2 py-0.5 text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

