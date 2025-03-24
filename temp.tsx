//mentor-dashboard/page.tsx

// import { api } from "@/trpc/server";
// import Link from "next/link";
// import React from "react";
// // import ChatRooms from "./_components/chatRooms";

// const Page = async () => {
//   const chatRooms = await api.chatRoom.getChatRoomByMentorId();
//   //console.log(chatRooms);

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
//       </div>

//       {/* Chatrooms Section */}
//       <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         {chatRooms.map((room) => (
//           <ChatRooms key={room.id} room={room} />
//         ))}
//       </section>

//       {/* Footer / Navigation */}
//       <footer className="mt-8">
//         <Link href="/mentor-dashboard/meeting">
//           <div className="inline-block rounded bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">
//             Go to Meeting
//           </div>
//         </Link>
//       </footer>
//     </div>
//   );
// };

// export default Page;
