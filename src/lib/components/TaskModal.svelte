<script lang="ts">
	import { GetTagState } from '$lib/services/tag.service.svelte';
	import { GetTaskState, TaskPriority, type ITask } from '$lib/services/task.service.svelte';
	import { fade } from 'svelte/transition';
	import Switch from './Switch.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faClose } from '@fortawesome/free-solid-svg-icons';

	const { task, type, onClose } = $props<{
		task: ITask | null;
		type: 'create' | 'edit';
		onClose: () => void;
	}>();
	const tagState = GetTagState();
	const taskState = GetTaskState();

	const now = new Date();

	let name = $state(task ? task.title : '');
	let dueDate = $state(
		task ? task?.dueDate.toISOString().split('T')[0] : now.toISOString().split('T')[0]
	);
	let dueTime = $state(
		task
			? task?.dueDate.toLocaleString('cs-CZ', { hour: 'numeric', minute: 'numeric' })
			: `${now.getHours() + 2}:00`
	);
	let selectedPriority = $state(task ? task.priority : '');
	let selectedCategory = $state(task && task.tag ? task.tag.id : '');
	let reminderSet = $state(false);

	function CreateTask() {
		const task: ITask = {
			id: crypto.randomUUID(),
			title: name,
			dueDate: new Date(`${dueDate}T${dueTime}`),
			priority: selectedPriority === '' ? undefined : (selectedPriority as TaskPriority),
			tag: tagState.GetAllTags().find((tag) => tag.id === selectedCategory) || undefined,
			completed: false
		};

		taskState.AddTask(task);

		onClose();
	}

	function EditTask() {
		if (!task) return;

		const updatedTask: ITask = {
			...task,
			title: name,
			dueDate: new Date(`${dueDate}T${dueTime}`),
			priority: selectedPriority === '' ? undefined : (selectedPriority as TaskPriority),
			tag: tagState.GetAllTags().find((tag) => tag.id === selectedCategory) || undefined
		};

		taskState.UpdateTask(updatedTask);

		onClose();
	}

	function RemoveTask() {
		if (!task) return;

		taskState.RemoveTask(task.id);

		onClose();
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
	in:fade={{ duration: 200 }}
>
	{#if type === 'create'}
		<form
			onsubmit={CreateTask}
			class="relative max-h-[95%] w-[95%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
		>
			<button type="button" class="absolute top-3 right-3 font-bold" onclick={onClose}
				><FontAwesomeIcon icon={faClose} class="text-xl text-black/70" /></button
			>

			<h2 class="mb-4 text-xl font-semibold">Vytvořit nový úkol</h2>

			<div class="flex flex-col gap-4">
				<label class="flex flex-col">
					<span class="mb-1 font-medium">Název úkolu</span>
					<input
						type="text"
						bind:value={name}
						required
						class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</label>

				<div class="flex items-end gap-2">
					<label class="flex flex-col">
						<span class="mb-1 font-medium">Datum dokončení</span>
						<input
							type="date"
							bind:value={dueDate}
							class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</label>

					<label class="flex flex-col">
						<span class="mb-1 font-medium">Čas dokončení</span>
						<input
							type="time"
							bind:value={dueTime}
							class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</label>
				</div>

				<div class="mt-3 flex items-center justify-between gap-2">
					<span class="font-medium">Nastavit připomenutí</span>
					<Switch bind:enabled={reminderSet} />
				</div>

				{#if reminderSet}
					<div class="flex items-end gap-2">
						<label class="flex flex-col">
							<span class="mb-1 font-medium">Datum připomenutí</span>
							<input
								type="date"
								bind:value={dueDate}
								class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</label>

						<label class="flex flex-col">
							<span class="mb-1 font-medium">Čas</span>
							<input
								type="time"
								bind:value={dueTime}
								class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</label>
					</div>
				{/if}

				<label class="flex flex-col">
					<span class="mb-1 font-medium">Priorita</span>
					<select
						bind:value={selectedPriority}
						class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						<option value="">Žádná</option>
						{#each Array(TaskPriority.Low, TaskPriority.Medium, TaskPriority.High) as priority}
							<option value={priority}>{priority}</option>
						{/each}
					</select>
				</label>

				<label class="flex flex-col">
					<span class="mb-1 font-medium">Kategorie</span>
					<select
						bind:value={selectedCategory}
						class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						<option value="">Žádná</option>
						{#each tagState.GetAvailableTags() as tag}
							<option value={tag.id}>{tag.name}</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="flex items-center justify-center gap-2">
				<button type="submit" class="mt-4 rounded bg-green-700 px-4 py-2 text-white"
					>Vytvořit</button
				>
			</div>
		</form>
	{:else if type === 'edit'}
		<form
			onsubmit={EditTask}
			class="relative max-h-[95%] w-[95%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
		>
			<button type="button" class="absolute top-4 right-4 font-bold" onclick={onClose}
				><FontAwesomeIcon icon={faClose} class="text-xl text-black/70" /></button
			>

			<h2 class="mb-4 text-xl font-semibold">Vytvořit nový úkol</h2>

			<div class="flex flex-col gap-4">
				<label class="flex flex-col">
					<span class="mb-1 font-medium">Název úkolu</span>
					<input
						type="text"
						bind:value={name}
						required
						class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</label>

				<div class="flex items-end gap-2">
					<label class="flex flex-col">
						<span class="mb-1 font-medium">Datum dokončení</span>
						<input
							type="date"
							bind:value={dueDate}
							class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</label>

					<label class="flex flex-col">
						<span class="mb-1 font-medium">Čas dokončení</span>
						<input
							type="time"
							bind:value={dueTime}
							class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</label>
				</div>

				<div class="mt-3 flex items-center justify-between gap-2">
					<span class="font-medium">Nastavit připomenutí</span>
					<Switch bind:enabled={reminderSet} />
				</div>

				{#if reminderSet}
					<div class="flex items-end gap-2">
						<label class="flex flex-col">
							<span class="mb-1 font-medium">Datum připomenutí</span>
							<input
								type="date"
								bind:value={dueDate}
								class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</label>

						<label class="flex flex-col">
							<span class="mb-1 font-medium">Čas</span>
							<input
								type="time"
								bind:value={dueTime}
								class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</label>
					</div>
				{/if}

				<label class="flex flex-col">
					<span class="mb-1 font-medium">Priorita</span>
					<select
						bind:value={selectedPriority}
						class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						<option value="">Žádná</option>
						{#each Array(TaskPriority.Low, TaskPriority.Medium, TaskPriority.High) as priority}
							<option value={priority}>{priority}</option>
						{/each}
					</select>
				</label>

				<label class="flex flex-col">
					<span class="mb-1 font-medium">Kategorie</span>
					<select
						bind:value={selectedCategory}
						class="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						<option value="">Žádná</option>
						{#each tagState.GetAvailableTags() as tag}
							<option value={tag.id}>{tag.name}</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="flex items-center justify-center gap-2">
				<button
					type="button"
					class="mt-4 rounded bg-red-500 px-4 py-2 text-white"
					onclick={RemoveTask}>Smazat</button
				>

				<button type="submit" class="mt-4 rounded bg-green-700 px-4 py-2 text-white">Upravit</button
				>
			</div>
		</form>
	{/if}
</div>
