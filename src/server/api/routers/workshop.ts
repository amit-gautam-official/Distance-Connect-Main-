import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { Role } from "@prisma/client";
import { generateMeetLink } from "@/lib/services/generate-meet-link";

export const workshopRouter = createTRPCRouter({
  // Create a new workshop (mentor only)
  createWorkshop: protectedProcedure
    .input(z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      numberOfDays: z.number().int().min(1, "Workshop must have at least 1 day"),
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
      courseDetails: z.record(z.any()),
      otherDetails: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user is a mentor
      if (ctx.dbUser?.role !== Role.MENTOR) {
        throw new Error("Only mentors can create workshops");
      }

      // Validate schedule based on scheduleType
      if (input.scheduleType === "recurring" && !input.startDate) {
        throw new Error("Start date is required for recurring schedules");
      }

      return ctx.db.workshop.create({
        data: {
          name: input.name,
          description: input.description,
          numberOfDays: input.numberOfDays,
          scheduleType: input.scheduleType,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          schedule: input.schedule,
          price: input.price,
          learningOutcomes: input.learningOutcomes,
          courseDetails: input.courseDetails,
          otherDetails: input.otherDetails || "",
          mentorUserId: ctx.dbUser.id,
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
      courseDetails: z.record(z.any()).optional(),
      otherDetails: z.string().optional(),
      meetUrl: z.string().optional(),
      meetLinks: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user is a mentor
      if (ctx.dbUser?.role !== Role.MENTOR) {
        throw new Error("Only mentors can update workshops");
      }

      // Verify the workshop belongs to the mentor
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.id },
      });

      if (!workshop || workshop.mentorUserId !== ctx.dbUser.id) {
        throw new Error("Workshop not found or you don't have permission to update it");
      }

      // Validate schedule based on scheduleType
      if (input.scheduleType === "recurring" && input.startDate === "") {
        throw new Error("Start date is required for recurring schedules");
      }

      // Prepare update data
      const updateData: any = {};

      // Only update fields that are provided
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.numberOfDays !== undefined) updateData.numberOfDays = input.numberOfDays;
      if (input.scheduleType !== undefined) updateData.scheduleType = input.scheduleType;
      if (input.startDate !== undefined) {
        updateData.startDate = input.startDate ? new Date(input.startDate) : null;
      }
      if (input.schedule !== undefined) updateData.schedule = input.schedule;
      if (input.price !== undefined) updateData.price = input.price;
      if (input.learningOutcomes !== undefined) updateData.learningOutcomes = input.learningOutcomes;
      if (input.courseDetails !== undefined) updateData.courseDetails = input.courseDetails;
      if (input.otherDetails !== undefined) updateData.otherDetails = input.otherDetails;
      if (input.meetUrl !== undefined) updateData.meetUrl = input.meetUrl;
      if (input.meetLinks !== undefined) updateData.meetLinks = input.meetLinks;

      // If schedule type changes, clear existing meeting links
      if (input.scheduleType !== undefined && input.scheduleType !== workshop.scheduleType) {
        updateData.meetLinks = null;
      }

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
        throw new Error("Only mentors can delete workshops");
      }

      // Verify the workshop belongs to the mentor
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.id },
      });

      if (!workshop || workshop.mentorUserId !== ctx.dbUser.id) {
        throw new Error("Workshop not found or you don't have permission to delete it");
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
        throw new Error("Only mentors can access their workshops");
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

  // Get a specific workshop by ID (public)
  getWorkshopById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.workshop.findUnique({
        where: { id: input.id },
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
      });
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

  // Enroll in a workshop (student only)
  enrollInWorkshop: protectedProcedure
    .input(z.object({ 
      workshopId: z.string(),
      paymentStatus: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user is a student
      if (ctx.dbUser?.role !== Role.STUDENT) {
        throw new Error("Only students can enroll in workshops");
      }

      // Check if the workshop exists
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.workshopId },
      });

      if (!workshop) {
        throw new Error("Workshop not found");
      }

      // Check if the student is already enrolled
      const existingEnrollment = await ctx.db.workshopEnrollment.findFirst({
        where: {
          workshopId: input.workshopId,
          studentUserId: ctx.dbUser.id,
        },
      });

      if (existingEnrollment) {
        throw new Error("You are already enrolled in this workshop");
      }

      // Create the enrollment
      return ctx.db.workshopEnrollment.create({
        data: {
          workshopId: input.workshopId,
          studentUserId: ctx.dbUser.id,
          paymentStatus: input.paymentStatus,
        },
      });
    }),

  // Get enrolled workshops for a student (student only)
  getEnrolledWorkshops: protectedProcedure
    .query(async ({ ctx }) => {
      // Verify the user is a student
      if (ctx.dbUser?.role !== Role.STUDENT) {
        throw new Error("Only students can access their enrolled workshops");
      }

      return ctx.db.workshopEnrollment.findMany({
        where: {
          studentUserId: ctx.dbUser.id,
          paymentStatus: true,
        },
        include: {
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
        throw new Error("Only mentors can access workshop enrollments");
      }

      // Verify the workshop belongs to the mentor
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.workshopId },
      });

      if (!workshop || workshop.mentorUserId !== ctx.dbUser.id) {
        throw new Error("Workshop not found or you don't have permission to access it");
      }

      return ctx.db.workshopEnrollment.findMany({
        where: {
          workshopId: input.workshopId,
          paymentStatus: true,
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
        throw new Error("Only mentors can generate meeting links");
      }

      // Verify the workshop belongs to the mentor (unless admin)
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.workshopId },
        include: {
          mentor: {
            include: {
              user: { select: { email: true } },
            },
          },
          enrollments: {
            where: { paymentStatus: true },
            include: {
              student: {
                include: {
                  user: { select: { email: true } },
                },
              },
            },
          },
        },
      });

      if (!workshop) {
        throw new Error("Workshop not found");
      }
      
      // Only the workshop owner or an admin can generate links
      if (workshop.mentorUserId !== ctx.dbUser.id && ctx.dbUser?.role !== Role.ADMIN) {
        throw new Error("You don't have permission to access this workshop");
      }

      
      // Get current date and time
      const now = new Date();
      
      // Get day to generate link for (default to first day)
      const dayIndex = input.dayIndex || 1;
      if (dayIndex < 1 || dayIndex > workshop.numberOfDays) {
        throw new Error(`Invalid day index: ${dayIndex}. Must be between 1 and ${workshop.numberOfDays}`);
      }
      
      // Check if the workshop schedule is defined
      if (!workshop.schedule || !(workshop.schedule as any[]).length) {
        throw new Error("Workshop schedule is not defined");
      }
      
      let targetDate: Date;
      
      // Handle different schedule types
      if (workshop.scheduleType === "custom") {
        // For custom schedule, each item has a specific date and time
        if (dayIndex > (workshop.schedule as any[]).length) {
          throw new Error(`Day ${dayIndex} is not defined in the custom schedule`);
        }
        
        // Get the specific schedule item for this day
        const scheduleItem = workshop.schedule[dayIndex - 1];
        
        // Safely extract date and time values
        const scheduleDate = typeof scheduleItem === 'object' && scheduleItem !== null && 'date' in scheduleItem
          ? String(scheduleItem.date)
          : '';
        
        const scheduleTime = typeof scheduleItem === 'object' && scheduleItem !== null && 'time' in scheduleItem
          ? String(scheduleItem.time)
          : '';
        
        if (!scheduleDate || !scheduleTime) {
          throw new Error("Invalid custom schedule format: missing date or time");
        }
        
        // Create date from the specific date and time
        targetDate = new Date(scheduleDate);
        
        // Parse the time (assuming format like "10:00 AM")
        const [hourMin, period] = scheduleTime.split(' ');
        if (!hourMin) {
          throw new Error("Invalid time format in workshop schedule");
        }
        
        const [hour, minute] = hourMin.split(':').map(Number);
        
        let hours = hour || 0;
        if (period === 'PM' && hour !== 12) hours += 12;
        if (period === 'AM' && hour === 12) hours = 0;
        
        targetDate.setHours(hours, minute, 0, 0);
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
            throw new Error("Invalid recurring schedule format: missing day or time");
          }
          
          // Get the day of week for this schedule item
          const dayOfWeek = dayMap[scheduleDay];
          if (dayOfWeek === undefined) {
            throw new Error("Invalid day in workshop schedule");
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
          
          // Parse and set the time
          const [hourMin, period] = scheduleTime.split(' ');
          if (!hourMin) {
            throw new Error("Invalid time format in workshop schedule");
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
        if (dayIndex <= 0 || !workshopDays.length) {
          throw new Error(`Invalid day index: ${dayIndex}`);
        }
        
        // For day 1, return the first scheduled day
        if (dayIndex === 1 && workshopDays.length > 0) {
          targetDate = new Date(workshopDays[0]?.date || 0);
        } else if (workshopDays.length > 0) {
          // For subsequent days, calculate based on the pattern
          const daysBetweenSessions = 7; // Assuming weekly recurrence
          
          // Calculate which occurrence of the pattern we need
          const occurrenceIndex = Math.floor((dayIndex - 1) / workshopDays.length);
          const patternIndex = (dayIndex - 1) % workshopDays.length;
          
          // Get the pattern day (ensure it exists)
          const patternDay = workshopDays[patternIndex];
          if (!patternDay) {
            throw new Error(`Could not determine schedule for day ${dayIndex}`);
          }
          
          // Calculate the date
          targetDate = new Date(patternDay.date);
          targetDate.setDate(targetDate.getDate() + (occurrenceIndex * daysBetweenSessions));
        } else {
          throw new Error("No valid workshop days found in schedule");
        }
        
        // The time is already set in the targetDate calculation above
        // No need to set the date or parse time again
      }
      
      // Check if we're within 3 hours of the workshop start time
      const threeHoursBeforeWorkshop = new Date(targetDate.getTime() - (3 * 60 * 60 * 1000));
      const isWithinTimeWindow = now >= threeHoursBeforeWorkshop;
      
      // Only allow generation if within time window or if force generate is true
      if (!isWithinTimeWindow && !input.forceGenerate) {
        const timeUntilAllowed = Math.ceil((threeHoursBeforeWorkshop.getTime() - now.getTime()) / (60 * 1000));
        throw new Error(
          `Meeting links can only be generated within 3 hours of the workshop start time. ` +
          `You can generate this link in ${timeUntilAllowed} minutes.`
        );
      }
      
      // Get the attendees for the meeting
      const attendees = [];
      
      // Add enrolled students
      for (const enrollment of workshop.enrollments) {
        if (enrollment.student?.user?.email) {
          attendees.push({ email: enrollment.student.user.email });
        }
      }
      
      // Add the mentor
      if (workshop.mentor?.user?.email) {
        attendees.push({ email: workshop.mentor.user.email });
      } else if (ctx.dbUser?.email) {
        attendees.push({ email: ctx.dbUser.email });
      }
      
      // Check if we have any attendees
      if (attendees.length === 0) {
        throw new Error("No attendees found for this workshop. Make sure students are enrolled before generating a meeting link.");
      }
      
      // Call the meet router to generate a meeting link
      const result = await generateMeetLink({
        dateTime: targetDate.toISOString(),
        duration: 60, // 1 hour per session
        attendees,
      });
      
      // Get current meetLinks or initialize if null
      const currentMeetLinks = workshop.meetLinks as Record<string, any> || {};
      const updatedMeetLinks = { ...currentMeetLinks };
      
      // Store the generated link for this day
      const sessionKey = `day${dayIndex}`;
      updatedMeetLinks[sessionKey] = {
        link: result.meetLink,
        scheduledFor: targetDate.toISOString(),
        generated: new Date().toISOString()
      };
      
      // Update the workshop with the meeting links
      await ctx.db.workshop.update({
        where: { id: input.workshopId },
        data: { meetLinks: updatedMeetLinks },
      });
      
      return { 
        dayIndex,
        meetLink: result.meetLink,
        scheduledFor: targetDate.toISOString()
      };
    }),
});
