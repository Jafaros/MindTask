import { getContext, setContext } from 'svelte';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'mindtask_tags';

export interface ITag {
	id: string;
	name: string;
	color?: string;
	assignable: boolean;
}

class TagService {
	private tags = $state<ITag[]>([]);

	constructor() {
		this.LoadTagsFromStorage();
	}

	public LoadTags = (tags: ITag[]): void => {
		this.tags = tags;
	};

	private LoadTagsFromStorage = async (): Promise<void> => {
		const { value } = await Preferences.get({ key: STORAGE_KEY });

		if (value) {
			this.tags = JSON.parse(value) as ITag[];
		}
	};

	private SaveTags = async (): Promise<void> => {
		await Preferences.set({
			key: STORAGE_KEY,
			value: JSON.stringify(this.tags)
		});
	};

	public ClearTags = (): void => {
		this.tags = [];
	};

	public GetAllTags = $derived(() => {
		return this.tags;
	});

	public GetTagById = $derived<(tagId: string) => ITag | undefined>((tagId) => {
		return this.tags.find((tag) => tag.id === tagId);
	});

	public GetAvailableTags = $derived(() => {
		return this.tags.filter((tag) => tag.assignable);
	});

	public AddTag = (tag: ITag): void => {
		this.tags.push(tag);
		this.SaveTags();
	};

	public RemoveTag = (tagId: string): void => {
		this.tags = this.tags.filter((tag) => tag.id !== tagId);
		this.SaveTags();
	};

	public UpdateTag = (updatedTag: ITag): void => {
		this.tags = this.tags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag));
		this.SaveTags();
	};
}

const TAG_KEY = Symbol('TAG_KEY');

export function SetTagState() {
	return setContext(TAG_KEY, new TagService());
}

export function GetTagState() {
	return getContext<ReturnType<typeof SetTagState>>(TAG_KEY);
}
