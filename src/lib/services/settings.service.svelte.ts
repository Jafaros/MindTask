import { getContext, setContext } from 'svelte';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'mindtask_settings';

export interface ISettings {
	displayQuoteOnLaunch: boolean;
	darkModeEnabled: boolean;
}

const defaultSettings: ISettings = {
	displayQuoteOnLaunch: false,
	darkModeEnabled: false
};

class SettingsService {
	private settings = $state<ISettings>(defaultSettings);
	public loaded = $state<boolean>(false);

	constructor() {
		this.LoadSettingsFromStorage();
	}

	public LoadSettings = (settings: ISettings) => {
		this.settings = settings;
	};

	private LoadSettingsFromStorage = async (): Promise<void> => {
		const { value } = await Preferences.get({ key: STORAGE_KEY });

		if (value) {
			this.settings = JSON.parse(value) as ISettings;
		}

		this.loaded = true;
	};

	private SaveSettings = async (): Promise<void> => {
		await Preferences.set({
			key: STORAGE_KEY,
			value: JSON.stringify(this.settings)
		});
	};

	public GetSafeSettings = $derived(() => {
		if (!this.loaded) return undefined;
		return this.settings;
	});

	public GetDisplayQuoteOnLaunch = $derived((): boolean => {
		return this.settings.displayQuoteOnLaunch;
	});

	public SetDisplayQuoteOnLaunch = (value: boolean) => {
		this.settings.displayQuoteOnLaunch = value;
		this.SaveSettings();
	};

	public GetDarkModeEnabled = $derived((): boolean => {
		return this.settings.darkModeEnabled;
	});

	public SetDarkModeEnabled = (value: boolean) => {
		this.settings.darkModeEnabled = value;
		this.SaveSettings();
	};
}

const SETTINGS_KEY = Symbol('SETTINGS_KEY');

export function SetSettingsState() {
	return setContext(SETTINGS_KEY, new SettingsService());
}

export function GetSettingsState() {
	return getContext<ReturnType<typeof SetSettingsState>>(SETTINGS_KEY);
}
