import * as z from 'zod';

const dateSchema = z.string().refine((value) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(value);
}, 'Invalid date format (YYYY-MM-DD)');

export const User = z.object({
  email: z.string(),
  username: z.string(),
  fullName: z.string(),
  dateOfBirth: dateSchema,
  password: z.string(),
});

export type UserRequest = z.infer<typeof User>;
