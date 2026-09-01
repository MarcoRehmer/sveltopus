<script lang="ts">
	import { resolve } from "$app/paths";
	import * as Avatar from "$lib/components/ui/avatar";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";
	import LogOut from "@lucide/svelte/icons/log-out";
	import Settings from "@lucide/svelte/icons/settings";
	import User from "@lucide/svelte/icons/user";
	
</script>

<header class="flex h-16 w-full items-center justify-between border-b border-border bg-background px-6">
	<!-- Left side: Brand Logo & Name -->
	<a href={resolve("/dashboard")} class="flex items-center gap-2.5 focus-visible:outline-hidden">
		<!-- Purple isometric package/cube logo -->
		<svg class="size-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
			<polyline points="3.27 6.96 12 12.01 20.73 6.96" />
			<line x1="12" y1="22.08" x2="12" y2="12" />
		</svg>
		<span class="text-xl font-bold tracking-tight text-foreground">PrintShipper</span>
	</a>

	<!-- Right side: Actions, Notifications, Profile -->
	<div class="flex items-center gap-4">

		<!-- Divider -->
		<div class="h-6 w-px bg-border"></div>

		<!-- User Menu Dropdown -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="flex items-center gap-2.5 rounded-full p-1 text-left select-none focus-visible:outline-hidden hover:bg-accent focus:outline-none">
				<Avatar.Root class="size-9 bg-muted text-muted-foreground">
					<!-- Max Mustermann initials -->
					<Avatar.Fallback class="bg-muted text-sm font-semibold">MM</Avatar.Fallback>
				</Avatar.Root>
				<div class="hidden flex-col pr-1 md:flex">
					<span class="text-sm font-medium leading-none text-foreground">Max Mustermann</span>
				</div>
				<ChevronDown class="size-4 text-muted-foreground" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-56">
				<DropdownMenu.Label class="text-xs font-semibold text-muted-foreground">Mein Konto</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="flex cursor-pointer items-center gap-2 text-sm text-foreground hover:bg-accent focus:bg-accent">
					<User class="size-4" />
					<span>Profil</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item class="flex cursor-pointer items-center gap-2 text-sm text-foreground hover:bg-accent focus:bg-accent">
					<Settings class="size-4" />
					<span>Einstellungen</span>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="flex cursor-pointer items-center gap-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive">
					<LogOut class="size-4" />
					<span>Abmelden</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>
