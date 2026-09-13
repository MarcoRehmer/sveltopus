<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { ComponentProps } from 'svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { enhance } from '$app/forms';

	let {
		redirectTo = '/',
		form,
		...restProps
	}: ComponentProps<typeof Card.Root> & {
		redirectTo?: string;
		form?: { message?: string; fieldErrors?: Record<string, string[]> } | null;
	} = $props();
</script>

<Card.Root {...restProps}>
	<Card.Header>
		<Card.Title>Create an account</Card.Title>
		<Card.Description>Enter your information below to create your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="post" action="?/signUpEmail" use:enhance>
			<input type="hidden" name="redirectTo" value={redirectTo} />
			<Field.Group>
				<Field.Field>
					<Field.Label for="name">Full Name</Field.Label>
					<Input
						id="name"
						name="name"
						type="text"
						placeholder="John Doe"
						required
						aria-invalid={Boolean(form?.fieldErrors?.name?.[0])}
					/>
					{#if form?.fieldErrors?.name?.[0]}
						<Field.Description class="text-destructive">
							{form.fieldErrors.name[0]}
						</Field.Description>
					{/if}
				</Field.Field>
				<Field.Field>
					<Field.Label for="email">Email</Field.Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="m@example.com"
						required
						aria-invalid={Boolean(form?.fieldErrors?.email?.[0])}
					/>
					{#if form?.fieldErrors?.email?.[0]}
						<Field.Description class="text-destructive">
							{form.fieldErrors.email[0]}
						</Field.Description>
					{/if}
					<Field.Description>
						We'll use this to contact you. We will not share your email with anyone else.
					</Field.Description>
				</Field.Field>
				<Field.Field>
					<Field.Label for="password">Password</Field.Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						aria-invalid={Boolean(form?.fieldErrors?.password?.[0])}
					/>
					{#if form?.fieldErrors?.password?.[0]}
						<Field.Description class="text-destructive">
							{form.fieldErrors.password[0]}
						</Field.Description>
					{/if}
					<Field.Description>Must be at least 8 characters long.</Field.Description>
				</Field.Field>
				<Field.Field>
					<Field.Label for="confirm-password">Confirm Password</Field.Label>
					<Input
						id="confirm-password"
						name="confirmPassword"
						type="password"
						required
						aria-invalid={Boolean(form?.fieldErrors?.confirmPassword?.[0])}
					/>
					{#if form?.fieldErrors?.confirmPassword?.[0]}
						<Field.Description class="text-destructive">
							{form.fieldErrors.confirmPassword[0]}
						</Field.Description>
					{/if}
					<Field.Description>Please confirm your password.</Field.Description>
				</Field.Field>
				<Field.Group>
					<Field.Field>
						<Button type="submit">Create Account</Button>
						<form method="post" action="?/signInGoogle" use:enhance>
							<input type="hidden" name="redirectTo" value={redirectTo} />
							<Button variant="outline" type="submit">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
									<path
										d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
										fill="currentColor"
									/>
								</svg>
								Sign up with Google
							</Button>
						</form>
						{#if form?.message}
							<Field.Description class="text-destructive">{form.message}</Field.Description>
						{/if}
						<Field.Description class="px-6 text-center">
							Already have an account?
							<a href={resolve(`/login?redirectTo=${encodeURIComponent(redirectTo)}` as Pathname)}
								>Sign in</a>
							>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</Field.Group>
		</form>
	</Card.Content>
</Card.Root>
