<script lang="ts">
	import { page } from '$app/state';
	import { getPageTitle } from '$lib/utils/pageRoutes';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faBars } from '@fortawesome/free-solid-svg-icons';
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import MobileMenu from './MobileMenu.svelte';

	let pageTitle = $derived(getPageTitle(page.route.id ?? ''));

	let mobileMenuOpen = $state<boolean>(false);
</script>

{#if mobileMenuOpen}
	<MobileMenu onClick={() => (mobileMenuOpen = false)} />
{/if}

<div class="flex items-center justify-between p-5">
	<button onclick={() => (mobileMenuOpen = true)} class="size-8"
		><FontAwesomeIcon icon={faBars} class="text-xl text-black" /></button
	>
	<div class="text-1xl font-bold text-zinc-700">{pageTitle}</div>
	<button class="size-8"><FontAwesomeIcon icon={faSearch} class="text-xl text-black" /></button>
</div>
