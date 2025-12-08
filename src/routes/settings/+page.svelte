<script lang="ts">
	import Switch from '$lib/components/Switch.svelte';
	import { GetSettingsState } from '$lib/services/settings.service.svelte';
	// import { faMoon } from '@fortawesome/free-regular-svg-icons';
	import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	const settingsState = GetSettingsState();

	let darkModeEnabled = $derived<boolean>(settingsState.GetDarkModeEnabled());
	let displayQuoteOnLaunch = $derived<boolean>(settingsState.GetDisplayQuoteOnLaunch());
</script>

<div class="flex flex-col gap-4">
	<!-- Možná v jiné verzi
	<div
		class="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2
		       backdrop-blur-sm transition-all hover:bg-black/10 active:scale-[0.98]"
	>
		<div class="flex items-center gap-3 text-black/80">
			<div class="rounded-lg bg-black/10 p-2">
				<FontAwesomeIcon icon={faMoon} class="text-black/70" />
			</div>
			<p class="text-base font-medium">Tmavý režim</p>
		</div>

		<Switch
			bind:enabled={darkModeEnabled}
			onChange={() => settingsState.SetDarkModeEnabled(darkModeEnabled)}
		/>
	</div>
	-->

	<div
		class="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2
		       backdrop-blur-sm transition-all hover:bg-black/10 active:scale-[0.98]"
	>
		<div class="flex items-center gap-3 text-black/80">
			<div class="rounded-lg bg-black/10 p-2">
				<FontAwesomeIcon icon={faQuoteRight} class="text-black/70" />
			</div>
			<p class="text-base font-medium">Zobrazovat citát při spuštění</p>
		</div>

		<Switch
			bind:enabled={displayQuoteOnLaunch}
			onChange={() => settingsState.SetDisplayQuoteOnLaunch(displayQuoteOnLaunch)}
		/>
	</div>
</div>
