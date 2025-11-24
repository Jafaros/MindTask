import { getContext, setContext } from 'svelte';
import { GetTagState, type ITag } from './tag.service.svelte';

export interface ITask {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	dueDate?: Date;
	priority?: TaskPriority;
	tag?: ITag;
}

export enum TaskPriority {
	Low = 'Nízká',
	Medium = 'Střední',
	High = 'Vysoká'
}

class TaskService {
	private tasks = $state<ITask[]>([]);
	private tagState = GetTagState();

	constructor() {
		// Initialize with some dummy data
		this.tasks = [
			{
				id: '1',
				title: 'Task 1',
				description: 'Testovací task',
				completed: false,
				dueDate: new Date(),
				priority: TaskPriority.Low
			},
			{
				id: '2',
				title: 'Task 2',
				completed: true,
				dueDate: new Date(),
				priority: TaskPriority.Medium
			},
			{
				id: '3',
				title: 'Task 3',
				completed: false,
				priority: TaskPriority.High,
				dueDate: new Date(),
				tag: this.tagState.GetAllTags()[1]
			}
		];
	}

	public LoadTasks = (tasks: ITask[]): void => {
		this.tasks = tasks;
	};

	public ClearTasks = (): void => {
		this.tasks = [];
	};

	public GetAllTasks = $derived(() => {
		return this.tasks;
	});

	public GetTasksByTag(tagId: string) {
		if (tagId === '0') {
			return this.tasks;
		}

		return this.tasks
			.filter((task) => task.tag?.id === tagId)
			.sort((a, b) => Number(a.completed) - Number(b.completed));
	}

	public GetTaskById(taskId: string) {
		return this.tasks.find((task) => task.id === taskId);
	}

	public UpdateTask(updatedTask: ITask): void {
		this.tasks = this.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
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
			if (!task.tag) return;

			if (!tagGroups[task.tag.id]) {
				tagGroups[task.tag.id] = [];
			}
			tagGroups[task.tag.id].push(task);
		});
		return tagGroups;
	});

	public GetTasksDueToday = $derived<() => ITask[]>(() => {
		const today = new Date();
		return this.tasks
			.filter((task) => {
				if (!task.dueDate) return false;
				const dueDate = new Date(task.dueDate);
				return (
					dueDate.getDate() === today.getDate() &&
					dueDate.getMonth() === today.getMonth() &&
					dueDate.getFullYear() === today.getFullYear()
				);
			})
			.sort((a, b) => Number(a.completed) - Number(b.completed));
	});

	public GetAllTasksToComplete = $derived(() => {
		return this.tasks.filter((task) => !task.completed);
	});

	public AddTask(task: ITask): void {
		this.tasks.push(task);
	}

	public RemoveTask(taskId: string): void {
		this.tasks = this.tasks.filter((task) => task.id !== taskId);
	}

	public ToggleCompleted(taskId: string, completed: boolean): void {
		this.tasks = this.tasks.map((task) =>
			task.id === taskId ? { ...task, completed: completed } : task
		);
	}
}

const TASKS_KEY = Symbol('TASKS_KEY');

export function SetTaskState() {
	return setContext(TASKS_KEY, new TaskService());
}

export function GetTaskState() {
	return getContext<ReturnType<typeof SetTaskState>>(TASKS_KEY);
}
