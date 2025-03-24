import * as z from "zod"

export const studentFormSchema = z.object({

  firstName : z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  lastName : z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  university: z.string().min(2, {
    message: "University must be at least 2 characters.",
  }),
  course: z.string().min(2, {
    message: "Course must be at least 2 characters.",
  }),
  yearOfStudy: z.enum(["FIRST", "SECOND", "THIRD", "FOURTH"], {
    required_error: "Please select your year of study.",
  }),
  linkedInUrl: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }),
  profilePicture: z.instanceof(File).optional(),
})

export type StudentFormValues = z.infer<typeof studentFormSchema>

