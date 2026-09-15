<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { m } from '$lib/paraglide/messages';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>{m.signup_title()} | Sveltopus</title>
</svelte:head>

<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">{m.signup_title()}</h1>
		<p class="text-sm text-muted-foreground">
			{m.signup_already_have_account()} <a href={resolve('/login')} class="underline underline-offset-4 hover:text-primary">{m.signup_login_link()}</a>
		</p>
	</div>
	<div class="grid gap-6">
		<form
			method="POST"
			action="?/signup"
			use:enhance={async () => {
				isLoading = true;
				return async ({ result }) => {
					isLoading = false;
					if (result.type === 'success') {
						// Handle successful signup
					} else if (result.type === 'failure') {
						// Handle failure
					}
				};
			}}
		>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">{m.signup_email_label()}</Label>
					<Input id="email" name="email" type="email" placeholder="name@example.com" bind:value={email} required />
				</div>
				<div class="grid gap-2">
					<Label for="password">{m.signup_password_label()}</Label>
					<Input id="password" name="password" type="password" required bind:value={password} />
				</div>
				<div class="grid gap-2">
					<Label for="confirmPassword">{m.signup_confirm_password_label()}</Label>
					<Input id="confirmPassword" name="confirmPassword" type="password" required bind:value={confirmPassword} />
				</div>
				<Button type="submit" class="w-full" disabled={isLoading}>
					{#if isLoading}
						<span class="flex items-center gap-2">
							<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							{m.signup_submit_button()}
						</span>
					{:else}
						{m.signup_submit_button()}
					{/if}
				</Button>
			</div>
		</form>
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t"></span>
			</div>
			<!-- <div class="relative flex justify-center text-xs uppercase">
				<span class="bg-background px-2 text-muted-foreground">
					Or continue with
				</span>
			</div> -->
		</div>
		<!-- <div class="grid grid-cols-2 gap-4">
			<Button variant="outline" type="button" disabled={isLoading}>
				{m.login_google_button()}
			</Button>
			<Button variant="outline" type="button" disabled={isLoading}>
				{m.login_github_button()}
			</Button>
		</div> -->
	</div>
</div>
