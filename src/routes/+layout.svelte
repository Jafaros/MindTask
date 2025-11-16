<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { SetTaskState } from '$lib/services/task.service.svelte';
	import { SetTagState } from '$lib/services/tag.service.svelte';

	let { children } = $props();

	SetTaskState();
	SetTagState();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />

<div class="border-box relative bg-white p-5 text-black">
	{@render children()}
</div>
