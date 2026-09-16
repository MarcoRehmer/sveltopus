<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	
	import { m } from '$lib/paraglide/messages';

	let isSending = $state(false);
	let emailStatus = $state<string | null>(null);
</script>

<svelte:head>
	<title>{m.dashboard_title()} | Sveltopus</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<h1 class="text-3xl font-semibold tracking-tight">{m.dashboard_title()}</h1>
	<p class="text-muted-foreground">{m.dashboard_description()}</p>

	<div class="mt-6">
		<form
			method="POST"
			action="?/sendWelcomeEmail"
			use:enhance={async () => {
				isSending = true;
				return async ({ result }) => {
					isSending = false;
					if (result.type === 'success') {
						emailStatus = 'success';
					} else if (result.type === 'failure') {
						emailStatus = 'error';
					}
				};
			}}
		>
			<Button
				type="submit"
				disabled={isSending}
				class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
			>
				{#if isSending}
					<span class="flex items-center gap-2">
						<svg
							class="h-4 w-4 animate-spin"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
							{m.sending_welcome_email()}
						</span>
					{:else}
						{m.send_welcome_email_button()}
					{/if}
					</Button>
			</form>
			{#if emailStatus === 'success'}
				<p class="mt-2 text-sm text-green-600">{m.email_sent_success()}</p>
			{:else if emailStatus === 'error'}
				<p class="mt-2 text-sm text-red-600">
					{m.email_sent_error()}
				</p>
			{/if}
	</div>
	</div>
