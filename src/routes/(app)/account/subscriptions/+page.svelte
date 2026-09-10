<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';

	const freeFeatures = ['feature 1', 'feature 2', 'feature 3'];
	const proFeatures = [
		...freeFeatures,
		'Everything in Free, plus:',
		'feature 5',
		'feature 6',
		'feature 7'
	];
	const enterpriseFeatures = [...proFeatures, 'feature 8', 'feature 9', 'feature 10'];

	const featurePlan: Record<string, string[]> = {
		Free: freeFeatures,
		Pro: proFeatures,
		Enterprise: enterpriseFeatures
	};

	const plans = [
		{
			name: 'Free',
			description: 'A simple starting point for your account.',
			price: '0€',
			priceSuffix: 'forever',
			features: featurePlan.Free,
			current: true,
			badge: ''
		},
		{
			name: 'Pro',
			description: 'More capability for growing teams.',
			price: '39,99€',
			priceSuffix: 'per month',
			features: featurePlan.Pro,
			current: false,
			badge: 'Most loved'
		},
		{
			name: 'Enterprise',
			description: 'Flexible support for larger organizations.',
			price: '',
			priceSuffix: '',
			features: featurePlan.Enterprise,
			current: false,
			badge: ''
		}
	];

	const comparisonFeatures = [...new Set(Object.values(featurePlan).flat())];
</script>

<svelte:head>
	<title>Subscriptions | Sveltopus</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-7xl flex-col gap-8">
	<div class="max-w-2xl">
		<h1 class="text-3xl font-semibold tracking-tight">Subscriptions</h1>
		<p class="mt-2 text-muted-foreground">
			Choose the plan that best fits your needs. You can change your plan at any time.
		</p>
	</div>

	<div class="grid gap-4 md:grid-cols-3">
		{#each plans as plan (plan.name)}
			<Card.Root
				class={[
					'relative flex h-full flex-col',
					plan.current && 'border-primary ring-2 ring-primary/20',
					plan.name === 'Pro' && 'border-primary/50'
				]}
			>
				{#if plan.badge}
					<Badge class="absolute end-5 top-5">
						{plan.badge}
					</Badge>
				{/if}

				<Card.Header class="min-h-36">
					<div class="flex items-center gap-2">
						<Card.Title>{plan.name}</Card.Title>
						{#if plan.current}
							<span
								class="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
							>
								Current plan
							</span>
						{/if}
					</div>
					<Card.Description>{plan.description}</Card.Description>
				</Card.Header>

				<Card.Content class="flex flex-1 flex-col gap-6">
					<div class="min-h-20">
						{#if plan.price}
							<div class="flex items-baseline gap-2">
								<span class="text-4xl font-semibold tracking-tight">{plan.price}</span>
								<span class="text-sm text-muted-foreground">{plan.priceSuffix}</span>
							</div>
						{:else}
							<span class="text-3xl font-semibold tracking-tight">Let's talk</span>
						{/if}
					</div>

					<ul class="grid gap-3 text-sm">
						{#each plan.features as feature, index (feature)}
							<li
								class={[
									'flex items-start gap-2',
									index === 0 && plan.name === 'Pro' && 'font-medium'
								]}
							>
								<CheckIcon class="mt-0.5 size-4 shrink-0 text-primary" />
								<span>{feature}</span>
							</li>
						{/each}
					</ul>
				</Card.Content>

				<Card.Footer>
					<Button
						class="w-full"
						variant={plan.current ? 'secondary' : plan.name === 'Pro' ? 'default' : 'outline'}
						type="button"
						disabled
					>
						{plan.current
							? 'Current plan'
							: plan.name === 'Enterprise'
								? "Let's talk"
								: 'Choose Pro'}
					</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>

	<section class="flex flex-col gap-4">
		<div>
			<h2 class="text-2xl font-semibold tracking-tight">Feature comparison</h2>
			<p class="mt-2 text-muted-foreground">Compare the features included with each plan.</p>
		</div>

		<div class="hidden overflow-hidden rounded-lg border md:block">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-1/2">Feature</Table.Head>
						{#each plans as plan (plan.name)}
							<Table.Head class="text-center">{plan.name}</Table.Head>
						{/each}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each comparisonFeatures as feature (feature)}
						<Table.Row>
							<Table.Cell class="font-medium">{feature}</Table.Cell>
							{#each plans as plan (plan.name)}
								<Table.Cell class="text-center">
									{#if plan.features.includes(feature)}
										<CheckIcon
											class="mx-auto size-4 text-primary"
											aria-label={`${plan.name} includes ${feature}`}
										/>
									{:else}
										<span
											class="text-muted-foreground"
											aria-label={`${plan.name} does not include ${feature}`}
										>
											&mdash;
										</span>
									{/if}
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<div class="grid gap-3 md:hidden">
			{#each comparisonFeatures as feature (feature)}
				<div class="rounded-lg border p-4">
					<h3 class="font-medium">{feature}</h3>
					<div class="mt-3 grid gap-2">
						{#each plans as plan (plan.name)}
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">{plan.name}</span>
								{#if plan.features.includes(feature)}
									<CheckIcon
										class="size-4 text-primary"
										aria-label={`${plan.name} includes ${feature}`}
									/>
								{:else}
									<span
										class="text-muted-foreground"
										aria-label={`${plan.name} does not include ${feature}`}
									>
										&mdash;
									</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
