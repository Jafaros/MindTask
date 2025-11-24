<script lang="ts">
	import { GetTagState, type ITag } from '$lib/services/tag.service.svelte';
	import { fade } from 'svelte/transition';

	const { tag, type, onClose } = $props<{
		tag: ITag | null;
		type: 'create' | 'edit';
		onClose: () => void;
	}>();
	const tagState = GetTagState();

	let name = $state(tag ? tag.name : '');
	let color = $state(tag ? tag.color : '#FFFFFF');

	function CreateTag() {
		const tag: ITag = {
			id: crypto.randomUUID(),
			name: name,
			color: color,
			assignable: true
		};

		tagState.AddTag(tag);
		onClose();
	}

	function EditTag() {
		const editedTag: ITag = {
			id: tag.id,
			name: name,
			color: color,
			assignable: true
		};

		tagState.UpdateTag(editedTag);
		onClose();
	}

	function RemoveTag() {
		if (tag) {
			tagState.RemoveTag(tag.id);
		}
		onClose();
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
	in:fade={{ duration: 200 }}
>
	{#if type === 'create'}
		<form
			onsubmit={CreateTag}
			class="max-h-[95%] w-[95%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
		>
			<h2 class="mb-4 text-xl font-semibold">Vytvořit nový štítek</h2>

			<div class="flex flex-col gap-4">
				<label class="flex flex-col">
					<span class="mb-1 font-medium">Název štítku</span>
					<input
						type="text"
						bind:value={name}
						maxlength="16"
						required
						class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</label>

				<label class="flex flex-col">
					<span class="mb-1 font-medium">Barva štítku</span>
					<input type="color" bind:value={color} class="h-8 w-16 border-0 p-0" />
				</label>
			</div>

			<div class="flex items-center justify-center gap-2">
				<button
					type="button"
					class="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
					onclick={onClose}>Zavřít</button
				>
				<button type="submit" class="mt-4 rounded bg-green-700 px-4 py-2 text-white"
					>Vytvořit</button
				>
			</div>
		</form>
	{:else if type === 'edit'}
		<form
			onsubmit={EditTag}
			class="max-h-[95%] w-[95%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
		>
			<h2 class="mb-4 text-xl font-semibold">Upravit štítek</h2>

			<div class="flex flex-col gap-4">
				<label class="flex flex-col">
					<span class="mb-1 font-medium">Název štítku</span>
					<input
						type="text"
						bind:value={name}
						maxlength="16"
						required
						class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</label>

				<label class="flex max-w-1/2 flex-col">
					<span class="mb-1 font-medium">Barva štítku</span>
					<input type="color" bind:value={color} class="h-8 w-16 border-0 p-0" />
				</label>
			</div>

			<div class="flex items-center justify-center gap-2">
				<button
					type="button"
					class="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
					onclick={onClose}>Zavřít</button
				>
				<button
					type="button"
					class="mt-4 rounded bg-red-700 px-4 py-2 text-white"
					onclick={RemoveTag}>Smazat</button
				>
				<button type="submit" class="mt-4 rounded bg-green-700 px-4 py-2 text-white">Upravit</button
				>
			</div>
		</form>
	{/if}
</div>
