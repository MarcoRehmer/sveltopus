import { z } from 'zod';

const email = z.string().trim().toLowerCase().email();
const password = z.string().min(8, 'Password must be at least 8 characters long');

export const signInSchema = z.object({
	email,
	password
});

export const signUpSchema = z
	.object({
		name: z.string().trim().min(1, 'Name is required'),
		email,
		password,
		confirmPassword: z.string()
	})
	.refine(({ password, confirmPassword }) => password === confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export type SignInInput = z.output<typeof signInSchema>;
export type SignUpInput = z.output<typeof signUpSchema>;
