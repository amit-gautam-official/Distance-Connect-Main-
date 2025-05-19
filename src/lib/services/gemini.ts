import { GoogleGenerativeAI } from "@google/generative-ai";

export const gemini = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyDAyKyppuLVnd8mLyYpIudOe3STcVw2Qng",
      );