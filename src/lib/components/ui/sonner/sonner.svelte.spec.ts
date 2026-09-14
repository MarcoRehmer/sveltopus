import { page } from 'vitest/browser';
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { toast } from 'svelte-sonner';
import { Toaster } from '.';

describe('Toaster', () => {
	afterEach(() => {
		toast.dismiss();
	});

	it('renders a toast triggered by the application', async () => {
		render(Toaster);

		toast.success('Settings saved', { description: 'Your changes are live.' });

		await expect.element(page.getByText('Settings saved')).toBeVisible();
		await expect.element(page.getByText('Your changes are live.')).toBeVisible();
	});
});
