import * as z from 'zod';

const dateSchema = z.string().refine((value) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(value);
}, 'Invalid date format (YYYY-MM-DD)');

const validRoles = ['USER', 'SELLER'];

export const User = z.object({
  email: z.string(),
  username: z.string(),
  fullName: z.string(),
  role: z.string().refine(value => validRoles.includes(value), {
    message: 'role must be a string(USER or SELLER)',
  }),
  dateOfBirth: dateSchema,
  password: z.string(),
});

export const LoginValidation = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginRequest = z.infer<typeof LoginValidation>;

export type UserRequest = z.infer<typeof User>;
