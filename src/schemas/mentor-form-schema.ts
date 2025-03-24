import * as z from "zod";

export const mentorFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
  positionTitle: z.string().min(2, {
    message: "Position Title must be at least 2 characters.",
  }),
  industryExperience: z.string().min(2, {
    message: "Industry Experience must be at least 2 characters.",
  }),
  yearsOfExperience: z.string().regex(/^\d+$/, {
    message: "Years of Experience must be a number.",
  }),
  linkedInUrl: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }),
  professionalIdUrl: z.string().url({
    message: "Please enter a valid Professional ID URL.",
  }),
  companyEmail: z.string().email({
    message: "Please enter a valid Company Email.",
  }),
  profilePicture: z.instanceof(File).optional(),
});

export type MentorFormValues = z.infer<typeof mentorFormSchema>;
