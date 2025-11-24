<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { SetTaskState } from '$lib/services/task.service.svelte';
	import { SetTagState } from '$lib/services/tag.service.svelte';

	let { children } = $props();

	SetTagState();
	SetTaskState();
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

<Header />

<div class="border-box relative bg-white p-5 text-black">
	{@render children()}
</div>
