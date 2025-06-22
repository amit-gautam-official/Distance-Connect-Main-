import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { ReferralStatus } from "@prisma/client";

export const referralRouter = createTRPCRouter({
  // For students to request a referral from a mentor
  requestReferral: protectedProcedure
    .input(
      z.object({
        mentorUserId: z.string(),
        resumeUrl: z.string().optional(),
        coverLetterUrl: z.string().optional(),
        positionName: z.string(),
        jobLink: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is a student
      if (ctx.dbUser?.role !== "STUDENT") {
        throw new Error("Only students can request referrals");
      }      // Create the referral request
      const referralRequest = await ctx.db.referralRequest.create({
        data: {
          studentUserId: ctx.dbUser.id,
          mentorUserId: input.mentorUserId,
          resumeUrl: input.resumeUrl,
          coverLetterUrl: input.coverLetterUrl,
          positionName: input.positionName,
          jobLink: input.jobLink,
          status: ReferralStatus.INITIATED,
          initiationFeePaid: false, // Will be updated after payment
        }
      });      return referralRequest;
    }),  // For students to upload or update their resume for a referral request
  updateReferralDocuments: protectedProcedure
    .input(
      z.object({
        referralRequestId: z.string(),
        resumeUrl: z.string()
          .url({ message: "Resume URL must be a valid URL" })
          .optional()
          .or(z.literal("")),
        coverLetterUrl: z.string()
          .url({ message: "Cover letter URL must be a valid URL" })
          .optional()
          .or(z.literal("")),
        positionName: z.string().min(2, { message: "Position name must be at least 2 characters" }),
        jobLink: z.string().url({ message: "Job link must be a valid URL" }),
        status: z.nativeEnum(ReferralStatus).optional(),
      })
    )    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user is a student
        if (ctx.dbUser?.role !== "STUDENT") {
          throw new Error("Only students can update referral documents");
        }

        // Check if the referral request belongs to the student
        const referralRequest = await ctx.db.referralRequest.findUnique({
          where: { id: input.referralRequestId },
          select: { studentUserId: true, status: true }
        });      if (!referralRequest) {
          throw new Error("Referral request not found");
        }
        
        if (referralRequest.studentUserId !== ctx.dbUser.id) {
          throw new Error("Access denied - you can only update your own referral requests");
        }
          // Ensure resume URL is provided
        if (!input.resumeUrl) {
          throw new Error("Resume URL is required");
        }
        
        // Update the referral request
        const updatedReferral = await ctx.db.referralRequest.update({
          where: { id: input.referralRequestId },
          data: {
            resumeUrl: input.resumeUrl,
            coverLetterUrl: input.coverLetterUrl,
            positionName: input.positionName,
            jobLink: input.jobLink,
            status: input.status || ReferralStatus.RESUME_REVIEW, // Change status back to RESUME_REVIEW
            updatedAt: new Date(), // Update the timestamp
          }
        });
        
        return updatedReferral;
      } catch (error: any) {
        // Re-throw with a more descriptive message
        throw new Error(`Failed to update referral documents: ${error.message}`);
      }
    }),

  // For mentors to review and update the status of a referral request
  updateReferralStatus: protectedProcedure
    .input(
      z.object({
        referralRequestId: z.string(),
        status: z.nativeEnum(ReferralStatus),
        mentorFeedback: z.string().optional(),
        mentorChangesRequested: z.string().optional(),
        referralProofUrl: z.string().optional(),
        acceptanceProofUrl: z.string().optional(),
        finalFeeAmount: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is a mentor
      if (ctx.dbUser?.role !== "MENTOR") {
        throw new Error("Only mentors can update referral status");
      }

      // Check if the referral request belongs to the mentor
      const referralRequest = await ctx.db.referralRequest.findUnique({
        where: { id: input.referralRequestId },
        select: { mentorUserId: true, status: true }
      });

      if (!referralRequest || referralRequest.mentorUserId !== ctx.dbUser.id) {
        throw new Error("Referral request not found or access denied");
      }

      // Update the referral request
      return await ctx.db.referralRequest.update({
        where: { id: input.referralRequestId },
        data: {
          status: input.status,
          mentorFeedback: input.mentorFeedback,
          mentorChangesRequested: input.mentorChangesRequested,
          referralProofUrl: input.referralProofUrl,
          acceptanceProofUrl: input.acceptanceProofUrl,
          finalFeeAmount: input.finalFeeAmount,
        }
      });
    }),

  // For students to get their referral requests
  getStudentReferralRequests: protectedProcedure
    .query(async ({ ctx }) => {
      // Check if user is a student
      if (ctx.dbUser?.role !== "STUDENT") {
        throw new Error("Only students can view their referral requests");
      }

      return await ctx.db.referralRequest.findMany({
        where: { studentUserId: ctx.dbUser.id },
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                }
              }
            }
          },
          orders: true
        },
        orderBy: { updatedAt: 'desc' }
      });
    }),

  // For mentors to get referral requests they've received
  getMentorReferralRequests: protectedProcedure
    .query(async ({ ctx }) => {
      // Check if user is a mentor
      if (ctx.dbUser?.role !== "MENTOR") {
        throw new Error("Only mentors can view their referral requests");
      }

      return await ctx.db.referralRequest.findMany({
        where: { mentorUserId: ctx.dbUser.id },
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                }
              }
            }
          },
          orders: true
        },
        orderBy: { updatedAt: 'desc' }
      });
    }),

  // Get a single referral request by ID
  getReferralRequestById: protectedProcedure
    .input(z.object({ referralRequestId: z.string() }))
    .query(async ({ ctx, input }) => {
      const referralRequest = await ctx.db.referralRequest.findUnique({
        where: { id: input.referralRequestId },
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                }
              }
            }
          },
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                }
              }
            }
          },
          orders: true
        }
      });

      // Check if the user is authorized to view this referral request
      if (!referralRequest) {
        throw new Error("Referral request not found");
      }

      if (
        ctx.dbUser?.role !== "ADMIN" &&
        referralRequest.studentUserId !== ctx.dbUser?.id &&
        referralRequest.mentorUserId !== ctx.dbUser?.id
      ) {
        throw new Error("Access denied");
      }

      return referralRequest;
    }),

  // For updating payment status after successful payment
  updatePaymentStatus: protectedProcedure
    .input(
      z.object({
        referralRequestId: z.string(),
        isInitiationFee: z.boolean(), // true for initial ₹99, false for final payment
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is a student
      if (ctx.dbUser?.role !== "STUDENT") {
        throw new Error("Only students can update payment status");
      }

      // Check if the referral request belongs to the student
      const referralRequest = await ctx.db.referralRequest.findUnique({
        where: { id: input.referralRequestId },
        select: { studentUserId: true, status: true }
      });

      if (!referralRequest || referralRequest.studentUserId !== ctx.dbUser.id) {
        throw new Error("Referral request not found or access denied");
      }

      // Update payment status based on fee type
      if (input.isInitiationFee) {
        return await ctx.db.referralRequest.update({
          where: { id: input.referralRequestId },
          data: {
            initiationFeePaid: true,
            status: ReferralStatus.RESUME_REVIEW,
          }
        });
      } else {
        // Final payment
        return await ctx.db.referralRequest.update({
          where: { id: input.referralRequestId },
          data: {
            finalFeePaid: true,
            status: ReferralStatus.COMPLETED,
          }
        });
      }
    }),

  // Get referral stats for a mentor
  getMentorReferralStats: protectedProcedure
    .query(async ({ ctx }) => {
      // Check if user is a mentor
      if (ctx.dbUser?.role !== "MENTOR") {
        throw new Error("Only mentors can view their referral stats");
      }

      const stats = {
        totalReferralRequests: 0,
        pendingReview: 0,
        changesRequested: 0,
        referralsSent: 0,
        referralsAccepted: 0,
        referralsRejected: 0,
        completed: 0,
      };

      const referralRequests = await ctx.db.referralRequest.findMany({
        where: { mentorUserId: ctx.dbUser.id },
        select: { status: true }
      });

      stats.totalReferralRequests = referralRequests.length;

      referralRequests.forEach(request => {
        switch (request.status) {
          case ReferralStatus.RESUME_REVIEW:
            stats.pendingReview++;
            break;
          case ReferralStatus.CHANGES_REQUESTED:
            stats.changesRequested++;
            break;
          case ReferralStatus.REFERRAL_SENT:
          case ReferralStatus.UNDER_REVIEW:
            stats.referralsSent++;
            break;
          case ReferralStatus.REFERRAL_ACCEPTED:
          case ReferralStatus.PAYMENT_PENDING:
            stats.referralsAccepted++;
            break;
          case ReferralStatus.REFERRAL_REJECTED:
            stats.referralsRejected++;
            break;
          case ReferralStatus.COMPLETED:
            stats.completed++;
            break;
        }
      });

      return stats;
    }),

  // Get mentors available for referrals  
  getMentorsForReferral: protectedProcedure
    .query(async ({ ctx }) => {
      // Get mentors who have at least one active referral offering
      const mentorsWithOfferings = await ctx.db.mentor.findMany({
        where: {
          verified: true,
          companyEmailVerified: true,
          referralOfferings: {
            some: {
              isActive: true,
            },
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            }
          },
          referralOfferings: {
            where: {
              isActive: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return mentorsWithOfferings;
    }),

  // For mentors to create a referral offering
  createReferralOffering: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        description: z.string().min(10, "Description must be at least 10 characters"),
        companiesCanReferTo: z.array(z.string()).min(1, "Add at least one company"),
        positions: z.array(z.string()).min(1, "Add at least one position"),
        initiationFeeAmount: z.string().default("9900"), // Default ₹99 in paise
        finalFeeAmount: z.string().default("199900"), // Default ₹1999 in paise
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is a mentor
      if (ctx.dbUser?.role !== "MENTOR") {
        throw new Error("Only mentors can create referral offerings");
      }

      // Create the referral offering
      const referralOffering = await ctx.db.referralOffering.create({
        data: {
          mentorUserId: ctx.dbUser.id,
          title: input.title,
          description: input.description,
          companiesCanReferTo: input.companiesCanReferTo,
          positions: input.positions,
          initiationFeeAmount: input.initiationFeeAmount,
          finalFeeAmount: input.finalFeeAmount,
          isActive: input.isActive,
        }
      });

      return referralOffering;
    }),

  // For mentors to update their referral offering
  updateReferralOffering: protectedProcedure
    .input(
      z.object({
        offeringId: z.string(),
        title: z.string().min(3, "Title must be at least 3 characters").optional(),
        description: z.string().min(10, "Description must be at least 10 characters").optional(),
        companiesCanReferTo: z.array(z.string()).min(1, "Add at least one company").optional(),
        positions: z.array(z.string()).min(1, "Add at least one position").optional(),
        initiationFeeAmount: z.string().optional(),
        finalFeeAmount: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is a mentor
      if (ctx.dbUser?.role !== "MENTOR") {
        throw new Error("Only mentors can update referral offerings");
      }

      // Check if the offering belongs to the mentor
      const offering = await ctx.db.referralOffering.findUnique({
        where: { id: input.offeringId },
        select: { mentorUserId: true }
      });

      if (!offering || offering.mentorUserId !== ctx.dbUser.id) {
        throw new Error("Referral offering not found or access denied");
      }

      // Update the referral offering
      return await ctx.db.referralOffering.update({
        where: { id: input.offeringId },
        data: {
          title: input.title,
          description: input.description,
          companiesCanReferTo: input.companiesCanReferTo,
          positions: input.positions,
          initiationFeeAmount: input.initiationFeeAmount,
          finalFeeAmount: input.finalFeeAmount,
          isActive: input.isActive,
        }
      });
    }),

  // Get mentor's referral offerings
  getMentorReferralOfferings: protectedProcedure
    .query(async ({ ctx }) => {
      // Check if user is a mentor
      if (ctx.dbUser?.role !== "MENTOR") {
        throw new Error("Only mentors can view their referral offerings");
      }

      return await ctx.db.referralOffering.findMany({
        where: { mentorUserId: ctx.dbUser.id },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Get all active referral offerings (for students)
  getAllActiveReferralOfferings: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.referralOffering.findMany({
        where: { isActive: true },
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Get a specific referral offering by ID
  getReferralOfferingById: protectedProcedure
    .input(z.object({ offeringId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.referralOffering.findUnique({
        where: { id: input.offeringId },
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                }
              }
            }
          }
        },
      });
    }),

  // Delete a referral offering
  deleteReferralOffering: protectedProcedure
    .input(
      z.object({
        offeringId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is a mentor
      if (ctx.dbUser?.role !== "MENTOR") {
        throw new Error("Only mentors can delete referral offerings");
      }

      // Check if the offering belongs to the mentor
      const offering = await ctx.db.referralOffering.findUnique({
        where: { id: input.offeringId },
        select: { mentorUserId: true }
      });

      if (!offering || offering.mentorUserId !== ctx.dbUser.id) {
        throw new Error("Referral offering not found or access denied");
      }

      // Delete the referral offering
      return await ctx.db.referralOffering.delete({
        where: { id: input.offeringId },
      });
    })

});

