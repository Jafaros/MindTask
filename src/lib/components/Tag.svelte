<script lang="ts">
	import type { ITag } from '$lib/services/tag.service.svelte';
	import { fly } from 'svelte/transition';

	const { tag, i, active, onSelect } = $props<{
		tag: ITag;
		i: number;
		active: boolean;
		onSelect: (t: ITag) => void;
	}>();
</script>

<button
	in:fly={{ y: 20, delay: i * 50 }}
	onclick={() => onSelect(tag)}
	class="rounded-full px-3 py-1 text-xs text-black/70"
	class:bg-gray-100={!active}
	class:bg-blue-500={active}
	class:text-white={active}>{tag.name}</button
>
