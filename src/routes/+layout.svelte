<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { SetTaskState } from '$lib/services/task.service.svelte';
	import { SetTagState } from '$lib/services/tag.service.svelte';
	import { GetQuoteState, SetQuoteState, type IQuote } from '$lib/services/quote.service.svelte';
	import QuoteModal from '$lib/components/QuoteModal.svelte';
	import { GetSettingsState, SetSettingsState } from '$lib/services/settings.service.svelte';
	import { NotificationService } from '$lib/services/notification.service';

	let { children } = $props();

	NotificationService.init();

	SetSettingsState();
	SetTagState();
	SetTaskState();
	SetQuoteState();

	const settingsState = GetSettingsState();

	const quoteState = GetQuoteState();
	let quote = $state<IQuote | undefined>(undefined);
	let displayQuoteOnLaunch = $derived<boolean>(settingsState.GetDisplayQuoteOnLaunch());
	let quoteModalVisible = $state<boolean>();

	$effect(() => {
		if (displayQuoteOnLaunch) {
			(async () => {
				quote = await quoteState.FetchRandomQuoteFromAPI();
				quoteModalVisible = true;
			})();
		}
	});
</script>

<svelte:head>
	<title>MindTask</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Jednoduchá a efektivní aplikace pro správu úkolů a štítků." />
	<meta name="author" content="Petr Grajciar" />
	<meta name="keywords" content="task management, to-do list, tags, productivity" />
	<link rel="apple-touch-icon" href={favicon} />
	<link rel="icon" href={favicon} />
</svelte:head>

{#if quote && quoteModalVisible}
	<QuoteModal {quote} onClose={() => (quoteModalVisible = false)} />
{/if}

<Header />

<div class="border-box relative bg-white p-5 text-black">
	{@render children()}
</div>
