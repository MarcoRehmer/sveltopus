import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import Inbox from '@lucide/svelte/icons/inbox';
import FileText from '@lucide/svelte/icons/file-text';

export const navigationItems = [
	{
		label: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		label: 'Packing Table',
		href: '/packing-table',
		icon: Inbox,
	},
	{
		label: 'Orders',
		href: '/orders',
		icon: FileText,
	},
] as const;
