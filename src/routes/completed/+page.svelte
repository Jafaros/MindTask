<script lang="ts">
	import Task from '$lib/components/Task.svelte';
	import { GetTaskState } from '$lib/services/task.service.svelte';
	import { faChevronDown, faChevronUp, faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { GetTagState } from '$lib/services/tag.service.svelte';

	const taskState = GetTaskState();
	const tagState = GetTagState();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	let createTaskModalOpen = $state(false);

	let groups = $derived(taskState.GetCompletedTasksByGroup());
	let displayedGroups = $state<number[]>([]);

	const ToggleDisplay = (n: number) => {
		if (displayedGroups.includes(n)) {
			displayedGroups = displayedGroups.filter((num) => num != n);
		} else {
			displayedGroups.push(n);
		}
	};
</script>

{#if mounted}
	<div in:fade={{ duration: 200 }}>
		<div class="flex flex-col gap-2">
			{#each groups as group, i}
				<div
					class="rounded-lg border border-zinc-300 p-3"
					in:fly={{ x: -100, duration: 200 }}
					out:fade={{ duration: 200 }}
				>
					<button
						class="flex w-full items-center justify-between gap-5"
						onclick={() => ToggleDisplay(i)}
					>
						<h2 class="text-lg font-semibold text-black/70">
							{tagState.GetTagById(group.tagId)?.name}
						</h2>
						{#if displayedGroups.includes(i)}
							<FontAwesomeIcon icon={faChevronUp} class="text-lg text-black/70" />
						{:else}
							<FontAwesomeIcon icon={faChevronDown} class="text-lg text-black/70" />
						{/if}
					</button>
					{#if displayedGroups.includes(i)}
						<div class="flex flex-col gap-2" transition:slide={{ duration: 200 }}>
							{#each group.tasks as task, j (task.id)}
								<Task {task} i={j} onToggle={(id, val) => taskState.ToggleCompleted(id, val)} />
							{/each}
						</div>
					{/if}
				</div>
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
