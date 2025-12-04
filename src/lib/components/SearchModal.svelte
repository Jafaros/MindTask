<script lang="ts">
	import { GetTaskState, type ITask } from '$lib/services/task.service.svelte';
	import { fade, fly } from 'svelte/transition';
	import Task from './Task.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faClose } from '@fortawesome/free-solid-svg-icons';

	const taskState = GetTaskState();

	let searchQuery = $state<string>('');
	let searchedTasks = $derived(() => {
		return taskState.GetTasksByName(searchQuery);
	});

	const { onClose } = $props<{
		onClose: () => void;
	}>();
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
	transition:fade={{ duration: 150 }}
>
	<div
		class="relative w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg transition-all"
		transition:fly={{ y: -500, duration: 200 }}
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-bold text-black/70">Vyhledat</h2>
		</div>

		<button
			class="absolute top-0 right-4 text-4xl text-black/70 hover:text-black/70"
			onclick={() => onClose()}
		>
			<FontAwesomeIcon icon={faClose} class="text-xl text-black/70" />
		</button>

		<input
			type="search"
			bind:value={searchQuery}
			placeholder="Vyhledat úkol..."
			class="w-full rounded border border-gray-300 p-2"
		/>

		<div class="mt-4 flex max-h-[95%] flex-col gap-2 overflow-y-auto transition-all">
			{#each searchedTasks() as task, i (task.id)}
				<Task {task} {i} onToggle={(id, val) => taskState.ToggleCompleted(id, val)} />
			{/each}
		</div>
		{#if searchQuery.trim() !== '' && searchedTasks().length <= 0}
			<p class="mt-4 text-gray-500" in:fly={{ x: -200, duration: 150 }}>Žádné úkoly nenalezeny.</p>
		{/if}
	</div>
</div>
