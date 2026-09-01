<script lang="ts">
	import { page } from '$app/state';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Inbox from '@lucide/svelte/icons/inbox';
	import FileText from '@lucide/svelte/icons/file-text';

	import * as SidebarPrimitive from '$lib/components/ui/sidebar';
	import SidebarFooter from '../ui/sidebar/sidebar-footer.svelte';

	const navItems = [
		{
			name: 'Dashboard',
			path: '/dashboard',
			href: '/dashboard',
			icon: LayoutDashboard,
		},
		{
			name: 'Packing Table',
			path: '/packing-table',
			href: '/packing-table',
			icon: Inbox,
		},
		{
			name: 'Orders',
			path: '/orders',
			href: '/orders',
			icon: FileText,
		},
	] as const;

	function isActive(href: string) {
		return page.url.pathname.startsWith(href);
	}
</script>

<SidebarPrimitive.Root collapsible="none">
	<SidebarPrimitive.Content>
		<SidebarPrimitive.Group>
			<SidebarPrimitive.GroupContent>
				<SidebarPrimitive.Menu>
					{#each navItems as item (item.path)}
						<SidebarPrimitive.MenuItem>
							<SidebarPrimitive.MenuButton isActive={isActive(item.path)}>
								{#snippet child({ props })}
									<a href={item.href} {...props}>
										<item.icon />
										<span>{item.name}</span>
									</a>
								{/snippet}
							</SidebarPrimitive.MenuButton>
						</SidebarPrimitive.MenuItem>
					{/each}
				</SidebarPrimitive.Menu>
			</SidebarPrimitive.GroupContent>
		</SidebarPrimitive.Group>
	</SidebarPrimitive.Content>
	<SidebarFooter>
		Foo
	</SidebarFooter>
</SidebarPrimitive.Root>
