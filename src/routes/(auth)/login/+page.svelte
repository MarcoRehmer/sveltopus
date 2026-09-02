<script lang="ts">
	import type { PageProps } from './$types.js';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Log in</title>
</svelte:head>

<h1>Login</h1>

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
		<input id="password" name="password" type="password" autocomplete="current-password" required />
	</div>
	<button type="submit">Log in</button>
</form>
