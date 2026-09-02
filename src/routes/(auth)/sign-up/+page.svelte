<script lang="ts">
	import type { PageProps } from './$types.js';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Sign up</title>
</svelte:head>

<h1>Sign Up</h1>

{#if form?.error}
	<p role="alert">{form.error}</p>
{/if}

<form method="POST">
	<div>
		<label for="email">Email</label>
		<input
			id="email"
			name="email"
			type="email"
			autocomplete="email"
			required
			value={form?.email ?? ''}
		/>
	</div>
	<div>
		<label for="password">Password</label>
		<input
			id="password"
			name="password"
			type="password"
			autocomplete="new-password"
			required
			minlength="8"
		/>
	</div>
	<button type="submit">Sign up</button>
</form>
