<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	let error: Error | null = $state(null);

	$effect(() => {
		page.url.pathname;
		error = null;
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher />
<Toaster position="top-right" closeButton visibleToasts={3} />

{#if error && import.meta.env.DEV}
	<div class="fixed inset-0 bg-red-50 z-50 p-4">
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			<strong>Client Error:</strong> {error.message}
			<br/>
			<small>{error.stack}</small>
		</div>
	</div>
{/if}

{@render children()}

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
