import { z } from "zod";

export const themeSchema = z.object({
	mode: z.string(),
});

export type ThemeType = z.infer<typeof themeSchema>;
