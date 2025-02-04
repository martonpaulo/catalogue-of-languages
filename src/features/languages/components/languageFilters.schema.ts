import { z } from "zod";

export const languageFilterSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  spokenIn: z.string().optional(),
  writingSystem: z.string().optional(),
  nationOfOrigin: z.string().optional(),
});

export type LanguageFilterFormValues = z.infer<typeof languageFilterSchema>;
