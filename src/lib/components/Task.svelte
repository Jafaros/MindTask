<script lang="ts">
	import { TaskPriority, type ITask } from '$lib/services/task.service.svelte';
	import { GetReadableTextFromColor } from '$lib/utils/color';
	import { fly } from 'svelte/transition';
	import TaskModal from './TaskModal.svelte';
	import { GetTagState, type ITag } from '$lib/services/tag.service.svelte';

	const { task, i, onToggle } = $props<{
		task: ITask;
		i: number;
		onToggle: (taskId: string, value: boolean) => void;
	}>();

	let taskModalOpen = $state<boolean>(false);

	const tagState = GetTagState();
	const tag: ITag | undefined = $derived(tagState.GetTagById(task.tagId ?? -1));
</script>

{#if taskModalOpen}
	<TaskModal {task} type={'edit'} onClose={() => (taskModalOpen = false)} />
{/if}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="flex items-center justify-between gap-5 rounded-lg bg-gray-100 p-4 transition"
	class:opacity-50={task.completed}
	transition:fly={{ x: -50, delay: i * 50, duration: 200 }}
	onclick={(e) => {
		e.stopPropagation();
		taskModalOpen = true;
	}}
>
	<div class="flex items-center justify-center">
		<input
			type="checkbox"
			class="size-7 cursor-pointer rounded-full border border-gray-300 text-blue-500 focus:ring-0"
			checked={task.completed}
			onclick={(e) => e.stopPropagation()}
			onchange={(e) => {
				onToggle(task.id, e.currentTarget.checked);
			}}
		/>
	</div>
	<div
		class:line-through={task.completed}
		class:text-gray-500={task.completed}
		class="flex flex-col"
	>
		<h2 class="text-base font-medium text-black/70">{task.title}</h2>
		{#if task.dueDate}
			<span
				class="text-xs font-medium text-black/50"
				class:text-red-400={task.dueDate < new Date() && !task.completed}
				>Do
				{#if task.dueDate.getFullYear() !== new Date().getFullYear()}
					{task.dueDate.toLocaleString('cs-CZ', {
						day: 'numeric',
						year: 'numeric',
						month: 'numeric',
						minute: 'numeric',
						hour: 'numeric'
					})}
				{:else}
					{task.dueDate.toLocaleString('cs-CZ', {
						day: 'numeric',
						month: 'numeric',
						minute: 'numeric',
						hour: 'numeric'
					})}
				{/if}
			</span>
		{/if}
	</div>
	<div class="ml-auto flex flex-col items-center gap-1">
		{#if task.priority}
			<span
				class:bg-red-500={task.priority === TaskPriority.High}
				class:text-red-800={task.priority === TaskPriority.High}
				class:bg-yellow-500={task.priority === TaskPriority.Medium}
				class:text-yellow-800={task.priority === TaskPriority.Medium}
				class:bg-green-600={task.priority === TaskPriority.Low}
				class:text-green-800={task.priority === TaskPriority.Low}
				class="rounded-full px-3 py-1 text-xs text-white">{task.priority}</span
			>
		{/if}
		{#if tag}
			<span
				class="rounded-full px-3 py-1 text-xs"
				style="background-color: {tag.color}; color: {GetReadableTextFromColor(tag.color ?? '')};"
				>{tag.name}</span
			>
		{/if}
	</div>
</div>
