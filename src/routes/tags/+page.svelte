<script lang="ts">
	import TagModal from '$lib/components/TagModal.svelte';
	import { type ITag, GetTagState } from '$lib/services/tag.service.svelte';
	import { GetReadableTextFromColor } from '$lib/utils/color';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	const tagState = GetTagState();
	let createTagModalOpen = $state(false);
	let selectedTask = $state<ITag | null>(null);
</script>

{#if selectedTask}
	<TagModal tag={selectedTask} type={'edit'} onClose={() => (selectedTask = null)} />
{/if}

{#if createTagModalOpen}
	<TagModal tag={null} type={'create'} onClose={() => (createTagModalOpen = false)} />
{/if}

{#if mounted}
	<div in:fade={{ duration: 200 }}>
		<div class="mt-4 grid grid-cols-6 gap-2 max-md:grid-cols-3 max-sm:grid-cols-1">
			{#each tagState.GetAvailableTags() as tag, i (tag.id)}
				<button
					in:fly={{ x: 20, delay: i * 50 }}
					class="flex justify-center rounded-lg px-3 py-1 text-lg font-semibold"
					style="background-color: {tag.color}; color: {GetReadableTextFromColor(tag.color ?? '')};"
					onclick={() => (selectedTask = tag)}
				>
					{tag.name}
				</button>
			{/each}
		</div>

		<button
			onclick={() => (createTagModalOpen = true)}
			class="fixed right-5 bottom-5 flex size-12 items-center justify-center rounded-full bg-blue-500 shadow-lg"
		>
			<FontAwesomeIcon icon={faPlus} class="text-xl text-white" />
		</button>
	</div>
{/if}
