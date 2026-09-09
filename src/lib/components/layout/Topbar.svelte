<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import * as SidebarPrimitive from '$lib/components/ui/sidebar';
	import { navigationItems } from './navigation';

	function isActive(href: string) {
		const pathname = page.url.pathname;

		if (href === '/dashboard') {
			return pathname === href;
		}

		return pathname === href || pathname.startsWith(`${href}/`);
	}
</script>

<header class="flex min-h-16 w-full items-center gap-4 border-b border-border bg-background px-4 md:px-6">
	<SidebarPrimitive.Trigger />

	<a
		href={resolve('/dashboard')}
		class="shrink-0 rounded-md text-xl font-bold tracking-tight text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
	>
		Sveltopus
	</a>

	<nav aria-label="Primary navigation" class="ml-auto hidden items-center gap-1 md:flex">
		{#each navigationItems as item (item.href)}
			<a
				href={resolve(item.href)}
				aria-current={isActive(item.href) ? 'page' : undefined}
				class={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
					isActive(item.href)
						? 'bg-accent text-accent-foreground'
						: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
				}`}
			>
				{item.label}
			</a>
		{/each}
	</nav>
</header>
