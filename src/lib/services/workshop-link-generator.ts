import { PrismaClient } from "@prisma/client";
import { generateMeetLink } from "./generate-meet-link";

// Use the global prisma instance to prevent connection pool exhaustion
import { db } from "@/server/db";

// Keep track of the last run time to avoid processing the same workshops repeatedly
let lastRunTimestamp = 0;

// For rate limiting API calls to Google Calendar
const API_CALL_DELAY_MS = 200; // 200ms delay between API calls

// Sleep function for rate limiting
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Type for representing workshop day session data
interface WorkshopDaySession {
  day: string;
  time: string;
  date: Date;
  dayIndex: number;
}

// Interface for workshop attendees
interface WorkshopAttendees {
  mentor: { email: string };
  students: { email: string }[];
}

/**
 * Generates meeting links for workshops that are scheduled to start within the next few hours
 * Optimized for production use with high user volumes
 */
export async function generateUpcomingWorkshopLinks(hoursBeforeStart = 3): Promise<void> {
  // Track execution stats for monitoring
  const stats = {
    startTime: Date.now(),
    workshopsProcessed: 0,
    linksGenerated: 0,
    errors: 0,
  };
  
  try {
    console.log("Starting workshop link generation check...");
    
    // Current time
    const now = new Date();
    const nowTimestamp = now.getTime();
    
    // Don't run if executed recently (within 5 minutes) - prevents duplicate processing
    if (nowTimestamp - lastRunTimestamp < 5 * 60 * 1000) {
      console.log("Skipping workshop link generation - ran recently");
      return;
    }
    
    // Update the last run timestamp
    lastRunTimestamp = nowTimestamp;
    
    // Calculate time window for upcoming workshops
    const minTimeThreshold = nowTimestamp + 15 * 60 * 1000; // 15 minutes from now
    const maxTimeThreshold = nowTimestamp + hoursBeforeStart * 60 * 60 * 1000; // N hours from now
    
    // Get active workshops in batches to prevent memory issues with large datasets
    const BATCH_SIZE = 25;
    let hasMoreWorkshops = true;
    let skip = 0;
    
    while (hasMoreWorkshops) {
      // Get a batch of workshops
      const workshopBatch = await db.workshop.findMany({
        take: BATCH_SIZE,
        skip: skip,
        where: {
          // Only consider workshops with enrollments
          enrollments: {
            some: {
              paymentStatus: true
            }
          }
        },
        include: {
          mentor: {
            include: {
              user: { select: { email: true } }
            }
          },
          enrollments: {
            where: { paymentStatus: true },
            include: {
              student: {
                include: {
                  user: { select: { email: true } }
                }
              }
            }
          }
        }
      });
      
      // Update pagination
      skip += BATCH_SIZE;
      hasMoreWorkshops = workshopBatch.length === BATCH_SIZE;
      
      console.log(`Processing batch of ${workshopBatch.length} workshops`);
      
      // Process workshops in this batch
      await Promise.all(workshopBatch.map(async (workshop) => {
        try {
          // Process each workshop with rate limiting
          await processWorkshop(workshop, now, hoursBeforeStart, minTimeThreshold, maxTimeThreshold, stats);
          stats.workshopsProcessed++;
        } catch (error) {
          stats.errors++;
          console.error(`Error processing workshop ${workshop.id}:`, error);
        }
      }));
    }
    
    const duration = (Date.now() - stats.startTime) / 1000;
    console.log(`Workshop link generation completed in ${duration.toFixed(2)}s`);
    console.log(`Stats: ${stats.workshopsProcessed} workshops processed, ${stats.linksGenerated} links generated, ${stats.errors} errors`);
  } catch (error) {
    console.error("Error in workshop link generation:", error);
  }
}

/**
 * Process a single workshop with rate limiting and retries
 */
async function processWorkshop(
  workshop: any, 
  now: Date,
  hoursBeforeStart: number,
  minTimeThreshold: number,
  maxTimeThreshold: number,
  stats: { linksGenerated: number; errors: number }
): Promise<void> {
  try {
    // Skip if no enrollments
    if (workshop.enrollments.length === 0) {
      return;
    }

    // Get workshop days schedule
    const upcomingSessions = getUpcomingWorkshopSessions(workshop);
    if (upcomingSessions.length === 0) return;
    
    // Filter sessions that need links generated now (within our time window)
    const sessionsNeedingLinks = upcomingSessions.filter(session => {
      // Skip if we already have a link for this day
      const currentMeetLinks = workshop.meetLinks as Record<string, any> || {};
      const sessionKey = `day${session.dayIndex}`;
      if (currentMeetLinks[sessionKey]?.link) return false;
      
      // Check if session is within the threshold for link generation
      const sessionTime = session.date.getTime();
      return sessionTime >= minTimeThreshold && sessionTime <= maxTimeThreshold;
    });
    
    if (sessionsNeedingLinks.length === 0) return;
    
    // Get attendees
    const attendees = getWorkshopAttendees(workshop);
    if (!attendees.mentor.email || attendees.students.length === 0) return;
    
    // Current meetLinks data or initialize empty if null
    const currentMeetLinks = workshop.meetLinks as Record<string, any> || {};
    let updatedMeetLinks = { ...currentMeetLinks };
    let linksGenerated = false;
    
    // Process each session with rate limiting
    for (const session of sessionsNeedingLinks) {
      const sessionKey = `day${session.dayIndex}`;
      
      // Prepare attendees list for the Google Meet
      const meetAttendees = [
        { email: attendees.mentor.email },
        ...attendees.students.map(student => ({ email: student.email }))
      ];
      
      try {
        // Rate limiting - delay between API calls to avoid overwhelming external services
        await sleep(API_CALL_DELAY_MS);
        
        // Generate meet link with retry
        const meetResult = await withRetry(
          async () => generateMeetLink({
            dateTime: session.date.toISOString(),
            duration: 60, // 1 hour duration
            attendees: meetAttendees
          }),
          3 // Retry 3 times
        );
        
        // Store the generated link
        updatedMeetLinks[sessionKey] = {
          link: meetResult.meetLink,
          scheduledFor: session.date.toISOString(),
          generated: new Date().toISOString()
        };
        
        linksGenerated = true;
        stats.linksGenerated++;
        console.log(`Generated meet link for workshop ${workshop.id}, day ${session.dayIndex}`);
      } catch (error) {
        stats.errors++;
        console.error(`Failed to generate link for workshop ${workshop.id}, day ${session.dayIndex}:`, error);
      }
    }
    
    // If any links were generated, update the workshop
    if (linksGenerated) {
      // Use transaction for data consistency
      await db.$transaction(async (tx) => {
        // Get latest workshop data to prevent overwrites
        const latestWorkshop = await tx.workshop.findUnique({
          where: { id: workshop.id },
          select: { meetLinks: true }
        });
        
        // Merge latest links with our new ones
        const latestLinks = latestWorkshop?.meetLinks as Record<string, any> || {};
        const mergedLinks = { ...latestLinks };
        
        // Only add our new links
        for (const key in updatedMeetLinks) {
          if (!latestLinks[key]?.link) {
            mergedLinks[key] = updatedMeetLinks[key];
          }
        }
        
        // Update with merged data
        await tx.workshop.update({
          where: { id: workshop.id },
          data: { meetLinks: mergedLinks }
        });
      });
      
      // TODO: Send notifications to attendees about the new links
      // This would be implemented with a notification service
    }
  } catch (error) {
    throw error; // Propagate error to the main function
  }
}

/**
 * Utility for retrying a promise-based operation
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 500 + Math.random() * 500;
      await sleep(delay);
      
      console.log(`Retry attempt ${attempt + 1}/${maxRetries}`);
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}

/**
 * Calculate upcoming workshop sessions based on schedule
 */
function getUpcomingWorkshopSessions(workshop: any): WorkshopDaySession[] {
  try {
    const schedule = workshop.schedule as { day: string; time: string }[];
    if (!schedule || schedule.length === 0) return [];
    
    const now = new Date();
    const dayMap: Record<string, number> = {
      "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, 
      "Thursday": 4, "Friday": 5, "Saturday": 6
    };
    
    const sessions: WorkshopDaySession[] = [];
    
    for (let dayIndex = 0; dayIndex < workshop.numberOfDays; dayIndex++) {
      // Use modulo to cycle through available schedule items
      const scheduleIndex = dayIndex % schedule.length;
      const scheduleItem = schedule[scheduleIndex];
      
      // Get day of week and time
      const day = scheduleItem?.day as string;
      const time = scheduleItem?.time as string;
      
      const targetDay = dayMap[day];
      if (targetDay === undefined) continue;
      
      // Calculate the next occurrence of this day
      let daysToAdd = (targetDay - now.getDay() + 7) % 7;
      if (daysToAdd === 0) daysToAdd = 7; // If today, schedule for next week
      
      // For subsequent days, add offset
      if (dayIndex > 0) {
        daysToAdd += 7 * dayIndex;
      }
      
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + daysToAdd);
      
      // Parse the time (assuming format like "10:00 AM")
      const [hourMin, period] = time.split(' ');
      // Ensure hourMin is defined before destructuring
      const [hour, minute] = hourMin ? hourMin.split(':').map(Number) : [0, 0];
      
      let hours = hour || 0;
      if (period === 'PM' && hour !== 12) hours += 12;
      if (period === 'AM' && hour === 12) hours = 0;
      
      targetDate.setHours(hours, minute, 0, 0);
      
      sessions.push({
        day,
        time,
        date: targetDate,
        dayIndex: dayIndex + 1
      });
    }
    
    return sessions;
  } catch (error) {
    console.error("Error calculating workshop sessions:", error);
    return [];
  }
}

/**
 * Get all workshop attendees (mentor and enrolled students)
 */
function getWorkshopAttendees(workshop: any): WorkshopAttendees {
  const mentor = { email: workshop.mentor?.user?.email || '' };
  
  const students = workshop.enrollments
    .filter((enrollment: any) => enrollment.paymentStatus)
    .map((enrollment: any) => ({ 
      email: enrollment.student?.user?.email || ''
    }))
    .filter((student: { email: string }) => student.email !== '');
  
  return { mentor, students };
}

/**
 * Notify attendees about newly generated meeting links
 * This would be implemented with your notification system
 */
async function notifyAttendeesAboutMeetLink(
  workshopId: string, 
  dayIndex: number,
  attendees: WorkshopAttendees,
  meetLink: string,
  sessionTime: Date
): Promise<void> {
  // Implementation would depend on your notification system
  // Could use email, push notifications, or in-app notifications
  
  console.log(`Notification would be sent for workshop ${workshopId}, day ${dayIndex}`);
  console.log(`Meeting link: ${meetLink}`);
  console.log(`To: Mentor (${attendees.mentor.email}) and ${attendees.students.length} students`);
}
