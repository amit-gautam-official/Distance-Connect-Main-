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
    .query(({ ctx }) => {
    
        const studentChatRooms = ctx.db.chatRoom.findMany({
            where: {
                studentUserId: ctx.dbUser!.id,
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
        const mentorChatRooms = ctx.db.chatRoom.findMany({
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
        }else if(ctx.dbUser!.role === "STUDENT"){
            return studentChatRooms;
        }
        throw new Error("Not authorized to get chat rooms");
    
    })




    
  })

