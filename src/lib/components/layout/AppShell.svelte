<script lang="ts">
	import * as SidebarPrimitive from '$lib/components/ui/sidebar';
	import type { Snippet } from 'svelte';
	import Sidebar from './Sidebar.svelte';
	import Topbar from './Topbar.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<SidebarPrimitive.Provider class="min-h-svh">
	<Sidebar />

	<SidebarPrimitive.Inset class="min-h-svh min-w-0">
		<Topbar />

		<main class="min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
			{@render children()}
		</main>
	</SidebarPrimitive.Inset>
</SidebarPrimitive.Provider>
