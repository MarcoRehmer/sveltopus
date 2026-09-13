<script lang="ts">
	import LoginForm from '$lib/components/login-form.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<LoginForm redirectTo={data.redirectTo} {form} />
</div>
