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
				id: '0',
				name: 'Všechny',
				color: '#808080',
				assignable: false
			},
			{
				id: '1',
				name: 'Práce',
				color: '#0000ff',
				assignable: true
			},
			{
				id: '2',
				name: 'Osobní',
				color: '#0fff00',
				assignable: true
			},
			{
				id: '3',
				name: 'Nákupy',
				color: '#ff0000',
				assignable: true
			},
			{
				id: '4',
				name: 'Studium',
				color: '#ff00ff',
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
}

const TAG_KEY = Symbol('TAG_KEY');

export function SetTagState() {
	return setContext(TAG_KEY, new TagService());
}

export function GetTagState() {
	return getContext<ReturnType<typeof SetTagState>>(TAG_KEY);
}
