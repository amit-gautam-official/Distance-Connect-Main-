import React, { useEffect } from "react";
import ChatRoom from "../../ChatRooms";
interface ChatRoom {
  id: string;
  student: {
    studentName: string | null;
  };
  lastMessage: string;
  studentUnreadCount: number;
  mentor: {
    mentorName: string | null;
  };
}

const ChatRooms = ({
  chatRooms,
  selectedChatRoom,
  setSelectedChatRoom,
}: {
  chatRooms: ChatRoom[];
  selectedChatRoom: ChatRoom | null;
  setSelectedChatRoom: (room: ChatRoom) => void;
}) => {
  // Debug: Log when selectedChatRoom changes
  useEffect(() => {
    console.log(
      "Parent component - Selected Chat Room ID:",
      selectedChatRoom?.id,
    );
  }, [selectedChatRoom]);

  // If no chat rooms, show empty state
  if (chatRooms.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          When you connect with mentors, your conversations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {chatRooms.map((chatRoom) => (
        <ChatRoom
          key={chatRoom.id}
          room={chatRoom}
          selectedChatRoom={selectedChatRoom}
          setSelectedChatRoom={setSelectedChatRoom}
        />
      ))}
    </div>
  );
};

export default ChatRooms;
