<script lang="ts">
	import Tag from '$lib/components/Tag.svelte';
	import Task from '$lib/components/Task.svelte';
	import { GetTagState, type ITag } from '$lib/services/tag.service.svelte';
	import { GetTaskState } from '$lib/services/task.service.svelte';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import TaskModal from '$lib/components/TaskModal.svelte';
	import { GetQuoteState } from '$lib/services/quote.service.svelte';

	const taskState = GetTaskState();
	const tagState = GetTagState();
	const quoteState = GetQuoteState();

	let activeTag = $derived<ITag | null>(tagState.GetAllTags()[0] || null);

	let mounted = $state(false);

	onMount(() => {
		quoteState.FetchQuoteFromAPI();
		mounted = true;
	});

	let createTaskModalOpen = $state(false);
</script>

{#if createTaskModalOpen}
	<TaskModal task={null} type={'create'} onClose={() => (createTaskModalOpen = false)} />
{/if}

{#if mounted}
	<div in:fade={{ duration: 200 }}>
		<div class="no-scrollbar flex items-center gap-2 overflow-x-auto">
			{#each tagState.GetAllTags() as tag, i (tag.id)}
				<Tag {tag} {i} active={activeTag?.id === tag.id} onSelect={(t) => (activeTag = t)} />
			{/each}
		</div>

		<div class="mt-4 flex flex-col gap-2">
			{#if activeTag}
				{#each taskState.GetTasksByTag(activeTag.id) as task, i (`${activeTag?.id}-${task.id}`)}
					<Task {task} {i} onToggle={(id, val) => taskState.ToggleCompleted(id, val)} />
				{/each}
			{/if}
		</div>

		<button
			onclick={() => (createTaskModalOpen = true)}
			class="fixed right-5 bottom-5 flex size-12 items-center justify-center rounded-full bg-blue-500 shadow-lg"
		>
			<FontAwesomeIcon icon={faPlus} class="text-xl text-white" />
		</button>
	</div>
{/if}
