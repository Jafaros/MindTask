import { getContext, setContext } from 'svelte';

export interface ITag {
	id: string;
	name: string;
	color?: string;
	assignable: boolean;
}

class TagService {
	private tags = $state<ITag[]>([]);

	constructor() {
		// Initialize with some dummy data
		this.tags = [
			{
				id: crypto.randomUUID(),
				name: 'Dnes',
				color: '#808080',
				assignable: false
			},
			{
				id: crypto.randomUUID(),
				name: 'Práce',
				color: '#5959c5',
				assignable: true
			},
			{
				id: crypto.randomUUID(),
				name: 'Osobní',
				color: '#d48104ff',
				assignable: true
			},
			{
				id: crypto.randomUUID(),
				name: 'Nákupy',
				color: '#9e3c3cff',
				assignable: true
			},
			{
				id: crypto.randomUUID(),
				name: 'Studium',
				color: '#f0b1f0ff',
				assignable: true
			}
		];
	}

	public LoadTags = (tags: ITag[]): void => {
		this.tags = tags;
	};

	public ClearTags = (): void => {
		this.tags = [];
	};

	public GetAllTags = $derived(() => {
		return this.tags;
	});

	public GetAvailableTags = $derived(() => {
		return this.tags.filter((tag) => tag.assignable);
	});

	public AddTag = (tag: ITag): void => {
		this.tags.push(tag);
	};

	public RemoveTag = (tagId: string): void => {
		this.tags = this.tags.filter((tag) => tag.id !== tagId);
	};

	public UpdateTag = (updatedTag: ITag): void => {
		this.tags = this.tags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag));
	};
}

const TAG_KEY = Symbol('TAG_KEY');

export function SetTagState() {
	return setContext(TAG_KEY, new TagService());
}

export function GetTagState() {
	return getContext<ReturnType<typeof SetTagState>>(TAG_KEY);
}
