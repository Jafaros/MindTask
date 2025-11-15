<script lang="ts">
	import { pageRoutes } from '$lib/utils/pageRoutes';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { fade, fly } from 'svelte/transition';

	import logo from '$lib/assets/favicon.svg';

	const { onClick } = $props<{ onClick: () => void }>();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="fixed top-0 left-0 z-40 flex h-full w-full bg-black/50"
	onclick={onClick}
	transition:fade
>
	<div class="h-full w-3/4 bg-white p-4 shadow-lg" in:fly={{ x: -300 }} out:fly={{ x: -300 }}>
		<div class="flex items-center gap-3">
			<img src={logo} alt="MindTask Logo" class="h-12 w-12" />
			<div class="text-3xl font-bold">MindTask</div>
		</div>
		<div class="mt-5 flex flex-col">
			{#each pageRoutes as route}
				<a
					onclick={onClick}
					href={route.path}
					class="flex items-center gap-3 py-4 text-lg font-semibold hover:bg-gray-200"
					><FontAwesomeIcon icon={route.icon} class="text-2xl text-black" />{route.title}</a
				>
			{/each}
		</div>
	</div>
</div>
