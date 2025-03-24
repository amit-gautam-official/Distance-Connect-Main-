import * as z from "zod";

export const startupFormSchema = z.object({
    firstName : z.string().min(2, {
    message: "Name must be at least 2 characters.",
    }),
    lastName : z.string().min(2, {
    message: "Name must be at least 2 characters.",
    }),
  startupName: z.string().min(2, {
    message: "Startup name must be at least 2 characters.",
  }),
  startupEmail: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .optional(),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
  website: z.string().url({
    message: "Please enter a valid website URL.",
  }),
  linkedInUrl: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }),
});

export type StartupFormValues = z.infer<typeof startupFormSchema>;
