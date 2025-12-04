<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import { GetTaskState } from '$lib/services/task.service.svelte';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import TaskModal from '$lib/components/TaskModal.svelte';

	const taskState = GetTaskState();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	let createTaskModalOpen = $state(false);
</script>

{#if createTaskModalOpen}
	<TaskModal task={null} type={'create'} onClose={() => (createTaskModalOpen = false)} />
{/if}

{#if mounted}
	<div in:fade={{ duration: 200 }}>
		<div class="flex flex-col gap-2">
			{#each taskState.GetAllTasksToComplete() as task, i (task.id)}
				<Task {task} {i} onToggle={(id, val) => taskState.ToggleCompleted(id, val)} />
			{/each}
		</div>

		<button
			onclick={() => (createTaskModalOpen = true)}
			class="fixed right-5 bottom-5 flex size-12 items-center justify-center rounded-full bg-blue-500 shadow-lg"
		>
			<FontAwesomeIcon icon={faPlus} class="text-xl text-white" />
		</button>
	</div>
{/if}
