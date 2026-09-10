const fallbackPath = '/dashboard';

export function getSafeRedirectPath(value: string | null | undefined): string {
	if (!value || !value.startsWith('/') || value.startsWith('//')) {
		return fallbackPath;
	}

	try {
		const url = new URL(value, 'http://localhost');
		return `${url.pathname}${url.search}`;
	} catch {
		return fallbackPath;
	}
}

export function getReturnPath(url: URL): string {
	return `${url.pathname}${url.search}`;
}
