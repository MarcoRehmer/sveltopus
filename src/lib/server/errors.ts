export class AppError extends Error {
	constructor(
		public readonly status: number,
		message: string,
		public readonly details?: unknown
	) {
		super(message);
		this.name = 'AppError';
	}
}

export function handleError(error: unknown): { status: number; message: string } {
	if (error instanceof AppError) {
		return {
			status: error.status,
			message: import.meta.env.DEV ? error.message : 'An error occurred'
		};
	}

	console.error('Unexpected error:', error);

	return {
		status: 500,
		message: import.meta.env.DEV ? String(error) : 'An unexpected error occurred'
	};
}
