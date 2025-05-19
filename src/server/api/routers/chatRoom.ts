import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const chatRoomRouter = createTRPCRouter({
 
//create a chat room



getChatRoomByBothId: protectedProcedure
    .input(z.object({
        mentorUserId: z.string().optional().nullable(),
    }))
    .query(({ ctx, input }) => {

        if (!input.mentorUserId) {
            return null;
        }
        return ctx.db.chatRoom.findFirst({
            where: {
                mentorUserId: input.mentorUserId,
                studentUserId: ctx.dbUser!.id,
            },
            select : {
                id: true,
                lastMessage: true,
                mentorUnreadCount: true,
                studentUnreadCount: true,
                createdAt: true,
                updatedAt: true,
                mentor : {
                    select : {
                        id: true,
                        mentorName : true,
                        user : {
                            select : {
                                image : true,
                                name : true,
                                
                            }
                        }
                    }
                },
                student : {
                    select : {
                        id: true,
                        studentName : true,
                        user : {
                            select : {
                                image : true,
                                name    : true,
                            }
                        }
                    }
                }
            }
        });
    }
),

getChatRoomByBothId2: protectedProcedure
    .input(z.object({
        studentId: z.string().optional().nullable(),
    }))
    .query(({ ctx, input }) => {

        if (!input.studentId) {
            return null;
        }
        return ctx.db.chatRoom.findFirst({
            where: {
                mentorUserId: ctx.dbUser!.id,
                studentUserId: input.studentId,
            },
            select : {
                id: true,
                lastMessage: true,
                mentorUnreadCount: true,
                studentUnreadCount: true,
                createdAt: true,
                updatedAt: true,
                mentor : {
                    select : {
                        id: true,
                        mentorName : true,
                        user : {
                            select : {
                                image : true,
                                name : true,
                                
                            }
                        }
                    }
                },
                student : {
                    select : {
                        id: true,
                        studentName : true,
                        user : {
                            select : {
                                image : true,
                                name    : true,
                            }
                        }
                    }
                }
            }
        });
    }
),

createChatRoomByMentorId: protectedProcedure
    .input(z.object({
        mentorUserId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
        // Check if the student has a scheduled meeting with this mentor
        const scheduledMeeting = await ctx.db.scheduledMeetings.findFirst({
            where: {
                mentorUserId: input.mentorUserId,
                studentUserId: ctx.dbUser!.id,
                paymentStatus: true, // Ensure payment is completed
            },
        });

        if (!scheduledMeeting) {
            throw new Error("You must book a meeting with this mentor before starting a chat");
        }

        // Check if today is after the meeting day
        const meetingDate = new Date(scheduledMeeting.selectedDate);
        meetingDate.setHours(23, 59, 59); // End of the meeting day
        const now = new Date();

        if (now > meetingDate) {
            throw new Error("Chat is only available until the end of your meeting day");
        }

        // Check if the chat room already exists
        const existingChatRoom = await ctx.db.chatRoom.findFirst({
            where: {
                mentorUserId: input.mentorUserId,
                studentUserId: ctx.dbUser!.id,
            },
        });

        if (existingChatRoom) {
            return existingChatRoom;
        }

        // Create a new chat room if it doesn't exist
        return ctx.db.chatRoom.create({
            data: {
                mentorUserId: input.mentorUserId,
                studentUserId: ctx.dbUser!.id,
                lastMessage: "",
                mentorUnreadCount: 0,
                studentUnreadCount: 0,
            },
            select: {
                id: true,
                lastMessage: true,
                mentorUnreadCount: true,
                studentUnreadCount: true,
                createdAt: true,
                updatedAt: true,
                mentor : {
                    select : {
                        id: true,
                        mentorName : true,
                        user : {
                            select : {
                                image : true,
                                name : true,
                                
                            }
                        }
                    }
                },
                student : {
                    select : {
                        id: true,
                        studentName : true,
                        user : {
                            select : {
                                image : true,
                                name    : true,
                            }
                        }
                    }
                }
            }
        });
    }
),

createChatRoom: protectedProcedure
    .input(z.object({
        mentorUserId: z.string(),
    }))
    .mutation(({ ctx, input }) => {
        return ctx.db.chatRoom.create({
            data: {
                mentorUserId: input.mentorUserId,
                studentUserId : ctx.dbUser!.id,
                lastMessage: "",
                mentorUnreadCount: 0,
                studentUnreadCount: 0,

            },
            select: {
                id: true,
                lastMessage: true,
               studentUnreadCount: true,
                mentor : {
                    select : {
                        mentorName : true,
                    }
                },
                student : {
                    select : {
                        studentName : true,
                    }
                }
            }
        });
    }),
    
createChatRoomByStudentId: protectedProcedure
.input(z.object({
    studentUserId: z.string(),
}))
.mutation(({ ctx, input }) => {
    return ctx.db.chatRoom.create({
        data: {
            mentorUserId: ctx.dbUser!.id,
            studentUserId : input.studentUserId,
            lastMessage: "",
            mentorUnreadCount: 0,
            studentUnreadCount: 0,

        },
        select: {
            id: true,
            lastMessage: true,
           studentUnreadCount: true,
            mentor : {
                select : {
                    mentorName : true,
                }
            },
            student : {
                select : {
                    studentName : true,
                }
            }
        }
    });
}),

//get chat room by mentor id
getChatRoomById: protectedProcedure
    .input(z.object({
        mentorUserId: z.string(),
    }))
    .query(({ ctx, input }) => {
        return ctx.db.chatRoom.findFirst({
            where: {
                mentorUserId: input.mentorUserId,
                studentUserId: ctx.dbUser!.id,
            },
            select : {
                id : true,
                lastMessage : true,
                mentorUnreadCount : true,
                studentUnreadCount : true,
                student : true 
            }
        });
    }),

    getChatRoomByMentorAndStudentId: protectedProcedure
    .input(z.object({
        mentorUserId: z.string(),
    }))
    .query(({ ctx, input }) => {
        return ctx.db.chatRoom.findFirst({
            where: {
                mentorUserId: input.mentorUserId,
                studentUserId: ctx.dbUser!.id,
            },
            select: {
                id: true,
                lastMessage: true,
               studentUnreadCount: true,
                mentor : {
                    select : {
                        mentorName : true,
                    }
                },
                student : {
                    select : {
                        studentName : true,
                    }
                }
            }
        });
    }),

    getChatRoomByMentorId: protectedProcedure
    .query(({ ctx }) => {
        return ctx.db.chatRoom.findMany({
            where: {
                mentorUserId: ctx.dbUser!.id,
            },
            select: {
                id: true,
                lastMessage: true,
                mentorUnreadCount: true,
                
                mentor : {
                    select : {
                        mentorName : true,
                    }
                },
                student : {
                    select : {
                        id: true,
                        studentName : true,
                        user : {
                            select : {
                                image : true
                            }
                        }
                    }
                }
            }
        });
    }),

    getChatRoomByStudentBackendId: protectedProcedure
    .query(({ ctx }) => {
        return ctx.db.chatRoom.findMany({
            where: {
                studentUserId: ctx.dbUser!.id,

            },
        
            select: {
                id: true,
                student : {
                    select : {
                        studentName : true,
                        id: true
                    }
                },
                lastMessage : true,
                studentUnreadCount : true,
                mentor : {
                    select : {
                        mentorName : true,
                        id: true
                    }
                }
            }   
        });
    }),

    getChatRoomByStudentId: protectedProcedure
    .input(z.object({
        studentUserId: z.string(),
    }))
    .query(({ ctx, input }) => {
        return ctx.db.chatRoom.findFirst({
            where: {
                studentUserId: input.studentUserId,
                mentorUserId: ctx.dbUser!.id,
            },
            select: {
                id: true,
                lastMessage: true,
               studentUnreadCount: true,
                mentor : {
                    select : {
                        mentorName : true,
                    }
                },
                student : {
                    select : {
                        studentName : true,
                    }
                }
            }
        });
    }),

    mentorUnreadCountToZero : protectedProcedure
    .input(z.object({
        chatRoomId : z.string(),
    }))
    .mutation(({ctx, input}) => {
        return ctx.db.chatRoom.update({
            where: {
                id: input.chatRoomId,
            },
            data: {
                mentorUnreadCount : 0,
            },
        });
    }),

    studentUnreadCountToZero : protectedProcedure
    .input(z.object({
        chatRoomId : z.string(),
    }))
    .mutation(({ctx, input}) => {
        return ctx.db.chatRoom.update({
            where: {
                id: input.chatRoomId,
            },
            data: {
                studentUnreadCount : 0,
            },
        });
    }),


    
    
    getChatRoomByBackendId: protectedProcedure
    .query(async ({ ctx }) => {
        if (ctx.dbUser!.role === "STUDENT") {
            // Get all valid scheduled meetings for this student
            const scheduledMeetings = await ctx.db.scheduledMeetings.findMany({
                where: {
                    studentUserId: ctx.dbUser!.id,
                    paymentStatus: true,
                },
                select: {
                    mentorUserId: true,
                    selectedDate: true,
                },
            });

            // Extract mentor IDs and create a map of mentor to meeting date
            const mentorMeetings: Record<string, Date> = {};
            
            scheduledMeetings.forEach(meeting => {
                if (!meeting.selectedDate) return;
                const meetingDate = new Date(meeting.selectedDate);
                
                // Keep the latest meeting date for each mentor
                if (!mentorMeetings[meeting.mentorUserId]) {
                    mentorMeetings[meeting.mentorUserId] = meetingDate;
                } else {
                    const existingDate = new Date(mentorMeetings[meeting.mentorUserId]!);
                    if (meetingDate > existingDate) {
                        mentorMeetings[meeting.mentorUserId] = meetingDate;
                    }
                }
            });

            const mentorIds = Object.keys(mentorMeetings);
            
            // Only get chat rooms for mentors the student has meetings with
            const studentChatRooms = await ctx.db.chatRoom.findMany({
                where: {
                    studentUserId: ctx.dbUser!.id,
                    mentorUserId: { in: mentorIds.length > 0 ? mentorIds : ["none"] },
                },
                select: {
                    id: true,
                    lastMessage: true,
                    mentorUnreadCount: true,
                    studentUnreadCount: true,
                    createdAt: true,
                    updatedAt: true,
                    mentorUserId: true,
                    mentor: {
                        select: {
                            id: true,
                            mentorName: true,
                            user: {
                                select: {
                                    image: true,
                                    name: true,
                                }
                            }
                        }
                    },
                    student: {
                        select: {
                            id: true,
                            studentName: true,
                            user: {
                                select: {
                                    image: true,
                                    name: true,
                                }
                            }
                        }
                    }
                }
            });

            // Filter chat rooms based on meeting day
            const now = new Date();
            const validChatRooms = studentChatRooms.filter(chatRoom => {
                if (!chatRoom.mentorUserId || !mentorMeetings[chatRoom.mentorUserId]) return false;
                
                // Since we've already checked that mentorMeetings[chatRoom.mentorUserId] exists and is a Date
                const meetingDate = new Date(mentorMeetings[chatRoom.mentorUserId]!.valueOf());
                meetingDate.setHours(23, 59, 59); // End of meeting day
                return now <= meetingDate;
            });

            return validChatRooms;
        }
        
        // For mentors, show all chat rooms
        const mentorChatRooms = await ctx.db.chatRoom.findMany({
            where: {
                mentorUserId: ctx.dbUser!.id,
            },
            select: {
                id: true,
                lastMessage: true,
                mentorUnreadCount: true,
                studentUnreadCount: true,
                createdAt: true,
                updatedAt: true,
                mentor : {
                    select : {
                        id: true,
                        mentorName : true,
                        user : {
                            select : {
                                image : true,
                                name : true,
                                
                            }
                        }
                    }
                },
                student : {
                    select : {
                        id: true,
                        studentName : true,
                        user : {
                            select : {
                                image : true,
                                name    : true,
                            }
                        }
                    }
                }
            }
        });

        if(ctx.dbUser!.role === "MENTOR"){
            return mentorChatRooms;
        }
        
        // For any other role (should never reach here due to the if conditions above)
        throw new Error("Not authorized to get chat rooms");
    
    })




    
  })

