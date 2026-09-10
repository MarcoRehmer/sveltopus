<script lang="ts">
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();
</script>

<AppShell user={data.user}>{@render children()}</AppShell>
