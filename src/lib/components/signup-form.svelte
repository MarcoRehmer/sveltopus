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
						<Field.Description class="text-destructive"
							>{form.fieldErrors.name[0]}</Field.Description
						>
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
						<Field.Description class="text-destructive"
							>{form.fieldErrors.email[0]}</Field.Description
						>
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
						<Field.Description class="text-destructive"
							>{form.fieldErrors.password[0]}</Field.Description
						>
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
						<Field.Description class="text-destructive"
							>{form.fieldErrors.confirmPassword[0]}</Field.Description
						>
					{/if}
					<Field.Description>Please confirm your password.</Field.Description>
				</Field.Field>
				<Field.Group>
					<Field.Field>
						<Button type="submit">Create Account</Button>
						<Button variant="outline" type="button">Sign up with Google</Button>
						{#if form?.message}
							<Field.Description class="text-destructive">{form.message}</Field.Description>
						{/if}
						<Field.Description class="px-6 text-center">
							Already have an account?
							<a href={resolve(`/login?redirectTo=${encodeURIComponent(redirectTo)}` as Pathname)}
								>Sign in</a
							>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</Field.Group>
		</form>
	</Card.Content>
</Card.Root>
