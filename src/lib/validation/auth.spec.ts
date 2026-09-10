import { describe, expect, it } from 'vitest';
import { signInSchema, signUpSchema } from './auth';
import { validateFormData } from './form';

function createFormData(values: Record<string, string>): FormData {
	const formData = new FormData();

	for (const [key, value] of Object.entries(values)) {
		formData.append(key, value);
	}

	return formData;
}

describe('auth validation', () => {
	it('normalizes valid sign-in data', () => {
		const result = validateFormData(
			signInSchema,
			createFormData({
				email: '  USER@EXAMPLE.COM  ',
				password: 'password123'
			})
		);

		expect(result).toEqual({
			success: true,
			data: { email: 'user@example.com', password: 'password123' }
		});
	});

	it('returns field errors for invalid sign-up data', () => {
		const result = validateFormData(
			signUpSchema,
			createFormData({
				name: '',
				email: 'not-an-email',
				password: 'short',
				confirmPassword: 'different'
			})
		);

		expect(result).toEqual({
			success: false,
			fieldErrors: {
				name: ['Name is required'],
				email: ['Invalid email address'],
				password: ['Password must be at least 8 characters long'],
				confirmPassword: ['Passwords do not match']
			}
		});
	});
});
