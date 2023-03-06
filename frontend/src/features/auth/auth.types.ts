import { z } from "zod";

export const authSchema = z.object({
	accessToken: z.string().optional(),
});

export type AuthType = z.infer<typeof authSchema>;
