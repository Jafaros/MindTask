<script lang="ts">
	import { fade } from 'svelte/transition';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faClose, faStar } from '@fortawesome/free-solid-svg-icons';
	import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
	import { GetQuoteState, type IQuote } from '$lib/services/quote.service.svelte';

	const quoteState = GetQuoteState();

	const { quote, onClose } = $props<{
		quote: IQuote;
		onClose: () => void;
	}>();

	const favourite = $derived(() => quoteState.isSaved(quote));
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
	transition:fade={{ duration: 150 }}
>
	<div class="relative w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg">
		<button
			class="absolute top-0 right-4 text-4xl text-black/70 hover:text-black/70"
			onclick={() => onClose()}
		>
			<FontAwesomeIcon icon={faClose} class="text-xl text-black/70" />
		</button>

		<div class="mx-auto mt-6 max-w-xl border-l-4 border-black/20 p-3 text-center">
			<p class="text-lg text-black/80 italic">"{quote.text}"</p>
			<p class="mt-3 text-sm font-semibold tracking-wide text-black/50">— {quote.author}</p>
			<button
				onclick={() => quoteState.ToggleQuote(quote)}
				class="mt-6 rounded-full p-2 transition-all hover:bg-black/5 active:scale-90"
			>
				{#if favourite()}
					<FontAwesomeIcon
						icon={faStar}
						class="text-xl text-black/60 transition-all duration-300
		       {favourite() ? 'scale-110 text-yellow-500' : 'hover:scale-110'}"
					/>
				{:else}
					<FontAwesomeIcon
						icon={faRegularStar}
						class="text-xl text-black/60 transition-all duration-300
		                {favourite() ? 'scale-110 text-yellow-500' : 'hover:scale-110'}"
					/>
				{/if}
			</button>
		</div>
	</div>
</div>
