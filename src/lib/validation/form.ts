import { z } from 'zod';

export type FieldErrors = Record<string, string[]>;

type ValidationSuccess<T> = {
	data: T;
	success: true;
};

type ValidationFailure = {
	fieldErrors: FieldErrors;
	success: false;
};

export type FormValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export function validateFormData<T extends z.ZodType>(
	schema: T,
	formData: FormData
): FormValidationResult<z.output<T>> {
	const result = schema.safeParse(Object.fromEntries(formData.entries()));

	if (result.success) {
		return result;
	}

	const fieldErrors: FieldErrors = {};

	const flattenedErrors = z.flattenError(result.error).fieldErrors as Record<
		string,
		string[] | undefined
	>;

	for (const [field, messages] of Object.entries(flattenedErrors)) {
		if (messages) {
			fieldErrors[field] = messages;
		}
	}

	return { success: false, fieldErrors };
}
