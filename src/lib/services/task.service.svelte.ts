import { getContext, setContext } from 'svelte';
import { Preferences } from '@capacitor/preferences';
import { GetTagState } from './tag.service.svelte';

const STORAGE_KEY = 'mindtask_tasks';

export interface ITask {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	dueDate?: Date;
	priority?: TaskPriority;
	tagId?: string;
}

export enum TaskPriority {
	Low = 'Nízká',
	Medium = 'Střední',
	High = 'Vysoká'
}

const priorityOrder: Record<TaskPriority | 'none', number> = {
	[TaskPriority.High]: 1,
	[TaskPriority.Medium]: 2,
	[TaskPriority.Low]: 3,
	none: 4
};

class TaskService {
	private tasks = $state<ITask[]>([]);

	constructor() {
		this.LoadTasksFromStorage();
	}

	public LoadTasks = (tasks: ITask[]): void => {
		this.tasks = tasks;
	};

	private LoadTasksFromStorage = async (): Promise<void> => {
		const { value } = await Preferences.get({ key: STORAGE_KEY });

		if (value) {
			const rawData = JSON.parse(value) as ITask[];
			this.tasks = rawData.map((task) => ({
				...task,
				dueDate: task.dueDate ? new Date(task.dueDate) : undefined
			}));
		}
	};

	private SaveTasks = async (): Promise<void> => {
		await Preferences.set({
			key: STORAGE_KEY,
			value: JSON.stringify(this.tasks)
		});
	};

	public ClearTasks = (): void => {
		this.tasks = [];
	};

	public GetAllTasks = $derived(() => {
		return this.tasks;
	});

	public GetTaskById = $derived<(taskId: string) => ITask | undefined>((taskId) => {
		return this.tasks.find((task) => task.id === taskId);
	});

	public UpdateTask(updatedTask: ITask): void {
		this.tasks = this.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
		this.SaveTasks();
	}

	public GetTasksGroupedByPriority = $derived<() => Record<string, ITask[]>>(() => {
		return this.tasks.reduce((groups: Record<string, ITask[]>, task) => {
			const priority = task.priority || 'none';
			if (!groups[priority]) {
				groups[priority] = [];
			}
			groups[priority].push(task);
			return groups;
		}, {});
	});

	public GetTasksGroupedByTag = $derived<() => Record<string, ITask[]>>(() => {
		const tagGroups: Record<string, ITask[]> = {};
		this.tasks.forEach((task) => {
			if (!task.tagId) return;

			if (!tagGroups[task.tagId]) {
				tagGroups[task.tagId] = [];
			}
			tagGroups[task.tagId].push(task);
		});
		return tagGroups;
	});

	public GetActiveTasksGroupedByTag = $derived<() => { tagId: string; tasks: ITask[] }[]>(() => {
		return Object.entries(
			this.tasks.reduce((groups: Record<string, ITask[]>, task) => {
				if (!task.tagId || task.completed) return groups;

				(groups[task.tagId] ??= []).push(task);
				return groups;
			}, {})
		).map(([tagId, tasks]) => ({ tagId, tasks }));
	});

	public GetTasksByTag(tagId: string): ITask[] {
		const tagState = GetTagState();
		const tag = tagState.GetTagById(tagId);

		if (tag?.name === 'Dnes' && !tag.assignable) {
			return this.GetTasksDueToday();
		}

		return this.tasks
			.filter((task) => task.tagId === tagId)
			.sort((a, b) => Number(a.completed) - Number(b.completed));
	}

	public GetTasksDueToday(): ITask[] {
		const today = new Date();
		return this.tasks
			.filter((task) => {
				if (!task.dueDate) return false;
				const dueDate = new Date(task.dueDate);
				return dueDate.toDateString() === today.toDateString();
			})
			.sort((a, b) => Number(a.completed) - Number(b.completed));
	}

	public GetAllTasksToComplete = $derived(() => {
		return this.tasks
			.filter((task) => !task.completed)
			.sort((a, b) => {
				const pa = priorityOrder[a.priority ?? 'none'];
				const pb = priorityOrder[b.priority ?? 'none'];
				return pa - pb; // lower number = higher priority
			});
	});

	public GetTasksByName = (searchTerm: string): ITask[] => {
		if (!searchTerm) return [];
		const lowerSearchTerm = searchTerm.toLowerCase();
		return this.tasks.filter((task) => task.title.toLowerCase().includes(lowerSearchTerm));
	};

	public AddTask(task: ITask): void {
		this.tasks.push(task);
		this.SaveTasks();
	}

	public RemoveTask(taskId: string): void {
		this.tasks = this.tasks.filter((task) => task.id !== taskId);
		this.SaveTasks();
	}

	public ToggleCompleted(taskId: string, completed: boolean): void {
		this.tasks = this.tasks.map((task) =>
			task.id === taskId ? { ...task, completed: completed } : task
		);
		this.SaveTasks();
	}
}

const TASKS_KEY = Symbol('TASKS_KEY');

export function SetTaskState() {
	return setContext(TASKS_KEY, new TaskService());
}

export function GetTaskState() {
	return getContext<ReturnType<typeof SetTaskState>>(TASKS_KEY);
}
