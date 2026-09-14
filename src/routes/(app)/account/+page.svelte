<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { setMode, userPrefersMode } from 'mode-watcher';
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

	<div class="grid gap-6 lg:grid-cols-2">
		<Card.Root>
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

		<Card.Root>
			<Card.Header>
				<Card.Title>Active plan</Card.Title>
				<Card.Description>Your current subscription plan.</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-1 flex-col justify-between gap-6">
				<div>
					<p class="text-2xl font-semibold">Free</p>
					<p class="text-muted-foreground">0€</p>
				</div>
				<Button href="/account/subscriptions" variant="outline">View subscriptions</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Appearance</Card.Title>
				<Card.Description>Choose how Sveltopus should look on this device.</Card.Description>
			</Card.Header>
			<Card.Content>
				<Field.FieldSet>
					<Field.FieldLegend variant="label">Theme</Field.FieldLegend>
					<RadioGroup.Root value={userPrefersMode.current} aria-label="Theme">
						<Field.Field orientation="horizontal">
							<RadioGroup.Item
								id="appearance-light"
								value="light"
								onclick={() => setMode('light')}
							/>
							<Field.FieldContent>
								<Field.FieldLabel for="appearance-light">Light</Field.FieldLabel>
								<Field.FieldDescription>Use a light color scheme.</Field.FieldDescription>
							</Field.FieldContent>
						</Field.Field>

						<Field.Field orientation="horizontal">
							<RadioGroup.Item id="appearance-dark" value="dark" onclick={() => setMode('dark')} />
							<Field.FieldContent>
								<Field.FieldLabel for="appearance-dark">Dark</Field.FieldLabel>
								<Field.FieldDescription>Use a dark color scheme.</Field.FieldDescription>
							</Field.FieldContent>
						</Field.Field>

						<Field.Field orientation="horizontal">
							<RadioGroup.Item
								id="appearance-system"
								value="system"
								onclick={() => setMode('system')}
							/>
							<Field.FieldContent>
								<Field.FieldLabel for="appearance-system">System</Field.FieldLabel>
								<Field.FieldDescription>Follow your device preference.</Field.FieldDescription>
							</Field.FieldContent>
						</Field.Field>
					</RadioGroup.Root>
				</Field.FieldSet>
			</Card.Content>
		</Card.Root>
	</div>

	<Card.Root class="border-destructive/40">
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
