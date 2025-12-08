<script lang="ts">
	import { fade } from 'svelte/transition';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSpinner } from '@fortawesome/free-solid-svg-icons';
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
	transition:fade={{ duration: 150 }}
>
	<div class="relative flex h-full w-full items-center justify-center rounded-lg p-6 shadow-lg">
		<FontAwesomeIcon icon={faSpinner} class="animate-spin text-5xl text-white" />
	</div>
</div>
