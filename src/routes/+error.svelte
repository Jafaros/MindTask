<script lang="ts">
	import { page } from '$app/state';

	let status = page.status;
	let error = page.error?.message;
</script>

<div class="flex flex-col items-center justify-center">
	<div class="text-5xl font-bold">{status}</div>
	<div class="mt-4 text-xl">{error}</div>
</div>
