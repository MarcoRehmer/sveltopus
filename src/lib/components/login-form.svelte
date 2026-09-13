<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { enhance } from '$app/forms';

	let {
		redirectTo = '/',
		form
	}: {
		redirectTo?: string;
		form?: { message?: string; fieldErrors?: Record<string, string[]> } | null;
	} = $props();
	const id = $props.id();
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="post" action="?/signInEmail" use:enhance>
			<input type="hidden" name="redirectTo" value={redirectTo} />
			<FieldGroup>
				<Field>
					<FieldLabel for="email-{id}">Email</FieldLabel>
					<Input
						id="email-{id}"
						name="email"
						type="email"
						placeholder="m@example.com"
						required
						aria-invalid={Boolean(form?.fieldErrors?.email?.[0])}
					/>
					{#if form?.fieldErrors?.email?.[0]}
						<FieldDescription class="text-destructive">{form.fieldErrors.email[0]}</FieldDescription>
					{/if}
				</Field>
				<Field>
					<div class="flex items-center">
						<FieldLabel for="password-{id}">Password</FieldLabel>
						<a href="##" class="ms-auto inline-block text-sm underline"> Forgot your password? </a>
					</div>
					<Input
						id="password-{id}"
						name="password"
						type="password"
						required
						aria-invalid={Boolean(form?.fieldErrors?.password?.[0])}
					/>
					{#if form?.fieldErrors?.password?.[0]}
						<FieldDescription class="text-destructive">
							{form.fieldErrors.password[0]}
						</FieldDescription>
					{/if}
				</Field>
				<Field>
					<Button type="submit" class="w-full">Login</Button>
					<form method="post" action="?/signInGoogle" use:enhance>
						<input type="hidden" name="redirectTo" value={redirectTo} />
						<Button variant="outline" type="submit" class="w-full">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path
									d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
									fill="currentColor"
								/>
							</svg>
							Login with Google
						</Button>
					</form>
					{#if form?.message}
						<FieldDescription class="text-center text-destructive">{form.message}</FieldDescription>
					{/if}
					<FieldDescription class="text-center">
						Don't have an account?
						<a href={resolve(`/signup?redirectTo=${encodeURIComponent(redirectTo)}` as Pathname)}
							>Sign up</a
						>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	</Card.Content>
</Card.Root>
