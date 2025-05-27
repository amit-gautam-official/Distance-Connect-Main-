import { z } from "zod";
import { createCallerFactory, createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { Role, Prisma } from "@prisma/client";
import { generateMeetLink } from "@/lib/services/generate-meet-link";
import { fileRouter } from "./file"; // Import fileRouter
import { TRPCError } from "@trpc/server"; // Import TRPCError

// Define a Zod schema for the structure of a single meet link entry
const MeetLinkEntrySchema = z.object({
  link: z.string(),
  scheduledFor: z.string(), // ISO date string
  generated: z.string(),   // ISO date string
});

export const workshopRouter = createTRPCRouter({
  // Create a new workshop (mentor only)
  createWorkshop: protectedProcedure
    .input(z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      numberOfDays: z.number().int().min(1, "Workshop must have at least 1 day"),
      bannerImage: z.string().optional(),
      scheduleType: z.enum(["recurring", "custom"]),
      startDate: z.string().optional(), // ISO string for recurring schedule start date
      schedule: z.array(
        z.union([
          // Recurring schedule (day and time)
          z.object({
            day: z.string(),
            time: z.string(),
          }),
          // Custom schedule (specific date and time)
          z.object({
            date: z.string(), // ISO date string
            time: z.string(),
          })
        ])
      ),
      price: z.number().int().min(0, "Price cannot be negative"),
      learningOutcomes: z.array(z.string()),
      courseDetails: z.record(z.object({ description: z.string().min(1, "Session description cannot be empty."), isFreeSession: z.boolean() })), // Corrected schema
      otherDetails: z.string().optional(),
      mentorGmailId: z.string().email(), // Changed to required
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user is a mentor
      if (ctx.dbUser?.role !== Role.MENTOR) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only mentors can create workshops" });
      }

      // Validate schedule based on scheduleType
      if (input.scheduleType === "recurring" && !input.startDate) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Start date is required for recurring schedules" });
      }

      return ctx.db.workshop.create({
        data: {
          name: input.name,
          description: input.description,
          numberOfDays: input.numberOfDays,
          bannerImage: input.bannerImage,
          scheduleType: input.scheduleType,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          schedule: input.schedule,
          price: input.price,
          learningOutcomes: input.learningOutcomes,
          courseDetails: input.courseDetails,
          otherDetails: input.otherDetails || "",
          mentorUserId: ctx.dbUser.id,
          mentorGmailId: input.mentorGmailId, // Now directly passed as it's required
        },
      });
    }),

  // Update a workshop (mentor only)
  updateWorkshop: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(3, "Name must be at least 3 characters").optional(),
      description: z.string().min(10, "Description must be at least 10 characters").optional(),
      numberOfDays: z.number().int().min(1, "Workshop must have at least 1 day").optional(),
      bannerImage: z.string().optional(),
      scheduleType: z.enum(["recurring", "custom"]).optional(),
      startDate: z.string().optional(), // ISO string for recurring schedule start date
      schedule: z.union([
        // Recurring schedule (day and time)
        z.array(z.object({
          day: z.string(),
          time: z.string(),
        })),
        // Custom schedule (specific date and time for each session)
        z.array(z.object({
          date: z.string(), // ISO date string
          time: z.string(),
        }))
      ]).optional(),
      price: z.number().int().min(0, "Price cannot be negative").optional(),
      learningOutcomes: z.array(z.string()).optional(),
      courseDetails: z.record(z.object({ description: z.string().min(1, "Session description cannot be empty."), isFreeSession: z.boolean() })).optional(), // Updated schema
      otherDetails: z.string().optional(),
      meetLinks: z.record(MeetLinkEntrySchema).optional(), // Refined from z.any()
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user is a mentor
      if (ctx.dbUser?.role !== Role.MENTOR) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only mentors can update workshops" });
      }

      // Verify the workshop belongs to the mentor
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.id },
      });

      if (!workshop || workshop.mentorUserId !== ctx.dbUser.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to update this workshop" });
      }

      const updateData: Prisma.WorkshopUpdateInput = {};

      // Standard field updates
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.numberOfDays !== undefined) updateData.numberOfDays = input.numberOfDays;
      if (input.bannerImage !== undefined) updateData.bannerImage = input.bannerImage;
      if (input.price !== undefined) updateData.price = input.price;
      if (input.learningOutcomes !== undefined) updateData.learningOutcomes = input.learningOutcomes;
      if (input.courseDetails !== undefined) updateData.courseDetails = input.courseDetails;
      if (input.otherDetails !== undefined) updateData.otherDetails = input.otherDetails;

      // Handle scheduleType and startDate carefully
      if (input.scheduleType !== undefined) {
        updateData.scheduleType = input.scheduleType;
        if (input.scheduleType === "custom") {
          updateData.startDate = null; // Custom schedules don't have a global start date
        } else if (input.scheduleType === "recurring") {
          // If type is changing to recurring, startDate might be in input or not.
          // If input.startDate is provided, it will be handled below.
          // If input.startDate is not provided, existing startDate might persist or be null based on schema.
        }
      }

      // Handle startDate based on effective schedule type
      // input.startDate can be string (date or empty) or undefined.
      if (input.startDate !== undefined) { 
        const effectiveScheduleType = input.scheduleType ?? workshop.scheduleType;
        if (effectiveScheduleType === "recurring") {
          // Allow setting to null if input.startDate is an empty string
          updateData.startDate = input.startDate && input.startDate.trim() !== "" ? new Date(input.startDate) : null;
        } else {
          // If effective type is custom, but startDate was sent, ensure it's nulled.
          // This case is also covered if input.scheduleType was 'custom'.
          if (updateData.scheduleType === 'custom') { // Check if scheduleType was set to custom in this update
             updateData.startDate = null;
          } else if (workshop.scheduleType === 'custom' && input.scheduleType === undefined){
             // If existing type is custom and not being changed, but startDate is sent, nullify it.
             updateData.startDate = null;
          }
        }
      }

      if (input.schedule !== undefined) {
        updateData.schedule = input.schedule;
      }

      // Reset meetLinks if scheduleType changes, as meeting generation logic might differ
      if (input.scheduleType !== undefined && input.scheduleType !== workshop.scheduleType) {
        updateData.meetLinks = null; // Using Prisma.DbNull for JSON field might be more explicit if needed, but null should work.
      }
      // Consider if meetLinks should also be reset if only startDate or schedule array changes significantly.
      // For now, only scheduleType change triggers reset.

      return ctx.db.workshop.update({
        where: { id: input.id },
        data: updateData,
      });
    }),

  // Delete a workshop (mentor only)
  deleteWorkshop: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user is a mentor
      if (ctx.dbUser?.role !== Role.MENTOR) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only mentors can delete workshops" });
      }

      // Verify the workshop belongs to the mentor
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.id },
      });

      if (!workshop || workshop.mentorUserId !== ctx.dbUser.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to delete this workshop" });
      }

      // Delete all enrollments first
      await ctx.db.workshopEnrollment.deleteMany({
        where: { workshopId: input.id },
      });

      // Then delete the workshop
      return ctx.db.workshop.delete({
        where: { id: input.id },
      });
    }),

  // Get all workshops for a mentor (mentor only)
  getMentorWorkshops: protectedProcedure
    .query(async ({ ctx }) => {
      // Verify the user is a mentor
      if (ctx.dbUser?.role !== Role.MENTOR) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only mentors can access their workshops" });
      }

      return ctx.db.workshop.findMany({
        where: { mentorUserId: ctx.dbUser.id },
        include: {
          _count: {
            select: { enrollments: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),


    getWorkshopDetailsByIdForMentor: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.id },
        include: {
          mentor: {
            include: {
              user: true,
            },
          },
          enrollments: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      });
      if (!workshop || workshop.mentorUserId !== ctx?.dbUser?.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to view this workshop" });
      }
      return workshop;
    }),

    

  // Get a specific workshop by ID 
  getWorkshopById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.id },
        include: {
          mentor: {
            include: {
              user: true,
            },
          },
          enrollments: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      });
      if (!workshop) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workshop not found" });
      }
      const isWorkshopPaid = workshop.price > 0;
      const currentUserEnrollment = workshop.enrollments.find(
        (enrollment) => enrollment.student.userId === ctx?.dbUser?.id
      ) ?? null;

      let filteredMeetLinks: Record<string, { link: string; scheduledFor: string; generated: string }> | null = null;

      if (workshop.meetLinks && typeof workshop.meetLinks === 'object') {
        filteredMeetLinks = {}; // Initialize if meetLinks exist

        for (const dayKey of Object.keys(workshop.meetLinks)) {
          const meetLinkData = (workshop.meetLinks as Record<string, any>)[dayKey];
          if (!meetLinkData || !meetLinkData.link) continue;

          // Find the corresponding session detail from courseDetails
          const sessionKeyInCourseDetails = dayKey.startsWith('day') ? `Day ${dayKey.substring(3)}` : dayKey;
          const actualSessionDetail = (workshop.courseDetails as Record<string, { description: string; isFreeSession: boolean }>)[
            sessionKeyInCourseDetails
          ];

          if (!actualSessionDetail) {
            // If no specific session detail, assume it's part of the main workshop payment structure
            if (isWorkshopPaid) {
              if (currentUserEnrollment && currentUserEnrollment.paymentStatus) {
                filteredMeetLinks[dayKey] = meetLinkData;
              }
            } else { // Free workshop
              if (currentUserEnrollment) {
                filteredMeetLinks[dayKey] = meetLinkData;
              }
            }
            continue; // Move to next meet link
          }

          const isSessionActuallyFree = actualSessionDetail.isFreeSession === true;

          if (isSessionActuallyFree) {
            // Free session: only requires enrollment
            if (currentUserEnrollment) {
              filteredMeetLinks[dayKey] = meetLinkData;
            }
          } else {
            // Not a free session (i.e., paid or part of overall workshop cost)
            if (isWorkshopPaid) {
              // Workshop itself is paid
              if (currentUserEnrollment && currentUserEnrollment.paymentStatus) {
                filteredMeetLinks[dayKey] = meetLinkData;
              }
            } else {
              // Workshop itself is free (this case implies the session is part of the free workshop)
              if (currentUserEnrollment) {
                filteredMeetLinks[dayKey] = meetLinkData;
              }
            }
          }
        }
        // If filteredMeetLinks is empty after processing, set it back to null
        if (Object.keys(filteredMeetLinks).length === 0) {
          filteredMeetLinks = null;
        }
      }

      return {
        ...workshop,
        meetLinks: filteredMeetLinks,
      };
    }),

  // Get all available workshops (public)
  getAllWorkshops: publicProcedure
    .query(async ({ ctx }) => {
      return ctx.db.workshop.findMany({
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: { enrollments: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Get all workshops for public listing
  getPublicWorkshops: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).nullish(), cursor: z.string().nullish() })) // Optional pagination
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10; // Default limit
      const { cursor } = input;
      const workshops = await ctx.db.workshop.findMany({
        take: limit + 1, // get an extra item to see if there's a next page
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          // Add any conditions for public workshops, e.g., published: true if you add such a field
        },
        select: {
          id: true,
          name: true,
          description: true, // Consider truncating this on the client for list view
          bannerImage: true,
          price: true,
          numberOfDays: true,
          scheduleType: true,
          schedule: true,
          startDate: true,
          introductoryVideoUrl: true,
          courseDetails: true,
          otherDetails: true,
          
          learningOutcomes: true, // Consider taking only a few for list view
          mentor: {
            select: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: { enrollments: true },
          },
          createdAt: true, // For sorting or display
        },
        orderBy: {
          createdAt: 'desc', // Or any other preferred order
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (workshops.length > limit) {
        const nextItem = workshops.pop(); // remove the extra item
        nextCursor = nextItem!.id;
      }
      return {
        workshops,
        nextCursor,
      };
    }),

  // Get a specific workshop by ID for public detailed view
  getPublicWorkshopById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          description: true,
          bannerImage: true,
          introductoryVideoUrl: true,
          price: true,
          numberOfDays: true,
          scheduleType: true,
          startDate: true,
          schedule: true, // This is JSON, client can parse
          learningOutcomes: true,
          courseDetails: true, // This is JSON, client can parse
          otherDetails: true,
          mentor: {
            select: {
              user: {
                select: {
                  id: true, // For linking to mentor's public profile if you have one
                  name: true,
                  image: true,
                },
              },
              bio: true,
              jobTitle: true,
              currentCompany: true,
              skills: true, // Added skills
            },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      });

      if (!workshop) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workshop not found" });
      }
      return workshop;
    }),

  // Enroll in a workshop (student only)
  enrollInWorkshop: protectedProcedure
    .input(z.object({ 
      workshopId: z.string(),
      studentGmailId: z.string().email({ message: "Invalid email address format." })
        .refine(email => email.toLowerCase().endsWith('@gmail.com'), {
          message: "Email must be a Gmail address (e.g., user@gmail.com)."
        }), 
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user is a student
      if (ctx.dbUser?.role !== Role.STUDENT) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only students can enroll in workshops" });
      }

      console.log("Input:", input);

      // Check if the workshop exists
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.workshopId },
      });
      if (!workshop) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workshop not found" });
      }

      // Check if already enrolled
      const existingEnrollment = await ctx.db.workshopEnrollment.findUnique({
        where: {
          workshopId_studentUserId: {
            workshopId: input.workshopId,
            studentUserId: ctx.dbUser.id,
          },
        },
      });

      if (existingEnrollment) {
        throw new TRPCError({ code: "CONFLICT", message: "You are already enrolled in this workshop" });
      } 

      const isFreeWorkshop = workshop.price === 0;

      return ctx.db.workshopEnrollment.create({
        data: {
          workshopId: input.workshopId,
          studentUserId: ctx.dbUser.id,
          studentGmailId: input.studentGmailId,
          paymentStatus: isFreeWorkshop, // Set paymentStatus to true if workshop is free
        },
      });
    }),

  // Get enrolled workshops for a student (student only)
  getEnrolledWorkshops: protectedProcedure
    .query(async ({ ctx }) => {
      // Verify the user is a student
      if (ctx.dbUser?.role !== Role.STUDENT) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only students can access their enrolled workshops" });
      }
      return ctx.db.workshopEnrollment.findMany({
        where: {
          studentUserId: ctx.dbUser.id,
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          workshop: {
            include: {
              mentor: {
                include: {
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Get students enrolled in a workshop (mentor only)
  getWorkshopEnrollments: protectedProcedure
    .input(z.object({ workshopId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify the user is a mentor
      if (ctx.dbUser?.role !== Role.MENTOR) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only mentors can view workshop attendees" });
      }

      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.workshopId },
      });

      if (!workshop || workshop.mentorUserId !== ctx.dbUser.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to view attendees for this workshop" });
      }

      return ctx.db.workshopEnrollment.findMany({
        where: {
          workshopId: input.workshopId,
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Upload workshop introductory video (mentor only)
  uploadWorkshopIntroVideo: protectedProcedure
    .input(z.object({
      workshopId: z.string(),
      video: z.object({
        fileName: z.string(),
        fileType: z.string(),
        base64Content: z.string(),
      }),
      currentVideoUrl: z.string().optional(), // To delete the old video if replacing
    }))
    .mutation(async ({ ctx, input }) => {
      const { workshopId, video, currentVideoUrl } = input;

      // 1. Verify the user is a mentor
      if (ctx.dbUser?.role !== Role.MENTOR) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only mentors can upload workshop videos." });
      }

      // 2. Verify the workshop exists and belongs to the mentor
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: workshopId },
      });

      if (!workshop) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workshop not found." });
      }

      if (workshop.mentorUserId !== ctx.dbUser.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not authorized to modify this workshop." });
      }
      console.log("Video:", video);
      // 3. Call the file upload router using createCaller
      const createCaller = createCallerFactory(fileRouter)
      const fileCaller = createCaller(ctx)
      try {
      const uploadResult = await fileCaller.upload({
        bucketName: "dc-public-files",
        folderName: "dc-ws-intro-video",
        fileName: video.fileName,
        fileType: video.fileType,
        fileContent: video.base64Content,
        initialAvatarUrl: currentVideoUrl, // Pass current URL to delete old video
      });

      if (!uploadResult.success) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Video upload failed. Please try again." });
      }

      // 4. Update the workshop with the new video URL
      return ctx.db.workshop.update({
        where: { id: workshopId },
        data: { introductoryVideoUrl: uploadResult.url },
      });
    } catch (error) {
      console.log("Error uploading video:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Video upload failed. Please try again.",
      });
    }
    }),

  // Generate meeting link for a workshop (mentor only)
  generateWorkshopMeetLink: protectedProcedure
    .input(z.object({ 
      workshopId: z.string(),
      dayIndex: z.number().int().optional(), // Optional day index (1-based), if not provided generates for first day
      forceGenerate: z.boolean().optional(), // Optional flag to force generation (for admin use)
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user is a mentor
      if (ctx.dbUser?.role !== Role.MENTOR && ctx.dbUser?.role !== Role.ADMIN) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only mentors can generate meeting links" });
      }

      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.workshopId },
        include: {
          mentor: { include: { user: true } },
          enrollments: { include: { student: { include: { user: true } } } },
          // courseDetails: true, // Removed: courseDetails is a direct JSON field, not a relation
        },
      });

      if (!workshop) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workshop not found." });
      }
      if (ctx.dbUser.role !== Role.ADMIN && workshop.mentorUserId !== ctx.dbUser.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not own this workshop." });
      }

      const { dayIndex } = input;
      // Get current date and time - we'll treat all times as if they're already in IST
      const now = new Date();
      
      console.log(`Current time: ${now.toISOString()}`);
      console.log(`Timezone offset: ${now.getTimezoneOffset()} minutes`);
      
      // Get day to generate link for (default to first day)
      const dayIndexToUse = dayIndex || 1;
      if (dayIndexToUse < 1 || dayIndexToUse > workshop.numberOfDays) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Invalid day index: ${dayIndexToUse}. Must be between 1 and ${workshop.numberOfDays}` });
      }
      
      // Check if the workshop schedule is defined
      if (!workshop.schedule || !(workshop.schedule as any[]).length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Workshop schedule is not defined" });
      }
      
      let targetDate: Date;
      
      // Handle different schedule types
      if (workshop.scheduleType === "custom") {
        // For custom schedule, each item has a specific date and time
        if (dayIndexToUse > (workshop.schedule as any[]).length) {
          throw new TRPCError({ code: "BAD_REQUEST", message: `Day ${dayIndexToUse} is not defined in the custom schedule` });
        }
        
        // Get the specific schedule item for this day
        const scheduleItem = workshop.schedule[dayIndexToUse - 1];
        
        // Safely extract date and time values
        const scheduleDate = typeof scheduleItem === 'object' && scheduleItem !== null && 'date' in scheduleItem
          ? String(scheduleItem.date)
          : '';
        
        const scheduleTime = typeof scheduleItem === 'object' && scheduleItem !== null && 'time' in scheduleItem
          ? String(scheduleItem.time)
          : '';
        
        if (!scheduleDate || !scheduleTime) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid custom schedule format: missing date or time" });
        }
        
        // Create date from the specific date and time in IST
        targetDate = new Date(scheduleDate);
        
        // Parse the time (assuming format like "10:00 AM")
        const [hourMin, period] = scheduleTime.split(' ');
        if (!hourMin) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid time format in workshop schedule" });
        }
        
        const [hour, minute] = hourMin.split(':').map(Number);
        
        let hours = hour || 0;
        if (period === 'PM' && hour !== 12) hours += 12;
        if (period === 'AM' && hour === 12) hours = 0;
        
        // Set time in IST
        targetDate.setHours(hours, minute || 0, 0, 0);
        
        // Log the target date in IST
        console.log(`Target date (IST): ${targetDate.toString()}`);
      } else {
        // For recurring schedule, calculate based on start date and day pattern
        const dayMap: Record<string, number> = {
          "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, 
          "Thursday": 4, "Friday": 5, "Saturday": 6
        };
        
        // Get the start date if available, otherwise use current date
        const startDate = workshop.startDate ? new Date(workshop.startDate) : new Date();
        
        // Create an ordered list of workshop days based on the start date
        const workshopDays: {day: number; scheduleIndex: number; date: Date}[] = [];
        
        // First, determine the first occurrence of each scheduled day after the start date
        for (let i = 0; i < (workshop.schedule as any[]).length; i++) {
          const scheduleItem = workshop.schedule[i];
          
          // Safely extract the day and time values
          const scheduleDay = typeof scheduleItem === 'object' && scheduleItem !== null && 'day' in scheduleItem
            ? String(scheduleItem.day) : '';
          
          const scheduleTime = typeof scheduleItem === 'object' && scheduleItem !== null && 'time' in scheduleItem
            ? String(scheduleItem.time) : '';
          
          if (!scheduleDay || !scheduleTime) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid recurring schedule format: missing day or time" });
          }
          
          // Get the day of week for this schedule item
          const dayOfWeek = dayMap[scheduleDay];
          if (dayOfWeek === undefined) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid day in workshop schedule" });
          }
          
          // Calculate days to add to reach this day from the start date
          const startDayOfWeek = startDate.getDay();
          let daysToAdd = 0;
          
          // If the day is before or equal to the start day of week, find the next occurrence
          if (dayOfWeek < startDayOfWeek) {
            daysToAdd = 7 - (startDayOfWeek - dayOfWeek);
          } else if (dayOfWeek > startDayOfWeek) {
            daysToAdd = dayOfWeek - startDayOfWeek;
          } else {
            // Same day of week as start date
            // If the workshop starts today, count today as day 1
            daysToAdd = 0;
          }
          
          // Create a date for this workshop day
          const workshopDate = new Date(startDate);
          workshopDate.setDate(startDate.getDate() + daysToAdd);
          
          // Parse the time (assuming format like "10:00 AM")
          const [hourMin, period] = scheduleTime.split(' ');
          if (!hourMin) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid time format in workshop schedule" });
          }
          
          const [hour, minute] = hourMin.split(':').map(Number);
          
          let hours = hour || 0;
          if (period === 'PM' && hour !== 12) hours += 12;
          if (period === 'AM' && hour === 12) hours = 0;
          
          workshopDate.setHours(hours, minute || 0, 0, 0);
          
          workshopDays.push({
            day: dayOfWeek,
            scheduleIndex: i,
            date: workshopDate
          });
        }
        
        // Sort workshop days by date
        workshopDays.sort((a, b) => a.date.getTime() - b.date.getTime());
        
        // Now calculate the date for the specific day index
        if (dayIndexToUse <= 0 || !workshopDays.length) {
          throw new TRPCError({ code: "BAD_REQUEST", message: `Invalid day index: ${dayIndexToUse}` });
        }
        
        // For day 1, return the first scheduled day
        if (dayIndexToUse === 1 && workshopDays.length > 0) {
          targetDate = new Date(workshopDays[0]?.date || 0);
        } else if (workshopDays.length > 0) {
          // For subsequent days, calculate based on the pattern
          const daysBetweenSessions = 7; // Assuming weekly recurrence
          
          // Calculate which occurrence of the pattern we need
          const occurrenceIndex = Math.floor((dayIndexToUse - 1) / workshopDays.length);
          const patternIndex = (dayIndexToUse - 1) % workshopDays.length;
          
          // Get the pattern day (ensure it exists)
          const patternDay = workshopDays[patternIndex];
          if (!patternDay) {
            throw new TRPCError({ code: "BAD_REQUEST", message: `Could not determine schedule for day ${dayIndexToUse}` });
          }
          
          // Calculate the date
          targetDate = new Date(patternDay.date);
          targetDate.setDate(targetDate.getDate() + (occurrenceIndex * daysBetweenSessions));
        } else {
          throw new TRPCError({ code: "BAD_REQUEST", message: "No valid workshop days found in schedule" });
        }
        
        // The time is already set in the targetDate calculation above
        // No need to set the date or parse time again
      }
      
      // Determine if the session is free
      const courseDayKey = `day${dayIndexToUse}`;
      const courseDetailsRecord = workshop.courseDetails as Record<string, { description: string, isFreeSession: boolean }> | null | undefined;
      const dayCourseDetail = courseDetailsRecord && courseDetailsRecord[courseDayKey] ? courseDetailsRecord[courseDayKey] : null;
      const isFreeSession = dayCourseDetail ? dayCourseDetail.isFreeSession : false;

      // Meeting links can now be generated at any time by authorized users.
      
      // Get the attendees for the meeting
      const attendees = [];
      
      // Add enrolled students conditionally
      for (const enrollment of workshop.enrollments) {
        if (enrollment.studentGmailId) { // Student must have a Gmail ID
          if (isFreeSession) { // If the session is free, add the student
            attendees.push({ email: enrollment.studentGmailId });
          } else { // If the session is paid
            if (enrollment.paymentStatus === true) { // And student has paid
              attendees.push({ email: enrollment.studentGmailId });
            }
          }
        }
      }
      
      // Add the mentor
      if (workshop.mentorGmailId) {
        attendees.push({ email: workshop.mentorGmailId });
      } else if (workshop.mentorUserId === ctx.dbUser?.id && ctx.dbUser?.email) { // Check if current user is the mentor
        attendees.push({ email: ctx.dbUser.email });
      }
      
      // Check if we have any attendees (mentor should always be one if available)
      if (attendees.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST", 
          message: "No attendees could be added for this meeting. Ensure the mentor's Gmail ID is set and, for paid sessions, that students have completed payment."
        });
      }
      
      // Call the meet router to generate a meeting link
      const result = await generateMeetLink({
        dateTime: targetDate.toISOString(),
        duration: 60, // 1 hour per session
        attendees,
      });
      
      // Get current meetLinks or initialize if null
      const currentMeetLinks = (workshop.meetLinks as Record<string, typeof MeetLinkEntrySchema._type>) || {};
      const updatedMeetLinks = { ...currentMeetLinks };
      
      // Store the generated link for this day
      const sessionKey = `day${dayIndexToUse}`;
      updatedMeetLinks[sessionKey] = {
        link: result.meetLink,
        scheduledFor: targetDate.toISOString(),
        generated: new Date().toISOString()
      };
      
      // Update the workshop with the meeting links
      await ctx.db.workshop.update({
        where: { id: input.workshopId },
        data: { meetLinks: updatedMeetLinks as any }, // Added 'as any' for Prisma JSON type compatibility
      });
      
      return { 
        dayIndex: dayIndexToUse,
        meetLink: result.meetLink,
        scheduledFor: targetDate.toISOString()
      };
    }),
});
