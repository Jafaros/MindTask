<script lang="ts">
	import CreateTaskModal from '$lib/components/CreateTaskModal.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import Task from '$lib/components/Task.svelte';
	import { GetTagState, type ITag } from '$lib/services/tag.service.svelte';
	import { GetTaskState } from '$lib/services/task.service.svelte';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const taskState = GetTaskState();
	const tagState = GetTagState();

	let activeTag: ITag = $state<ITag>(tagState.GetAllTags()[0] || null);

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	let createTaskModalOpen = $state(false);
</script>

{#if createTaskModalOpen}
	<CreateTaskModal onClose={() => (createTaskModalOpen = false)} />
{/if}

{#if mounted}
	<div in:fade={{ duration: 200 }}>
		<div class="no-scrollbar flex items-center gap-2 overflow-x-auto">
			{#each tagState.GetAllTags() as tag, i}
				<Tag {tag} {i} active={activeTag?.id === tag.id} onSelect={(t) => (activeTag = t)} />
			{/each}
		</div>

		<div class="mt-4 flex flex-col gap-2">
			{#each taskState.GetTasksByTag(activeTag.id) as task, i}
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
