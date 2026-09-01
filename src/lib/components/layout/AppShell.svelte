<script lang="ts">
	import Topbar from './Topbar.svelte';
	import Sidebar from './Sidebar.svelte';
	import * as SidebarPrimitive from '$lib/components/ui/sidebar';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex h-screen w-screen flex-col overflow-hidden bg-zinc-50">
	<!-- Fixed Topbar on top -->
	<Topbar />

	<!-- Sidebar + Content area -->
	<SidebarPrimitive.Provider class="min-h-0 flex-1">
		<div class="animate-fade-in flex h-full w-full overflow-hidden">
			<Sidebar />

			<main class="flex-1 overflow-y-auto p-8">
				{@render children()}
			</main>
		</div>
	</SidebarPrimitive.Provider>
</div>
