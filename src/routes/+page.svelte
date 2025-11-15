<script lang="ts">
	import { faCode } from '@fortawesome/free-solid-svg-icons';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
</script>

<h1><FontAwesomeIcon icon={faCode} class="text-black" /> Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<button
	class="fixed right-5 bottom-5 flex size-12 items-center justify-center rounded-full bg-blue-500 shadow-lg"
>
	<FontAwesomeIcon icon={faPlus} class="text-xl text-white" />
</button>
