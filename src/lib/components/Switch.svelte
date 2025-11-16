<script lang="ts">
	let { enabled = $bindable() } = $props<{ enabled: boolean }>();
</script>

<label class="flex cursor-pointer items-center select-none">
	<input type="checkbox" bind:checked={enabled} class="peer sr-only" />

	<div
		class="relative h-6 w-11 rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-blue-500"
	>
		<div
			class="
                absolute top-1 left-1 h-4 w-4 translate-x-0 transform
                rounded-full bg-white transition-all
                duration-300 {enabled ? 'translate-x-5' : ''}
            "
		></div>
	</div>
</label>
