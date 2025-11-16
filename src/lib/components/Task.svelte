<script lang="ts">
	import { TaskPriority, type Task } from '$lib/services/task.service.svelte';
	import { fly } from 'svelte/transition';

	const { task, i, onToggle } = $props<{
		task: Task;
		i: number;
		onToggle: (taskId: string, value: boolean) => void;
	}>();
</script>

<div
	class="flex items-center justify-between gap-5 rounded-lg bg-gray-100 p-4 transition"
	class:opacity-50={task.completed}
	in:fly={{ y: 20, delay: i * 50 }}
>
	<div class="flex items-center justify-center">
		<input
			type="checkbox"
			class="size-7 cursor-pointer rounded-full border border-gray-300 text-blue-500 focus:ring-0"
			checked={task.completed}
			onchange={(e) => onToggle(task.id, e.currentTarget.checked)}
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
		{#if task.tag}
			<span class="rounded-full bg-{task.tag.color}-600 px-3 py-1 text-xs text-{task.tag.color}-200"
				>{task.tag.name}</span
			>
		{/if}
	</div>
</div>
