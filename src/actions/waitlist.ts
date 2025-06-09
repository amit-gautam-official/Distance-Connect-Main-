"use server";
import { db } from "@/server/db";

export const addToWaitlist = async (email: string, name?: string, phone?: string) => {
    try {

        const waitlistEntry = db.waitlist.create({
            data: {
                email,
                name: name || undefined,
                phone: phone || undefined,
            },
        });

        return waitlistEntry;
        
    } catch (error) {
        console.error("Error adding to waitlist:", error);
        throw new Error("Failed to add to waitlist. Please try again later.");
    }
  
}

export const getWaitlistByEmail = async (email: string) => {
    try {
        const waitlistEntry = await db.waitlist.findUnique({
            where: { email },
        });

        return waitlistEntry;
        
    } catch (error) {
        console.error("Error fetching waitlist entry:", error);
        throw new Error("Failed to fetch waitlist entry. Please try again later.");
    }
}

export const getWaitlistEntries = async () => {
    try {
        const waitlistEntries = await db.waitlist.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return waitlistEntries;
        
    } catch (error) {
        console.error("Error fetching waitlist entries:", error);
        throw new Error("Failed to fetch waitlist entries. Please try again later.");
    }
}

