<script lang="ts">
	import { page } from '$app/state';
	import { getPageTitle } from '$lib/utils/pageRoutes';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faBars } from '@fortawesome/free-solid-svg-icons';
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import MobileMenu from './MobileMenu.svelte';
	import SearchModal from './SearchModal.svelte';

	let pageTitle = $derived(getPageTitle(page.route.id ?? ''));

	let mobileMenuOpen = $state<boolean>(false);
	let seachModalOpen = $state<boolean>(false);
</script>

{#if mobileMenuOpen}
	<MobileMenu onClick={() => (mobileMenuOpen = false)} />
{/if}

{#if seachModalOpen}
	<SearchModal onClose={() => (seachModalOpen = false)} />
{/if}

<div class="flex items-center justify-between p-5">
	<button onclick={() => (mobileMenuOpen = true)} class="size-8"
		><FontAwesomeIcon icon={faBars} class="text-xl text-black/70" /></button
	>
	<div class="text-xl font-bold text-black/70">{pageTitle}</div>
	<button class="size-8" onclick={() => (seachModalOpen = true)}
		><FontAwesomeIcon icon={faSearch} class="text-xl text-black/70" /></button
	>
</div>
