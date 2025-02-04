import { z } from "zod";

export const languageFilterSchema = z.object({
  code: z.string().max(3, "Code must be at most 3 characters long").optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  spokenIn: z.string().optional(),
  writingSystem: z.string().optional(),
  nationOfOrigin: z.string().optional(),
});

export type LanguageFilterFormValues = z.infer<typeof languageFilterSchema>;
