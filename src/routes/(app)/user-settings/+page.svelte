<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Account Settings | Sveltopus</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div>
		<h1 class="text-3xl font-semibold tracking-tight">Account Settings</h1>
		<p class="text-muted-foreground">Manage your account details and security preferences.</p>
	</div>

	<Card.Root class="max-w-2xl">
		<Card.Header>
			<Card.Title>Profile</Card.Title>
			<Card.Description>View the information associated with your account.</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-6">
			<div class="grid gap-2">
				<label for="username" class="text-sm font-medium">Username</label>
				<Input id="username" value={data.user!.name} readonly />
			</div>

			<div class="grid gap-2">
				<label for="email" class="text-sm font-medium">Email</label>
				<div class="flex flex-col gap-2 sm:flex-row">
					<Input id="email" class="flex-1" value={data.user!.email} readonly />
					<Button variant="outline" type="button" disabled>Change email</Button>
				</div>
			</div>

			<div class="grid gap-2">
				<label for="password" class="text-sm font-medium">Password</label>
				<div class="flex flex-col gap-2 sm:flex-row">
					<Input id="password" class="flex-1" value="********" type="password" readonly />
					<Button variant="outline" type="button" disabled>Change password</Button>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="max-w-2xl border-destructive/40">
		<Card.Header>
			<Card.Title class="text-destructive">Danger Zone</Card.Title>
			<Card.Description>
				Permanently delete your account and all associated data. This action cannot be undone.
			</Card.Description>
		</Card.Header>
		<Card.Footer class="justify-end">
			<Button variant="destructive" type="button" disabled>Delete account</Button>
		</Card.Footer>
	</Card.Root>
</div>
