import {composedPrompt} from "@/lib/mentor-classifier-prompt"
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from "zod";


interface Data {
    experience: string;
    companies: string[];
    roles: string[];
  }


export const MentorTierOutput = z.object({
    tier: z.enum([
      "Junior",
      "Mid-Level A",
      "Mid-Level B",
      "Senior A",
      "Senior B",
      "Expert",
    ]).describe("Mentor's pricing tier"),
    recommendedPriceRange: z
      .array(z.number())
      .min(2)
      .max(2)
      .describe("Recommended price range in ₹ for the mentor (2-element array)"),
    reason: z.string().describe("Reason for classification based on experience, company, and role"),
  });
  


const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0,
    maxRetries: 2,
    apiKey: "AIzaSyDAyKyppuLVnd8mLyYpIudOe3STcVw2Qng",
    // other params...
  });



const structuredLlm = llm.withStructuredOutput(MentorTierOutput, { name: "Mentor Tier output Schemna " });

export const classifyMentorTier = async (data:  {data:Data}) => {

    try {
        const formattedPrompt = await composedPrompt.format({
            input:data,
        });
    
        const result = await structuredLlm.invoke(formattedPrompt);
    
        return result as unknown as z.infer<typeof MentorTierOutput>;
    }catch (error) {
        console.error("Error in classifyMentorTier:", error);
        throw error; 
    }
}



