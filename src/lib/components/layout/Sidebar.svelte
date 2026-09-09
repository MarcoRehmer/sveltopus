<script lang="ts">
	import { page } from '$app/state';
	import * as SidebarPrimitive from '$lib/components/ui/sidebar';
	import { resolve } from '$app/paths';
	import { navigationItems } from './navigation';

	function isActive(href: string) {
		const pathname = page.url.pathname;

		if (href === '/dashboard') {
			return pathname === href;
		}

		return pathname === href || pathname.startsWith(`${href}/`);
	}
</script>

<SidebarPrimitive.Root>
	<SidebarPrimitive.Header class="border-b border-sidebar-border">
		<span class="px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
			Workspace
		</span>
	</SidebarPrimitive.Header>

	<SidebarPrimitive.Content>
		<SidebarPrimitive.Group>
			<SidebarPrimitive.GroupContent>
				<SidebarPrimitive.Menu>
					{#each navigationItems as item (item.href)}
						<SidebarPrimitive.MenuItem>
							<SidebarPrimitive.MenuButton isActive={isActive(item.href)}>
								{#snippet child({ props })}
									<a href={resolve(item.href)} {...props}>
										<item.icon />
										<span>{item.label}</span>
									</a>
								{/snippet}
							</SidebarPrimitive.MenuButton>
						</SidebarPrimitive.MenuItem>
					{/each}
				</SidebarPrimitive.Menu>
			</SidebarPrimitive.GroupContent>
		</SidebarPrimitive.Group>
	</SidebarPrimitive.Content>
</SidebarPrimitive.Root>
